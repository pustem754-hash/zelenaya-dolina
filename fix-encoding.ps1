# Скрипт для удаления BOM и исправления кодировки HTML файлов
# Использование: .\fix-encoding.ps1

$ErrorActionPreference = "Stop"

Write-Host "🔍 Проверка и исправление кодировки HTML файлов..." -ForegroundColor Cyan

# Путь к директории проекта
$projectPath = $PSScriptRoot
$htmlFiles = @(
    "$projectPath\index.html",
    "$projectPath\public\index.html",
    "$projectPath\public\login.html",
    "$projectPath\public\payments.html",
    "$projectPath\public\meters.html",
    "$projectPath\public\cameras.html",
    "$projectPath\public\create-request.html",
    "$projectPath\public\barrier.html",
    "$projectPath\public\404.html"
)

$fixedCount = 0
$checkedCount = 0

foreach ($filePath in $htmlFiles) {
    if (Test-Path $filePath) {
        $checkedCount++
        Write-Host "`n📄 Проверка: $filePath" -ForegroundColor Yellow
        
        try {
            # Читаем файл как байты для проверки BOM
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $hasBOM = $false
            
            # Проверка на UTF-8 BOM (EF BB BF)
            if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
                Write-Host "  ⚠️  Обнаружен UTF-8 BOM!" -ForegroundColor Red
                $hasBOM = $true
            }
            
            # Читаем содержимое как UTF-8
            $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
            
            # Проверяем на крякозябры (простые эвристики)
            $hasGarbledText = $false
            if ($content -match 'Р[^\w]В[^\w]Р|РІВ|РЎС') {
                Write-Host "  ⚠️  Возможные крякозябры обнаружены!" -ForegroundColor Red
                $hasGarbledText = $true
            }
            
            if ($hasBOM -or $hasGarbledText) {
                # Удаляем BOM и сохраняем в UTF-8 без BOM
                $utf8NoBom = New-Object System.Text.UTF8Encoding $false
                [System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)
                Write-Host "  ✅ Файл исправлен (UTF-8 без BOM)" -ForegroundColor Green
                $fixedCount++
            } else {
                # Пересохраняем в UTF-8 без BOM для гарантии
                $utf8NoBom = New-Object System.Text.UTF8Encoding $false
                [System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)
                Write-Host "  ✓ Файл в порядке (пересохранён в UTF-8 без BOM)" -ForegroundColor Gray
            }
        } catch {
            Write-Host "  ❌ Ошибка при обработке: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "`n⚠️  Файл не найден: $filePath" -ForegroundColor Yellow
    }
}

Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 Результаты:" -ForegroundColor Cyan
Write-Host "  Проверено файлов: $checkedCount" -ForegroundColor White
Write-Host "  Исправлено файлов: $fixedCount" -ForegroundColor $(if ($fixedCount -gt 0) { "Green" } else { "Gray" })
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan

if ($fixedCount -gt 0) {
    Write-Host "`n✅ Кодировка исправлена! Обновите страницу в браузере." -ForegroundColor Green
} else {
    Write-Host "`n✅ Все файлы в порядке!" -ForegroundColor Green
}

