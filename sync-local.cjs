const fs = require('fs')
const path = require('path')
const https = require('https')

const PROJECT = 'traveliumgrobal-808bc'
const CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com'
const CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi'
const CONFIG_PATH = path.join(process.env.USERPROFILE, '.config', 'configstore', 'firebase-tools.json')

async function main() {
  console.log('=== Firebase Auth-to-Firestore Sync Tool ===\n')

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
  const refreshToken = config.tokens.refresh_token
  if (!refreshToken) { console.error('No refresh token found. Run firebase login first.'); process.exit(1) }

  console.log('Getting access token...')
  const accessToken = await getAccessToken(refreshToken)
  console.log('Got access token.\n')

  console.log('Listing Auth users...')
  const authUsers = await listAuthUsers(accessToken)
  console.log(`Total Auth users: ${authUsers.length}`)
  if (authUsers.length > 0) {
    console.log('Sample user:', JSON.stringify(authUsers[0], null, 2))
  }

  console.log('\nChecking existing Firestore user docs...')
  const existingUids = await getExistingUserDocs(accessToken)
  console.log(`Existing Firestore user docs: ${existingUids.size}`)
  if (existingUids.size > 0) {
    console.log('Existing UIDs:', [...existingUids])
  }

  // Identity Toolkit API uses "localId" (not "uid") for the user ID
  const toCreate = authUsers.filter(u => u.localId && !existingUids.has(u.localId))
  console.log(`\nUsers without Firestore doc: ${toCreate.length}`)

  if (toCreate.length === 0) {
    console.log('\nAll Auth users already have Firestore documents. Nothing to do.')
    return
  }

  let created = 0
  let skipped = 0
  console.log('\nCreating missing Firestore documents...')
  for (let i = 0; i < toCreate.length; i++) {
    const user = toCreate[i]
    try {
      await createUserDoc(accessToken, user)
      console.log(`  [${i + 1}/${toCreate.length}] Created doc for ${user.email || user.localId}`)
      created++
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log(`  [${i + 1}/${toCreate.length}] Skipped ${user.email || user.localId} (already exists)`)
        skipped++
      } else {
        console.error(`  [${i + 1}/${toCreate.length}] Failed for ${user.email || user.localId}: ${err.message}`)
      }
    }
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`)
}

function getAccessToken(refreshToken) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }).toString()

    const req = https.request({
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        const json = JSON.parse(data)
        if (json.access_token) resolve(json.access_token)
        else reject(new Error('Failed to refresh token: ' + (json.error_description || JSON.stringify(json))))
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

function listAuthUsers(accessToken) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      returnUserInfo: true,
      maxResults: 1000,
    })

    const req = https.request({
      hostname: 'identitytoolkit.googleapis.com',
      path: `/v1/projects/${PROJECT}/accounts:query`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        const json = JSON.parse(data)
        if (json.userInfo) resolve(json.userInfo)
        else if (json.error) reject(new Error(json.error.message || JSON.stringify(json)))
        else resolve([])
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

function getExistingUserDocs(accessToken) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'firestore.googleapis.com',
      path: `/v1/projects/${PROJECT}/databases/(default)/documents/users?pageSize=1000`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    }, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        const json = JSON.parse(data)
        const uids = new Set()
        if (json.documents) {
          for (const doc of json.documents) {
            const uid = doc.name.split('/').pop()
            uids.add(uid)
          }
        }
        resolve(uids)
      })
    })
    req.on('error', reject)
    req.end()
  })
}

function createUserDoc(accessToken, user) {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString()
    const body = JSON.stringify({
      fields: {
        email: { stringValue: user.email || '' },
        displayName: { stringValue: user.displayName || '' },
        phone: { stringValue: user.phoneNumber || '' },
        photoURL: { stringValue: user.photoUrl || '' },
        role: { stringValue: 'student' },
        createdAt: { timestampValue: now },
        updatedAt: { timestampValue: now },
      },
    })

    const req = https.request({
      hostname: 'firestore.googleapis.com',
      path: `/v1/projects/${PROJECT}/databases/(default)/documents/users?documentId=${user.localId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        if (res.statusCode < 300) resolve()
        else {
          const json = JSON.parse(data)
          reject(new Error(json.error?.message || JSON.stringify(json)))
        }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

main().catch(err => {
  console.error('\nError:', err.message)
  process.exit(1)
})
