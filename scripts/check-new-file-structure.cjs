const XLSX = require('xlsx');

console.log('📊 ДЕТАЛЬНЫЙ АНАЛИЗ ФАЙЛА 1-7 (1).xlsx\n');

const workbook = XLSX.readFile('C:\\Users\\Пользователь\\Downloads\\1-7 (1).xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// Получить диапазон
const range = XLSX.utils.decode_range(sheet['!ref']);
console.log(`📄 Диапазон: ${sheet['!ref']}`);
console.log(`📊 Строк: ${range.e.r + 1}`);
console.log(`📊 Колонок: ${range.e.c + 1}\n`);

// Показать первые 10 строк
console.log('📋 ПЕРВЫЕ 10 СТРОК:\n');
for (let row = range.s.r; row <= Math.min(range.e.r, 10); row++) {
    console.log(`Строка ${row + 1}:`);
    for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = sheet[cellAddress];
        if (cell) {
            console.log(`  ${cellAddress}: ${cell.v}`);
        }
    }
    console.log('');
}

// Прочитать как JSON
const data = XLSX.utils.sheet_to_json(sheet);
console.log(`\n✅ Всего записей (JSON): ${data.length}`);

if (data.length > 0) {
    console.log('\n📝 ПЕРВАЯ ЗАПИСЬ:');
    console.log(JSON.stringify(data[0], null, 2));
}







