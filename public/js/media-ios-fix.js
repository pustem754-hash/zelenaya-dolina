/**
 * iOS Media Fix для УК «Зелёная долина» v6.8.2
 * Исправляет проблему с камерой на iPhone/iPad
 */

(function() {
    'use strict';

    /**
     * Проверка iOS устройства
     */
    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    /**
     * Улучшенная функция захвата фото для iOS
     */
    window.capturePhotoIOS = async function() {
        // Проверяем поддержку камеры
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('❌ Ваш браузер не поддерживает камеру. Попробуйте Safari.');
            return null;
        }

        try {
            // Запрашиваем доступ к камере (iOS требует HTTPS или localhost)
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Задняя камера
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });

            // Создаём video элемент
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            video.playsInline = true; // Важно для iOS!

            // Ждём загрузки видео
            await new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    video.play();
                    resolve();
                };
            });

            // Создаём canvas для захвата кадра
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            // Останавливаем камеру
            stream.getTracks().forEach(track => track.stop());

            // Конвертируем в blob
            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', 0.9);
            });

        } catch (error) {
            // Fallback: используем input[type=file]
            alert('⚠️ Не удалось открыть камеру. Выберите фото из галереи.');
            return null;
        }
    };

    /**
     * Fallback: выбор фото из галереи
     */
    window.selectPhotoFromGallery = function() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    resolve(file);
                } else {
                    reject(new Error('Файл не выбран'));
                }
            };
            
            input.click();
        });
    };

    /**
     * Универсальная функция для всех платформ
     */
    window.capturePhoto = async function() {
        if (isIOS()) {
            return await capturePhotoIOS();
        } else {
            // Стандартный метод для Android/Desktop
            return await capturePhotoIOS();
        }
    };

})();

/**
 * Запись аудио (placeholder)
 */
window.recordAudio = async function() {
    alert('⚠️ Функция записи аудио в разработке.\nИспользуйте кнопку "Выбрать файл" для загрузки аудио.');
    return null;
};

/**
 * Запись видео (placeholder)
 */
window.recordVideo = async function() {
    alert('⚠️ Функция записи видео в разработке.\nИспользуйте кнопку "Выбрать файл" для загрузки видео.');
    return null;
};

console.log('[Media Fix] ✅ recordAudio и recordVideo добавлены');
