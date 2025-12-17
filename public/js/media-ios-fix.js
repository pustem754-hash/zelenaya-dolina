// iOS-friendly capture helpers (no console.log)
(function() {
    const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    function fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
        });
    }

    async function captureViaFileInput(preferFront = false) {
        return new Promise((resolve, reject) => {
            try {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.capture = preferFront ? 'user' : 'environment';
                input.style.display = 'none';
                document.body.appendChild(input);

                input.onchange = async (e) => {
                    try {
                        const file = e.target.files && e.target.files[0];
                        input.remove();
                        if (!file) {
                            resolve(null);
                            return;
                        }
                        const dataUrl = await fileToDataUrl(file);
                        resolve(dataUrl);
                    } catch (err) {
                        reject(err);
                    }
                };

                input.click();
            } catch (err) {
                reject(err);
            }
        });
    }

    async function captureViaMediaDevices(preferFront = false) {
        const constraints = {
            video: {
                facingMode: preferFront ? 'user' : 'environment'
            }
        };

        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            const video = document.createElement('video');
            video.style.position = 'fixed';
            video.style.opacity = '0';
            video.playsInline = true;
            video.srcObject = stream;
            await video.play();

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 1280;
            canvas.height = video.videoHeight || 720;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            stream.getTracks().forEach(t => t.stop());
            return dataUrl;
        } catch (err) {
            if (stream) {
                stream.getTracks().forEach(t => t.stop());
            }
            throw err;
        }
    }

    async function capturePhotoSafe(options = {}) {
        const preferFront = !!options.preferFront;

        try {
            if (isIOS()) {
                const data = await captureViaFileInput(preferFront);
                if (data) return data;
            }
        } catch (err) {
            // Тихо переходим к следующему методу
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const data = await captureViaMediaDevices(preferFront);
                if (data) return data;
            } catch (err) {
                console.error('capturePhotoSafe mediaDevices error', err);
            }
        }

        try {
            const data = await captureViaFileInput(preferFront);
            return data;
        } catch (err) {
            console.error('capturePhotoSafe fallback input error', err);
            return null;
        }
    }

    window.capturePhotoSafe = capturePhotoSafe;
})();



