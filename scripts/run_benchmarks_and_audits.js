import { spawn } from 'child_process'
import { promises as fs } from 'fs'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok || res.status === 200 || res.status === 304) return true
    } catch {}
    await sleep(400)
  }
  return false
}

function runCommand(cmd, args, env = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n▶ Running: ${cmd} ${args.join(' ')}`)
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      env: { ...process.env, ...env },
    })
    child.on('close', (code) => {
      if (code === 0) resolve(code)
      else reject(new Error(`Command failed with code ${code}`))
    })
    child.on('error', reject)
  })
}

async function main() {
  console.log('==================================================')
  console.log('   Starting Backend & Frontend Servers for Test')
  console.log('==================================================')

  // 1. Start Backend
  const backendProc = spawn('node', ['backend/server.js'], {
    stdio: 'pipe',
    env: { ...process.env, PORT: '3001', NODE_ENV: 'production' }
  })
  backendProc.stdout.on('data', (d) => process.stdout.write(`[Backend] ${d}`))
  backendProc.stderr.on('data', (d) => process.stderr.write(`[Backend ERR] ${d}`))

  // 2. Start Frontend Preview
  const frontendProc = spawn('npx', ['vite', 'preview', '--host', '0.0.0.0', '--port', '5173'], {
    cwd: './frontend',
    stdio: 'pipe',
    env: { ...process.env }
  })
  frontendProc.stdout.on('data', (d) => process.stdout.write(`[Frontend] ${d}`))
  frontendProc.stderr.on('data', (d) => process.stderr.write(`[Frontend ERR] ${d}`))

  try {
    console.log('Waiting for backend on http://127.0.0.1:3001/health ...')
    const backendReady = await waitForServer('http://127.0.0.1:3001/health', 12000)
    if (!backendReady) throw new Error('Backend failed to start within timeout')
    console.log('✅ Backend is UP on http://127.0.0.1:3001')

    console.log('Waiting for frontend on http://127.0.0.1:5173 ...')
    const frontendReady = await waitForServer('http://127.0.0.1:5173', 12000)
    if (!frontendReady) throw new Error('Frontend failed to start within timeout')
    console.log('✅ Frontend is UP on http://127.0.0.1:5173')

    // 3. Autocannon on Backend
    console.log('\n==================================================')
    console.log('   Benchmarking Backend Health with autocannon')
    console.log('==================================================')
    await runCommand('npx', ['autocannon', '-c', '40', '-d', '4', 'http://127.0.0.1:3001/health'])

    // 4. Autocannon on Frontend Landing Page
    console.log('\n==================================================')
    console.log('   Benchmarking Frontend Static HTML with autocannon')
    console.log('==================================================')
    await runCommand('npx', ['autocannon', '-c', '40', '-d', '4', 'http://127.0.0.1:5173/'])

    // 5. Lighthouse Audit on Frontend
    console.log('\n==================================================')
    console.log('   Running Lighthouse Audit on Landing Page')
    console.log('==================================================')
    const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    await runCommand('npx', [
      'lighthouse',
      'http://127.0.0.1:5173',
      '--chrome-flags=--headless --no-sandbox --disable-gpu',
      '--output=json',
      '--output-path=lighthouse-report.json',
      '--only-categories=performance,accessibility,best-practices,seo',
      '--view=false'
    ], { CHROME_PATH: chromePath })

    // Read and print lighthouse summary
    const reportRaw = await fs.readFile('lighthouse-report.json', 'utf8')
    const report = JSON.parse(reportRaw)
    console.log('\n==================================================')
    console.log('          LIGHTHOUSE AUDIT SCORES')
    console.log('==================================================')
    for (const [key, category] of Object.entries(report.categories || {})) {
      console.log(`  ${category.title.padEnd(20)} : ${Math.round(category.score * 100)} / 100`)
    }
    console.log('==================================================\n')

  } finally {
    console.log('Shutting down test servers...')
    backendProc.kill('SIGINT')
    frontendProc.kill('SIGINT')
  }
}

main().catch((err) => {
  console.error('Test execution failed:', err)
  process.exit(1)
})
