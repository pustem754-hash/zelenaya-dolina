/**
 * СКРИПТ ИМПОРТА ВСЕХ ЖИТЕЛЕЙ УК "ЗЕЛЁНАЯ ДОЛИНА"
 * Импорт 494 жителей из двух Excel файлов в систему авторизации
 * 
 * Источники:
 * - 25.xlsx: 208 квартир (ЖК "Маяк", дом 25)
 * - 1-7.xlsx: 286 квартир (ЖК "Зелёная Долина", дома 3,5,7)
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// === КОНФИГУРАЦИЯ ===
const CONFIG = {
    files: {
        mayak: path.join(__dirname, '..', '25.xlsx'),
        zelDol: path.join(__dirname, '..', '1-7.xlsx'),
        authJs: path.join(__dirname, '..', 'public', 'auth.js'),
        residentsJson: path.join(__dirname, '..', 'public', 'data', 'residents.json'),
        report: path.join(__dirname, '..', 'import-report.txt')
    },
    testUsers: [
        {
            id: "1234",
            name: "Тестовый Пользователь 1",
            apartment: "100",
            building: "25",
            complex: "ЖК Маяк",
            address: "Тестовый адрес 1",
            area: "65.5",
            login_code: "1234",
            balance: 0
        },
        {
            id: "5678",
            name: "Тестовый Пользователь 2",
            apartment: "200",
            building: "5",
            complex: "ЖК Зелёная Долина",
            address: "Тестовый адрес 2",
            area: "45.0",
            login_code: "5678",
            balance: -1500
        },
        {
            id: "9999",
            name: "Тестовый Пользователь 3",
            apartment: "300",
            building: "7",
            complex: "ЖК Зелёная Долина",
            address: "Тестовый адрес 3",
            area: "80.2",
            login_code: "9999",
            balance: 2000
        }
    ]
};

// === СТАТИСТИКА ===
const stats = {
    mayak: { korpus1: 0, korpus2: 0, total: 0 },
    zelDol: { dom3: 0, dom5: 0, dom7: 0, total: 0 },
    warnings: [],
    errors: [],
    codes: new Set(),
    duplicates: []
};

// === УТИЛИТЫ ===

/**
 * Нормализация ФИО
 */
function normalizeName(name) {
    if (!name) return '';
    return name
        .toString()
        .trim()
        .replace(/\s+/g, ' ')
        .toUpperCase();
}

/**
 * Извлечение номера квартиры
 */
function normalizeApartment(aptRaw) {
    if (!aptRaw) return { number: '', display: '' };
    
    const aptStr = aptRaw.toString().trim();
    
    // Убираем "ПОМ.№", "К", оставляем только цифры для поиска
    const number = aptStr
        .replace(/ПОМ\.№/gi, '')
        .replace(/^К/gi, '')
        .replace(/[^\d]/g, '')
        .trim();
    
    return {
        number: number,
        display: aptStr
    };
}

/**
 * Разделение площади "61.9/31.4" → {total: "61.9", living: "31.4"}
 */
function parseArea(areaRaw) {
    if (!areaRaw) return { total: null, living: null };
    
    const areaStr = areaRaw.toString().trim();
    const parts = areaStr.split('/');
    
    return {
        total: parts[0]?.trim() || null,
        living: parts[1]?.trim() || null
    };
}

/**
 * Генерация кода доступа (последние 4 цифры)
 */
function generateLoginCode(accountNumber) {
    if (!accountNumber) return null;
    
    const digits = accountNumber.toString().replace(/[^\d]/g, '');
    if (digits.length < 4) {
        stats.warnings.push(`⚠️ Недостаточно цифр для кода: ${accountNumber}`);
        return null;
    }
    
    return digits.slice(-4);
}

/**
 * Проверка уникальности кода
 */
function checkCodeUnique(code, name, apartment) {
    if (stats.codes.has(code)) {
        stats.duplicates.push(`Дубликат кода ${code}: ${name}, кв. ${apartment}`);
        return false;
    }
    stats.codes.add(code);
    return true;
}

// === ИМПОРТ ЖК "МАЯК" (25.xlsx) ===

