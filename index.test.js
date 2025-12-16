// Тесты для markdownToHTML
const { markdownToHTML } = require('./index.js');

describe('markdownToHTML', () => {
    // Тест 1: Заголовки
    test('should convert headings', () => {
        expect(markdownToHTML('# Heading 1')).toBe('<h1>Heading 1</h1>');
        expect(markdownToHTML('## Heading 2')).toBe('<h2>Heading 2</h2>');
        expect(markdownToHTML('### Heading 3')).toBe('<h3>Heading 3</h3>');
        expect(markdownToHTML('#### Heading 4')).toBe('<h4>Heading 4</h4>');
        expect(markdownToHTML('##### Heading 5')).toBe('<h5>Heading 5</h5>');
        expect(markdownToHTML('###### Heading 6')).toBe('<h6>Heading 6</h6>');
    });

    // Тест 2: Жирный текст
    test('should convert bold text', () => {
        expect(markdownToHTML('**bold text**')).toBe('<strong>bold text</strong>');
        expect(markdownToHTML('__bold text__')).toBe('<strong>bold text</strong>');
        expect(markdownToHTML('This is **bold** word')).toBe('This is <strong>bold</strong> word');
    });

    // Тест 3: Курсив
    test('should convert italic text', () => {
        expect(markdownToHTML('*italic text*')).toBe('<em>italic text</em>');
        expect(markdownToHTML('_italic text_')).toBe('<em>italic text</em>');
        expect(markdownToHTML('This is *italic* word')).toBe('This is <em>italic</em> word');
    });

    // Тест 4: Зачёркнутый текст
    test('should convert strikethrough text', () => {
        expect(markdownToHTML('~~strikethrough~~')).toBe('<del>strikethrough</del>');
    });

    // Тест 5: Код инлайн
    test('should convert inline code', () => {
        expect(markdownToHTML('`code`')).toBe('<code>code</code>');
        expect(markdownToHTML('Use `console.log()` function')).toBe('Use <code>console.log()</code> function');
    });

    // Тест 6: Ссылки
    test('should convert links', () => {
        expect(markdownToHTML('[Google](https://google.com)')).toBe('<a href="https://google.com">Google</a>');
        expect(markdownToHTML('[Link](https://example.com)')).toBe('<a href="https://example.com">Link</a>');
    });

    // Тест 7: Изображения
    test('should convert images', () => {
        expect(markdownToHTML('![Alt text](image.png)')).toBe('<img src="image.png" alt="Alt text">');
    });

    // Тест 8: Списки (неупорядоченные)
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

    // Тест 9: Списки (упорядоченные)
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

    // Тест 12: Горизонтальная линия
    test('should convert horizontal rules', () => {
        expect(markdownToHTML('---')).toBe('<hr>');
        expect(markdownToHTML('***')).toBe('<hr>');
        expect(markdownToHTML('___')).toBe('<hr>');
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

    // Тест 15: Комбинированный текст
    test('should handle combined markdown', () => {
        const markdown = '# Title\n\nThis is **bold** and *italic* text with `code`.';
        const expected = '<h1>Title</h1>\n<p>This is <strong>bold</strong> and <em>italic</em> text with <code>code</code>.</p>';
        expect(markdownToHTML(markdown)).toBe(expected);
    });

    // Тест 16: Пустая строка
    test('should handle empty string', () => {
        expect(markdownToHTML('')).toBe('');
    });

    // Тест 17: Экранирование HTML
    test('should escape HTML entities', () => {
        expect(markdownToHTML('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    });
});













