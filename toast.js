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
    const container = ensureToastContainer();

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Create icon
    const icon = document.createElement('div');
    icon.className = 'toast-icon';
    icon.textContent = toastIcons[type] || 'ℹ';

    // Create content
    const content = document.createElement('div');
    content.className = 'toast-content';

    const titleEl = document.createElement('div');
    titleEl.className = 'toast-title';
    titleEl.textContent = title;
    content.appendChild(titleEl);

    if (message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'toast-message';
        messageEl.textContent = message;
        content.appendChild(messageEl);
    }

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = () => removeToast(toast);

    // Assemble toast
    toast.appendChild(icon);
    toast.appendChild(content);
    toast.appendChild(closeBtn);

    // Add progress bar if duration is set
    if (duration > 0) {
        const progress = document.createElement('div');
        progress.className = 'toast-progress';
        progress.style.animationDuration = `${duration}ms`;
        toast.appendChild(progress);

        // Auto remove after duration
        setTimeout(() => removeToast(toast), duration);
    }

    // Add to container
    container.appendChild(toast);

    // Allow clicking toast to dismiss
    toast.onclick = (e) => {
        if (e.target !== closeBtn) {
            removeToast(toast);
        }
    };

    return toast;
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
