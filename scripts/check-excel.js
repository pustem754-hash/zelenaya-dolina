const XLSX = require('xlsx');
const path = require('path');

// Читаем файл и выводим первые 3 строки для анализа
const workbook = XLSX.readFile(path.join(__dirname, '..', '1-7 (2).xlsx'));
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet);

console.log('Первые 3 строки:');
console.log(JSON.stringify(data.slice(0, 3), null, 2));

console.log('\nВсего строк:', data.length);
console.log('\nКлючи первой строки:', Object.keys(data[0]));






