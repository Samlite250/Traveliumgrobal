const fs = require('fs');
const path = require('path');
const https = require('https');

const PROJECT = 'traveliumgrobal-808bc';
const CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';
const CONFIG_PATH = path.join(process.env.USERPROFILE, '.config', 'configstore', 'firebase-tools.json');

async function main() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const refreshToken = config.tokens.refresh_token;
  const accessToken = await getAccessToken(refreshToken);

  console.log('Fetching existing services...');
  const services = await fetchServices(accessToken);
  console.log(`Found ${services.length} services:`);
  for(let i=0; i<services.length; i++) {
     const fields = services[i].fields || {};
     const name = fields.name && fields.name.stringValue || 'Unnamed';
     const active = fields.active && fields.active.booleanValue !== undefined ? fields.active.booleanValue : 'Not Set';
     console.log(`- ${name} (Active: ${active})`);
  }
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
      res.on('end', () => resolve(JSON.parse(data).access_token))
    })
    req.write(body)
    req.end()
  })
}

function fetchServices(accessToken) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'firestore.googleapis.com',
      path: `/v1/projects/${PROJECT}/databases/(default)/documents/services?pageSize=1000`,
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    }, (res) => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        const json = JSON.parse(data);
        resolve(json.documents || []);
      })
    })
    req.end()
  })
}

main().catch(console.error);
