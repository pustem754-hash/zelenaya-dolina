const XLSX = require('xlsx');

console.log('🔍 Проверка структуры Excel файлов...\n');

const workbook1 = XLSX.readFile('25.xlsx');
const workbook2 = XLSX.readFile('1-7 (2).xlsx');

const sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];

const data1 = XLSX.utils.sheet_to_json(sheet1);
const data2 = XLSX.utils.sheet_to_json(sheet2);

console.log('📄 Файл 25.xlsx - Первая строка данных:');
console.log(JSON.stringify(data1[0], null, 2));
console.log('\n📄 Файл 25.xlsx - Названия колонок:');
console.log(Object.keys(data1[0] || {}));

console.log('\n\n📄 Файл 1-7 (2).xlsx - Первая строка данных:');
console.log(JSON.stringify(data2[0], null, 2));
console.log('\n📄 Файл 1-7 (2).xlsx - Названия колонок:');
console.log(Object.keys(data2[0] || {}));
