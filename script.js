/* ==================== GLOBAL VARIABLES ==================== */
let currentPage = 'landing';
let wasteData = {
    biodegradable: 35,
    nonBiodegradable: 25,
    recyclable: 40
};

/* ==================== NAVIGATION MENU TOGGLE ==================== */
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const navbar = document.querySelector('.navbar');
    
    if (navLinks && hamburger && navbar) {
        if (!navbar.contains(event.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

// Close menu when clicking on a nav link
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navLinksContainer = document.getElementById('navLinks');
            const hamburger = document.getElementById('hamburger');
            if (navLinksContainer && hamburger) {
                navLinksContainer.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
});

/* ==================== SMOOTH SCROLLING ==================== */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

/* ==================== NAVBAR SCROLL EFFECT ==================== */
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

/* ==================== LOGIN MODAL ==================== */
function showLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const loginModal = document.getElementById('loginModal');
    const signUpModal = document.getElementById('signUpModal');
    if (event.target === loginModal) {
        closeLogin();
    }
    if (event.target === signUpModal) {
        closeSignUp();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLogin();
        closeSignUp();
    }
});

/* ==================== LOGIN FORM HANDLER - UPDATED ==================== */
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simple validation
    if (email && password) {
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Store user data (in real app, this would come from backend)
            localStorage.setItem('userEmail', email);
            localStorage.setItem('isLoggedIn', 'true');

            // Show success notification
            showNotification('Login successful! Welcome back!', 'success');

            // Reset form
            event.target.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Close modal and redirect
            setTimeout(() => {
                closeLogin();
                showNotification('Dashboard feature coming soon!', 'info');
            }, 1500);
        }, 1500);
    } else {
        showNotification('Please fill in all fields', 'error');
    }

    return false;
}

/* ==================== SIGN UP MODAL ==================== */
function showSignUp() {
    const modal = document.getElementById('signUpModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeSignUp() {
    const modal = document.getElementById('signUpModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showLoginFromSignUp() {
    closeSignUp();
    showLogin();
}

/* ==================== SIGN UP FORM HANDLER ==================== */
function handleSignUp(event) {
    event.preventDefault();

    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('signUpConfirmPassword').value;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return false;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return false;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return false;
    }

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Store user data (in real app, this would come from backend)
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');

        // Show success notification
        showNotification('Account created successfully! Welcome to EcoSort!', 'success');

        // Reset form
        event.target.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Close modal and redirect
        setTimeout(() => {
            closeSignUp();
            showNotification('Dashboard feature coming soon!', 'info');
        }, 1500);
    }, 2000);

    return false;
}


