/**
 * Settings Component
 * Sistem ayarları sayfası
 */
class Settings extends Component {
    constructor(element, props = {}) {
        super(element, props);
        this.state = {
            settings: {
                companyName: 'ABC Teknoloji A.Ş.',
                companyCode: 'ABC001',
                taxNumber: '1234567890',
                taxOffice: 'Kadıköy Vergi Dairesi',
                workingHours: 8,
                annualLeave: 14
            },
            saving: false
        };
    }
    
    template() {
        return `
            <div class="row">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Sistem Ayarları</h5>
                        </div>
                        <div class="card-body">
                            <form id="settings-form">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="company_name" class="form-label">Şirket Adı</label>
                                        <input type="text" class="form-control" id="company_name" 
                                               name="companyName" value="${this.state.settings.companyName}">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="company_code" class="form-label">Şirket Kodu</label>
                                        <input type="text" class="form-control" id="company_code" 
                                               name="companyCode" value="${this.state.settings.companyCode}">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="tax_number" class="form-label">Vergi Numarası</label>
                                        <input type="text" class="form-control" id="tax_number" 
                                               name="taxNumber" value="${this.state.settings.taxNumber}">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="tax_office" class="form-label">Vergi Dairesi</label>
                                        <input type="text" class="form-control" id="tax_office" 
                                               name="taxOffice" value="${this.state.settings.taxOffice}">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="working_hours" class="form-label">Günlük Çalışma Saati</label>
                                        <input type="number" class="form-control" id="working_hours" 
                                               name="workingHours" value="${this.state.settings.workingHours}">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="annual_leave" class="form-label">Yıllık İzin Günü</label>
                                        <input type="number" class="form-control" id="annual_leave" 
                                               name="annualLeave" value="${this.state.settings.annualLeave}">
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <button type="submit" class="btn btn-primary" ${this.state.saving ? 'disabled' : ''}>
                                        ${this.state.saving ? `
                                            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Kaydediliyor...
                                        ` : `
                                            <i class="bi bi-check2 me-1"></i>
                                            Kaydet
                                        `}
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary ms-2">İptal</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Sistem Bilgileri</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <strong>Versiyon:</strong> v1.0.0
                            </div>
                            <div class="mb-3">
                                <strong>Son Güncelleme:</strong> 17.10.2024
                            </div>
                            <div class="mb-3">
                                <strong>Veritabanı:</strong> MySQL 8.0
                            </div>
                            <div class="mb-3">
                                <strong>Aktif Kullanıcılar:</strong> 12
                            </div>
                            <div class="mb-3">
                                <strong>Sistem Durumu:</strong> 
                                <span class="badge bg-success ms-1">Çevrimiçi</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card mt-4">
                        <div class="card-header">
                            <h5 class="mb-0">Yedekleme</h5>
                        </div>
                        <div class="card-body">
                            <p class="text-muted">Son yedekleme: 16.10.2024 23:00</p>
                            <button class="btn btn-outline-primary btn-sm" id="backup-btn">
                                <i class="bi bi-download me-1"></i>
                                Yedek Al
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // Form submit
        const form = this.$('#settings-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSave();
            });
        }
        
        // Yedekleme butonu
        const backupBtn = this.$('#backup-btn');
        if (backupBtn) {
            backupBtn.addEventListener('click', () => {
                toastr.info('Yedekleme işlemi başlatıldı...');
            });
        }
    }
    
    async handleSave() {
        this.setState({ saving: true });
        
        try {
            const form = this.$('#settings-form');
            const formData = new FormData(form);
            const settings = Object.fromEntries(formData.entries());
            
            // API çağrısı burada yapılacak
            // await apiClient.put('/settings', settings);
            
            this.setState({ settings, saving: false });
            toastr.success('Ayarlar başarıyla kaydedildi');
            
        } catch (error) {
            console.error('Ayarlar kaydedilirken hata:', error);
            toastr.error('Ayarlar kaydedilirken hata oluştu');
            this.setState({ saving: false });
        }
    }
}

window.Settings = Settings;
