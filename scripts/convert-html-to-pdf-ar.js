const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function convertHtmlToPdf() {
    const htmlFilePath = path.join(__dirname, '..', 'project-documentation-complete-ar.html');
    const pdfFilePath = path.join(__dirname, '..', 'ElectraCore-Documentation-AR.pdf');
    
    console.log('🔄 جاري تحويل الملف إلى PDF...');
    console.log('📄 الملف الأصلي:', htmlFilePath);
    console.log('📥 ملف PDF الناتج:', pdfFilePath);
    
    let browser;
    try {
        // تشغيل متصفح Chrome
        browser = await chromium.launch({
            headless: true
        });
        
        const context = await browser.newContext({
            locale: 'ar-SA'
        });
        
        const page = await context.newPage();
        
        // تحميل الملف الـ HTML
        const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
        await page.setContent(htmlContent, { waitUntil: 'networkidle' });
        
        // الانتظار قليلاً للتأكد من تحميل جميع المكونات
        await page.waitForTimeout(2000);
        
        // تحويل إلى PDF مع إعدادات محسّنة
        await page.pdf({
            path: pdfFilePath,
            format: 'A4',
            margin: {
                top: '20mm',
                right: '15mm',
                bottom: '20mm',
                left: '15mm'
            },
            printBackground: true,
            preferCSSPageSize: true,
            displayHeaderFooter: false,
            scale: 1
        });
        
        console.log('✅ تم إنشاء ملف PDF بنجاح!');
        console.log('📊 حجم الملف:', fs.statSync(pdfFilePath).size, 'بايت');
        console.log('📍 المسار الكامل:', path.resolve(pdfFilePath));
        
        await browser.close();
    } catch (error) {
        console.error('❌ خطأ في التحويل:', error.message);
        if (browser) {
            await browser.close();
        }
        process.exit(1);
    }
}

// تشغيل الدالة
convertHtmlToPdf();