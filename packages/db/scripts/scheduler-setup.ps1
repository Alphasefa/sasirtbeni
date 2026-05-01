# Sıfır Araç Fiyat Güncelleme - Windows Görev Zamanlayıcı
# Her gece 00:00'da çalışır

$taskName = "SifirAracFiyatGuncelleme"
$scriptPath = "C:\Users\gnd_s\OneDrive\Masaüstü\sasirtbeni\packages\db\scripts\fetch-all-prices.ts"
$bunPath = "$env:USERPROFILE\.bun\bin\bun.exe"

# Mevcut görevi kontrol et ve sil
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "Mevcut görev siliniyor..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# Yeni görev oluştur
$action = New-ScheduledTaskAction -Execute $bunPath -Argument "run `"$scriptPath`"" -WorkingDirectory "C:\Users\gnd_s\OneDrive\Masaüstü\sasirtbeni\packages\db"

$trigger = New-ScheduledTaskTrigger -Daily -At "00:00"

$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable:$false

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description "Sıfır araç fiyatlarını her gece 00:00'da günceller" -Force

Write-Host ""
Write-Host "✅ Görev Zamanlayıcı ayarlandı!" -ForegroundColor Green
Write-Host ""
Write-Host "Görev Adı: $taskName" -ForegroundColor Cyan
Write-Host "Çalışma Zamanı: Her gün 00:00" -ForegroundColor Cyan
Write-Host "Script: $scriptPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Görevi manuel çalıştırmak için:" -ForegroundColor Yellow
Write-Host "  Start-ScheduledTask -TaskName '$taskName'" -ForegroundColor Gray
Write-Host ""
Write-Host "Görevi iptal etmek için:" -ForegroundColor Yellow
Write-Host "  Unregister-ScheduledTask -TaskName '$taskName' -Confirm:`$false" -ForegroundColor Gray