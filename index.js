/**
 * Преобразует Markdown в HTML
 * @param {string} markdown - Markdown текст
 * @returns {string} HTML строка
 */
function markdownToHTML(markdown) {
    if (!markdown || markdown === '') {
        return '';
    }

    let html = markdown;

    // Экранирование HTML сущностей (должно быть первым)
    html = escapeHTML(html);

    // Блоки кода (до других преобразований)
    html = convertCodeBlocks(html);

    // Заголовки
    html = convertHeadings(html);

    // Горизонтальные линии
    html = convertHorizontalRules(html);

    // Списки
    html = convertLists(html);

    // Цитаты
    html = convertBlockquotes(html);

    // Жирный текст
    html = convertBold(html);

    // Курсив
    html = convertItalic(html);

    // Зачёркнутый текст
    html = convertStrikethrough(html);

    // Инлайн код
    html = convertInlineCode(html);

    // Изображения (до ссылок)
    html = convertImages(html);

    // Ссылки
    html = convertLinks(html);

    // Переносы строк
    html = convertLineBreaks(html);

    // Параграфы
    html = convertParagraphs(html);

    return html;
}

/**
 * Экранирует HTML сущности
 */
function escapeHTML(text) {
    // Временно сохраняем markdown синтаксис для обработки
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Преобразует блоки кода
 */
function convertCodeBlocks(text) {
    return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const langClass = lang ? ` class="language-${lang}"` : '';
        return `<pre><code${langClass}>${code}</code></pre>`;
    });
}

/**
 * Преобразует заголовки
 */
function convertHeadings(text) {
    return text
        .replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
        .replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
        .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
        .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
        .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
        .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
}

/**
 * Преобразует горизонтальные линии
 */
function convertHorizontalRules(text) {
    return text
        .replace(/^---$/gm, '<hr>')
        .replace(/^\*\*\*$/gm, '<hr>')
        .replace(/^___$/gm, '<hr>');
}

/**
 * Преобразует списки
 */
function convertLists(text) {
    // Неупорядоченные списки
    text = text.replace(/^- (.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
        return `<ul>\n${match}</ul>`;
    });

    // Упорядоченные списки
    text = text.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
        // Если уже в <ul>, не добавляем <ol>
        if (match.includes('<ul>')) {
            return match;
        }
        return `<ol>\n${match}</ol>`;
    });

    return text;
}

/**
 * Преобразует цитаты
 */
function convertBlockquotes(text) {
    return text.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
}

/**
 * Преобразует жирный текст
 */
function convertBold(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.+?)__/g, '<strong>$1</strong>');
}

/**
 * Преобразует курсив
 */
function convertItalic(text) {
    return text
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/_(.+?)_/g, '<em>$1</em>');
}

/**
 * Преобразует зачёркнутый текст
 */
function convertStrikethrough(text) {
    return text.replace(/~~(.+?)~~/g, '<del>$1</del>');
}

/**
 * Преобразует инлайн код
 */
function convertInlineCode(text) {
    return text.replace(/`(.+?)`/g, '<code>$1</code>');
}

/**
 * Преобразует изображения
 */
function convertImages(text) {
    return text.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1">');
}

/**
 * Преобразует ссылки
 */
function convertLinks(text) {
    return text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

/**
 * Преобразует переносы строк
 */
function convertLineBreaks(text) {
    return text.replace(/  \n/g, '<br>\n');
}

/**
 * Преобразует параграфы
 */
function convertParagraphs(text) {
    // Разделяем на блоки по двойным переносам
    const blocks = text.split(/\n\n+/);
    
    return blocks.map(block => {
        // Пропускаем блоки, которые уже являются HTML тегами
        if (block.match(/^<(h[1-6]|ul|ol|pre|blockquote|hr)/)) {
            return block;
        }
        // Оборачиваем в параграф
        return `<p>${block}</p>`;
    }).join('\n');
}

module.exports = { markdownToHTML };












