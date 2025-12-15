const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('🚀 Генерация данных жителей из Excel...\n');

// Читаем Excel файлы
const workbook1 = XLSX.readFile('25.xlsx');
const workbook2 = XLSX.readFile('1-7 (2).xlsx');

// Получаем первый лист из каждого файла
const sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];

// Преобразуем в JSON
const data1 = XLSX.utils.sheet_to_json(sheet1);
const data2 = XLSX.utils.sheet_to_json(sheet2);

console.log(`📄 Файл 25.xlsx: ${data1.length} строк`);
console.log(`📄 Файл 1-7 (2).xlsx: ${data2.length} строк\n`);

// Объединяем данные
const allData = [...data1, ...data2];

// Формируем массив жителей
const residents = [];
let idCounter = 1;

allData.forEach((row, index) => {
  // Извлекаем данные (попробуем разные варианты названий колонок)
  const fio = row['ФИО'] || row['Ф.И.О.'] || row['Фамилия Имя Отчество'] || row['Фамилия'] || '';
  const address = row['Адрес'] || row['Адрес проживания'] || row['Адрес дома'] || '';
  const apartment = row['Квартира'] || row['Кв.'] || row['№ кв.'] || row['Номер квартиры'] || '';
  const storage = row['Кладовая'] || row['Кладовка'] || row['Кладовое помещение'] || row['№ кладовой'] || '';
  const phone = row['Телефон'] || row['Тел.'] || row['Мобильный'] || row['Контактный телефон'] || '';
  const balance = row['Баланс'] || row['Задолженность'] || row['Сумма'] || 0;
  
  // Пропускаем пустые строки
  if (!fio || fio.length < 3) {
    console.log(`⚠️  Строка ${index + 1}: пропущена (нет ФИО)`);
    return;
  }
  
  if (!phone) {
    console.log(`⚠️  Строка ${index + 1}: пропущена (нет телефона) - ${fio}`);
    return;
  }
  
  // Форматируем телефон
  let formattedPhone = phone.toString().replace(/\D/g, '');
  
  if (formattedPhone.length === 10) {
    formattedPhone = '+7' + formattedPhone;
  } else if (formattedPhone.length === 11 && formattedPhone[0] === '8') {
    formattedPhone = '+7' + formattedPhone.slice(1);
  } else if (formattedPhone.length === 11 && formattedPhone[0] === '7') {
    formattedPhone = '+' + formattedPhone;
  } else {
    console.log(`⚠️  Строка ${index + 1}: некорректный телефон (${phone}) - ${fio}`);
    return;
  }
  
  // Определяем ЖК по адресу
  let complex = 'Зелёная долина';
  if (address.includes('Рогачёва') || address.includes('Рогачева')) {
    complex = 'Зелёная долина';
  }
  
  // Генерируем код (последние 4 цифры телефона)
  const code = formattedPhone.slice(-4);
  
  // Добавляем жителя
  residents.push({
    id: idCounter++,
    fio: fio.trim(),
    phone: formattedPhone,
    code: code,
    address: address.trim() || 'Адрес не указан',
    apartment: apartment.toString().trim() || '—',
    storage: storage.toString().trim() || '—',
    complex: complex,
    balance: parseFloat(balance) || 0
  });
});

// Удаляем дубликаты по телефону
const uniqueResidents = residents.filter((resident, index, self) =>
  index === self.findIndex((r) => r.phone === resident.phone)
);

console.log(`\n✅ Обработано уникальных жителей: ${uniqueResidents.length}`);

// Создаём директорию public/data если её нет
const dataDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Создана директория: public/data');
}

// Сохраняем в JSON
const outputPath = path.join(dataDir, 'residents.json');
fs.writeFileSync(outputPath, JSON.stringify(uniqueResidents, null, 2), 'utf-8');

console.log(`✅ Файл сохранён: ${outputPath}`);
console.log(`✅ Размер файла: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB\n`);

// Примеры для тестирования
console.log('📱 Примеры для входа (первые 5 жителей):\n');

uniqueResidents.slice(0, 5).forEach((r, i) => {
  console.log(`${i + 1}. Телефон: ${r.phone}, Код: ${r.code}`);
  console.log(`   ФИО: ${r.fio}`);
  console.log(`   Адрес: ${r.address}, Кв: ${r.apartment}, Кладовая: ${r.storage}\n`);
});
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const files = [
    { path: path.join(__dirname, '..', '25.xlsx') },
    { path: path.join(__dirname, '..', '1-7 (2).xlsx') }
];

function normalizePhone(input) {
    let digits = (input || '').toString().replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('8')) {
        digits = '7' + digits.slice(1);
    }
    if (!digits.startsWith('7')) {
        digits = '7' + digits;
    }
    return '+' + digits;
}

function detectComplex(row) {
    const fromField = row['ЖК'] || row['Complex'];
    if (fromField) return fromField;

    const street = (row['Улица'] || row['Street'] || '').toString().toLowerCase();
    if (street.includes('рогач') || street.includes('зелёная долина') || street.includes('зеленая долина') || street.includes('мкр')) {
        return 'ЖК Зелёная долина';
    }
    return 'ЖК Маяк';
}

function asNumberOrEmpty(value) {
    if (value === undefined || value === null || value === '') return '';
    const num = Number(value);
    return Number.isFinite(num) ? num : '';
}

function readWorkbook(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Файл не найден: ${filePath}`);
        return [];
    }
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
}

const rows = files.flatMap(f => readWorkbook(f.path));

const residents = rows.map((row, index) => {
    const phone = normalizePhone(row['Телефон'] || row['Phone'] || '');
    return {
        id: index + 1,
        phone,
        fullName: row['ФИО'] || row['Full Name'] || 'Не указано',
        complex: detectComplex(row),
        street: row['Улица'] || row['Street'] || '',
        house: row['Дом'] || row['House'] || '',
        apartment: row['Квартира'] || row['Apartment'] || '',
        storage: row['Кладовая'] || row['Storage'] || '',
        accountNumber: row['Лицевой счёт'] || row['Account Number'] || '',
        area: row['Площадь'] || row['Area'] || '',
        registeredPeople: row['Зарегистрировано'] || row['Registered'] || row['Прописано'] || '',
        balance: asNumberOrEmpty(row['Баланс'] || row['Balance'])
    };
});

const dataDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const outputPath = path.join(dataDir, 'residents.json');
fs.writeFileSync(outputPath, JSON.stringify(residents, null, 2), 'utf-8');

console.log(`✅ Создан файл: ${outputPath}`);
console.log(`📊 Всего жильцов: ${residents.length}`);
console.log('📝 Пример данных:', residents[0]);

