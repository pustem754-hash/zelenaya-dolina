const XLSX = require('xlsx');

console.log('📊 АНАЛИЗ НОВОГО ФАЙЛА 1-7.xlsx\n');

const wb = XLSX.readFile('1-7.xlsx');
console.log(`📚 Листов: ${wb.SheetNames.length}`);

wb.SheetNames.forEach((sheetName, index) => {
    console.log(`\n📄 Лист ${index + 1}: "${sheetName}"`);
    const sheet = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`   Всего строк: ${data.length}`);
    console.log(`   Диапазон: ${sheet['!ref']}`);
    
    if (data.length > 0) {
        console.log(`   Колонки: ${Object.keys(data[0]).join(', ')}`);
        console.log(`\n   Первая запись:`);
        console.log(JSON.stringify(data[0], null, 2));
    }
});







