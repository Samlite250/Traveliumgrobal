// Runs the auto-import pipeline from GitHub Actions using a service account.
// Requires the SERVICE_ACCOUNT_JSON env var (Firebase service account key JSON).
const admin = require('firebase-admin')
const { runAllImports } = require('./import-lib')

const raw = process.env.SERVICE_ACCOUNT_JSON
if (!raw) {
  console.error('Missing SERVICE_ACCOUNT_JSON environment variable.')
  process.exit(1)
}

let serviceAccount
try {
  serviceAccount = JSON.parse(raw)
} catch (err) {
  console.error('SERVICE_ACCOUNT_JSON is not valid JSON:', err.message)
  process.exit(1)
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

runAllImports()
  .then((summary) => {
    console.log('Import summary:', JSON.stringify(summary, null, 2))
    process.exit(0)
  })
  .catch((err) => {
    console.error('Import run failed:', err)
    process.exit(1)
  })
