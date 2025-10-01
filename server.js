const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.BEARER_TOKEN || 'devToken'

app.use(bodyParser.json({limit: '10mb'}));

async function launchBrowser() {
    // const revision = '140.0.7339.207'; // révision stable
    // const installOptions = {browser: "chrome@stable"}
    // console.log(browsers);
    // chrome = await browsers.install([installOptions]);
    // console.log(chrome);
    // const executablePath = computeExecutablePath(installOptions);
    // console.log('[PDF SERVICE] Browser installe')
    // return await puppeteer.launch({
    //     executablePath,
    //     args: ['--no-sandbox', '--disable-setuid-sandbox']
    // });
    return await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
}

app.post('/generate-pdf', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || auth !== `Bearer ${SECRET}`) {
        console.log(`[PDF SERVICE] Tentative avec token invalide : ${auth}`);
        return res.status(401).send({error: "Unauthorized"});
    }
    const {html} = req.body;
    if (!html) return res.status(400).send({error: "Missing HTML"});

    try {
        const browser = await launchBrowser();
        const page = await browser.newPage();
        await page.setContent(html, {waitUntil: 'networkidle0'});
        const pdfBuffer = await page.pdf({format: 'A4'});
        await browser.close();

        console.log(`[PDF SERVICE] PDF généré avec succès pour la requête.`);
        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (err) {
        console.error(err);
        console.log(`[PDF SERVICE] Une erreur est survenue.`, err);
        res.status(500).send({error: err.message});
    }
});

app.listen(PORT, "localhost",
    () => console.log(`PDF service running on http://localhost:${PORT}`));
