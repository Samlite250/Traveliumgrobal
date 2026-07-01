# Deploy Firebase Storage CORS configuration
# Run this script once to fix the CORS policy error on file uploads
#
# Requirements: Google Cloud SDK (gcloud) must be installed and authenticated
# Install: https://cloud.google.com/sdk/docs/install

$BUCKET = "traveliumgrobal-808bc.appspot.com"
$CORS_FILE = "./cors.json"

Write-Host "Deploying CORS config to gs://$BUCKET ..." -ForegroundColor Cyan
gsutil cors set $CORS_FILE "gs://$BUCKET"

if ($LASTEXITCODE -eq 0) {
    Write-Host "CORS configuration applied successfully!" -ForegroundColor Green
    Write-Host "Passport uploads from https://traveliumgrobal.vercel.app should now work." -ForegroundColor Green
} else {
    Write-Host "ERROR: gsutil failed. Make sure you are logged in:" -ForegroundColor Red
    Write-Host "  gcloud auth login" -ForegroundColor Yellow
    Write-Host "  gcloud config set project traveliumgrobal-808bc" -ForegroundColor Yellow
}
