/**
 * API Client for Personnel Management
 * Uses ky library for HTTP requests with proper error handling
 */

class ApiClient {
    constructor() {
        // Check if ky is available
        if (typeof ky === 'undefined') {
            console.error('ky library is not loaded. Please include ky before apiClient.js');
            throw new Error('ky library is required');
        }
        
        // Get base URL from environment or use default
        this.baseUrl = window.API_BASE_URL || '/api';
        
        // Initialize ky instance with default configuration
        this.api = ky.create({
            prefixUrl: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000, // 30 seconds timeout
            retry: {
                limit: 2,
                methods: ['get', 'post', 'put', 'delete'],
                statusCodes: [408, 413, 429, 500, 502, 503, 504]
            },
            hooks: {
                beforeRequest: [
                    request => {
                        // Add authentication token if available
                        const token = this.getAuthToken();
                        if (token) {
                            request.headers.set('Authorization', `Bearer ${token}`);
                        }
                        
                        // Log request for debugging
                        console.log(`API Request: ${request.method} ${request.url}`);
                    }
                ],
                afterResponse: [
                    async (request, options, response) => {
                        // Log response for debugging
                        console.log(`API Response: ${response.status} ${request.url}`);
                        
                        // Handle specific status codes
                        if (response.status === 401) {
                            this.handleUnauthorized();
                        }
                        
                        return response;
                    }
                ],
                beforeError: [
                    error => {
                        console.error('API Error:', error);
                        return error;
                    }
                ]
            }
        });
    }

    /**
     * Get authentication token from localStorage or sessionStorage
     */
    getAuthToken() {
        return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }

    /**
     * Handle unauthorized access
     */
    handleUnauthorized() {
        // Clear stored tokens
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        
        // Show error message
        if (window.toastr) {
            toastr.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        }
        
        // Redirect to login page after a delay
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
    }

