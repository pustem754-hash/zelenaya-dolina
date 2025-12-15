/**
 * MARKDOWN TO HTML CONVERTER
 * ===========================
 * Преобразует Markdown разметку в HTML
 * 
 * Поддерживаемые функции:
 * - Заголовки: # H1, ## H2, ### H3, etc.
 * - Жирный: **текст** или __текст__
 * - Курсив: *текст* или _текст_
 * - Зачёркнутый: ~~текст~~
 * - Инлайн код: `код`
 * - Блоки кода: ```язык\nкод\n```
 * - Ссылки: [текст](url)
 * - Изображения: ![alt](src)
 * - Списки: - элемент или 1. элемент
 * - Цитаты: > текст
 * - Горизонтальные линии: ---, ***, ___
 * - Параграфы: автоматически
 * - Экранирование HTML
 */

function markdownToHTML(markdown) {
    if (!markdown) return '';
    
    let html = markdown;
    
    // 1. Сохраняем блоки кода (до экранирования)
    const codeBlocks = [];
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        const langClass = lang ? ` class="language-${lang}"` : '';
        codeBlocks.push(`<pre><code${langClass}>${code}</code></pre>`);
        return placeholder;
    });
    
    // 2. Сохраняем инлайн код (до экранирования)
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
    
    // 4. Восстанавливаем код
    codeBlocks.forEach((block, i) => {
        html = html.replace(`__CODE_BLOCK_${i}__`, block);
    });
    inlineCodes.forEach((code, i) => {
        html = html.replace(`__INLINE_CODE_${i}__`, code);
    });
    
    // 5. Заголовки (от большего к меньшему)
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
        // Не оборачиваем в <p> если уже есть блочный элемент
        if (trimmed.match(/^<(h[1-6]|ul|ol|pre|blockquote|hr)/)) {
            return trimmed;
        }
        return `<p>${trimmed}</p>`;
    }).filter(b => b).join('\n');
    
    return html;
}

// ============================================
// ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ
// ============================================

console.log('📝 Markdown to HTML Converter\n');
console.log('Пример 1 - Заголовок:');
console.log(markdownToHTML('# Hello World'));
console.log('');

console.log('Пример 2 - Текст с форматированием:');
console.log(markdownToHTML('This is **bold** and *italic* text'));
console.log('');

console.log('Пример 3 - Ссылка:');
console.log(markdownToHTML('[Google](https://google.com)'));
console.log('');

console.log('Пример 4 - Список:');
console.log(markdownToHTML('- Item 1\n- Item 2\n- Item 3'));
console.log('');

console.log('Пример 5 - Комплексный пример:');
const complexMarkdown = `# Заголовок

Это **жирный** текст и *курсивный* текст.

## Список:
- Первый элемент
- Второй элемент
- Третий элемент

Ссылка на [Google](https://google.com).

\`\`\`javascript
const x = 1;
console.log(x);
\`\`\``;

console.log(markdownToHTML(complexMarkdown));

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { markdownToHTML };
}

// Экспорт для браузера
if (typeof window !== 'undefined') {
    window.markdownToHTML = markdownToHTML;
}










