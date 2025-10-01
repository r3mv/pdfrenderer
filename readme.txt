Ce script permet de transformer un HTML en PDF en utilisant chrome pour le rendu.
Les images si passées par URL sur le web seront accessibles dans le PDF
Les CSS sont bien pris en compte (de meme peuvent être inclus si accessibles depuis le web).

Le deploiement render.com ne fonctionne pas car on ne peut pas utiliser le browser.
Je le deploie sur un VPS:

# Install node.js
`https://nodejs.org/en/download`
```
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 22

# Verify the Node.js version:
node -v # Should print "v22.20.0".

# Verify npm version:
npm -v # Should print "10.9.3".
```

On doit installer toutes les libs dynamiques manquantes pour faire tourner chrome (cf `ldd .cache/puppeteer/chrome/linux-140.0.7339.207/chrome-linux64/chrome`)



