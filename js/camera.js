// УК Зелёная Долина - Менеджер камеры

class CameraManager {
    constructor() {
        this.stream = null;
        this.currentCamera = 'user'; // 'user' или 'environment'
        this.photoData = null;
        this.videoElement = null;
        this.canvasElement = null;
        this.modal = null;
        this.onPhotoCaptured = null;
    }

    async openCamera(onPhotoCaptured) {
        this.onPhotoCaptured = onPhotoCaptured;
        
        // Получить элементы
        this.modal = document.getElementById('cameraModal');
        this.videoElement = document.getElementById('cameraVideo');
        this.canvasElement = document.getElementById('cameraCanvas');
        
        if (!this.modal || !this.videoElement || !this.canvasElement) {
            console.error('Элементы камеры не найдены');
            return;
        }

        // Показать модальное окно
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Скрыть превью фото
        const photoPreview = document.getElementById('photoPreview');
        const previewImage = document.getElementById('previewImage');
        if (photoPreview) photoPreview.style.display = 'none';
        if (previewImage) previewImage.src = '';

        // Показать кнопки съемки
        const captureBtn = document.getElementById('captureBtn');
        const switchCameraBtn = document.getElementById('switchCameraBtn');
        const retakeBtn = document.getElementById('retakeBtn');
        const usePhotoBtn = document.getElementById('usePhotoBtn');
        
        if (captureBtn) captureBtn.style.display = 'block';
        if (switchCameraBtn) switchCameraBtn.style.display = 'block';
        if (retakeBtn) retakeBtn.style.display = 'none';
        if (usePhotoBtn) usePhotoBtn.style.display = 'none';

        try {
            await this.startCamera();
        } catch (error) {
            console.error('Ошибка при открытии камеры:', error);
            alert('Не удалось получить доступ к камере. Проверьте разрешения.');
        }
    }

    async startCamera() {
        try {
            const constraints = {
                video: {
                    facingMode: this.currentCamera,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            if (this.videoElement) {
                this.videoElement.srcObject = this.stream;
                this.videoElement.style.display = 'block';
            }
        } catch (error) {
            console.error('Ошибка доступа к камере:', error);
            throw error;
        }
    }

    async switchCamera() {
        // Остановить текущий поток
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        // Переключить камеру
        this.currentCamera = this.currentCamera === 'user' ? 'environment' : 'user';

        // Запустить камеру снова
        try {
            await this.startCamera();
        } catch (error) {
            console.error('Ошибка при переключении камеры:', error);
        }
    }

    capturePhoto() {
        if (!this.videoElement || !this.canvasElement) {
            return;
        }

        const video = this.videoElement;
        const canvas = this.canvasElement;

        // Установить размеры canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Нарисовать кадр на canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Конвертировать в base64
        this.photoData = canvas.toDataURL('image/jpeg', 0.8);

        // Показать превью
        this.showPreview();
    }

    showPreview() {
        const photoPreview = document.getElementById('photoPreview');
        const previewImage = document.getElementById('previewImage');
        const captureBtn = document.getElementById('captureBtn');
        const switchCameraBtn = document.getElementById('switchCameraBtn');
        const retakeBtn = document.getElementById('retakeBtn');
        const usePhotoBtn = document.getElementById('usePhotoBtn');

        if (photoPreview && previewImage && this.photoData) {
            previewImage.src = this.photoData;
            photoPreview.style.display = 'block';
            
            if (this.videoElement) {
                this.videoElement.style.display = 'none';
            }

            // Скрыть кнопки съемки, показать кнопки превью
            if (captureBtn) captureBtn.style.display = 'none';
            if (switchCameraBtn) switchCameraBtn.style.display = 'none';
            if (retakeBtn) retakeBtn.style.display = 'block';
            if (usePhotoBtn) usePhotoBtn.style.display = 'block';
        }
    }

    retakePhoto() {
        const photoPreview = document.getElementById('photoPreview');
        const captureBtn = document.getElementById('captureBtn');
        const switchCameraBtn = document.getElementById('switchCameraBtn');
        const retakeBtn = document.getElementById('retakeBtn');
        const usePhotoBtn = document.getElementById('usePhotoBtn');

        if (photoPreview) photoPreview.style.display = 'none';
        if (this.videoElement) this.videoElement.style.display = 'block';

        // Показать кнопки съемки, скрыть кнопки превью
        if (captureBtn) captureBtn.style.display = 'block';
        if (switchCameraBtn) switchCameraBtn.style.display = 'block';
        if (retakeBtn) retakeBtn.style.display = 'none';
        if (usePhotoBtn) usePhotoBtn.style.display = 'none';

        this.photoData = null;
    }

    usePhoto() {
        if (this.photoData) {
            // Показать миниатюру в форме
            const thumbnailContainer = document.getElementById('photoThumbnailContainer');
            const thumbnail = document.getElementById('photoThumbnail');
            
            if (thumbnailContainer && thumbnail) {
                thumbnail.src = this.photoData;
                thumbnailContainer.style.display = 'block';
            }

            // Вызвать callback если есть
            if (this.onPhotoCaptured) {
                this.onPhotoCaptured(this.photoData);
            }
        }
        
        this.closeCamera();
    }

    closeCamera() {
        // Остановить поток камеры
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        // Скрыть модальное окно
        if (this.modal) {
            this.modal.style.display = 'none';
        }

        // Восстановить прокрутку
        document.body.style.overflow = '';

        // Очистить video
        if (this.videoElement) {
            this.videoElement.srcObject = null;
        }
    }
}
