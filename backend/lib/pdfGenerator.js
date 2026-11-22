import puppeteer from 'puppeteer-core'
import fs from 'fs'

const POSSIBLE_CHROME_PATHS = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
].filter(Boolean)

export function findChromePath() {
  for (const p of POSSIBLE_CHROME_PATHS) {
    if (fs.existsSync(p)) return p
  }
  return null
}

export async function generateResumePdf({ html, title = 'resume' }) {
  const executablePath = findChromePath()
  if (!executablePath) {
    throw new Error('Chromium/Chrome executable not found on system. Set PUPPETEER_EXECUTABLE_PATH in your environment.')
  }

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',
    ]
  })

  try {
    const page = await browser.newPage()
    
    // Set high-DPI viewport
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 })

    // Build standalone HTML with print styling & base fonts
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            html, body {
              background: #ffffff;
              color: #000000;
              width: 100%;
              height: 100%;
              font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @page {
              size: letter portrait;
              margin: 0mm;
            }
            .pdf-container {
              width: 800px;
              margin: 0 auto;
              background: #ffffff;
            }
          </style>
        </head>
        <body>
          <div class="pdf-container">
            ${html}
          </div>
        </body>
      </html>
    `

    await page.setContent(fullHtml, { waitUntil: ['domcontentloaded', 'networkidle0'] })
    
    // Wait for fonts to be ready
    await page.evaluateHandle('document.fonts.ready')

    const pdfBuffer = await page.pdf({
      format: 'letter',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      preferCSSPageSize: true
    })

    return pdfBuffer
  } finally {
    await browser.close().catch(() => {})
  }
}
