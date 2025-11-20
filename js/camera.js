// УК Зелёная Долина - Менеджер камеры
// Версия 3.0.0 с полным логированием

class CameraManager {
    constructor() {
        console.log('📷 [CameraManager] constructor() - начало');
        this.stream = null;
        this.currentCamera = 'user'; // 'user' или 'environment'
        this.photoData = null;
        this.videoElement = null;
        this.canvasElement = null;
        this.modal = null;
        this.onPhotoCaptured = null;
        console.log('📷 [CameraManager] constructor() - начальные значения установлены:', {
            currentCamera: this.currentCamera,
            hasStream: !!this.stream,
            hasPhotoData: !!this.photoData
        });
        console.log('✅ [CameraManager] constructor() - завершено');
    }

    async openCamera(onPhotoCaptured) {
        console.log('📷 [CameraManager] openCamera() - начало');
        console.log('📷 [CameraManager] openCamera() - callback установлен:', !!onPhotoCaptured);
        this.onPhotoCaptured = onPhotoCaptured;
        
        // Получить элементы
        this.modal = document.getElementById('cameraModal');
        this.videoElement = document.getElementById('cameraVideo');
        this.canvasElement = document.getElementById('cameraCanvas');
        
        console.log('🔍 [CameraManager] openCamera() - элементы найдены:', {
            modal: !!this.modal,
            video: !!this.videoElement,
            canvas: !!this.canvasElement
        });
        
        if (!this.modal || !this.videoElement || !this.canvasElement) {
            console.error('❌ [CameraManager] openCamera() - элементы камеры не найдены');
            return;
        }

        // Показать модальное окно
        console.log('👁️ [CameraManager] openCamera() - отображение модального окна');
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Скрыть превью фото
        const photoPreview = document.getElementById('photoPreview');
        const previewImage = document.getElementById('previewImage');
        console.log('🔍 [CameraManager] openCamera() - элементы превью найдены:', {
            photoPreview: !!photoPreview,
            previewImage: !!previewImage
        });
        
        if (photoPreview) photoPreview.style.display = 'none';
        if (previewImage) previewImage.src = '';

        // Показать кнопки съемки
        const captureBtn = document.getElementById('captureBtn');
        const switchCameraBtn = document.getElementById('switchCameraBtn');
        const retakeBtn = document.getElementById('retakeBtn');
        const usePhotoBtn = document.getElementById('usePhotoBtn');
        
        console.log('🔘 [CameraManager] openCamera() - кнопки найдены:', {
            capture: !!captureBtn,
            switch: !!switchCameraBtn,
            retake: !!retakeBtn,
            use: !!usePhotoBtn
        });
        
        if (captureBtn) captureBtn.style.display = 'block';
        if (switchCameraBtn) switchCameraBtn.style.display = 'block';
        if (retakeBtn) retakeBtn.style.display = 'none';
        if (usePhotoBtn) usePhotoBtn.style.display = 'none';

        try {
            console.log('📷 [CameraManager] openCamera() - запуск камеры');
            await this.startCamera();
            console.log('✅ [CameraManager] openCamera() - камера запущена успешно');
        } catch (error) {
            console.error('❌ [CameraManager] openCamera() - ОШИБКА при открытии камеры:', error);
            console.error('📊 [CameraManager] openCamera() - стек ошибки:', error.stack);
            alert('Не удалось получить доступ к камере. Проверьте разрешения.');
        }
    }

