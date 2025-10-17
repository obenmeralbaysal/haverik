/**
 * Simple Router Class
 * Component tabanlı sayfa geçişleri için
 */
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.currentComponent = null;
        this.container = null;
        
        // Browser history API desteği
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname, false);
        });
    }
    
    /**
     * Router'ı başlat
     */
    init(container) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        
        // Başlangıç route'unu çalıştır
        const currentPath = window.location.pathname === '/' ? '/personnel-list' : window.location.pathname;
        this.navigate(currentPath, false);
        
        return this;
    }
    
    /**
     * Route tanımla
     */
    route(path, componentClass, options = {}) {
        this.routes[path] = {
            component: componentClass,
            title: options.title || 'İK Sistemi',
            subtitle: options.subtitle || ''
        };
        return this;
    }
    
    /**
     * Sayfa geçişi yap
     */
    navigate(path, pushState = true) {
        const route = this.routes[path];
        
        if (!route) {
            console.warn(`Route not found: ${path}`);
            return;
        }
        
        // Mevcut component'i yok et
        if (this.currentComponent) {
            this.currentComponent.destroy();
        }
        
        // URL parametrelerini parse et
        const urlParams = new URLSearchParams(window.location.search);
        const routeOptions = {};
        
        // ID parametresi varsa ekle
        if (urlParams.get('id')) {
            routeOptions.personnelId = urlParams.get('id');
        }
        
        // Yeni component'i oluştur ve render et
        this.currentComponent = new route.component(this.container, routeOptions);
        this.currentComponent.render();
        this.currentRoute = path;
        
        // Browser history'yi güncelle
        if (pushState) {
            window.history.pushState({ path }, route.title, path);
        }
        
        // Sayfa başlığını güncelle
        this.updatePageTitle(route.title, route.subtitle);
        
        // Sidebar active state'ini güncelle
        this.updateSidebarActiveState(path);
        
        return this;
    }
    
    /**
     * Sayfa başlığını güncelle
     */
    updatePageTitle(title, subtitle) {
        const titleElement = document.getElementById('page-title');
        const subtitleElement = document.getElementById('page-subtitle');
        
        if (titleElement) titleElement.textContent = title;
        if (subtitleElement) subtitleElement.textContent = subtitle;
        
        document.title = title + ' - İK Sistemi';
    }
    
    /**
     * Sidebar active state'ini güncelle
     */
    updateSidebarActiveState(path) {
        // Tüm nav link'lerin active class'ını kaldır
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // İlgili link'i active yap
        const activeLink = document.querySelector(`[data-route="${path}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    /**
     * Mevcut route'u döndür
     */
    getCurrentRoute() {
        return this.currentRoute;
    }
    
    /**
     * Geri git
     */
    back() {
        window.history.back();
    }
    
    /**
     * İleri git
     */
    forward() {
        window.history.forward();
    }
}

// Global router instance
window.router = new Router();
