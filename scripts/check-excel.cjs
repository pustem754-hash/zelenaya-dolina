const XLSX = require('xlsx');

console.log('📊 ПОЛНЫЙ АНАЛИЗ ОБОИХ ФАЙЛОВ\n');
console.log('═══════════════════════════════════════\n');

// === 25.xlsx ===
console.log('📄 Файл: 25.xlsx (ЖК Маяк)');
const wb1 = XLSX.readFile('25.xlsx');
const sheet1 = wb1.Sheets[wb1.SheetNames[0]];
const data1 = XLSX.utils.sheet_to_json(sheet1);

console.log(`   Всего строк: ${data1.length}`);
console.log(`   Колонки: ${Object.keys(data1[0] || {}).join(', ')}`);

// === 1-7 (2).xlsx ===
console.log('\n📄 Файл: 1-7 (2).xlsx (ЖК Зелёная Долина)');
const wb2 = XLSX.readFile('1-7 (2).xlsx');
console.log(`   Листов: ${wb2.SheetNames.length}`);

wb2.SheetNames.forEach(sheetName => {
    const sheet = wb2.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(`   Лист "${sheetName}": ${data.length} строк`);
});

// Проверим, может быть данные начинаются не с первой строки?
const sheet2 = wb2.Sheets[wb2.SheetNames[0]];
console.log('\n🔍 Диапазон ячеек в первом листе:',  sheet2['!ref']);

// Попробуем прочитать БЕЗ пропуска
const data2_all = XLSX.utils.sheet_to_json(sheet2);
console.log(`   Всего строк (включая заголовок): ${data2_all.length}`);

if (data2_all.length > 0) {
    console.log('\n📋 Первые 5 строк:');
    data2_all.slice(0, 5).forEach((row, i) => {
        console.log(`   ${i+1}:`, JSON.stringify(row));
    });
}

console.log('\n═══════════════════════════════════════');
console.log(`📊 ИТОГО: ${data1.length + data2_all.length - 1} записей`);
console.log(`   ЖК Маяк: ${data1.length}`);
console.log(`   ЖК Зелёная Долина: ${data2_all.length - 1} (без заголовка)`);