    async startCamera() {
        console.log('📷 [CameraManager] startCamera() - начало, текущая камера:', this.currentCamera);
        try {
            const constraints = {
                video: {
                    facingMode: this.currentCamera,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };
            console.log('📷 [CameraManager] startCamera() - ограничения:', constraints);

            console.log('📷 [CameraManager] startCamera() - запрос доступа к медиа-устройствам');
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('✅ [CameraManager] startCamera() - доступ получен, поток создан');
            
            if (this.videoElement) {
                console.log('📷 [CameraManager] startCamera() - подключение потока к video элементу');
                this.videoElement.srcObject = this.stream;
                this.videoElement.style.display = 'block';
                console.log('✅ [CameraManager] startCamera() - поток подключен');
            } else {
                console.error('❌ [CameraManager] startCamera() - video элемент не найден!');
            }
        } catch (error) {
            console.error('❌ [CameraManager] startCamera() - ОШИБКА доступа к камере:', error);
            console.error('📊 [CameraManager] startCamera() - стек ошибки:', error.stack);
            throw error;
        }
    }

    async switchCamera() {
        console.log('📷 [CameraManager] switchCamera() - начало, текущая камера:', this.currentCamera);
        
        // Остановить текущий поток
        if (this.stream) {
            console.log('📷 [CameraManager] switchCamera() - остановка текущего потока');
            const tracks = this.stream.getTracks();
            console.log('📷 [CameraManager] switchCamera() - найдено треков:', tracks.length);
            tracks.forEach((track, index) => {
                track.stop();
                console.log(`📷 [CameraManager] switchCamera() - трек ${index + 1} остановлен`);
            });
            this.stream = null;
        }

        // Переключить камеру
        const oldCamera = this.currentCamera;
        this.currentCamera = this.currentCamera === 'user' ? 'environment' : 'user';
        console.log('📷 [CameraManager] switchCamera() - камера переключена:', oldCamera, '->', this.currentCamera);

        // Запустить камеру снова
        try {
            console.log('📷 [CameraManager] switchCamera() - запуск новой камеры');
            await this.startCamera();
            console.log('✅ [CameraManager] switchCamera() - новая камера запущена');
        } catch (error) {
            console.error('❌ [CameraManager] switchCamera() - ОШИБКА при переключении камеры:', error);
            console.error('📊 [CameraManager] switchCamera() - стек ошибки:', error.stack);
        }
    }

    capturePhoto() {
        console.log('📸 [CameraManager] capturePhoto() - начало');
        
        if (!this.videoElement || !this.canvasElement) {
            console.error('❌ [CameraManager] capturePhoto() - элементы не найдены:', {
                video: !!this.videoElement,
                canvas: !!this.canvasElement
            });
            return;
        }

        const video = this.videoElement;
        const canvas = this.canvasElement;

        // Установить размеры canvas
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        console.log('📸 [CameraManager] capturePhoto() - размеры видео:', videoWidth, 'x', videoHeight);
        
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        console.log('📸 [CameraManager] capturePhoto() - размеры canvas установлены');

        // Нарисовать кадр на canvas
        const ctx = canvas.getContext('2d');
        console.log('📸 [CameraManager] capturePhoto() - рисование кадра на canvas');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        console.log('✅ [CameraManager] capturePhoto() - кадр нарисован');

        // Конвертировать в base64
        console.log('📸 [CameraManager] capturePhoto() - конвертация в base64');
        this.photoData = canvas.toDataURL('image/jpeg', 0.8);
        const photoSize = this.photoData.length;
        console.log('✅ [CameraManager] capturePhoto() - фото создано, размер:', photoSize, 'байт');

        // Показать превью
        console.log('📸 [CameraManager] capturePhoto() - показ превью');
        this.showPreview();
        console.log('✅ [CameraManager] capturePhoto() - завершено');
    }

    showPreview() {
        console.log('👁️ [CameraManager] showPreview() - начало');
        const photoPreview = document.getElementById('photoPreview');
        const previewImage = document.getElementById('previewImage');
        const captureBtn = document.getElementById('captureBtn');
        const switchCameraBtn = document.getElementById('switchCameraBtn');
        const retakeBtn = document.getElementById('retakeBtn');
        const usePhotoBtn = document.getElementById('usePhotoBtn');

        console.log('🔍 [CameraManager] showPreview() - элементы найдены:', {
            photoPreview: !!photoPreview,
            previewImage: !!previewImage,
            hasPhotoData: !!this.photoData
        });

        if (photoPreview && previewImage && this.photoData) {
            console.log('👁️ [CameraManager] showPreview() - установка src превью');
            previewImage.src = this.photoData;
            photoPreview.style.display = 'block';
            
            if (this.videoElement) {
                console.log('👁️ [CameraManager] showPreview() - скрытие video элемента');
                this.videoElement.style.display = 'none';
            }

            // Скрыть кнопки съемки, показать кнопки превью
            console.log('👁️ [CameraManager] showPreview() - переключение кнопок');
            if (captureBtn) captureBtn.style.display = 'none';
            if (switchCameraBtn) switchCameraBtn.style.display = 'none';
            if (retakeBtn) retakeBtn.style.display = 'block';
            if (usePhotoBtn) usePhotoBtn.style.display = 'block';
            console.log('✅ [CameraManager] showPreview() - превью показано');
        } else {
            console.warn('⚠️ [CameraManager] showPreview() - не все элементы найдены или нет фото');
        }
    }

    retakePhoto() {
        console.log('📷 [CameraManager] retakePhoto() - начало');
        const photoPreview = document.getElementById('photoPreview');
        const captureBtn = document.getElementById('captureBtn');
        const switchCameraBtn = document.getElementById('switchCameraBtn');
        const retakeBtn = document.getElementById('retakeBtn');
        const usePhotoBtn = document.getElementById('usePhotoBtn');

        console.log('🔍 [CameraManager] retakePhoto() - элементы найдены:', {
            photoPreview: !!photoPreview,
            video: !!this.videoElement
        });

        if (photoPreview) {
            console.log('📷 [CameraManager] retakePhoto() - скрытие превью');
            photoPreview.style.display = 'none';
        }
        if (this.videoElement) {
            console.log('📷 [CameraManager] retakePhoto() - показ video элемента');
            this.videoElement.style.display = 'block';
        }

        // Показать кнопки съемки, скрыть кнопки превью
        console.log('📷 [CameraManager] retakePhoto() - переключение кнопок');
        if (captureBtn) captureBtn.style.display = 'block';
        if (switchCameraBtn) switchCameraBtn.style.display = 'block';
        if (retakeBtn) retakeBtn.style.display = 'none';
        if (usePhotoBtn) usePhotoBtn.style.display = 'none';

        console.log('📷 [CameraManager] retakePhoto() - очистка фото данных');
        this.photoData = null;
        console.log('✅ [CameraManager] retakePhoto() - завершено');
    }

    usePhoto() {
        console.log('✅ [CameraManager] usePhoto() - начало');
        
        if (this.photoData) {
            console.log('✅ [CameraManager] usePhoto() - фото есть, размер:', this.photoData.length, 'байт');
            
            // Показать миниатюру в форме
            const thumbnailContainer = document.getElementById('photoThumbnailContainer');
            const thumbnail = document.getElementById('photoThumbnail');
            
            console.log('🔍 [CameraManager] usePhoto() - элементы миниатюры найдены:', {
                container: !!thumbnailContainer,
                thumbnail: !!thumbnail
            });
            
            if (thumbnailContainer && thumbnail) {
                console.log('✅ [CameraManager] usePhoto() - установка миниатюры');
                thumbnail.src = this.photoData;
                thumbnailContainer.style.display = 'block';
            }

            // Вызвать callback если есть
            if (this.onPhotoCaptured) {
                console.log('✅ [CameraManager] usePhoto() - вызов callback');
                this.onPhotoCaptured(this.photoData);
            }
        } else {
            console.warn('⚠️ [CameraManager] usePhoto() - фото данных нет!');
        }
        
        console.log('✅ [CameraManager] usePhoto() - закрытие камеры');
        this.closeCamera();
    }

    closeCamera() {
        console.log('🚪 [CameraManager] closeCamera() - начало');
        
        // Остановить поток камеры
        if (this.stream) {
            console.log('🚪 [CameraManager] closeCamera() - остановка потока');
            const tracks = this.stream.getTracks();
            console.log('🚪 [CameraManager] closeCamera() - найдено треков:', tracks.length);
            tracks.forEach((track, index) => {
                track.stop();
                console.log(`🚪 [CameraManager] closeCamera() - трек ${index + 1} остановлен`);
            });
            this.stream = null;
        } else {
            console.log('🚪 [CameraManager] closeCamera() - потока нет');
        }

        // Скрыть модальное окно
        if (this.modal) {
            console.log('🚪 [CameraManager] closeCamera() - скрытие модального окна');
            this.modal.style.display = 'none';
        }

        // Восстановить прокрутку
        console.log('🚪 [CameraManager] closeCamera() - восстановление прокрутки');
        document.body.style.overflow = '';

        // Очистить video
        if (this.videoElement) {
            console.log('🚪 [CameraManager] closeCamera() - очистка video элемента');
            this.videoElement.srcObject = null;
        }
        
        console.log('✅ [CameraManager] closeCamera() - завершено');
    }
}

console.log('✅ [camera.js] - файл загружен, версия 3.0.0');
