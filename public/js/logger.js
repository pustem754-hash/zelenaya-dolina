(function() {
    const pageName = document.title.split('-')[0].trim();
    console.log(`[Logger] 🚀 Страница загружена: ${pageName}`);

    // Логирование кликов
    document.addEventListener('click', (e) => {
        let el = e.target;
        // Поднимаемся до интерактивного элемента
        while (el && el !== document.body && !['BUTTON', 'A', 'INPUT', 'SELECT'].includes(el.tagName) && !el.onclick) {
            el = el.parentElement;
        }
        if (!el || el === document.body) el = e.target; // Если не нашли, логируем сам таргет

        const tag = el.tagName;
        const id = el.id ? `#${el.id}` : '';
        const cls = el.className ? `.${el.className.replace(/\s+/g, '.')}` : '';
        const text = el.innerText ? ` text="${el.innerText.substring(0, 20).replace(/\n/g, '')}..."` : '';
        
        console.log(`[UI]  CLICK: ${tag}${id}${cls}${text}`);
    }, true); // Capture phase

    // Логирование ввода
    document.addEventListener('input', (e) => {
        const el = e.target;
        console.log(`[UI]  INPUT: #${el.id || el.name || el.tagName} value="${el.value}"`);
    });

    // Логирование ошибок
    window.addEventListener('error', (e) => {
        console.error(`[System]  ERROR: ${e.message} (${e.filename}:${e.lineno})`);
    });

    // Heartbeat
    setInterval(() => {
        console.log(`[System]  Ping... Memory: ${performance.memory ? Math.round(performance.memory.usedJSHeapSize/1024/1024) + 'MB' : 'N/A'}`);
    }, 5000); // Каждые 5 сек
})();
