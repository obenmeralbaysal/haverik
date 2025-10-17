/**
 * Main Application
 * Component tabanlı İK Sistemi ana uygulama dosyası
 */
class App {
    constructor() {
        this.layout = null;
        this.init();
    }
    
    init() {
        // DOM yüklendiğinde uygulamayı başlat
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }
    
    start() {
        console.log('🚀 İK Sistemi başlatılıyor...');
        
        // Layout component'ini oluştur
        this.layout = new Layout('#app');
        this.layout.render();
        
        // Router'ı yapılandır
        this.setupRouter();
        
        // Global event listener'ları ekle
        this.setupGlobalEvents();
        
        console.log('✅ İK Sistemi başarıyla başlatıldı');
        
        // Başlangıç bildirimi
        toastr.success('İK Sistemi başarıyla yüklendi', 'Hoş Geldiniz!');
    }
    
    setupRouter() {
        // Route'ları tanımla
        router
            .route('/personnel-list', PersonnelList, {
                title: 'Personel Listesi',
                subtitle: 'Tüm personelleri görüntüleyin ve yönetin'
            })
            .route('/personnel-form', PersonnelForm, {
                title: 'Personel Ekle',
                subtitle: 'Yeni personel bilgilerini ekleyin'
            })
            .route('/reports', Reports, {
                title: 'Raporlar',
                subtitle: 'İstatistikler ve analizler'
            })
            .route('/settings', Settings, {
                title: 'Ayarlar',
                subtitle: 'Sistem ayarlarını yapılandırın'
            });
        
        // Router'ı başlat
        router.init('#app-content');
    }
    
    setupGlobalEvents() {
        // Klavye kısayolları
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: Arama
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.focusSearch();
            }
            
            // Escape: Modal'ları kapat
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
        
        // Sayfa yenileme uyarısı (form doluysa)
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = 'Kaydedilmemiş değişiklikler var. Sayfayı kapatmak istediğinizden emin misiniz?';
            }
        });
        
        // Çevrimdışı/çevrimiçi durumu
        window.addEventListener('online', () => {
            toastr.success('İnternet bağlantısı yeniden kuruldu', 'Çevrimiçi');
        });
        
        window.addEventListener('offline', () => {
            toastr.warning('İnternet bağlantısı kesildi', 'Çevrimdışı');
        });
    }
    
    focusSearch() {
        const searchInput = document.querySelector('#search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    closeModals() {
        // Bootstrap modal'larını kapat
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        });
    }
    
    hasUnsavedChanges() {
        // Form değişikliklerini kontrol et
        const forms = document.querySelectorAll('form');
        for (let form of forms) {
            if (form.classList.contains('dirty')) {
                return true;
            }
        }
        return false;
    }
    
    // Utility metodları
    static showLoading(message = 'Yükleniyor...') {
        toastr.info(message);
    }
    
    static hideLoading() {
        toastr.clear();
    }
    
    static showError(message, title = 'Hata') {
        toastr.error(message, title);
    }
    
    static showSuccess(message, title = 'Başarılı') {
        toastr.success(message, title);
    }
    
    static showWarning(message, title = 'Uyarı') {
        toastr.warning(message, title);
    }
}

// Toastr yapılandırması
toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '5000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut'
};

// Uygulamayı başlat
const app = new App();

// Global erişim için
window.app = app;
