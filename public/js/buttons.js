п»їРїВ»С—Р С—Р’В»РЎвЂ”/**
 * Button Interactions & Ripple Effects
 * Р В Р’В Р В РІвЂљВ¬Р В Р’В Р РЋРІвЂћСћ Р В РІР‚в„ўР вЂ™Р’В«Р В Р’В Р Р†Р вЂљРІР‚СњР В Р’В Р вЂ™Р’ВµР В Р’В Р вЂ™Р’В»Р В Р Р‹Р Р†Р вЂљР’ВР В Р’В Р В РІР‚В¦Р В Р’В Р вЂ™Р’В°Р В Р Р‹Р В Р РЏ Р В Р’В Р СћРІР‚ВР В Р’В Р РЋРІР‚СћР В Р’В Р вЂ™Р’В»Р В Р’В Р РЋРІР‚ВР В Р’В Р В РІР‚В¦Р В Р’В Р вЂ™Р’В°Р В РІР‚в„ўР вЂ™Р’В»
 * v1.0
 */

(function() {
    'use strict';

    /**
     * Ripple effect for Material Design buttons
     */
    function initRippleEffect() {
        const rippleButtons = document.querySelectorAll(
            '.btn-primary, .btn-success, .btn-warning, .btn-danger, .btn-icon, .btn-fab'
        );

        rippleButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Don't create ripple if button is disabled
                if (this.disabled) return;

                const ripple = document.createElement('span');
                ripple.classList.add('ripple-effect');
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.6)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple-animation 0.6s ease-out';
                ripple.style.pointerEvents = 'none';
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    /**
     * Loading state for async buttons
     */
    function setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('btn-loading');
            button.disabled = true;
            button.setAttribute('data-original-text', button.textContent);
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
            const originalText = button.getAttribute('data-original-text');
            if (originalText) {
                button.textContent = originalText;
                button.removeAttribute('data-original-text');
            }
        }
    }

    /**
     * Success feedback animation
     */
    function showButtonSuccess(button, message = 'Р В Р вЂ Р РЋРЎв„ўР Р†Р вЂљРЎС™') {
        const originalText = button.textContent;
        button.textContent = message;
        button.classList.add('btn-success-feedback');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('btn-success-feedback');
        }, 2000);
    }

    /**
     * Button group toggle functionality
     */
    function initButtonGroups() {
        const buttonGroups = document.querySelectorAll('.btn-group');
        
        buttonGroups.forEach(group => {
            if (group.hasAttribute('data-toggle')) {
                const buttons = group.querySelectorAll('.btn');
                
                buttons.forEach(button => {
                    button.addEventListener('click', function() {
                        buttons.forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                    });
                });
            }
        });
    }

    /**
     * Keyboard navigation for buttons
     */
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Space or Enter on focused button
            if ((e.key === ' ' || e.key === 'Enter') && e.target.classList.contains('btn')) {
                e.preventDefault();
                e.target.click();
            }
        });
    }

    /**
     * Touch feedback for mobile devices
     */
    function initTouchFeedback() {
        if ('ontouchstart' in window) {
            const buttons = document.querySelectorAll('.btn');
            
            buttons.forEach(button => {
                button.addEventListener('touchstart', function() {
                    this.classList.add('btn-touch-active');
                });
                
                button.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.classList.remove('btn-touch-active');
                    }, 150);
                });
            });
        }
    }

    /**
     * Accessibility improvements
     */
    function initAccessibility() {
        // Add ARIA labels to icon buttons without text
        const iconButtons = document.querySelectorAll('.btn-icon');
        
        iconButtons.forEach(button => {
            if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
                const title = button.getAttribute('title');
                if (title) {
                    button.setAttribute('aria-label', title);
                }
            }
        });

        // Add role="button" to non-button elements with button classes
        const buttonElements = document.querySelectorAll('.btn');
        
        buttonElements.forEach(element => {
            if (element.tagName !== 'BUTTON' && !element.hasAttribute('role')) {
                element.setAttribute('role', 'button');
            }
        });
    }

    /**
     * FAB menu functionality (if needed)
     */
    function initFABMenu() {
        const fabButtons = document.querySelectorAll('.btn-fab[data-menu]');
        
        fabButtons.forEach(fab => {
            fab.addEventListener('click', function() {
                const menuId = this.getAttribute('data-menu');
                const menu = document.getElementById(menuId);
                
                if (menu) {
                    menu.classList.toggle('active');
                }
            });
        });
    }

    /**
     * Initialize all button functionality
     */
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('Р РЋР вЂљР РЋРЎСџР В РІР‚в„–Р В Р С“ Initializing button system...');
        
        initRippleEffect();
        initButtonGroups();
        initKeyboardNavigation();
        initTouchFeedback();
        initAccessibility();
        initFABMenu();
        
        console.log('Р В Р вЂ Р РЋРЎв„ўР Р†Р вЂљР’В¦ Button system initialized');
    }

    // Export functions for global use
    window.ButtonSystem = {
        setLoading: setButtonLoading,
        showSuccess: showButtonSuccess,
        init: init
    };

    // Auto-initialize
    init();
})();

// CSS Animation for ripple effect
if (!document.getElementById('ripple-animation-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-animation-style';
    style.textContent = `
        @keyframes ripple-animation {
            from {
                transform: scale(0);
                opacity: 1;
            }
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .btn-success-feedback {
            background: #2E7D32 !important;
            transform: scale(1.05);
        }
        
        .btn-touch-active {
            transform: scale(0.95);
        }
        
        /* Additional touch feedback */
        @media (hover: none) {
            .btn:active {
                transform: scale(0.96);
            }
        }
    `;
    document.head.appendChild(style);
}