function importMayak() {
    console.log('\n📂 Импорт ЖК "Маяк" (25.xlsx)...');
    
    const workbook = XLSX.readFile(CONFIG.files.mayak);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`   Прочитано строк: ${data.length}`);
    
    const residents = [];
    
    for (const row of data) {
        // Извлечение данных
        const licSchet = row['Лиц. счет'];
        const fio = row['Абонент'];
        const kvRaw = row['Кв-ра'];
        const korpusRaw = row['Корп.'];
        const areaRaw = row['Общая/Жилая площадь'] || row['Общая'] || row['Площадь'];
        
        // Валидация
        if (!licSchet || !fio) {
            stats.warnings.push(`⚠️ Пропущена строка (нет лиц. счета или ФИО): ${JSON.stringify(row)}`);
            continue;
        }
        
        // Обработка
        const name = normalizeName(fio);
        const apt = normalizeApartment(kvRaw);
        const area = parseArea(areaRaw);
        const code = generateLoginCode(licSchet);
        const korpus = korpusRaw?.toString() || '1';
        
        if (!code) {
            stats.errors.push(`❌ Не удалось сгенерировать код для ${name}`);
            continue;
        }
        
        // Проверка уникальности
        checkCodeUnique(code, name, apt.display);
        
        // Адрес
        const address = `ул. Рогачева, д. 25${korpus !== '1' ? ', корп. ' + korpus : ''}, кв. ${apt.number}`;
        
        // Статистика
        if (korpus === '1') stats.mayak.korpus1++;
        else if (korpus === '2') stats.mayak.korpus2++;
        stats.mayak.total++;
        
        // Создание объекта жителя
        residents.push({
            id: code,
            name: name,
            apartment: apt.number,
            apartment_display: apt.display,
            building: "25",
            korpus: korpus,
            complex: "ЖК Маяк",
            address: address,
            full_address: `г. Зеленодольск, ${address}`,
            area: area.total,
            total_area: area.total,
            living_area: area.living,
            status: "active",
            login_code: code,
            original_account: licSchet.toString(),
            balance: 0
        });
    }
    
    console.log(`   ✅ Импортировано: ${residents.length}`);
    console.log(`      Корпус 1: ${stats.mayak.korpus1}`);
    console.log(`      Корпус 2: ${stats.mayak.korpus2}`);
    
    return residents;
}

// === ИМПОРТ ЖК "ЗЕЛЁНАЯ ДОЛИНА" (1-7.xlsx) ===

function importZelenayaDolina() {
    console.log('\n📂 Импорт ЖК "Зелёная Долина" (1-7.xlsx)...');
    
    const workbook = XLSX.readFile(CONFIG.files.zelDol);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`   Прочитано строк: ${data.length}`);
    
    const residents = [];
    
    for (const row of data) {
        // Извлечение данных
        const platKod = row['Платежный код'] || row['Лиц. счет'];
        const fio = row['Абонент'];
        const domRaw = row['Дом'];
        const kvRaw = row['Кв-ра'];
        const areaRaw = row['Общая/Жилая площадь'] || row['Площадь'];
        
        // Валидация
        if (!platKod || !fio) {
            stats.warnings.push(`⚠️ Пропущена строка (нет платежного кода или ФИО): ${JSON.stringify(row)}`);
            continue;
        }
        
        // Обработка
        const name = normalizeName(fio);
        const apt = normalizeApartment(kvRaw);
        const area = parseArea(areaRaw);
        const code = generateLoginCode(platKod);
        const dom = domRaw?.toString() || '5';
        
        if (!code) {
            stats.errors.push(`❌ Не удалось сгенерировать код для ${name}`);
            continue;
        }
        
        // Проверка уникальности
        checkCodeUnique(code, name, apt.display);
        
        // Определение дома по номеру квартиры (191-220 → дом 3)
        const aptNum = parseInt(apt.number);
        let building = dom;
        if (aptNum >= 191 && aptNum <= 220) {
            building = '3';
        }
        
        // Адрес
        const address = `мкр. Зелёная Долина, д. ${building}, кв. ${apt.number}`;
        
        // Статистика
        if (building === '3') stats.zelDol.dom3++;
        else if (building === '5') stats.zelDol.dom5++;
        else if (building === '7') stats.zelDol.dom7++;
        stats.zelDol.total++;
        
        // Создание объекта жителя
        residents.push({
            id: code,
            name: name,
            apartment: apt.number,
            apartment_display: apt.display,
            building: building,
            complex: "ЖК Зелёная Долина",
            address: address,
            full_address: `г. Зеленодольск, ${address}`,
            area: area.total,
            total_area: area.total,
            living_area: area.living,
            status: "active",
            login_code: code,
            original_account: platKod.toString(),
            balance: 0
        });
    }
    
    console.log(`   ✅ Импортировано: ${residents.length}`);
    console.log(`      Дом 3: ${stats.zelDol.dom3}`);
    console.log(`      Дом 5: ${stats.zelDol.dom5}`);
    console.log(`      Дом 7: ${stats.zelDol.dom7}`);
    
    return residents;
}

