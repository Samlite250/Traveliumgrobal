param([switch]$Help)

$ErrorActionPreference = "Stop"
$PROJECT = "traveliumgrobal-808bc"
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

if ($Help) {
    Write-Host @"
USAGE: powershell -ExecutionPolicy Bypass -File deploy.ps1

Deploys Firestore rules + Cloud Function to Firebase.
Automatically installs firebase-tools and handles login.

For a quick fix (Firestore only), paste firestore.rules into:
  https://console.firebase.google.com/project/$PROJECT/firestore/rules
"@
    return
}

# 1. Check Node.js
try {
    $nodeVer = node --version 2>$null
    if (-not $nodeVer) { throw "not found" }
} catch { Write-Host "Node.js is required. Install from https://nodejs.org" -ForegroundColor Red; exit 1 }

# 2. Install firebase-tools if missing
try {
    $ver = firebase --version 2>$null
    if (-not $ver) { throw "not found" }
    Write-Host "Firebase CLI $ver detected." -ForegroundColor Green
} catch {
    Write-Host "Installing Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# 3. Login
$status = firebase login:list 2>&1
if ($status -match "No authorized accounts") {
    Write-Host "`nOpening browser for Firebase login..." -ForegroundColor Yellow
    Write-Host "Complete the browser flow, then return here.`n" -ForegroundColor Yellow
    firebase login
    if ($LASTEXITCODE -ne 0) { Write-Host "Login failed." -ForegroundColor Red; exit 1 }
}

# 4. Deploy Firestore rules
Set-Location -LiteralPath $ROOT
Write-Host "`nDeploying Firestore rules..." -ForegroundColor Cyan
firebase deploy --only firestore
if ($LASTEXITCODE -eq 0) {
    Write-Host "Firestore rules deployed. Refresh your site!" -ForegroundColor Green
} else {
    Write-Host "Firestore deploy failed." -ForegroundColor Red; exit 1
}

# 5. Install functions deps
Set-Location -LiteralPath (Join-Path $ROOT "functions")
npm install 2>&1 | Out-Null

# 6. Deploy Cloud Functions
Set-Location -LiteralPath $ROOT
Write-Host "`nDeploying Cloud Function (syncAuthUsers)..." -ForegroundColor Cyan
firebase deploy --only functions 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host @"

WARNING: Function deploy failed.
This requires the Blaze plan (pay-as-you-go).
Upgrade at: https://console.firebase.google.com/project/$PROJECT/overview
Then re-run: firebase deploy --only functions

"@ -ForegroundColor Yellow
} else {
    Write-Host "Cloud Function deployed!" -ForegroundColor Green
}

Set-Location -LiteralPath $ROOT
Write-Host "`nDone! Refresh https://traveliumgrobal.vercel.app" -ForegroundColor Green
pause