/* ==================== NOTIFICATION SYSTEM ==================== */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/* ==================== SCROLL ANIMATIONS ==================== */
function revealOnScroll() {
    const reveals = document.querySelectorAll('.feature-card, .floating-card');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Initial check on page load
document.addEventListener('DOMContentLoaded', revealOnScroll);

/* ==================== WASTE DATA SIMULATION (for future dashboard) ==================== */
function updateWasteData() {
    // Simulate random waste data changes
    wasteData.biodegradable = Math.max(20, Math.min(50, wasteData.biodegradable + (Math.random() - 0.5) * 5));
    wasteData.nonBiodegradable = Math.max(15, Math.min(40, wasteData.nonBiodegradable + (Math.random() - 0.5) * 5));
    wasteData.recyclable = Math.max(25, Math.min(55, wasteData.recyclable + (Math.random() - 0.5) * 5));
    
    // Normalize to 100%
    const total = wasteData.biodegradable + wasteData.nonBiodegradable + wasteData.recyclable;
    wasteData.biodegradable = Math.round((wasteData.biodegradable / total) * 100);
    wasteData.nonBiodegradable = Math.round((wasteData.nonBiodegradable / total) * 100);
    wasteData.recyclable = 100 - wasteData.biodegradable - wasteData.nonBiodegradable;
    
    console.log('Updated Waste Data:', wasteData);
}

// Update waste data every 5 seconds (for demo purposes)
setInterval(updateWasteData, 5000);

/* ==================== FORM VALIDATION ==================== */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/* ==================== LOADING ANIMATION ==================== */
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

/* ==================== CONSOLE WELCOME MESSAGE ==================== */
console.log('%c🌿 Welcome to EcoSort! 🌿', 'color: #10b981; font-size: 20px; font-weight: bold;');
console.log('%cSmart Waste Management System', 'color: #34d399; font-size: 14px;');
console.log('%cVersion 1.0.0', 'color: #6ee7b7; font-size: 12px;');

/* ==================== PERFORMANCE MONITORING ==================== */
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page Load Time: ${pageLoadTime}ms`);
        }, 0);
    });
}

/* ==================== SERVICE WORKER (for PWA - optional) ==================== */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

/* ==================== ANALYTICS TRACKING (placeholder) ==================== */
function trackEvent(category, action, label) {
    console.log(`Analytics Event: ${category} - ${action} - ${label}`);
    // In production, integrate with Google Analytics or similar
    // gtag('event', action, { 'event_category': category, 'event_label': label });
}

// Track button clicks
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            trackEvent('Button', 'Click', buttonText);
        });
    });
});

/* ==================== DARK MODE TOGGLE (optional feature) ==================== */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    showNotification(isDarkMode ? 'Dark mode enabled' : 'Light mode enabled', 'info');
}

// Load dark mode preference
document.addEventListener('DOMContentLoaded', function() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
});

/* ==================== COPY TO CLIPBOARD ==================== */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showNotification('Copied to clipboard!', 'success');
    }, function(err) {
        showNotification('Failed to copy', 'error');
    });
}

/* ==================== PRINT PAGE ==================== */
function printPage() {
    window.print();
}

/* ==================== SHARE FUNCTIONALITY ==================== */
async function shareContent() {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'EcoSort - Smart Waste Management',
                text: 'Check out this amazing waste management system!',
                url: window.location.href
            });
            showNotification('Shared successfully!', 'success');
        } catch (err) {
            console.log('Error sharing:', err);
        }
    } else {
        showNotification('Sharing not supported on this browser', 'error');
    }
}

/* ==================== BACK TO TOP BUTTON ==================== */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide back to top button
window.addEventListener('scroll', function() {
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    }
});

/* ==================== LAZY LOADING IMAGES ==================== */
document.addEventListener('DOMContentLoaded', function() {
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
});

/* ==================== KEYBOARD SHORTCUTS ==================== */
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + K to open search (if implemented)
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        showNotification('Search feature coming soon!', 'info');
    }
    
    // Ctrl/Cmd + L to open login
    if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
        event.preventDefault();
        showLogin();
    }
});

/* ==================== INITIALIZE APP ==================== */
function initApp() {
    console.log('EcoSort App Initialized');
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        const userEmail = localStorage.getItem('userEmail');
        console.log(`Welcome back, ${userEmail}!`);
    }
    
    // Initialize any other features
    revealOnScroll();
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

/* ==================== DASHBOARD ANIMATIONS ==================== */
document.addEventListener('DOMContentLoaded', function() {
  // Animate progress bars when in view
  const progressBars = document.querySelectorAll('.progress-fill');
  
  const animateProgressBars = () => {
    progressBars.forEach(bar => {
      const rect = bar.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const value = bar.getAttribute('data-value');
        bar.style.width = value + '%';
      }
    });
  };

  // Animate bin fills
  const binFills = document.querySelectorAll('.bin-fill');
  
  const animateBinFills = () => {
    binFills.forEach(fill => {
      const rect = fill.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const height = fill.style.height;
        fill.style.height = '0%';
        setTimeout(() => {
          fill.style.height = height;
        }, 100);
      }
    });
  };

  // Run animations on scroll
  window.addEventListener('scroll', () => {
    animateProgressBars();
    animateBinFills();
  });

  // Run animations on page load
  setTimeout(() => {
    animateProgressBars();
    animateBinFills();
  }, 500);

  // Simulate real-time updates (for demo)
  setInterval(() => {
    const liveIndicators = document.querySelectorAll('.live-indicator + span');
    liveIndicators.forEach(indicator => {
      const seconds = Math.floor(Math.random() * 10) + 1;
      indicator.textContent = `Updated ${seconds}s ago`;
    });
  }, 5000);
});

// Button click handlers
document.addEventListener('click', function(e) {
  if (e.target.closest('.btn-view-all')) {
    showNotification('Full alerts dashboard coming soon!', 'info');
  }
  
  if (e.target.closest('.btn-diagnostics')) {
    showNotification('Running system diagnostics...', 'info');
    setTimeout(() => {
      showNotification('All systems operational!', 'success');
    }, 2000);
  }
});
