const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    let browser;
    try {
        // Launch browser
        browser = await chromium.launch();
        const page = await browser.newPage();

        // Read and navigate to HTML file
        const htmlPath = path.join(__dirname, 'DATABASE_SCHEMA_ERD_FINAL.html');
        const htmlUrl = `file://${htmlPath}`;

        console.log(`📄 Loading HTML from: ${htmlPath}`);
        await page.goto(htmlUrl, { waitUntil: 'networkidle' });

        // Generate PDF
        const pdfPath = path.join(__dirname, 'DATABASE_SCHEMA_ERD_FINAL.pdf');
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            margin: {
                top: '20mm',
                right: '15mm',
                bottom: '20mm',
                left: '15mm'
            },
            printBackground: true,
            preferCSSPageSize: false,
            scale: 1
        });

        console.log(`✅ PDF generated successfully!`);
        console.log(`📁 Location: ${pdfPath}`);
        console.log(`📊 File size: ${(fs.statSync(pdfPath).size / 1024).toFixed(2)} KB`);

    } catch (error) {
        console.error('❌ Error generating PDF:', error.message);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the function
generatePDF();