// === СОЗДАНИЕ ФАЙЛОВ ===

function saveAuthJs(allResidents) {
    console.log('\n💾 Создание auth.js...');
    
    // Создать бэкап
    if (fs.existsSync(CONFIG.files.authJs)) {
        fs.copyFileSync(CONFIG.files.authJs, CONFIG.files.authJs + '.backup');
        console.log('   ✅ Бэкап создан: auth.js.backup');
    }
    
    // Объединить тестовых + реальных жителей
    const authData = {};
    
    // Добавить тестовых пользователей
    for (const testUser of CONFIG.testUsers) {
        authData[testUser.id] = testUser;
    }
    
    // Добавить реальных жителей
    for (const resident of allResidents) {
        authData[resident.id] = resident;
    }
    
    // Сформировать содержимое
    const content = `// БАЗА ДАННЫХ ЖИТЕЛЕЙ УК "ЗЕЛЁНАЯ ДОЛИНА"
// Автоматически сгенерировано: ${new Date().toISOString()}
// Всего: ${Object.keys(authData).length} записей (${CONFIG.testUsers.length} тестовых + ${allResidents.length} реальных)

window.authData = ${JSON.stringify(authData, null, 2)};
`;
    
    fs.writeFileSync(CONFIG.files.authJs, content, 'utf-8');
    console.log(`   ✅ auth.js создан: ${Object.keys(authData).length} записей`);
}

function saveResidentsJson(allResidents) {
    console.log('\n💾 Создание residents.json...');
    
    // Создать папку data если не существует
    const dataDir = path.dirname(CONFIG.files.residentsJson);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Создать бэкап
    if (fs.existsSync(CONFIG.files.residentsJson)) {
        fs.copyFileSync(CONFIG.files.residentsJson, CONFIG.files.residentsJson + '.backup');
        console.log('   ✅ Бэкап создан: residents.json.backup');
    }
    
    fs.writeFileSync(CONFIG.files.residentsJson, JSON.stringify(allResidents, null, 2), 'utf-8');
    console.log(`   ✅ residents.json создан: ${allResidents.length} записей`);
}

// === СОЗДАНИЕ ОТЧЁТА ===

