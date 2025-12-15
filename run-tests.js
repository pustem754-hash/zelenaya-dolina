// Простой скрипт для запуска тестов
console.log('🧪 Загрузка модуля...');

try {
    const { markdownToHTML } = require('./index.js');
    console.log('✅ Модуль загружен успешно\n');

    let passed = 0;
    let failed = 0;

    function runTest(name, input, expected) {
        const result = markdownToHTML(input);
        if (result === expected) {
            console.log(`✅ ${name}`);
            passed++;
        } else {
            console.log(`❌ ${name}`);
            console.log(`   Ожидалось: ${expected}`);
            console.log(`   Получено:  ${result}\n`);
            failed++;
        }
    }

    console.log('Запуск тестов:\n');

    // Тест 1: Заголовки
    runTest('H1', '# Heading 1', '<h1>Heading 1</h1>');
    runTest('H2', '## Heading 2', '<h2>Heading 2</h2>');
    runTest('H3', '### Heading 3', '<h3>Heading 3</h3>');

    // Тест 2: Жирный текст
    runTest('Bold **', '**bold**', '<strong>bold</strong>');
    runTest('Bold __', '__bold__', '<strong>bold</strong>');

    // Тест 3: Курсив
    runTest('Italic *', '*italic*', '<em>italic</em>');
    runTest('Italic _', '_italic_', '<em>italic</em>');

    // Тест 4: Зачёркнутый
    runTest('Strikethrough', '~~text~~', '<del>text</del>');

    // Тест 5: Инлайн код
    runTest('Inline code', '`code`', '<code>code</code>');

    // Тест 6: Ссылка
    runTest('Link', '[Google](https://google.com)', '<a href="https://google.com">Google</a>');

    // Тест 7: Изображение
    runTest('Image', '![Alt](img.png)', '<img src="img.png" alt="Alt">');

    // Тест 8: Горизонтальная линия
    runTest('HR ---', '---', '<hr>');

    // Тест 9: Цитата
    runTest('Blockquote', '> Quote', '<blockquote>Quote</blockquote>');

    // Тест 10: Пустая строка
    runTest('Empty string', '', '');

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Пройдено: ${passed}`);
    console.log(`❌ Провалено: ${failed}`);
    console.log('='.repeat(60));

    if (failed > 0) {
        process.exit(1);
    } else {
        console.log('\n🎉 Все тесты пройдены!');
        process.exit(0);
    }

} catch (error) {
    console.error('❌ Ошибка загрузки модуля:', error.message);
    process.exit(1);
}










