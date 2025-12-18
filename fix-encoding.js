/**
 * Скрипт для удаления BOM и исправления кодировки HTML файлов
 * Использование: node fix-encoding.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Проверка и исправление кодировки HTML файлов...\n');

// Список файлов для проверки
const htmlFiles = [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'public', 'index.html'),
    path.join(__dirname, 'public', 'login.html'),
    path.join(__dirname, 'public', 'payments.html'),
    path.join(__dirname, 'public', 'meters.html'),
    path.join(__dirname, 'public', 'cameras.html'),
    path.join(__dirname, 'public', 'create-request.html'),
    path.join(__dirname, 'public', 'barrier.html'),
    path.join(__dirname, 'public', '404.html')
];

let fixedCount = 0;
let checkedCount = 0;

htmlFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        checkedCount++;
        console.log(`📄 Проверка: ${filePath}`);
        
        try {
            // Читаем файл как байты для проверки BOM
            const bytes = fs.readFileSync(filePath);
            let hasBOM = false;
            
            // Проверка на UTF-8 BOM (EF BB BF)
            if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
                console.log('  ⚠️  Обнаружен UTF-8 BOM!');
                hasBOM = true;
            }
            
            // Читаем содержимое как UTF-8
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Удаляем BOM если он есть (на случай если он был прочитан как текст)
            if (content.charCodeAt(0) === 0xFEFF) {
                content = content.slice(1);
                hasBOM = true;
            }
            
            // Проверяем на крякозябры (простые эвристики)
            let hasGarbledText = false;
            if (/Р\s+В\s+Р|РІВ|РЎС|Р\s+РЋ/.test(content)) {
                console.log('  ⚠️  Возможные крякозябры обнаружены!');
                hasGarbledText = true;
            }
            
            if (hasBOM || hasGarbledText) {
                // Сохраняем в UTF-8 без BOM
                fs.writeFileSync(filePath, content, { encoding: 'utf8' });
                console.log('  ✅ Файл исправлен (UTF-8 без BOM)');
                fixedCount++;
            } else {
                // Пересохраняем в UTF-8 без BOM для гарантии
                fs.writeFileSync(filePath, content, { encoding: 'utf8' });
                console.log('  ✓ Файл в порядке (пересохранён в UTF-8 без BOM)');
            }
        } catch (error) {
            console.error(`  ❌ Ошибка при обработке: ${error.message}`);
        }
    } else {
        console.log(`⚠️  Файл не найден: ${filePath}`);
    }
});

console.log('\n═══════════════════════════════════════');
console.log('📊 Результаты:');
console.log(`  Проверено файлов: ${checkedCount}`);
console.log(`  Исправлено файлов: ${fixedCount}`);
console.log('═══════════════════════════════════════\n');

if (fixedCount > 0) {
    console.log('✅ Кодировка исправлена! Обновите страницу в браузере.');
} else {
    console.log('✅ Все файлы в порядке!');
}

