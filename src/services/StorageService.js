/**
 * StorageService - Сервис для работы с localStorage с кэшированием
 * Версия: 1.0.0
 * Проект: УК «Зелёная долина» v7.2.4
 */

class StorageService {
    constructor(prefix = 'zd_') {
        this.prefix = prefix;
        this.cache = new Map(); // Кэш в памяти
        this.cacheTTL = 5 * 60 * 1000; // 5 минут в миллисекундах
        this.cacheTimestamps = new Map(); // Время создания кэша
        
        console.log('✅ StorageService initialized with prefix:', this.prefix);
    }
    
    /**
     * Получить значение из localStorage (с кэшем)
     * @param {string} key - ключ
     * @param {*} defaultValue - значение по умолчанию
     * @returns {*} значение или defaultValue
     */
    get(key, defaultValue = null) {
        const prefixedKey = this.prefix + key;
        
        // Проверить кэш
        if (this._isCacheValid(key)) {
            console.log(`📦 StorageService.get('${key}') - FROM CACHE`);
            return this.cache.get(key);
        }
        
        // Читать из localStorage
        try {
            const item = localStorage.getItem(prefixedKey);
            
            if (item === null) {
                console.log(`📦 StorageService.get('${key}') - NOT FOUND, returning default`);
                return defaultValue;
            }
            
            // Парсить JSON
            const parsed = JSON.parse(item);
            
            // Сохранить в кэш
            this._setCache(key, parsed);
            
            console.log(`📦 StorageService.get('${key}') - FROM LOCALSTORAGE (cached now)`);
            return parsed;
            
        } catch (error) {
            console.error(`❌ StorageService.get('${key}') error:`, error);
            return defaultValue;
        }
    }
    
    /**
     * Сохранить значение в localStorage (и обновить кэш)
     * @param {string} key - ключ
     * @param {*} value - значение (будет сериализовано в JSON)
     * @returns {boolean} успешность операции
     */
    set(key, value) {
        const prefixedKey = this.prefix + key;
        
        try {
            // Сериализовать в JSON
            const serialized = JSON.stringify(value);
            
            // Сохранить в localStorage
            localStorage.setItem(prefixedKey, serialized);
            
            // Обновить кэш
            this._setCache(key, value);
            
            console.log(`💾 StorageService.set('${key}') - SAVED & CACHED`);
            return true;
            
        } catch (error) {
            console.error(`❌ StorageService.set('${key}') error:`, error);
            
            // Если QuotaExceededError - попытаться очистить кэш
            if (error.name === 'QuotaExceededError') {
                console.warn('⚠️ localStorage quota exceeded, clearing cache...');
                this.clearCache();
                
                // Повторная попытка
                try {
                    const serialized = JSON.stringify(value);
                    localStorage.setItem(prefixedKey, serialized);
                    this._setCache(key, value);
                    return true;
                } catch (retryError) {
                    console.error('❌ Retry failed:', retryError);
                    return false;
                }
            }
            
            return false;
        }
    }
    
    /**
     * Удалить значение из localStorage (и кэша)
     * @param {string} key - ключ
     */
    remove(key) {
        const prefixedKey = this.prefix + key;
        
        localStorage.removeItem(prefixedKey);
        this.cache.delete(key);
        this.cacheTimestamps.delete(key);
        
        console.log(`🗑️ StorageService.remove('${key}') - REMOVED`);
    }
    
    /**
     * Очистить всё localStorage с префиксом
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
        
        console.log(`🧹 StorageService.clear() - CLEARED ${keysToRemove.length} keys`);
    }
    
    /**
     * Очистить только кэш (не localStorage)
     */
    clearCache() {
        this.cache.clear();
        this.cacheTimestamps.clear();
        console.log('🧹 StorageService.clearCache() - CACHE CLEARED');
    }
    
    /**
     * Инвалидировать кэш для конкретного ключа
     * @param {string} key - ключ
     */
    invalidateCache(key) {
        this.cache.delete(key);
        this.cacheTimestamps.delete(key);
        console.log(`♻️ StorageService.invalidateCache('${key}') - INVALIDATED`);
    }
    
    /**
     * Проверить, валиден ли кэш для ключа
     * @private
     * @param {string} key - ключ
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
            // Кэш устарел
            this.cache.delete(key);
            this.cacheTimestamps.delete(key);
            return false;
        }
        
        return true;
    }
    
    /**
     * Сохранить в кэш
     * @private
     * @param {string} key - ключ
     * @param {*} value - значение
     */
    _setCache(key, value) {
        this.cache.set(key, value);
        this.cacheTimestamps.set(key, Date.now());
    }
    
    /**
     * Получить статистику кэша
     * @returns {object} статистика
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            ttl: this.cacheTTL / 1000 + ' seconds'
        };
    }
}

// Экспорт singleton instance
const storage = new StorageService('zd_');

// Для использования в browser (без модулей)
if (typeof window !== 'undefined') {
    window.StorageService = StorageService;
    window.storage = storage;
}

// Для Node.js / ES6 модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageService, storage };
}
