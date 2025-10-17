/**
 * Main Application Entry Point
 * Handles application initialization, mode detection, and global configurations
 */

class PersonnelApp {
    constructor() {
        this.config = {
            apiBaseUrl: window.API_BASE_URL || '/api',
            redirectUrl: '/personnel-list.html',
            debugMode: window.DEBUG_MODE || false
        };
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupGlobalErrorHandling();
        this.setupEnvironmentConfig();
        this.detectMode();
        this.setupGlobalEventListeners();
        this.loadDropdownOptions();
        
        if (this.config.debugMode) {
            console.log('Personnel App initialized', this.config);
        }
    }

    /**
     * Setup global error handling
     */
    setupGlobalErrorHandling() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            if (window.toastr) {
                toastr.error('Beklenmeyen bir hata oluştu.');
            }
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            if (window.toastr) {
                toastr.error('İşlem tamamlanamadı.');
            }
            event.preventDefault();
        });

        // Handle network errors
        window.addEventListener('offline', () => {
            if (window.toastr) {
                toastr.warning('İnternet bağlantısı kesildi.');
            }
        });

        window.addEventListener('online', () => {
            if (window.toastr) {
                toastr.success('İnternet bağlantısı yeniden kuruldu.');
            }
        });
    }

    /**
     * Setup environment configuration
     */
    setupEnvironmentConfig() {
        // Check for environment variables or configuration
        if (typeof window.APP_CONFIG !== 'undefined') {
            Object.assign(this.config, window.APP_CONFIG);
        }

        // Set API base URL globally
        window.API_BASE_URL = this.config.apiBaseUrl;
        
        // Set debug mode
        window.DEBUG_MODE = this.config.debugMode;
    }

    /**
     * Detect application mode (add/edit)
     */
    detectMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        if (id) {
            this.mode = 'edit';
            this.personnelId = id;
            document.title = 'Personel Düzenle - HR Sistemi';
        } else {
            this.mode = 'add';
            this.personnelId = null;
            document.title = 'Personel Ekle - HR Sistemi';
        }

        // Store mode globally for other components
        window.APP_MODE = this.mode;
        window.PERSONNEL_ID = this.personnelId;

        if (this.config.debugMode) {
            console.log(`App mode: ${this.mode}`, { personnelId: this.personnelId });
        }
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.mode) {
                this.handleModeChange(event.state.mode, event.state.id);
            }
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.onPageVisible();
            } else {
                this.onPageHidden();
            }
        });

        // Handle before unload (warn about unsaved changes)
        window.addEventListener('beforeunload', (event) => {
            if (this.hasUnsavedChanges()) {
                event.preventDefault();
                event.returnValue = 'Kaydedilmemiş değişiklikler var. Sayfadan ayrılmak istediğinizden emin misiniz?';
                return event.returnValue;
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
        });
    }

    /**
     * Handle mode changes
     */
    handleModeChange(newMode, id = null) {
        this.mode = newMode;
        this.personnelId = id;
        
        // Update global variables
        window.APP_MODE = this.mode;
        window.PERSONNEL_ID = this.personnelId;
        
        // Reload the page with new parameters
        const url = new URL(window.location);
        if (id) {
            url.searchParams.set('id', id);
        } else {
            url.searchParams.delete('id');
        }
        
        window.location.href = url.toString();
    }

    /**
     * Check for unsaved changes
     */
    hasUnsavedChanges() {
        if (!window.personnelForm) return false;
        
        const form = document.getElementById('personnel-form');
        if (!form) return false;

        // Check if any form field has been modified
        const formData = new FormData(form);
        const hasData = Array.from(formData.entries()).some(([key, value]) => {
            return value && value.toString().trim() !== '';
        });

        return hasData && !this.isFormSubmitted;
    }

    /**
     * Handle page visibility changes
     */
    onPageVisible() {
        // Refresh data if needed
        if (this.mode === 'edit' && this.personnelId) {
            // Could implement auto-refresh here
        }
    }

    onPageHidden() {
        // Auto-save draft if needed
        // Could implement auto-save functionality here
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Ctrl+S or Cmd+S to save
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
            }
        }

        // Escape to cancel
        if (event.key === 'Escape') {
            const cancelBtn = document.getElementById('cancel-btn');
            if (cancelBtn) {
                cancelBtn.click();
            }
        }

        // Ctrl+1-9 to switch tabs
        if ((event.ctrlKey || event.metaKey) && event.key >= '1' && event.key <= '9') {
            event.preventDefault();
            const tabIndex = parseInt(event.key) - 1;
            const tabs = document.querySelectorAll('[data-bs-toggle="tab"]');
            if (tabs[tabIndex]) {
                tabs[tabIndex].click();
            }
        }
    }

    /**
     * Load dropdown options from API
     */
    async loadDropdownOptions() {
        if (!window.apiClient) return;

        const dropdownConfigs = [
            { selector: '#bolum', type: 'departments' },
            { selector: '#pozisyon', type: 'positions' },
            { selector: '#unvan', type: 'titles' },
            { selector: '#banka_adi', type: 'banks' }
        ];

        for (const config of dropdownConfigs) {
            try {
                const options = await window.apiClient.getOptions(config.type);
                this.populateDropdown(config.selector, options);
            } catch (error) {
                if (this.config.debugMode) {
                    console.warn(`Failed to load options for ${config.type}:`, error);
                }
            }
        }
    }

    /**
     * Populate dropdown with options
     */
    populateDropdown(selector, options) {
        const dropdown = document.querySelector(selector);
        if (!dropdown || !Array.isArray(options)) return;

        // Keep the first option (usually "Seçiniz")
        const firstOption = dropdown.querySelector('option');
        dropdown.innerHTML = '';
        
        if (firstOption) {
            dropdown.appendChild(firstOption);
        }

        // Add new options
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value || option.id;
            optionElement.textContent = option.label || option.name;
            dropdown.appendChild(optionElement);
        });
    }

    /**
     * Show loading overlay
     */
    showLoading(message = 'Yükleniyor...') {
        let overlay = document.getElementById('loading-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-content">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Yükleniyor...</span>
                    </div>
                    <div class="loading-text mt-3">${message}</div>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        overlay.querySelector('.loading-text').textContent = message;
        overlay.style.display = 'flex';
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    /**
     * Utility method to format currency
     */
    formatCurrency(amount, currency = 'TRY') {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    /**
     * Utility method to format date
     */
    formatDate(date, format = 'short') {
        const options = {
            short: { year: 'numeric', month: '2-digit', day: '2-digit' },
            long: { year: 'numeric', month: 'long', day: 'numeric' },
            time: { hour: '2-digit', minute: '2-digit' }
        };

        return new Intl.DateTimeFormat('tr-TR', options[format]).format(new Date(date));
    }

    /**
     * Utility method to validate Turkish ID number
     */
    validateTurkishId(id) {
        if (!id || id.length !== 11) return false;
        
        const digits = id.split('').map(Number);
        
        // First digit cannot be 0
        if (digits[0] === 0) return false;
        
        // Calculate checksum
        const sum1 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
        const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
        
        const check1 = (sum1 * 7 - sum2) % 10;
        const check2 = (sum1 + sum2 + digits[9]) % 10;
        
        return check1 === digits[9] && check2 === digits[10];
    }

    /**
     * Utility method to validate IBAN
     */
    validateIban(iban) {
        if (!iban) return false;
        
        // Remove spaces and convert to uppercase
        iban = iban.replace(/\s/g, '').toUpperCase();
        
        // Check format for Turkish IBAN
        if (!/^TR\d{24}$/.test(iban)) return false;
        
        // Move first 4 characters to end
        const rearranged = iban.slice(4) + iban.slice(0, 4);
        
        // Replace letters with numbers (A=10, B=11, ..., Z=35)
        const numeric = rearranged.replace(/[A-Z]/g, (char) => 
            (char.charCodeAt(0) - 55).toString()
        );
        
        // Calculate mod 97
        let remainder = '';
        for (let i = 0; i < numeric.length; i++) {
            remainder = (remainder + numeric[i]) % 97;
        }
        
        return remainder === 1;
    }

    /**
     * Mark form as submitted
     */
    markFormSubmitted() {
        this.isFormSubmitted = true;
    }

    /**
     * Get application info
     */
    getAppInfo() {
        return {
            mode: this.mode,
            personnelId: this.personnelId,
            config: this.config,
            version: '1.0.0'
        };
    }
}

// CSS for loading overlay
const loadingStyles = `
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }
    
    .loading-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .loading-text {
        color: #666;
        font-weight: 500;
    }
`;

// Inject loading styles
const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.personnelApp = new PersonnelApp();
});

// Global utility functions
window.formatCurrency = (amount, currency = 'TRY') => {
    return window.personnelApp ? window.personnelApp.formatCurrency(amount, currency) : amount;
};

window.formatDate = (date, format = 'short') => {
    return window.personnelApp ? window.personnelApp.formatDate(date, format) : date;
};

window.validateTurkishId = (id) => {
    return window.personnelApp ? window.personnelApp.validateTurkishId(id) : false;
};

window.validateIban = (iban) => {
    return window.personnelApp ? window.personnelApp.validateIban(iban) : false;
};
