/* ==================== APP INITIALIZATION ==================== */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Core Functionalities
    initCore();
    initModal();
    initDashboardAnimations();
    initApp();

    // Attach Event Listeners
    attachEventListeners();
});

/* ==================== CORE FUNCTIONALITIES ==================== */
function initCore() {
    console.log('%c🌿 Welcome to EcoSort! 🌿', 'color: #10b981; font-size: 20px; font-weight: bold;');
    console.log('%cSmart Waste Management System', 'color: #34d399; font-size: 14px;');
    console.log('%cVersion 1.0.0', 'color: #6ee7b7; font-size: 12px;');

    // Initial check for scroll-based animations
    revealOnScroll();
    
    // Performance Monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page Load Time: ${pageLoadTime}ms`);
            }, 0);
        });
    }

    // Lazy Loading Images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
}

/* ==================== EVENT LISTENERS ==================== */
function attachEventListeners() {
    // Navigation
    document.getElementById('hamburger')?.addEventListener('click', toggleMenu);
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
            scrollToSection(link.getAttribute('href').substring(1));
        });
    });

    // Modals
    document.querySelector('.btn-login')?.addEventListener('click', () => showModal('loginModal'));
    document.querySelector('.close-modal')?.addEventListener('click', () => closeModal('loginModal'));
    document.querySelector('.btn-primary')?.addEventListener('click', () => showModal('loginModal'));
    document.querySelector('.btn-secondary')?.addEventListener('click', () => scrollToSection('features'));
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('signUpForm')?.addEventListener('submit', handleSignUp);

    // Global Listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleWindowClick);
    document.addEventListener('keydown', handleKeyDown);

    // Dashboard Buttons
    document.querySelector('.btn-view-all')?.addEventListener('click', () => showNotification('Full alerts dashboard coming soon!', 'info'));
    document.querySelector('.btn-diagnostics')?.addEventListener('click', () => {
        showNotification('Running system diagnostics...', 'info');
        setTimeout(() => showNotification('All systems operational!', 'success'), 2000);
    });

    // Back to Top
    document.getElementById('backToTop')?.addEventListener('click', scrollToTop);

    // Reboot Demo Button
    document.getElementById('reboot-btn')?.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.className = 'reboot-overlay';
        overlay.textContent = 'Rebooting...';
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.remove();
        }, 5000);
    });
}

/* ==================== NAVIGATION ==================== */
function toggleMenu() {
    document.getElementById('navLinks')?.classList.toggle('active');
    document.getElementById('hamburger')?.classList.toggle('active');
}

function closeMenu() {
    document.getElementById('navLinks')?.classList.remove('active');
    document.getElementById('hamburger')?.classList.remove('active');
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==================== MODAL HANDLING ==================== */
let activeModal = null;

function initModal() {
    // Pre-fetch modal elements
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const modalId = modal.id;
        document.querySelector(`.close-modal[onclick="closeModal('${modalId}')"]`)?.addEventListener('click', () => closeModal(modalId));
        document.querySelector(`.modal-footer a[onclick^="showModal"]`)?.addEventListener('click', (e) => {
            e.preventDefault();
            const targetModal = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
            switchModal(modalId, targetModal);
        });
    });
}

function showModal(modalId) {
    closeModal(); // Close any active modal first
    const modal = document.getElementById(modalId);
    if (modal) {
        activeModal = modal;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId = null) {
    const modalToClose = modalId ? document.getElementById(modalId) : activeModal;
    if (modalToClose) {
        modalToClose.style.display = 'none';
        activeModal = null;
        document.body.style.overflow = 'auto';
    }
}

function switchModal(fromModalId, toModalId) {
    closeModal(fromModalId);
    showModal(toModalId);
}

function handleWindowClick(event) {
    if (activeModal && event.target === activeModal) {
        closeModal();
    }
}

function handleKeyDown(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
        event.preventDefault();
        showModal('loginModal');
    }
}

/* ==================== FORM HANDLERS ==================== */
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (email && password) {
        setLoadingState(event.target, true, 'Signing in...');
        setTimeout(() => {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('isLoggedIn', 'true');

            // Check if the user is an admin and log the event
            if (email.toLowerCase() === 'admin@ecosort.com') {
                const message = `Admin user ${email} logged in.`;
                console.log(`[ADMIN LOGIN] ${message} at ${new Date().toISOString()}`);
                logToPage(message);
            }

            showNotification('Login successful! Welcome back!', 'success');
            setLoadingState(event.target, false, 'Sign In');
            event.target.reset();
            setTimeout(() => {
                closeModal('loginModal');
                showNotification('Dashboard feature coming soon!', 'info');
            }, 1500);
        }, 1500);
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

function handleSignUp(event) {
    event.preventDefault();
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('signUpConfirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    setLoadingState(event.target, true, 'Creating account...');
    setTimeout(() => {
        showNotification('Account created successfully!', 'success');
        setLoadingState(event.target, false, 'Create Account');
        event.target.reset();
        setTimeout(() => switchModal('signUpModal', 'loginModal'), 1500);
    }, 2000);
}

function setLoadingState(form, isLoading, loadingText) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        if (isLoading) {
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
            submitBtn.disabled = true;
        } else {
            submitBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> ${loadingText}`;
            submitBtn.disabled = false;
        }
    }
}

/* ==================== LOGGING ==================== */
function logToPage(message) {
    const logList = document.getElementById('log-list');
    if (logList) {
        const entry = document.createElement('li');
        const timestamp = new Date().toLocaleTimeString();
        entry.textContent = `[${timestamp}] ${message}`;
        logList.prepend(entry); // Add new logs to the top
    }
}

/* ==================== UI & ANIMATIONS ==================== */
function handleScroll() {
    // Navbar style on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
    }

    // "Back to Top" button visibility
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    }

    // Reveal elements on scroll
    revealOnScroll();
}

function revealOnScroll() {
    const reveals = document.querySelectorAll('.feature-card, .floating-card');
    reveals.forEach(element => {
        if (element.getBoundingClientRect().top < window.innerHeight - 150) {
            element.classList.add('active');
        }
    });
}

function showNotification(message, type = 'info') {
    document.querySelector('.notification')?.remove();
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    const icon = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' }[type];
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="notification-close"><i class="fas fa-times"></i></button>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/* ==================== DASHBOARD ANIMATIONS ==================== */
function initDashboardAnimations() {
    const progressBars = document.querySelectorAll('.progress-fill');
    const binFills = document.querySelectorAll('.bin-fill');

    const animateElements = () => {
        progressBars.forEach(bar => {
            if (bar.getBoundingClientRect().top < window.innerHeight) {
                bar.style.width = bar.getAttribute('data-value') + '%';
            }
        });
        binFills.forEach(fill => {
            if (fill.getBoundingClientRect().top < window.innerHeight) {
                fill.style.height = fill.getAttribute('data-height') + '%';
            }
        });
    };
    
    window.addEventListener('scroll', animateElements);
    setTimeout(animateElements, 500); // Initial animation

    setInterval(() => {
        document.querySelectorAll('.live-indicator + span').forEach(indicator => {
            indicator.textContent = `Updated ${Math.floor(Math.random() * 10) + 1}s ago`;
        });
    }, 5000);
}

/* ==================== APP-SPECIFIC LOGIC ==================== */
function initApp() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        console.log(`Welcome back, ${localStorage.getItem('userEmail')}!`);
    }
    // Any other app-specific initializations can go here
}
