/**
 * Base Component Class
 * Modern component tabanlı yapı için temel sınıf
 */
class Component {
    constructor(element, props = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        this.props = props;
        this.state = {};
        this.children = [];
        
        if (this.element) {
            this.element._component = this;
        }
    }
    
    /**
     * Component'i render et
     */
    render() {
        if (this.element) {
            this.element.innerHTML = this.template();
            this.afterRender();
        }
        return this;
    }
    
    /**
     * Template HTML'i döndür (override edilmeli)
     */
    template() {
        return '';
    }
    
    /**
     * Render sonrası çalışacak kod (event listeners vs.)
     */
    afterRender() {
        this.bindEvents();
    }
    
    /**
     * Event listener'ları bağla
     */
    bindEvents() {
        // Override edilebilir
    }
    
    /**
     * State güncelle ve re-render et
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }
    
    /**
     * Props güncelle
     */
    setProps(newProps) {
        this.props = { ...this.props, ...newProps };
        this.render();
    }
    
    /**
     * Component'i yok et
     */
    destroy() {
        if (this.element) {
            this.element.innerHTML = '';
            this.element._component = null;
        }
        this.children.forEach(child => child.destroy());
        this.children = [];
    }
    
    /**
     * Child component ekle
     */
    addChild(component) {
        this.children.push(component);
        return component;
    }
    
    /**
     * Element içinde selector ile arama
     */
    $(selector) {
        return this.element ? this.element.querySelector(selector) : null;
    }
    
    /**
     * Element içinde selector ile çoklu arama
     */
    $$(selector) {
        return this.element ? this.element.querySelectorAll(selector) : [];
    }
}

// Global olarak kullanılabilir hale getir
window.Component = Component;
