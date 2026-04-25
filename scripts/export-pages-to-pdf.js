const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const { chromium } = require('playwright');
const { PDFDocument } = require('pdf-lib');

const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OUT_DIR = path.join(ROOT, 'exports');
const SHOTS_DIR = path.join(OUT_DIR, 'screenshots');

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

async function waitForOk(url, timeoutMs = 20000) {
    const start = Date.now();
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            const res = await fetch(url);
            if (res.ok) return true;
        } catch {
            // ignore
        }
        if (Date.now() - start > timeoutMs) return false;
        await sleep(400);
    }
}

function listHtmlPages() {
    const files = fs.readdirSync(PUBLIC_DIR);
    return files
        .filter((f) => f.toLowerCase().endsWith('.html'))
        .filter((f) => !f.toLowerCase().startsWith('admin')) // optional: admin pages usually require auth
        .sort((a, b) => a.localeCompare(b));
}

async function ensureDirs() {
    fs.mkdirSync(SHOTS_DIR, { recursive: true });
}

function startServer() {
    const child = spawn('node', ['server.js'], {
        cwd: ROOT,
        env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'production' },
        stdio: 'inherit'
    });
    return child;
}

async function main() {
    await ensureDirs();
    const port = Number(process.env.PORT || 3001);
    const baseUrl = process.env.EXPORT_BASE_URL || `http://127.0.0.1:${port}`;

    const shouldStartServer = process.env.EXPORT_START_SERVER !== '0';
    const server = shouldStartServer ? startServer() : null;

    const ok = await waitForOk(`${baseUrl}/ping`, 25000);
    if (!ok) {
        if (server) server.kill();
        throw new Error(`Server not reachable at ${baseUrl}. Ensure it is running and /ping works.`);
    }

    const pages = listHtmlPages();
    if (!pages.length) {
        if (server) server.kill();
        throw new Error('No HTML pages found in public/.');
    }

    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2
    });

    const shotPaths = [];
    for (const file of pages) {
        const url = `${baseUrl}/${file}`;
        const page = await context.newPage();
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(400);
        const outPath = path.join(SHOTS_DIR, file.replace(/\.html$/i, '.png'));
        await page.screenshot({ path: outPath, fullPage: true });
        shotPaths.push({ file, outPath });
        await page.close();
        console.log(`Captured: ${file}`);
    }

    await context.close();
    await browser.close();

    const pdf = await PDFDocument.create();
    for (const s of shotPaths) {
        const bytes = fs.readFileSync(s.outPath);
        const img = await pdf.embedPng(bytes);
        const { width, height } = img.size();
        const page = pdf.addPage([width, height]);
        page.drawImage(img, { x: 0, y: 0, width, height });
    }

    const pdfBytes = await pdf.save();
    const pdfPath = path.join(OUT_DIR, 'site-pages.pdf');
    fs.writeFileSync(pdfPath, pdfBytes);

    console.log(`\nDone.`);
    console.log(`PDF: ${pdfPath}`);
    console.log(`Screenshots: ${SHOTS_DIR}`);

    if (server) server.kill();
}

main().catch((err) => {
    console.error(err.message || err);
    process.exitCode = 1;
});

