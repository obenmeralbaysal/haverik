/**
 * Simple API Client for Personnel Management
 * Uses native fetch API for HTTP requests
 */

class ApiClient {
    constructor() {
        // Get base URL from environment or use default
        this.baseUrl = window.API_BASE_URL || '/api';
        
        // Default headers
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }
    
    /**
     * Make HTTP request using fetch
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const config = {
            headers: { ...this.defaultHeaders, ...options.headers },
            ...options
        };
        
        // Add body for POST/PUT requests
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }
        
        try {
            const response = await fetch(url, config);
            
            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            return data;
            
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }
    
    /**
     * GET request
     */
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        
        return this.request(url, {
            method: 'GET'
        });
    }
    
    /**
     * POST request
     */
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: data
        });
    }
    
    /**
     * PUT request
     */
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data
        });
    }
    
    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
    
    /**
     * PATCH request
     */
    async patch(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: data
        });
    }
    
    // Personnel specific methods
    
    /**
     * Get all personnel
     */
    async getPersonnel(params = {}) {
        return this.get('/personnel', params);
    }
    
    /**
     * Get personnel by ID
     */
    async getPersonnelById(id) {
        return this.get(`/personnel/${id}`);
    }
    
    /**
     * Create new personnel
     */
    async createPersonnel(data) {
        return this.post('/personnel', data);
    }
    
    /**
     * Update personnel
     */
    async updatePersonnel(id, data) {
        return this.put(`/personnel/${id}`, data);
    }
    
    /**
     * Delete personnel
     */
    async deletePersonnel(id) {
        return this.delete(`/personnel/${id}`);
    }
    
    /**
     * Search personnel
     */
    async searchPersonnel(query, filters = {}) {
        return this.get('/personnel/search', { q: query, ...filters });
    }
    
    /**
     * Get personnel statistics
     */
    async getPersonnelStats() {
        return this.get('/personnel/stats');
    }
    
    /**
     * Upload file
     */
    async uploadFile(file, endpoint = '/upload') {
        const formData = new FormData();
        formData.append('file', file);
        
        return this.request(endpoint, {
            method: 'POST',
            body: formData,
            headers: {} // Let browser set Content-Type for FormData
        });
    }
    
    /**
     * Bulk operations
     */
    async bulkOperation(operation, ids, data = {}) {
        return this.post('/personnel/bulk', {
            operation,
            ids,
            data
        });
    }
}

// Create global instance
const apiClient = new ApiClient();

// Make it globally available
window.apiClient = apiClient;
