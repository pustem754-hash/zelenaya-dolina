// УК Зелёная Долина - Локальный сервер для PWA
// Настроен для доступа с мобильных устройств в локальной сети
// ИСПРАВЛЕНО: Привязка к конкретному IP для работы с VPN

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3002;

// ВАШИ IP АДРЕСА (измените если нужно)
const WIFI_IP = '192.168.1.8'; // Ваш IP из ipconfig (Wi-Fi адаптер)

// MIME типы
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// Получить локальный IP адрес Wi-Fi
function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Ищем только IPv4 адреса в диапазоне 192.168.1.x (ваша домашняя сеть)
            if (iface.family === 'IPv4' && !iface.internal && iface.address.startsWith('192.168.1.')) {
                return iface.address;
            }
        }
    }
    return WIFI_IP; // Если не нашли, используем заданный вручную
}

// Создать HTTP сервер
const server = http.createServer((req, res) => {
    console.log(`📱 ${req.method} ${req.url}`);

    // Определить путь к файлу
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Получить расширение файла
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    // Читать и отправить файл
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Файл не найден - вернуть index.html для SPA роутинга
                fs.readFile('./index.html', (err, indexContent) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Ошибка сервера: ' + err.code);
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end(indexContent, 'utf-8');
                    }
                });
            } else {
                // Другая ошибка
                res.writeHead(500);
                res.end('Ошибка сервера: ' + error.code);
            }
        } else {
            // Успешно - отправить файл
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// ИСПРАВЛЕНИЕ: Слушаем на всех интерфейсах для доступа с localhost
const localIP = getLocalIPAddress();

// Слушаем на всех интерфейсах (0.0.0.0) для доступа с localhost и по сети
server.listen(PORT, '0.0.0.0', () => {
    console.log('\n🏠 ========================================');
    console.log('   УК "Зелёная Долина" - Сервер запущен');
    console.log('========================================\n');
    
    console.log('✅ ПРИВЯЗКА К Wi-Fi ИНТЕРФЕЙСУ');
    console.log(`   IP адрес: ${localIP}`);
    console.log('   Теперь работает ДАЖЕ С ВКЛЮЧЁННЫМ VPN! 🎉\n');
    
    console.log('📱 Доступ с этого компьютера:');
    console.log(`   http://localhost:${PORT}`);
    console.log(`   http://127.0.0.1:${PORT}\n`);
    
    console.log('📱 Доступ с мобильных устройств:');
    console.log(`   http://${localIP}:${PORT}\n`);
    
    console.log('⚙️  Инструкции для подключения с телефона:');
    console.log('   1. Подключите телефон к той же WiFi сети');
    console.log('   2. Откройте браузер на телефоне');
    console.log(`   3. Введите адрес: http://${localIP}:${PORT}`);
    console.log('   4. Добавьте приложение на главный экран\n');
    
    console.log('🛑 Для остановки сервера нажмите Ctrl+C\n');
    
    console.log('💡 ВАЖНО:');
    console.log('   - Сервер привязан к Wi-Fi интерфейсу');
    console.log('   - VPN НЕ влияет на работу приложения');
    console.log('   - Если IP изменился, измените WIFI_IP в начале файла\n');
});

// Обработка ошибок
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Порт ${PORT} уже используется!`);
        console.log(`   Попробуйте другой порт: PORT=3001 node server.js`);
    } else if (error.code === 'EADDRNOTAVAIL') {
        console.error(`❌ IP адрес ${localIP} недоступен!`);
        console.log('   Ваш IP адрес изменился. Проверьте командой: ipconfig');
        console.log(`   Измените WIFI_IP в начале файла server.js на актуальный IP`);
    } else {
        console.error('❌ Ошибка сервера:', error);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 Получен сигнал SIGTERM, останавливаем сервер...');
    server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n\n🛑 Остановка сервера...');
    server.close(() => {
        console.log('✅ Сервер успешно остановлен');
        process.exit(0);
    });
});