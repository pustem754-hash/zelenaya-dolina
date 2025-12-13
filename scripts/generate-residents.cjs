const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('🚀 Генерация данных жителей из Excel...\n');

const workbook1 = XLSX.readFile('25.xlsx');
const workbook2 = XLSX.readFile('1-7 (2).xlsx');

const sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];

const data1 = XLSX.utils.sheet_to_json(sheet1);
const data2 = XLSX.utils.sheet_to_json(sheet2, { range: 1 });

console.log(`📄 Файл 25.xlsx: ${data1.length} строк`);
console.log(`📄 Файл 1-7 (2).xlsx: ${data2.length} строк\n`);

const allData = [...data1, ...data2];
const residents = [];
let idCounter = 1;

allData.forEach((row, index) => {
  const fio = row['Абонент'] || row['__EMPTY_4'] || '';
  const street = row['Элемент улично-дорожной сети'] || '';
  const house = row['Дом'] || '';
  const corp = row['Корп.'] || '';
  const apartment = row['Кв-ра'] || row['__EMPTY_6'] || '';
  const licSchet = row['Лиц. счет'] || row['__EMPTY_2'] || '';
  const paymentCode = row['__EMPTY_3'] || '';
  
  if (!fio || fio.length < 3 || typeof fio !== 'string') {
    return;
  }
  
  const address = street && house 
    ? `${street}, д. ${house}${corp ? ', корп. ' + corp : ''}`
    : 'Адрес не указан';
  
  let phone = '';
  if (licSchet && licSchet.toString().length >= 10) {
    const digits = licSchet.toString().slice(-10);
    phone = '+7' + digits;
  } else if (paymentCode && paymentCode.toString().length >= 10) {
    const digits = paymentCode.toString().replace(/\D/g, '').slice(-10);
    phone = '+7' + digits;
  } else {
    const randomPhone = '960' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    phone = '+7' + randomPhone;
  }
  
  const code = phone.slice(-4);
  
  const kvParts = apartment.toString().match(/\d+/);
  const kvNumber = kvParts ? kvParts[0] : '—';
  
  const storage = kvParts ? Math.floor(parseInt(kvParts[0]) / 10).toString() : '—';
  
  residents.push({
    id: idCounter++,
    fio: fio.trim(),
    phone: phone,
    code: code,
    address: address,
    apartment: kvNumber,
    storage: storage,
    complex: 'Зелёная долина',
    balance: 0,
    licSchet: licSchet.toString()
  });
});

const uniqueResidents = residents.filter((resident, index, self) =>
  index === self.findIndex((r) => r.phone === resident.phone)
);

console.log(`\n✅ Обработано уникальных жителей: ${uniqueResidents.length}`);

const dataDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const outputPath = path.join(dataDir, 'residents.json');
fs.writeFileSync(outputPath, JSON.stringify(uniqueResidents, null, 2), 'utf-8');

console.log(`✅ Файл сохранён: ${outputPath}`);
console.log(`✅ Размер файла: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB\n`);

console.log('📱 Примеры для входа (первые 10 жителей):\n');
uniqueResidents.slice(0, 10).forEach((r, i) => {
  console.log(`${i + 1}. Телефон: ${r.phone}, Код: ${r.code}`);
  console.log(`   ФИО: ${r.fio}`);
  console.log(`   Адрес: ${r.address}, Кв: ${r.apartment}, Кладовая: ${r.storage}`);
  console.log(`   Лиц. счёт: ${r.licSchet}\n`);
});
