/**
 * Personnel List Component
 * Personel listesini gösteren component
 */
class PersonnelList extends Component {
    constructor(element, props = {}) {
        super(element, props);
        this.state = {
            personnel: [
                {
                    id: 1,
                    sicilNo: 'P001',
                    adSoyad: 'Ahmet Yılmaz',
                    pozisyon: 'Yazılım Geliştirici',
                    bolum: 'IT',
                    iseGirisTarihi: '15.01.2023',
                    durum: 'Aktif'
                },
                {
                    id: 2,
                    sicilNo: 'P002',
                    adSoyad: 'Fatma Kaya',
                    pozisyon: 'İK Uzmanı',
                    bolum: 'İnsan Kaynakları',
                    iseGirisTarihi: '03.03.2023',
                    durum: 'Aktif'
                },
                {
                    id: 3,
                    sicilNo: 'P003',
                    adSoyad: 'Mehmet Demir',
                    pozisyon: 'Muhasebe Uzmanı',
                    bolum: 'Muhasebe',
                    iseGirisTarihi: '20.05.2023',
                    durum: 'İzinli'
                }
            ],
            loading: false,
            searchTerm: ''
        };
    }
    
    template() {
        const filteredPersonnel = this.getFilteredPersonnel();
        
        return `
            <div class="card shadow-sm">
                <div class="card-header bg-white border-bottom">
                    <div class="d-flex align-items-center justify-content-between">
                        <h5 class="mb-0">Personel Listesi</h5>
                        <div class="d-flex gap-2">
                            <div class="input-group" style="width: 300px;">
                                <span class="input-group-text">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input type="text" class="form-control" placeholder="Personel ara..." 
                                       value="${this.state.searchTerm}" id="search-input">
                            </div>
                            <button class="btn btn-primary" id="add-personnel-btn">
                                <i class="bi bi-person-plus me-1"></i>
                                Yeni Personel Ekle
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    ${this.state.loading ? this.renderLoading() : this.renderTable(filteredPersonnel)}
                </div>
            </div>
        `;
    }
    
    renderLoading() {
        return `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Yükleniyor...</span>
                </div>
                <p class="mt-2 text-muted">Personel listesi yükleniyor...</p>
            </div>
        `;
    }
    
    renderTable(personnel) {
        if (personnel.length === 0) {
            return `
                <div class="text-center py-5">
                    <i class="bi bi-people fs-1 text-muted"></i>
                    <h5 class="mt-3 text-muted">Personel bulunamadı</h5>
                    <p class="text-muted">Arama kriterlerinizi değiştirin veya yeni personel ekleyin.</p>
                </div>
            `;
        }
        
        return `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Sicil No</th>
                            <th>Ad Soyad</th>
                            <th>Pozisyon</th>
                            <th>Bölüm</th>
                            <th>İşe Giriş</th>
                            <th>Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${personnel.map(person => this.renderPersonRow(person)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    renderPersonRow(person) {
        const statusBadge = person.durum === 'Aktif' ? 'bg-success' : 
                           person.durum === 'İzinli' ? 'bg-warning' : 'bg-danger';
        
        return `
            <tr>
                <td>${person.sicilNo}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar bg-light me-2">
                            <i class="bi bi-person"></i>
                        </div>
                        ${person.adSoyad}
                    </div>
                </td>
                <td>${person.pozisyon}</td>
                <td>${person.bolum}</td>
                <td>${person.iseGirisTarihi}</td>
                <td>
                    <span class="badge ${statusBadge}">${person.durum}</span>
                </td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                                type="button" data-bs-toggle="dropdown">
                            İşlemler
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                                <a class="dropdown-item" href="#" data-action="view" data-id="${person.id}">
                                    <i class="bi bi-eye me-2"></i>Görüntüle
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#" data-action="edit" data-id="${person.id}">
                                    <i class="bi bi-pencil me-2"></i>Düzenle
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#" data-action="permissions" data-id="${person.id}">
                                    <i class="bi bi-calendar me-2"></i>İzinler
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#" data-action="payroll" data-id="${person.id}">
                                    <i class="bi bi-receipt me-2"></i>Bordro
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#" data-action="timesheet" data-id="${person.id}">
                                    <i class="bi bi-clock me-2"></i>Puantaj
                                </a>
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>
        `;
    }
    
    bindEvents() {
        // Arama
        const searchInput = this.$('#search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.setState({ searchTerm: e.target.value });
            });
        }
        
        // Yeni personel ekleme
        const addBtn = this.$('#add-personnel-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                if (window.router) {
                    window.router.navigate('/personnel-form');
                }
            });
        }
        
        // İşlem butonları
        this.$$('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.getAttribute('data-action');
                const id = btn.getAttribute('data-id');
                this.handleAction(action, id);
            });
        });
    }
    
    getFilteredPersonnel() {
        if (!this.state.searchTerm) {
            return this.state.personnel;
        }
        
        const term = this.state.searchTerm.toLowerCase();
        return this.state.personnel.filter(person => 
            person.adSoyad.toLowerCase().includes(term) ||
            person.sicilNo.toLowerCase().includes(term) ||
            person.pozisyon.toLowerCase().includes(term) ||
            person.bolum.toLowerCase().includes(term)
        );
    }
    
    handleAction(action, id) {
        const person = this.state.personnel.find(p => p.id == id);
        
        switch (action) {
            case 'view':
                this.viewPerson(person);
                break;
            case 'edit':
                this.editPerson(person);
                break;
            case 'permissions':
                this.managePermissions(person);
                break;
            case 'payroll':
                this.showPayroll(person);
                break;
            case 'timesheet':
                this.showTimesheet(person);
                break;
        }
    }
    
    viewPerson(person) {
        toastr.info(`${person.adSoyad} detayları görüntüleniyor...`);
    }
    
    editPerson(person) {
        if (window.router) {
            window.router.navigate(`/personnel-form?id=${person.id}`);
        }
    }
    
    managePermissions(person) {
        toastr.info(`${person.adSoyad} izin yönetimi açılıyor...`);
    }
    
    showPayroll(person) {
        toastr.info(`${person.adSoyad} bordro bilgileri gösteriliyor...`);
    }
    
    showTimesheet(person) {
        toastr.info(`${person.adSoyad} puantaj bilgileri gösteriliyor...`);
    }
    
    // API entegrasyonu için hazır metodlar
    async loadPersonnel() {
        this.setState({ loading: true });
        
        try {
            // API çağrısı burada yapılacak
            // const personnel = await apiClient.get('/personnel');
            // this.setState({ personnel, loading: false });
            
            // Şimdilik mock data kullanıyoruz
            setTimeout(() => {
                this.setState({ loading: false });
            }, 1000);
        } catch (error) {
            console.error('Personel listesi yüklenirken hata:', error);
            toastr.error('Personel listesi yüklenirken hata oluştu');
            this.setState({ loading: false });
        }
    }
}

window.PersonnelList = PersonnelList;
