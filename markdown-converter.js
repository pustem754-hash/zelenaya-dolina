// Markdown to HTML Converter

function markdownToHTML(markdown) {
    if (!markdown) return '';
    
    let html = markdown;
    
    // 1. Экранирование HTML (ПЕРЕД обработкой markdown)
    html = html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    
    // 2. Блоки кода (до других преобразований)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const langClass = lang ? ` class="language-${lang}"` : '';
        return `<pre><code${langClass}>${code}</code></pre>`;
    });
    
    // 3. Заголовки (от большего к меньшему)
    html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
    
    // 4. Горизонтальные линии
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/^\*\*\*$/gm, '<hr>');
    html = html.replace(/^___$/gm, '<hr>');
    
    // 5. Списки
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>\n$&</ul>');
    
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
        if (match.includes('<ul>')) return match;
        return `<ol>\n${match}</ol>`;
    });
    
    // 6. Цитаты
    html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
    
    // 7. Жирный текст (до курсива)
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // 8. Курсив
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    
    // 9. Зачёркнутый
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
    
    // 10. Инлайн код
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');
    
    // 11. Изображения (до ссылок)
    html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1">');
    
    // 12. Ссылки
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
    
    // 13. Переносы строк
    html = html.replace(/  \n/g, '<br>\n');
    
    // 14. Параграфы
    const blocks = html.split(/\n\n+/);
    html = blocks.map(block => {
        if (block.match(/^<(h[1-6]|ul|ol|pre|blockquote|hr)/)) {
            return block;
        }
        return `<p>${block}</p>`;
    }).join('\n');
    
    return html;
}

module.exports = { markdownToHTML };













