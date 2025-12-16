// Simple platform detection + iOS 100vh fix
const Platform = {
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
    isAndroid: /Android/i.test(navigator.userAgent),
    isDesktop: !/Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
    isPWA: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true,

    setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    },

    init() {
        this.setVH();
        window.addEventListener('resize', () => this.setVH());

        if (this.isIOS) document.documentElement.classList.add('ios');
        if (this.isAndroid) document.documentElement.classList.add('android');
        if (this.isDesktop) document.documentElement.classList.add('desktop');
        if (this.isPWA) document.documentElement.classList.add('pwa');
    }
};

document.addEventListener('DOMContentLoaded', () => Platform.init());













