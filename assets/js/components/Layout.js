/**
 * Layout Component
 * Sidebar, topbar ve ana içerik alanını yöneten component
 */
class Layout extends Component {
    constructor(element, props = {}) {
        super(element, props);
        this.state = {
            sidebarCollapsed: false,
            currentUser: 'Admin User'
        };
    }
    
    template() {
        return `
            <!-- Sidebar -->
            <div class="sidebar" id="sidebar">
                <div class="sidebar-header">
                        <div class="logo d-flex align-items-center justify-content-center">
                        <img src="https://kontrol.haver.com.tr/assets/images/haver-logo.png" 
                             alt="Haver İK" 
                             style="height: 40px; width: auto;"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div style="display: none;">
                            <div class="bg-primary text-white rounded d-flex align-items-center justify-content-center" 
                                 style="width: 40px; height: 40px; font-weight: 600;">H</div>
                        </div>
                    </div>
                </div>
                
                <nav class="sidebar-nav">
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link active" href="#" data-route="/personnel-list">
                                <i class="bi bi-people me-2"></i>
                                Personel Listesi
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-route="/personnel-form">
                                <i class="bi bi-person-plus me-2"></i>
                                Personel Ekle
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-route="/reports">
                                <i class="bi bi-graph-up me-2"></i>
                                Raporlar
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-route="/settings">
                                <i class="bi bi-gear me-2"></i>
                                Ayarlar
                            </a>
                        </li>
                    </ul>
                </nav>
                
                <!-- Company Selector -->
                <div class="sidebar-footer">
                    <div class="company-selector">
                        <label class="form-label text-muted small mb-2">Şirket Seçimi</label>
                        <select class="form-select form-select-sm" id="company-selector">
                            <option value="haver-main">Haver Beykoz</option>
                            <option value="haver-tech">Haver Trakya</option>
                            <option value="haver-consulting">Haver Ar-Ge</option>
                        </select>
                        <small class="text-muted mt-1 d-block">
                            <i class="bi bi-building me-1"></i>
                            <span id="selected-company-name">Haver Beykoz</span>
                        </small>
                    </div>
                </div>
            </div>

            <!-- Topbar -->
            <div class="topbar">
                <div class="d-flex align-items-center justify-content-between w-100">
                    <div class="d-flex align-items-center">
                        <button class="btn btn-link text-dark p-0 me-3" id="sidebar-toggle">
                            <i class="bi bi-list fs-4"></i>
                        </button>
                        <div>
                            <h4 class="mb-0" id="page-title">Personel Listesi</h4>
                            <small class="text-muted" id="page-subtitle">Tüm personelleri görüntüleyin ve yönetin</small>
                        </div>
                    </div>
                    
                    <div class="d-flex align-items-center gap-3">
                        <div class="dropdown">
                            <button class="btn btn-link text-dark p-0" type="button" data-bs-toggle="dropdown">
                                <i class="bi bi-bell fs-5"></i>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.6em;">
                                    3
                                </span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><h6 class="dropdown-header">Bildirimler</h6></li>
                                <li><a class="dropdown-item" href="#">Yeni personel başvurusu</a></li>
                                <li><a class="dropdown-item" href="#">İzin talebi onayı bekliyor</a></li>
                                <li><a class="dropdown-item" href="#">Bordro hazırlandı</a></li>
                            </ul>
                        </div>
                        
                        <div class="dropdown">
                            <button class="btn btn-link text-dark p-0 d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                                <div class="avatar bg-primary text-white me-2">
                                    <i class="bi bi-person"></i>
                                </div>
                                <span>${this.state.currentUser}</span>
                                <i class="bi bi-chevron-down ms-1"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Profil</a></li>
                                <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Ayarlar</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="#"><i class="bi bi-box-arrow-right me-2"></i>Çıkış</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="main-content">
                <div id="app-content">
                    <!-- Component'ler buraya render edilecek -->
                </div>
            </div>
        `;
    }
    
    afterRender() {
        super.afterRender();
        
        // Router'ı content area'ya bağla
        if (window.router) {
            window.router.init('#app-content');
        }
        
        // Load saved company selection
        this.loadSavedCompany();
    }
    
    loadSavedCompany() {
        const savedCompany = localStorage.getItem('selectedCompany') || 'haver-main';
        const companySelector = this.$('#company-selector');
        
        if (companySelector) {
            companySelector.value = savedCompany;
            // Trigger change event to update display
            this.handleCompanyChange(savedCompany);
        }
    }
    
    toggleSidebar() {
        this.setState({ 
            sidebarCollapsed: !this.state.sidebarCollapsed 
        });
        const sidebar = this.$('#sidebar');
        sidebar.classList.toggle('collapsed');
    }
    
    handleCompanyChange(companyId) {
        const companyNames = {
            'haver-main': 'Haver Beykoz',
            'haver-tech': 'Haver Trakya',
            'haver-consulting': 'Haver Ar-Ge'
        };
        
        // Update selected company name display
        const selectedCompanyName = this.$('#selected-company-name');
        if (selectedCompanyName) {
            selectedCompanyName.textContent = companyNames[companyId] || 'Bilinmeyen Şirket';
        }
        
        // Store selected company in localStorage
        localStorage.setItem('selectedCompany', companyId);
        
        // Show notification
        if (window.toastr) {
            toastr.success(`${companyNames[companyId]} seçildi`);
        }
        
        // Trigger company change event for other components
        window.dispatchEvent(new CustomEvent('companyChanged', {
            detail: { companyId, companyName: companyNames[companyId] }
        }));
    }
    
    bindEvents() {
        // Sidebar toggle
        const sidebarToggle = this.$('#sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }
        
        // Company selector
        const companySelector = this.$('#company-selector');
        if (companySelector) {
            companySelector.addEventListener('change', (e) => {
                this.handleCompanyChange(e.target.value);
            });
        }
        
        // Navigation links
        this.$$('[data-route]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                if (window.router) {
                    window.router.navigate(route);
                }
            });
        });
    }
}

window.Layout = Layout;
