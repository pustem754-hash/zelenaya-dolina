п»їРїВ»С—Р С—Р’В»РЎвЂ”// Micro interactions: ripple + lightweight toast
(function () {
    function createRipple(event, target) {
        const rect = target.getBoundingClientRect();
        const circle = document.createElement('span');
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.style.position = 'absolute';
        circle.style.borderRadius = '50%';
        circle.style.background = 'rgba(255,255,255,0.35)';
        circle.style.transform = 'scale(0)';
        circle.style.animation = 'ripple 0.6s linear';
        circle.style.pointerEvents = 'none';
        circle.className = 'ripple-effect';

        target.style.position = target.style.position || 'relative';
        target.appendChild(circle);
        circle.addEventListener('animationend', () => circle.remove());
    }

    document.addEventListener('click', (e) => {
        const target = e.target.closest('.btn, .media-btn, .submit-btn, .bank-card');
        if (!target) return;
        createRipple(e, target);
    });

    window.showToast = function (message, type = 'info', timeout = 2500) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #111827;
            color: white;
            padding: 12px 18px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
            z-index: 12000;
            opacity: 0;
            animation: fadeInUp 0.2s ease forwards;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, 10px)';
            setTimeout(() => toast.remove(), 200);
        }, timeout);
    };
})();




















