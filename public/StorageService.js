/**
 * StorageService - Централизованный сервис для работы с localStorage
 * 
 * Особенности:
 * - Кэширование в памяти (5 минут TTL)
 * - Автоматический JSON parse/stringify
 * - Обработка ошибок (QuotaExceededError)
 * - Логирование всех операций
 * - Поддержка префиксов для изоляции данных
 * 
 * @version 2.0.0
 * @project УК «Зелёная долина» v7.2.6
 */

class StorageService {
    /**
     * Конструктор
     * @param {string} prefix - Префикс для всех ключей (по умолчанию 'zd_')
     */
    constructor(prefix = 'zd_') {
        this.prefix = prefix;
        this.cache = new Map();
        this.cacheTimestamps = new Map();
        this.cacheTTL = 5 * 60 * 1000; // 5 минут
        
        // Статистика
        this.stats = {
            hits: 0,      // Попадания в кэш
            misses: 0,    // Промахи кэша
            reads: 0,     // Чтений из localStorage
            writes: 0,    // Записей в localStorage
            errors: 0     // Ошибок
        };
        
        console.log('%c✅ StorageService v2.0 initialized', 'color: #4CAF50; font-weight: bold', {
            prefix: this.prefix,
            cacheTTL: `${this.cacheTTL / 1000}s`
        });
    }
    
    /**
     * Получить значение (с кэшем)
     * @param {string} key - Ключ (без префикса)
     * @param {*} defaultValue - Значение по умолчанию
     * @returns {*} Значение или defaultValue
     */
    get(key, defaultValue = null) {
        // Проверить кэш
        if (this._isCacheValid(key)) {
            this.stats.hits++;
            console.log(`📦 storage.get('${key}') → FROM CACHE (hit #${this.stats.hits})`);
            return this.cache.get(key);
        }
        
        this.stats.misses++;
        
        // Читать из localStorage
        const prefixedKey = this._getPrefixedKey(key);
        
        try {
            const item = localStorage.getItem(prefixedKey);
            
            if (item === null || item === undefined) {
                console.log(`📦 storage.get('${key}') → NOT FOUND, using default:`, defaultValue);
                return defaultValue;
            }
            
            // Парсить JSON
            let parsed;
            try {
                parsed = JSON.parse(item);
            } catch (parseError) {
                // Если не JSON, вернуть как есть
                console.warn(`⚠️ storage.get('${key}') → Not valid JSON, returning raw value`);
                parsed = item;
            }
            
            // Сохранить в кэш
            this._setCache(key, parsed);
            this.stats.reads++;
            
            console.log(`📦 storage.get('${key}') → FROM LOCALSTORAGE (cached now, miss #${this.stats.misses})`);
            return parsed;
            
        } catch (error) {
            this.stats.errors++;
            console.error(`❌ storage.get('${key}') error:`, error);
            return defaultValue;
        }
    }
    
    /**
     * Сохранить значение (и обновить кэш)
     * @param {string} key - Ключ (без префикса)
     * @param {*} value - Значение (автоматически сериализуется)
     * @returns {boolean} Успешность операции
     */
    set(key, value) {
        const prefixedKey = this._getPrefixedKey(key);
        
        try {
            // Сериализовать
            let serialized;
            if (typeof value === 'string') {
                serialized = value;
            } else {
                serialized = JSON.stringify(value);
            }
            
            // Сохранить в localStorage
            localStorage.setItem(prefixedKey, serialized);
            
            // Обновить кэш (сохраняем оригинальное значение, не строку)
            this._setCache(key, value);
            this.stats.writes++;
            
            console.log(`💾 storage.set('${key}') → SAVED & CACHED (write #${this.stats.writes})`);
            return true;
            
        } catch (error) {
            this.stats.errors++;
            
            // Обработка переполнения
            if (error.name === 'QuotaExceededError') {
                console.error(`❌ localStorage QUOTA EXCEEDED for key '${key}'`);
                console.warn('🧹 Attempting to clear cache and retry...');
                
                this.clearCache();
                
                // Повторная попытка
                try {
                    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
                    localStorage.setItem(prefixedKey, serialized);
                    this._setCache(key, value);
                    this.stats.writes++;
                    console.log(`💾 storage.set('${key}') → SAVED after cache clear`);
                    return true;
                } catch (retryError) {
                    console.error('❌ Retry failed:', retryError);
                    return false;
                }
            }
            
            console.error(`❌ storage.set('${key}') error:`, error);
            return false;
        }
    }
    