    /**
     * Handle API errors and show user-friendly messages
     */
    handleError(error, customMessage = null) {
        let message = customMessage || 'Bir hata oluştu. Lütfen tekrar deneyin.';
        
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    message = 'Geçersiz veri gönderildi. Lütfen formu kontrol edin.';
                    break;
                case 401:
                    message = 'Yetkiniz bulunmuyor. Lütfen giriş yapın.';
                    break;
                case 403:
                    message = 'Bu işlem için yetkiniz bulunmuyor.';
                    break;
                case 404:
                    message = 'Aradığınız kayıt bulunamadı.';
                    break;
                case 409:
                    message = 'Bu kayıt zaten mevcut.';
                    break;
                case 422:
                    message = 'Gönderilen veriler geçersiz. Lütfen kontrol edin.';
                    break;
                case 429:
                    message = 'Çok fazla istek gönderildi. Lütfen bekleyin.';
                    break;
                case 500:
                    message = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
                    break;
                case 503:
                    message = 'Servis geçici olarak kullanılamıyor.';
                    break;
                default:
                    message = `Hata (${error.response.status}): ${error.message}`;
            }
        } else if (error.name === 'TimeoutError') {
            message = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.';
        } else if (error.name === 'TypeError') {
            message = 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.';
        }

        if (window.toastr) {
            toastr.error(message);
        } else {
            console.error(message, error);
        }

        throw new Error(message);
    }

    /**
     * Create a new personnel record
     * @param {Object} personnelData - Personnel data object
     * @returns {Promise<Object>} Created personnel record
     */
    async createPersonnel(personnelData) {
        try {
            const formData = this.prepareFormData(personnelData);
            
            const response = await this.api.post('personnel', {
                body: formData,
                headers: formData instanceof FormData ? {} : { 'Content-Type': 'application/json' }
            });
            
            const result = await response.json();
            
            if (window.toastr) {
                toastr.success('Personel kaydı başarıyla oluşturuldu.');
            }
            
            return result;
        } catch (error) {
            this.handleError(error, 'Personel kaydı oluşturulurken hata oluştu.');
        }
    }

    /**
     * Update an existing personnel record
     * @param {string|number} id - Personnel ID
     * @param {Object} personnelData - Updated personnel data
     * @returns {Promise<Object>} Updated personnel record
     */
    async updatePersonnel(id, personnelData) {
        try {
            const formData = this.prepareFormData(personnelData);
            
            const response = await this.api.put(`personnel/${id}`, {
                body: formData,
                headers: formData instanceof FormData ? {} : { 'Content-Type': 'application/json' }
            });
            
            const result = await response.json();
            
            if (window.toastr) {
                toastr.success('Personel kaydı başarıyla güncellendi.');
            }
            
            return result;
        } catch (error) {
            this.handleError(error, 'Personel kaydı güncellenirken hata oluştu.');
        }
    }

    /**
     * Get personnel record by ID
     * @param {string|number} id - Personnel ID
     * @returns {Promise<Object>} Personnel record
     */
    async getPersonnelById(id) {
        try {
            const response = await this.api.get(`personnel/${id}`);
            return await response.json();
        } catch (error) {
            this.handleError(error, 'Personel kaydı yüklenirken hata oluştu.');
        }
    }

    /**
     * Get all personnel records with optional filters
     * @param {Object} filters - Filter parameters
     * @returns {Promise<Array>} Array of personnel records
     */
    async getPersonnelList(filters = {}) {
        try {
            const searchParams = new URLSearchParams(filters);
            const response = await this.api.get(`personnel?${searchParams}`);
            return await response.json();
        } catch (error) {
            this.handleError(error, 'Personel listesi yüklenirken hata oluştu.');
        }
    }

    /**
     * Delete personnel record
     * @param {string|number} id - Personnel ID
     * @returns {Promise<boolean>} Success status
     */
    async deletePersonnel(id) {
        try {
            await this.api.delete(`personnel/${id}`);
            
            if (window.toastr) {
                toastr.success('Personel kaydı başarıyla silindi.');
            }
            
            return true;
        } catch (error) {
            this.handleError(error, 'Personel kaydı silinirken hata oluştu.');
        }
    }

    /**
     * Upload file
     * @param {File} file - File to upload
     * @param {string} type - File type (photo, document, etc.)
     * @returns {Promise<Object>} Upload result with file URL
     */
    async uploadFile(file, type = 'document') {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            
            const response = await this.api.post('upload', {
                body: formData
            });
            
            return await response.json();
        } catch (error) {
            this.handleError(error, 'Dosya yüklenirken hata oluştu.');
        }
    }

    /**
     * Get dropdown options for select fields
     * @param {string} type - Option type (departments, positions, etc.)
     * @returns {Promise<Array>} Array of options
     */
    async getOptions(type) {
        try {
            const response = await this.api.get(`options/${type}`);
            return await response.json();
        } catch (error) {
            console.warn(`Options for ${type} could not be loaded:`, error);
            return [];
        }
    }

    /**
     * Prepare form data for submission
     * Handles both regular form data and file uploads
     * @param {Object} data - Form data object
     * @returns {FormData|string} Prepared data for submission
     */
    prepareFormData(data) {
        const hasFiles = this.hasFileInputs(data);
        
        if (hasFiles) {
            const formData = new FormData();
            
            Object.keys(data).forEach(key => {
                const value = data[key];
                
                if (value instanceof FileList) {
                    // Handle multiple files
                    Array.from(value).forEach(file => {
                        formData.append(`${key}[]`, file);
                    });
                } else if (value instanceof File) {
                    // Handle single file
                    formData.append(key, value);
                } else if (Array.isArray(value)) {
                    // Handle arrays (repeatable groups)
                    formData.append(key, JSON.stringify(value));
                } else if (typeof value === 'object' && value !== null) {
                    // Handle objects
                    formData.append(key, JSON.stringify(value));
                } else if (value !== null && value !== undefined && value !== '') {
                    // Handle primitive values
                    formData.append(key, value);
                }
            });
            
            return formData;
        } else {
            // Return JSON string for non-file data
            return JSON.stringify(data);
        }
    }

    /**
     * Check if data contains file inputs
     * @param {Object} data - Data object to check
     * @returns {boolean} True if data contains files
     */
    hasFileInputs(data) {
        return Object.values(data).some(value => 
            value instanceof File || 
            value instanceof FileList ||
            (Array.isArray(value) && value.some(item => item instanceof File))
        );
    }

    /**
     * Validate response data
     * @param {Object} response - API response
     * @returns {boolean} True if response is valid
     */
    validateResponse(response) {
        return response && typeof response === 'object' && !response.error;
    }

    /**
     * Get health check status
     * @returns {Promise<Object>} Health status
     */
    async healthCheck() {
        try {
            const response = await this.api.get('health');
            return await response.json();
        } catch (error) {
            console.warn('Health check failed:', error);
            return { status: 'error', message: error.message };
        }
    }
}

// Create global instance
window.apiClient = new ApiClient();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiClient;
}
