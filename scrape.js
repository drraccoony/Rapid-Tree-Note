const puppeteer = require('puppeteer');

// Check if a URL parameter was provided
if (process.argv.length < 3) {
    console.error('Please provide a URL as a command-line argument.');
    process.exit(1);
}

// Extract the URL from the command-line arguments
const url = process.argv[2];

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});
    //await new Promise(resolve => setTimeout(resolve, 1000));
    const visibleText = await page.evaluate(() => document.body.innerHTML);
    console.log(visibleText);
    await browser.close();
})();