function createReport(allResidents) {
    console.log('\n📄 Создание отчёта...');
    
    const report = `
═══════════════════════════════════════════════════════════════════
   ОТЧЁТ ОБ ИМПОРТЕ ЖИТЕЛЕЙ УК "ЗЕЛЁНАЯ ДОЛИНА"
═══════════════════════════════════════════════════════════════════

📅 ДАТА ИМПОРТА: ${new Date().toLocaleString('ru-RU')}

📊 СТАТИСТИКА ИМПОРТА:
────────────────────────────────────────────────────────────────────
├── ОБЩЕЕ КОЛИЧЕСТВО: ${allResidents.length} жителей
│
├── ЖК "МАЯК" (дом 25):
│   ├── Корпус 1: ${stats.mayak.korpus1} квартир
│   ├── Корпус 2: ${stats.mayak.korpus2} квартир
│   └── ИТОГО: ${stats.mayak.total} квартир
│
├── ЖК "ЗЕЛЁНАЯ ДОЛИНА":
│   ├── Дом 3: ${stats.zelDol.dom3} квартир (191-220)
│   ├── Дом 5: ${stats.zelDol.dom5} квартир
│   ├── Дом 7: ${stats.zelDol.dom7} квартир
│   └── ИТОГО: ${stats.zelDol.total} квартир
│
├── КОДЫ ДОСТУПА:
│   ├── Уникальных: ${stats.codes.size}
│   ├── Дубликатов: ${stats.duplicates.length}
│   └── Тестовых: +${CONFIG.testUsers.length}
│
└── ФАЙЛЫ:
    ├── auth.js: ${allResidents.length + CONFIG.testUsers.length} записей (${allResidents.length} + ${CONFIG.testUsers.length} тестовых)
    ├── residents.json: ${allResidents.length} записей
    └── Бэкапы созданы: ✓

${stats.duplicates.length > 0 ? `
⚠️ ДУБЛИКАТЫ КОДОВ (${stats.duplicates.length}):
${stats.duplicates.map(d => `   - ${d}`).join('\n')}
` : ''}

${stats.warnings.length > 0 ? `
⚠️ ПРЕДУПРЕЖДЕНИЯ (${stats.warnings.length}):
${stats.warnings.slice(0, 10).map(w => `   ${w}`).join('\n')}
${stats.warnings.length > 10 ? `   ... и ещё ${stats.warnings.length - 10} предупреждений` : ''}
` : '⚠️ ПРЕДУПРЕЖДЕНИЯ: 0'}

${stats.errors.length > 0 ? `
❌ ОШИБКИ (${stats.errors.length}):
${stats.errors.map(e => `   ${e}`).join('\n')}
` : '❌ ОШИБКИ: 0'}

═══════════════════════════════════════════════════════════════════
   ИМПОРТ ЗАВЕРШЁН УСПЕШНО ✓
═══════════════════════════════════════════════════════════════════
`;
    
    fs.writeFileSync(CONFIG.files.report, report, 'utf-8');
    console.log(`   ✅ Отчёт создан: import-report.txt`);
    console.log(report);
}

// === ГЛАВНАЯ ФУНКЦИЯ ===

async function main() {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('   ИМПОРТ ВСЕХ ЖИТЕЛЕЙ УК "ЗЕЛЁНАЯ ДОЛИНА"');
    console.log('═══════════════════════════════════════════════════════════════════');
    
    try {
        // ШАГ 1: Проверка файлов
        console.log('\n🔍 ШАГ 1: Проверка исходных файлов...');
        if (!fs.existsSync(CONFIG.files.mayak)) {
            throw new Error(`Файл не найден: ${CONFIG.files.mayak}`);
        }
        if (!fs.existsSync(CONFIG.files.zelDol)) {
            throw new Error(`Файл не найден: ${CONFIG.files.zelDol}`);
        }
        console.log('   ✅ Все файлы найдены');
        
        // ШАГ 2: Импорт данных
        console.log('\n🔄 ШАГ 2: Импорт данных из Excel...');
        const mayakResidents = importMayak();
        const zelDolResidents = importZelenayaDolina();
        
        // ШАГ 3: Объединение
        console.log('\n🔗 ШАГ 3: Объединение данных...');
        const allResidents = [...mayakResidents, ...zelDolResidents];
        console.log(`   ✅ Всего жителей: ${allResidents.length}`);
        
        // ШАГ 4: Сохранение
        console.log('\n💾 ШАГ 4: Сохранение в файлы...');
        saveAuthJs(allResidents);
        saveResidentsJson(allResidents);
        
        // ШАГ 5: Отчёт
        console.log('\n📊 ШАГ 5: Создание отчёта...');
        createReport(allResidents);
        
        console.log('\n═══════════════════════════════════════════════════════════════════');
        console.log('   ✅ ИМПОРТ ЗАВЕРШЁН УСПЕШНО!');
        console.log('═══════════════════════════════════════════════════════════════════');
        
    } catch (error) {
        console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Запуск
main();

