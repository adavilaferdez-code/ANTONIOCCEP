// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================

// Create toast container if it doesn't exist
function ensureToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

// Icon mapping for toast types
const toastIcons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
};

/**
 * Show a toast notification
 * @param {string} title - Toast title
 * @param {string} message - Toast message (optional)
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in ms (default: 5000, use 0 for persistent)
 */
function showToast(title, message = '', type = 'info', duration = 5000) {
    // Toast notifications disabled by user request
    return null;
}

// Remove toast with animation
function removeToast(toast) {
    toast.classList.add('removing');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Convenience functions
function showSuccess(title, message, duration) {
    return showToast(title, message, 'success', duration);
}

function showError(title, message, duration) {
    return showToast(title, message, 'error', duration);
}

function showWarning(title, message, duration) {
    return showToast(title, message, 'warning', duration);
}

function showInfo(title, message, duration) {
    return showToast(title, message, 'info', duration);
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.showToast = showToast;
    window.showSuccess = showSuccess;
    window.showError = showError;
    window.showWarning = showWarning;
    window.showInfo = showInfo;
}
