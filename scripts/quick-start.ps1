# PocketBase Quick Start - One Command Setup
# Run with: npm run quickstart

param(
    [string]$AdminEmail = "",
    [string]$AdminPassword = ""
)

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   PocketBase Quick Start Setup        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

$POCKETBASE_VERSION = "0.22.0"
$POCKETBASE_URL = "https://github.com/pocketbase/pocketbase/releases/download/v$POCKETBASE_VERSION/pocketbase_${POCKETBASE_VERSION}_windows_amd64.zip"

# Step 1: Download PocketBase if needed
if (Test-Path "pocketbase.exe") {
    Write-Host "✅ PocketBase already installed" -ForegroundColor Green
} else {
    Write-Host "📥 Downloading PocketBase..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $POCKETBASE_URL -OutFile "pocketbase.zip"
        Expand-Archive -Path "pocketbase.zip" -DestinationPath . -Force
        Remove-Item "pocketbase.zip"
        Write-Host "✅ PocketBase installed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to download PocketBase: $_" -ForegroundColor Red
        exit 1
    }
}

# Step 2: Start PocketBase
Write-Host "`n🚀 Starting PocketBase..." -ForegroundColor Yellow
$pbProcess = Get-Process -Name "pocketbase" -ErrorAction SilentlyContinue
if ($pbProcess) {
    Write-Host "⚠️  PocketBase already running" -ForegroundColor Yellow
} else {
    Start-Process -FilePath ".\pocketbase.exe" -ArgumentList "serve" -WindowStyle Normal
    Start-Sleep -Seconds 3
    Write-Host "✅ PocketBase started at http://127.0.0.1:8090" -ForegroundColor Green
}

# Step 3: Check if admin exists
Write-Host "`n🔐 Checking admin setup..." -ForegroundColor Yellow
try {
    $healthCheck = Invoke-WebRequest -Uri "http://127.0.0.1:8090/api/health" -UseBasicParsing
    Write-Host "✅ PocketBase is responding" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot connect to PocketBase" -ForegroundColor Red
    exit 1
}

# Step 4: Instructions
Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          SETUP INSTRUCTIONS            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "📋 Complete these steps:`n" -ForegroundColor White

Write-Host "1️⃣  Create Admin Account:" -ForegroundColor Yellow
Write-Host "   → Open: " -NoNewline -ForegroundColor White
Write-Host "http://127.0.0.1:8090/_/" -ForegroundColor Cyan
Write-Host "   → Create your admin email and password`n" -ForegroundColor Gray

Write-Host "2️⃣  Import Database Schema:" -ForegroundColor Yellow
Write-Host "   → In PocketBase Admin, go to: Settings → Import collections" -ForegroundColor Gray
Write-Host "   → Open file: " -NoNewline -ForegroundColor Gray
Write-Host "pb_schema.json" -ForegroundColor Cyan
Write-Host "   → Copy all contents and paste into import dialog" -ForegroundColor Gray
Write-Host "   → Click 'Import'`n" -ForegroundColor Gray

Write-Host "3️⃣  Start Your App:" -ForegroundColor Yellow
Write-Host "   → Open a new terminal" -ForegroundColor Gray
Write-Host "   → Run: " -NoNewline -ForegroundColor Gray
Write-Host "npm run dev" -ForegroundColor Cyan
Write-Host "   → Open: " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:3000`n" -ForegroundColor Cyan

Write-Host "4️⃣  Test It:" -ForegroundColor Yellow
Write-Host "   → Sign up a new user" -ForegroundColor Gray
Write-Host "   → Try logging in" -ForegroundColor Gray
Write-Host "   → Create a patient`n" -ForegroundColor Gray

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     AUTOMATED IMPORT (OPTIONAL)        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "After creating admin account, you can automate schema import:`n" -ForegroundColor White
Write-Host "  `$env:POCKETBASE_ADMIN_EMAIL='your-admin@email.com'" -ForegroundColor Cyan
Write-Host "  `$env:POCKETBASE_ADMIN_PASSWORD='your-password'" -ForegroundColor Cyan
Write-Host "  npm run import:schema`n" -ForegroundColor Cyan

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║          USEFUL COMMANDS               ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Magenta

Write-Host "  npm run pocketbase    " -NoNewline -ForegroundColor Cyan
Write-Host "→ Start PocketBase" -ForegroundColor Gray
Write-Host "  npm run dev           " -NoNewline -ForegroundColor Cyan
Write-Host "→ Start Next.js app" -ForegroundColor Gray
Write-Host "  npm run import:schema " -NoNewline -ForegroundColor Cyan
Write-Host "→ Import schema automatically`n" -ForegroundColor Gray

Write-Host "✨ Setup script complete!`n" -ForegroundColor Green
Write-Host "Press any key to open PocketBase Admin UI..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "http://127.0.0.1:8090/_/"
