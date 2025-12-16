const XLSX = require('xlsx');

console.log('📊 СРАВНЕНИЕ ФАЙЛОВ\n');

// Старый файл 25.xlsx
const wb1 = XLSX.readFile('25.xlsx');
const data1 = XLSX.utils.sheet_to_json(wb1.Sheets[wb1.SheetNames[0]]);
console.log('📄 Старый 25.xlsx: ' + data1.length + ' строк');

// Новый файл 25-new.xlsx
const wb2 = XLSX.readFile('25-new.xlsx');
const data2 = XLSX.utils.sheet_to_json(wb2.Sheets[wb2.SheetNames[0]]);
console.log('📄 Новый 25 (1).xlsx: ' + data2.length + ' строк');

// Старый файл 1-7 (2).xlsx
try {
    const wb3 = XLSX.readFile('1-7 (2).xlsx');
    const data3 = XLSX.utils.sheet_to_json(wb3.Sheets[wb3.SheetNames[0]]);
    console.log('📄 Старый 1-7 (2).xlsx: ' + data3.length + ' строк');
} catch(e) {
    console.log('📄 Старый 1-7 (2).xlsx: не найден');
}

// Новый файл 1-7.xlsx
const wb4 = XLSX.readFile('1-7.xlsx');
const data4 = XLSX.utils.sheet_to_json(wb4.Sheets[wb4.SheetNames[0]]);
console.log('📄 Новый 1-7 (1).xlsx: ' + data4.length + ' строк');

console.log('\n💡 Рекомендация: Нужен файл 1-7.xlsx с ~286 строками!');







