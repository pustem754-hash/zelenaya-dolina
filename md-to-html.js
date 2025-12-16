#!/usr/bin/env node
// Markdown to HTML Converter - Standalone версия

function markdownToHTML(markdown) {
    if (!markdown) return '';
    
    let html = markdown;
    
    // 1. Блоки кода (ДО экранирования HTML)
    const codeBlocks = [];
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        const langClass = lang ? ` class="language-${lang}"` : '';
        codeBlocks.push(`<pre><code${langClass}>${code}</code></pre>`);
        return placeholder;
    });
    
    // 2. Инлайн код (до экранирования)
    const inlineCodes = [];
    html = html.replace(/`([^`]+)`/g, (match, code) => {
        const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
        inlineCodes.push(`<code>${code}</code>`);
        return placeholder;
    });
    
    // 3. Экранирование HTML
    html = html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    
    // 4. Восстанавливаем блоки кода
    codeBlocks.forEach((block, i) => {
        html = html.replace(`__CODE_BLOCK_${i}__`, block);
    });
    
    inlineCodes.forEach((code, i) => {
        html = html.replace(`__INLINE_CODE_${i}__`, code);
    });
    
    // 5. Заголовки
    html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
    
    // 6. Горизонтальные линии
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/^\*\*\*$/gm, '<hr>');
    html = html.replace(/^___$/gm, '<hr>');
    
    // 7. Неупорядоченные списки
    html = html.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>\n?)+/g, match => `<ul>\n${match}</ul>`);
    
    // 8. Упорядоченные списки
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>\n?)+/g, match => {
        if (match.includes('<ul>')) return match;
        return `<ol>\n${match}</ol>`;
    });
    
    // 9. Цитаты
    html = html.replace(/^&gt;\s+(.+)$/gm, '<blockquote>$1</blockquote>');
    
    // 10. Изображения (до ссылок!)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    
    // 11. Ссылки
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // 12. Жирный текст
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // 13. Курсив
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    
    // 14. Зачёркнутый
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
    
    // 15. Переносы строк (два пробела + перенос)
    html = html.replace(/  \n/g, '<br>\n');
    
    // 16. Параграфы
    const blocks = html.split(/\n\n+/);
    html = blocks.map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (trimmed.match(/^<(h[1-6]|ul|ol|pre|blockquote|hr)/)) {
            return trimmed;
        }
        return `<p>${trimmed}</p>`;
    }).filter(b => b).join('\n');
    
    return html;
}

// Тесты
function runTests() {
    console.log('🧪 Запуск тестов Markdown to HTML\n');
    
    let passed = 0;
    let failed = 0;
    
    function test(name, input, expected) {
        const result = markdownToHTML(input);
        if (result === expected) {
            console.log(`✅ ${name}`);
            passed++;
            return true;
        } else {
            console.log(`❌ ${name}`);
            console.log(`   Ожидалось: ${JSON.stringify(expected)}`);
            console.log(`   Получено:  ${JSON.stringify(result)}\n`);
            failed++;
            return false;
        }
    }
    
    // Заголовки
    test('H1', '# Heading 1', '<p><h1>Heading 1</h1></p>');
    test('H2', '## Heading 2', '<p><h2>Heading 2</h2></p>');
    test('H3', '### Heading 3', '<p><h3>Heading 3</h3></p>');
    
    // Жирный
    test('Bold **', '**bold**', '<p><strong>bold</strong></p>');
    test('Bold __', '__bold__', '<p><strong>bold</strong></p>');
    
    // Курсив
    test('Italic *', '*italic*', '<p><em>italic</em></p>');
    test('Italic _', '_italic_', '<p><em>italic</em></p>');
    
    // Зачёркнутый
    test('Strike', '~~text~~', '<p><del>text</del></p>');
    
    // Код
    test('Code', '`code`', '<p><code>code</code></p>');
    
    // Ссылка
    test('Link', '[Google](https://google.com)', '<p><a href="https://google.com">Google</a></p>');
    
    // Изображение
    test('Image', '![Alt](img.png)', '<p><img src="img.png" alt="Alt"></p>');
    
    // HR
    test('HR', '---', '<hr>');
    
    // Цитата
    test('Quote', '> Quote', '<blockquote>Quote</blockquote>');
    
    // Пустая строка
    test('Empty', '', '');
    
    // HTML экранирование
    test('Escape HTML', '<script>alert("XSS")</script>', '<p>&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</p>');
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ Пройдено: ${passed}`);
    console.log(`❌ Провалено: ${failed}`);
    console.log('='.repeat(60));
    
    return failed === 0;
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { markdownToHTML, runTests };
}

// Автозапуск тестов при прямом вызове
if (require.main === module) {
    const success = runTests();
    process.exit(success ? 0 : 1);
}












