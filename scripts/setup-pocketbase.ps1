# PocketBase Setup Script for Windows
# This script downloads PocketBase and sets up the schema

$POCKETBASE_VERSION = "0.22.0"
$POCKETBASE_URL = "https://github.com/pocketbase/pocketbase/releases/download/v$POCKETBASE_VERSION/pocketbase_${POCKETBASE_VERSION}_windows_amd64.zip"
$POCKETBASE_ZIP = "pocketbase.zip"

Write-Host "🚀 PocketBase Setup for Windows`n" -ForegroundColor Cyan

# Check if PocketBase already exists
if (Test-Path "pocketbase.exe") {
    Write-Host "✅ PocketBase executable already exists`n" -ForegroundColor Green
} else {
    Write-Host "📥 Downloading PocketBase v$POCKETBASE_VERSION..." -ForegroundColor Yellow
    
    try {
        Invoke-WebRequest -Uri $POCKETBASE_URL -OutFile $POCKETBASE_ZIP
        Write-Host "✅ Downloaded PocketBase`n" -ForegroundColor Green
        
        Write-Host "📦 Extracting..." -ForegroundColor Yellow
        Expand-Archive -Path $POCKETBASE_ZIP -DestinationPath . -Force
        Remove-Item $POCKETBASE_ZIP
        Write-Host "✅ Extracted PocketBase`n" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to download PocketBase: $_`n" -ForegroundColor Red
        exit 1
    }
}

# Check if PocketBase is already running
$pbProcess = Get-Process -Name "pocketbase" -ErrorAction SilentlyContinue
if ($pbProcess) {
    Write-Host "⚠️  PocketBase is already running (PID: $($pbProcess.Id))`n" -ForegroundColor Yellow
} else {
    Write-Host "🚀 Starting PocketBase..." -ForegroundColor Yellow
    Start-Process -FilePath ".\pocketbase.exe" -ArgumentList "serve" -WindowStyle Normal
    Start-Sleep -Seconds 2
    Write-Host "✅ PocketBase started at http://127.0.0.1:8090`n" -ForegroundColor Green
}

Write-Host "📋 Next Steps:`n" -ForegroundColor Cyan
Write-Host "1. Create admin account:" -ForegroundColor White
Write-Host "   Open http://127.0.0.1:8090/_/ in your browser`n" -ForegroundColor Gray

Write-Host "2. Import schema (choose one method):`n" -ForegroundColor White

Write-Host "   Method A - Manual Import (Recommended):" -ForegroundColor Yellow
Write-Host "   • Go to Settings → Import collections" -ForegroundColor Gray
Write-Host "   • Paste contents of pb_schema.json" -ForegroundColor Gray
Write-Host "   • Click Import`n" -ForegroundColor Gray

Write-Host "   Method B - Automated Import:" -ForegroundColor Yellow
Write-Host "   • Set environment variables:" -ForegroundColor Gray
Write-Host "     `$env:POCKETBASE_ADMIN_EMAIL='your-admin@email.com'" -ForegroundColor Gray
Write-Host "     `$env:POCKETBASE_ADMIN_PASSWORD='your-password'" -ForegroundColor Gray
Write-Host "   • Run: node scripts/import-schema.js`n" -ForegroundColor Gray

Write-Host "3. Start your Next.js app:" -ForegroundColor White
Write-Host "   npm run dev`n" -ForegroundColor Gray

Write-Host "✨ Setup complete!`n" -ForegroundColor Green
