п»їРїВ»С—Р С—Р’В»РЎвЂ”// Media Fixed v1.0 Р В Р вЂ Р В РІР‚С™Р Р†Р вЂљРЎСљ iOS-friendly photo capture + safer audio previews
// Lightweight helper to fix Safari capture issues and reduce layout jumps.

const mediaFixed = (() => {
    let photoStream = null;
    let photoVideo = null;

    async function startCamera() {
        try {
            // iOS Safari requires playsinline + environment facing mode
            photoStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' } },
                audio: false
            });

            if (!photoVideo) {
                photoVideo = document.createElement('video');
                photoVideo.id = 'liveCamera';
                photoVideo.autoplay = true;
                photoVideo.muted = true;
                photoVideo.playsInline = true;
                photoVideo.style.width = '100%';
                photoVideo.style.borderRadius = '12px';
            }

            photoVideo.srcObject = photoStream;
            return photoVideo;
        } catch (err) {
            console.error('[media-fixed] getUserMedia error', err);
            throw err;
        }
    }

    function stopCamera() {
        if (photoStream) {
            photoStream.getTracks().forEach(t => t.stop());
            photoStream = null;
        }
    }

    async function capturePhotoFromStream() {
        if (!photoVideo) throw new Error('no video element');
        const video = photoVideo;
        await video.play().catch(() => {});

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.9);
    }

    // Public API
    return {
        async capturePhotoFlow() {
            // If camera not supported Р В Р вЂ Р В РІР‚С™Р Р†Р вЂљРЎС™ fallback to file input handled elsewhere
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('camera-not-supported');
            }

            const previewBlock = document.getElementById('photoPreviewBlock');
            const previewImg = document.getElementById('photoPreview');
            const placeholder = document.getElementById('photoPlaceholder');

            if (placeholder) placeholder.style.display = 'block';

            try {
                const videoEl = await startCamera();
                // Show temporary live preview
                const liveContainer = document.getElementById('liveCameraContainer');
                if (liveContainer) {
                    liveContainer.innerHTML = '';
                    liveContainer.appendChild(videoEl);
                    liveContainer.style.display = 'block';
                }

                const dataUrl = await capturePhotoFromStream();
                stopCamera();

                // Update preview + storage
                if (previewImg && previewBlock) {
                    previewImg.src = dataUrl;
                    previewBlock.style.display = 'block';
                    requestAnimationFrame(() => previewBlock.classList.add('visible'));
                }
                localStorage.setItem('currentPhoto', dataUrl);
                return dataUrl;
            } catch (err) {
                stopCamera();
                if (err.message !== 'camera-not-supported') {
                    alert('Р В Р’В Р РЋРЎС™Р В Р’В Р вЂ™Р’Вµ Р В Р Р‹Р РЋРІР‚СљР В Р’В Р СћРІР‚ВР В Р’В Р вЂ™Р’В°Р В Р’В Р вЂ™Р’В»Р В Р’В Р РЋРІР‚СћР В Р Р‹Р В РЎвЂњР В Р Р‹Р В Р вЂ° Р В Р’В Р РЋРІР‚СћР В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р РЋРІР‚СњР В Р Р‹Р В РІР‚С™Р В Р Р‹Р Р†Р вЂљРІвЂћвЂ“Р В Р Р‹Р Р†Р вЂљРЎв„ўР В Р Р‹Р В Р вЂ° Р В Р’В Р РЋРІР‚СњР В Р’В Р вЂ™Р’В°Р В Р’В Р РЋР’ВР В Р’В Р вЂ™Р’ВµР В Р Р‹Р В РІР‚С™Р В Р Р‹Р РЋРІР‚Сљ. Р В Р’В Р вЂ™Р’В Р В Р’В Р вЂ™Р’В°Р В Р’В Р вЂ™Р’В·Р В Р Р‹Р В РІР‚С™Р В Р’В Р вЂ™Р’ВµР В Р Р‹Р Р†РІР‚С™Р’В¬Р В Р’В Р РЋРІР‚ВР В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р вЂ™Р’Вµ Р В Р’В Р СћРІР‚ВР В Р’В Р РЋРІР‚СћР В Р Р‹Р В РЎвЂњР В Р Р‹Р Р†Р вЂљРЎв„ўР В Р Р‹Р РЋРІР‚СљР В Р’В Р РЋРІР‚вЂќ Р В Р’В Р РЋРІР‚ВР В Р’В Р вЂ™Р’В»Р В Р’В Р РЋРІР‚В Р В Р’В Р В РІР‚В Р В Р Р‹Р Р†Р вЂљРІвЂћвЂ“Р В Р’В Р вЂ™Р’В±Р В Р’В Р вЂ™Р’ВµР В Р Р‹Р В РІР‚С™Р В Р’В Р РЋРІР‚ВР В Р Р‹Р Р†Р вЂљРЎв„ўР В Р’В Р вЂ™Р’Вµ Р В Р Р‹Р Р†Р вЂљРЎвЂєР В Р’В Р вЂ™Р’В°Р В Р’В Р Р†РІР‚С›РІР‚вЂњР В Р’В Р вЂ™Р’В».');
                }
                throw err;
            } finally {
                if (placeholder) placeholder.style.display = 'none';
            }
        },

        handlePhotoUpload(e) {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const dataUrl = ev.target?.result;
                localStorage.setItem('currentPhoto', dataUrl);
                const previewBlock = document.getElementById('photoPreviewBlock');
                const previewImg = document.getElementById('photoPreview');
                if (previewImg && previewBlock) {
                    previewImg.src = dataUrl;
                    previewBlock.style.display = 'block';
                    requestAnimationFrame(() => previewBlock.classList.add('visible'));
                }
            };
            reader.readAsDataURL(file);
        },

        deletePhoto() {
            localStorage.removeItem('currentPhoto');
            const previewBlock = document.getElementById('photoPreviewBlock');
            const previewImg = document.getElementById('photoPreview');
            if (previewBlock) {
                previewBlock.classList.remove('visible');
                setTimeout(() => previewBlock.style.display = 'none', 200);
            }
            if (previewImg) previewImg.src = '';
        },

        restorePhoto() {
            const saved = localStorage.getItem('currentPhoto');
            const previewBlock = document.getElementById('photoPreviewBlock');
            const previewImg = document.getElementById('photoPreview');
            if (saved && previewImg && previewBlock) {
                previewImg.src = saved;
                previewBlock.style.display = 'block';
                requestAnimationFrame(() => previewBlock.classList.add('visible'));
            }
        }
    };
})();

// Utility to prevent layout jumps for media preview blocks
document.addEventListener('DOMContentLoaded', () => {
    ['photoPreviewBlock', 'videoPreviewBlock', 'audioPreviewBlock'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.minHeight = '120px';
            el.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        }
    });
    if (mediaFixed.restorePhoto) mediaFixed.restorePhoto();
});






















