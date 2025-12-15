// Простой тестовый раннер для markdownToHTML
const { markdownToHTML } = require('./index.js');

let passedTests = 0;
let failedTests = 0;
const failures = [];

function test(description, fn) {
    try {
        fn();
        passedTests++;
        console.log(`✅ ${description}`);
    } catch (error) {
        failedTests++;
        console.log(`❌ ${description}`);
        failures.push({ description, error: error.message });
    }
}

function expect(actual) {
    return {
        toBe(expected) {
            if (actual !== expected) {
                throw new Error(`Expected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
            }
        }
    };
}

console.log('🧪 Запуск тестов markdownToHTML\n');

// Тест 1: Заголовки
test('should convert heading h1', () => {
    expect(markdownToHTML('# Heading 1')).toBe('<h1>Heading 1</h1>');
});

test('should convert heading h2', () => {
    expect(markdownToHTML('## Heading 2')).toBe('<h2>Heading 2</h2>');
});

test('should convert heading h3', () => {
    expect(markdownToHTML('### Heading 3')).toBe('<h3>Heading 3</h3>');
});

// Тест 2: Жирный текст
test('should convert bold text with **', () => {
    expect(markdownToHTML('**bold text**')).toBe('<strong>bold text</strong>');
});

test('should convert bold text with __', () => {
    expect(markdownToHTML('__bold text__')).toBe('<strong>bold text</strong>');
});

test('should convert bold in sentence', () => {
    expect(markdownToHTML('This is **bold** word')).toBe('This is <strong>bold</strong> word');
});

// Тест 3: Курсив
test('should convert italic with *', () => {
    expect(markdownToHTML('*italic text*')).toBe('<em>italic text</em>');
});

test('should convert italic with _', () => {
    expect(markdownToHTML('_italic text_')).toBe('<em>italic text</em>');
});

// Тест 4: Зачёркнутый
test('should convert strikethrough', () => {
    expect(markdownToHTML('~~strikethrough~~')).toBe('<del>strikethrough</del>');
});

// Тест 5: Инлайн код
test('should convert inline code', () => {
    expect(markdownToHTML('`code`')).toBe('<code>code</code>');
});

test('should convert inline code in sentence', () => {
    expect(markdownToHTML('Use `console.log()` function')).toBe('Use <code>console.log()</code> function');
});

// Тест 6: Ссылки
test('should convert links', () => {
    expect(markdownToHTML('[Google](https://google.com)')).toBe('<a href="https://google.com">Google</a>');
});

// Тест 7: Изображения
test('should convert images', () => {
    expect(markdownToHTML('![Alt text](image.png)')).toBe('<img src="image.png" alt="Alt text">');
});

// Тест 8: Списки неупорядоченные
test('should convert unordered lists', () => {
    const markdown = `- Item 1
- Item 2
- Item 3`;
    const expected = `<ul>
<li>Item 1</li>
<li>Item 2</li>
<li>Item 3</li>
</ul>`;
    expect(markdownToHTML(markdown)).toBe(expected);
});

// Тест 9: Упорядоченные списки
test('should convert ordered lists', () => {
    const markdown = `1. First
2. Second
3. Third`;
    const expected = `<ol>
<li>First</li>
<li>Second</li>
<li>Third</li>
</ol>`;
    expect(markdownToHTML(markdown)).toBe(expected);
});

// Тест 10: Блоки кода
test('should convert code blocks', () => {
    const markdown = '```javascript\nconst x = 1;\n```';
    const expected = '<pre><code class="language-javascript">const x = 1;\n</code></pre>';
    expect(markdownToHTML(markdown)).toBe(expected);
});

// Тест 11: Цитаты
test('should convert blockquotes', () => {
    expect(markdownToHTML('> Quote text')).toBe('<blockquote>Quote text</blockquote>');
});

// Тест 12: Горизонтальные линии
test('should convert hr with ---', () => {
    expect(markdownToHTML('---')).toBe('<hr>');
});

test('should convert hr with ***', () => {
    expect(markdownToHTML('***')).toBe('<hr>');
});

// Тест 13: Параграфы
test('should convert paragraphs', () => {
    const markdown = `First paragraph

Second paragraph`;
    const expected = `<p>First paragraph</p>
<p>Second paragraph</p>`;
    expect(markdownToHTML(markdown)).toBe(expected);
});

// Тест 14: Переносы строк
test('should handle line breaks', () => {
    expect(markdownToHTML('Line 1  \nLine 2')).toBe('Line 1<br>\nLine 2');
});

// Тест 15: Пустая строка
test('should handle empty string', () => {
    expect(markdownToHTML('')).toBe('');
});

// Тест 16: Экранирование HTML
test('should escape HTML entities', () => {
    expect(markdownToHTML('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
});

// Результаты
console.log('\n' + '='.repeat(50));
console.log(`✅ Пройдено: ${passedTests}`);
console.log(`❌ Провалено: ${failedTests}`);
console.log('='.repeat(50));

if (failures.length > 0) {
    console.log('\n❌ Ошибки:');
    failures.forEach(({ description, error }) => {
        console.log(`\n${description}:`);
        console.log(error);
    });
    process.exit(1);
} else {
    console.log('\n🎉 Все тесты пройдены!');
    process.exit(0);
}










