const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.BEARER_TOKEN

app.use(bodyParser.json({limit: '5mb'})); // support HTML volumineux

app.post('/generate-pdf', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || auth !== `Bearer ${SECRET}`) {
        console.log(`[PDF SERVICE] Tentative avec token invalide : ${auth}`);
        return res.status(401).send({error: "Unauthorized"});
    }
    const {html} = req.body;
    if (!html) return res.status(400).send({error: "Missing HTML"});

    try {
        const browser = await puppeteer.launch({
            executablePath: '/opt/render/.cache/puppeteer/chrome/linux-140.0.7339.207/chrome-linux64/chrome',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
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

app.listen(PORT, () => console.log(`PDF service running on http://localhost:${PORT}`));