    /**
     * Удалить значение
     * @param {string} key - Ключ (без префикса)
     */
    remove(key) {
        const prefixedKey = this._getPrefixedKey(key);
        
        localStorage.removeItem(prefixedKey);
        this.cache.delete(key);
        this.cacheTimestamps.delete(key);
        
        console.log(`🗑️ storage.remove('${key}') → REMOVED`);
    }
    
    /**
     * Очистить все ключи с префиксом
     */
    clear() {
        const keysToRemove = [];
        
        // Найти все ключи с префиксом
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
                keysToRemove.push(key);
            }
        }
        
        // Удалить
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Очистить кэш
        this.clearCache();
        
        console.log(`🧹 storage.clear() → Cleared ${keysToRemove.length} keys with prefix '${this.prefix}'`);
    }
    
    /**
     * Очистить только кэш (не localStorage)
     */
    clearCache() {
        const cacheSize = this.cache.size;
        this.cache.clear();
        this.cacheTimestamps.clear();
        console.log(`🧹 storage.clearCache() → Cleared ${cacheSize} cached items`);
    }
    
    /**
     * Инвалидировать кэш для конкретного ключа
     * @param {string} key - Ключ
     */
    invalidateCache(key) {
        this.cache.delete(key);
        this.cacheTimestamps.delete(key);
        console.log(`♻️ storage.invalidateCache('${key}') → Cache invalidated`);
    }
    
    /**
     * Получить статистику
     * @returns {object} Статистика использования
     */
    getStats() {
        const hitRate = this.stats.hits + this.stats.misses > 0 
            ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
            : 0;
        
        return {
            ...this.stats,
            hitRate: `${hitRate}%`,
            cacheSize: this.cache.size,
            cacheTTL: `${this.cacheTTL / 1000}s`
        };
    }
    
    /**
     * Вывести статистику в консоль
     */
    printStats() {
        const stats = this.getStats();
        console.log('%c📊 StorageService Statistics', 'color: #2196F3; font-weight: bold; font-size: 14px');
        console.table(stats);
    }
    
    /**
     * Проверить валидность кэша
     * @private
     * @param {string} key - Ключ
     * @returns {boolean}
     */
    _isCacheValid(key) {
        if (!this.cache.has(key)) {
            return false;
        }
        
        const timestamp = this.cacheTimestamps.get(key);
        const now = Date.now();
        
        // Проверить TTL
        if (now - timestamp > this.cacheTTL) {
            this.cache.delete(key);
            this.cacheTimestamps.delete(key);
            return false;
        }
        
        return true;
    }
    
    /**
     * Сохранить в кэш
     * @private
     * @param {string} key - Ключ
     * @param {*} value - Значение
     */
    _setCache(key, value) {
        this.cache.set(key, value);
        this.cacheTimestamps.set(key, Date.now());
    }
    
    /**
     * Получить ключ с префиксом
     * @private
     * @param {string} key - Ключ без префикса
     * @returns {string} Ключ с префиксом
     */
    _getPrefixedKey(key) {
        // Если ключ уже начинается с префикса, не дублировать
        if (key.startsWith(this.prefix)) {
            return key;
        }
        return this.prefix + key;
    }
}

// ============================================
// ЭКСПОРТ И ГЛОБАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ
// ============================================

// Создать singleton instance
const storage = new StorageService('zd_');

// Сделать доступным глобально (для browser)
if (typeof window !== 'undefined') {
    window.StorageService = StorageService;
    window.storage = storage;
    
    // Добавить в window для удобного доступа из консоли
    window.storageStats = () => storage.printStats();
}

// Экспорт для Node.js / ES6 модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageService, storage };
}

console.log('%c🚀 StorageService ready!', 'color: #4CAF50; font-weight: bold', 'Type storageStats() in console to see statistics');
