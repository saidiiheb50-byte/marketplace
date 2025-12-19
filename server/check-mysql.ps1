# Quick MySQL Password Check Script

Write-Host "`n🔍 Checking MySQL Connection..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (Test-Path .env) {
    Write-Host "✅ .env file found" -ForegroundColor Green
    
    # Read current password setting
    $envContent = Get-Content .env
    $passwordLine = $envContent | Select-String "DB_PASSWORD"
    
    Write-Host "`nCurrent DB_PASSWORD setting:" -ForegroundColor Yellow
    Write-Host $passwordLine -ForegroundColor White
    
    if ($passwordLine -match "DB_PASSWORD=$" -or $passwordLine -match "DB_PASSWORD=\s*$") {
        Write-Host "`n⚠️  Password is EMPTY" -ForegroundColor Yellow
        Write-Host "`nMySQL is asking for a password. You need to:" -ForegroundColor Yellow
        Write-Host "1. Open .env file" -ForegroundColor White
        Write-Host "2. Change: DB_PASSWORD=" -ForegroundColor White
        Write-Host "3. To: DB_PASSWORD=your_mysql_password" -ForegroundColor White
        Write-Host "`nOr test if MySQL accepts no password:" -ForegroundColor Cyan
        Write-Host "   mysql -u root" -ForegroundColor White
    } else {
        Write-Host "`n✅ Password is set in .env" -ForegroundColor Green
        Write-Host "`nTesting connection..." -ForegroundColor Cyan
        node test-connection.js
    }
} else {
    Write-Host "❌ .env file NOT found!" -ForegroundColor Red
    Write-Host "Run: npm run create-env" -ForegroundColor Yellow
}

Write-Host ""




