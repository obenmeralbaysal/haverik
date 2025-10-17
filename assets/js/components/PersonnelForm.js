class PersonnelForm extends Component {
    constructor(container, options = {}) {
        super(container);
        this.state = {
            currentTab: 0,
            loading: false,
            saving: false,
            isEditMode: !!options.personnelId,
            personnelId: options.personnelId || null,
            formData: {},
            emergencyContacts: [],
            tabs: [
                { id: 'identity', name: 'Kimlik ve İletişim', icon: 'bi-person' },
                { id: 'legal', name: 'Yasal ve Uyumluluk', icon: 'bi-shield-check' },
                { id: 'education', name: 'Eğitim ve Yeterlilik', icon: 'bi-mortarboard' },
                { id: 'hiring', name: 'İşe Alım ve Sözleşmeler', icon: 'bi-file-earmark-text' },
                { id: 'financial', name: 'SGK, Vergi ve Banka', icon: 'bi-bank' },
                { id: 'salary', name: 'Ücret ve Yan Haklar', icon: 'bi-cash-coin' },
                { id: 'schedule', name: 'Çalışma Süreleri ve İzinler', icon: 'bi-calendar-week' },
                { id: 'performance', name: 'Performans, Gelişim ve Disiplin', icon: 'bi-graph-up' },
                { id: 'health', name: 'İSG ve Sağlık', icon: 'bi-heart-pulse' },
                { id: 'assets', name: 'Varlık ve Erişim Yönetimi', icon: 'bi-laptop' },
                { id: 'documents', name: 'Belge ve Süreç Yönetimi', icon: 'bi-folder' },
                { id: 'department', name: 'Departman Görev', icon: 'bi-building' }
            ]
        };
        
        // Edit mode ise veriyi yükle
        if (this.state.isEditMode) {
            this.loadPersonnelData();
        }
        
        // Otomatik personel sicil oluştur
        this.generatePersonnelSicil();
    }
    
    generatePersonnelSicil() {
        // Rastgele personel sicil oluştur (algoritma sonra verilecek)
        const prefix = 'HVR';
        const year = new Date().getFullYear().toString().slice(-2);
        const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        this.state.formData.personel_sicil = `${prefix}${year}${random}`;
    }
    
    template() {
        return `
            <div class="personnel-form-container">
                <div class="card">
                    <div class="card-header bg-white border-bottom">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h4 class="mb-1">${this.state.isEditMode ? 'Personel Düzenle' : 'Yeni Personel Ekle'}</h4>
                            </div>
                        </div>
                    </div>
                    <div class="card-body pe-0 pt-0">
                        <div class="form-container d-flex">
                            <div class="form-tabs-sidebar">
                                <nav class="form-tabs-nav">
                                    ${this.renderTabs()}
                                </nav>
                                <div class="tab-navigation-buttons">
                                    <button type="button" class="btn btn-outline-secondary btn-sm" id="prev-tab-btn" 
                                            ${this.state.currentTab === 0 ? 'disabled' : ''}>
                                        <i class="bi bi-chevron-left"></i> Önceki
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary btn-sm" id="next-tab-btn"
                                            ${this.state.currentTab === this.state.tabs.length - 1 ? 'disabled' : ''}>
                                        Sonraki <i class="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="form-content-area">
                                <form id="personnel-form" class="mt-3 me-3" novalidate>
                                    ${this.renderCurrentTab()}
                                </form>
                                
                                <div class="form-actions mt-4 pt-3 border-top">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="form-progress">
                                            <small class="text-muted">
                                                Sekme ${this.state.currentTab + 1} / ${this.state.tabs.length}
                                            </small>
                                        </div>
                                        <div class="d-flex gap-2">
                                            <button type="button" class="btn btn-outline-secondary" id="cancel-btn">
                                                İptal
                                            </button>
                                            <button type="submit" class="btn btn-primary" id="save-btn" 
                                                    ${!this.isFormValid() ? 'disabled' : ''}>
                                                <span class="spinner-border spinner-border-sm me-2 d-none" id="save-spinner"></span>
                                                ${this.state.isEditMode ? 'Güncelle' : 'Kaydet'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                <p class="mt-3 text-muted">Personel bilgileri yükleniyor...</p>
            </div>
        `;
    }
    
    renderTabs() {
        return this.state.tabs.map((tab, index) => {
            const isActive = index === this.state.currentTab;
            const isCompleted = this.isTabCompleted(index);
            
            return `
                <button class="form-tab-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
                        data-tab-index="${index}" 
                        type="button">
                    <i class="${tab.icon}"></i>
                    ${tab.name}
                </button>
            `;
        }).join('');
    }
    
    renderCurrentTab() {
        const currentTab = this.state.tabs[this.state.currentTab];
        
        switch (currentTab.id) {
            case 'identity':
                return this.renderIdentityTab();
            case 'legal':
                return this.renderLegalTab();
            case 'education':
                return this.renderEducationTab();
            case 'hiring':
                return this.renderHiringTab();
            case 'financial':
                return this.renderFinancialTab();
            case 'salary':
                return this.renderSalaryTab();
            case 'schedule':
                return this.renderScheduleTab();
            case 'performance':
                return this.renderPerformanceTab();
            case 'health':
                return this.renderHealthTab();
            case 'assets':
                return this.renderAssetsTab();
            case 'documents':
                return this.renderDocumentsTab();
            case 'department':
                return this.renderDepartmentTab();
            default:
                return this.renderComingSoonTab(currentTab.name);
        }
    }
    
    renderIdentityTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">Kimlik ve İletişim Bilgileri</h6>
                <div class="row g-3">
                    <div class="col-md-4">
                        <label for="personel_sicil" class="form-label">Personel Sicil *</label>
                        <input type="text" class="form-control" id="personel_sicil" name="personel_sicil" 
                               value="${this.state.formData.personel_sicil || ''}" 
                               pattern="^[A-Za-z0-9-_]{3,32}$" required readonly>
                        <div class="invalid-feedback">Personel sicil gereklidir</div>
                        <small class="text-muted">Otomatik oluşturulur</small>
                    </div>
                    <div class="col-md-4">
                        <label for="ad" class="form-label">Ad *</label>
                        <input type="text" class="form-control" id="ad" name="ad" required>
                        <div class="invalid-feedback">Ad gereklidir</div>
                    </div>
                    <div class="col-md-4">
                        <label for="soyad" class="form-label">Soyad *</label>
                        <input type="text" class="form-control" id="soyad" name="soyad" required>
                        <div class="invalid-feedback">Soyad gereklidir</div>
                    </div>
                    
                    <div class="col-md-4">
                        <label for="tc_kimlik_no" class="form-label">TC Kimlik No *</label>
                        <input type="text" class="form-control" id="tc_kimlik_no" name="tc_kimlik_no" 
                               pattern="^[0-9]{11}$" maxlength="11" required>
                        <div class="invalid-feedback">Geçerli bir TC kimlik numarası giriniz (11 hane)</div>
                    </div>
                    
                    <div class="col-md-4">
                        <label for="belge_turu" class="form-label">Belge Türü *</label>
                        <select class="form-select" id="belge_turu" name="belge_turu" required>
                            <option value="">Seçiniz</option>
                            <option value="nufus_cuzdani">Nüfus Cüzdanı</option>
                            <option value="pasaport">Pasaport</option>
                            <option value="ehliyet">Ehliyet</option>
                            <option value="kimlik_karti">Kimlik Kartı</option>
                        </select>
                        <div class="invalid-feedback">Belge türü seçiniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="belge_seri_no" class="form-label">Belge Seri No *</label>
                        <input type="text" class="form-control" id="belge_seri_no" name="belge_seri_no" required>
                        <div class="invalid-feedback">Belge seri numarası gereklidir</div>
                        <small class="text-muted" id="belge-help-text">Belge türünü seçin</small>
                    </div>
                    
                    <div class="col-md-6">
                        <label for="dogum_tarihi" class="form-label">Doğum Tarihi *</label>
                        <input type="date" class="form-control" id="dogum_tarihi" name="dogum_tarihi" required>
                        <div class="invalid-feedback">Doğum tarihi giriniz</div>
                    </div>
                    <div class="col-md-6">
                        <label for="dogum_yeri" class="form-label">Doğum Yeri *</label>
                        <input type="text" class="form-control" id="dogum_yeri" name="dogum_yeri" required>
                        <div class="invalid-feedback">Doğum yeri giriniz</div>
                    </div>
                    
                    <div class="col-md-4">
                        <label for="cinsiyet" class="form-label">Cinsiyet *</label>
                        <select class="form-select" id="cinsiyet" name="cinsiyet" required>
                            <option value="">Seçiniz</option>
                            <option value="Erkek">Erkek</option>
                            <option value="Kadın">Kadın</option>
                        </select>
                        <div class="invalid-feedback">Cinsiyet seçiniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="medeni_durum" class="form-label">Medeni Durum *</label>
                        <select class="form-select" id="medeni_durum" name="medeni_durum" required>
                            <option value="">Seçiniz</option>
                            <option value="Bekar">Bekar</option>
                            <option value="Evli">Evli</option>
                            <option value="Boşanmış">Boşanmış</option>
                            <option value="Dul">Dul</option>
                        </select>
                        <div class="invalid-feedback">Medeni durum seçiniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="uyruk" class="form-label">Uyruk *</label>
                        <select class="form-select" id="uyruk" name="uyruk" required>
                            <option value="">Seçiniz</option>
                            <option value="TR">Türkiye</option>
                            <option value="US">Amerika</option>
                            <option value="DE">Almanya</option>
                            <option value="FR">Fransa</option>
                            <option value="OTHER">Diğer</option>
                        </select>
                        <div class="invalid-feedback">Uyruk seçiniz</div>
                    </div>
                    
                    <div class="col-md-6">
                        <label for="telefon" class="form-label">Telefon *</label>
                        <input type="tel" class="form-control" id="telefon" name="telefon" 
                               pattern="^[0-9 +()-]{7,20}$" required>
                        <div class="invalid-feedback">Geçerli bir telefon numarası giriniz</div>
                    </div>
                    <div class="col-md-6">
                        <label for="email" class="form-label">E-posta *</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                        <div class="invalid-feedback">Geçerli bir e-posta adresi giriniz</div>
                    </div>
                    
                    <div class="col-12">
                        <label for="adres" class="form-label">Adres *</label>
                        <textarea class="form-control" id="adres" name="adres" rows="3" required></textarea>
                        <div class="invalid-feedback">Adres giriniz</div>
                    </div>
                    
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="mb-0">Acil Durum İletişim Kişileri</h6>
                            <button type="button" class="btn btn-outline-primary btn-sm" id="add-emergency-contact">
                                <i class="bi bi-person-plus me-1"></i>
                                Kişi Ekle
                            </button>
                        </div>
                        <div id="emergency-contacts-container">
                            ${this.renderEmergencyContacts()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderEmergencyContacts() {
        if (this.state.emergencyContacts.length === 0) {
            return `
                <div class="text-center py-3 text-muted">
                    <i class="bi bi-person-plus fs-4"></i>
                    <p class="mb-0 mt-2">Henüz acil durum kişisi eklenmemiş</p>
                    <small>Yukarıdaki "Kişi Ekle" butonunu kullanarak ekleyebilirsiniz</small>
                </div>
            `;
        }
        
        return this.state.emergencyContacts.map((contact, index) => `
            <div class="emergency-contact-item border rounded p-3 mb-3 bg-light">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <h6 class="mb-0">Acil Durum Kişisi ${index + 1}</h6>
                    <button type="button" class="btn btn-outline-danger btn-sm" 
                            onclick="window.personnelForm.removeEmergencyContact(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label for="emergency_name_${index}" class="form-label">Ad Soyad *</label>
                        <input type="text" class="form-control" id="emergency_name_${index}" 
                               name="emergency_contacts[${index}][name]" value="${contact.name || ''}" required>
                        <div class="invalid-feedback">Ad soyad gereklidir</div>
                    </div>
                    <div class="col-md-6">
                        <label for="emergency_relation_${index}" class="form-label">İlişki *</label>
                        <select class="form-select" id="emergency_relation_${index}" 
                                name="emergency_contacts[${index}][relation]" required>
                            <option value="">Seçiniz</option>
                            <option value="Anne" ${contact.relation === 'Anne' ? 'selected' : ''}>Anne</option>
                            <option value="Baba" ${contact.relation === 'Baba' ? 'selected' : ''}>Baba</option>
                            <option value="Eş" ${contact.relation === 'Eş' ? 'selected' : ''}>Eş</option>
                            <option value="Kardeş" ${contact.relation === 'Kardeş' ? 'selected' : ''}>Kardeş</option>
                            <option value="Çocuk" ${contact.relation === 'Çocuk' ? 'selected' : ''}>Çocuk</option>
                            <option value="Arkadaş" ${contact.relation === 'Arkadaş' ? 'selected' : ''}>Arkadaş</option>
                            <option value="Diğer" ${contact.relation === 'Diğer' ? 'selected' : ''}>Diğer</option>
                        </select>
                        <div class="invalid-feedback">İlişki seçiniz</div>
                    </div>
                    <div class="col-md-6">
                        <label for="emergency_phone_${index}" class="form-label">Telefon *</label>
                        <input type="tel" class="form-control" id="emergency_phone_${index}" 
                               name="emergency_contacts[${index}][phone]" value="${contact.phone || ''}"
                               pattern="^[0-9 +()-]{7,20}$" required>
                        <div class="invalid-feedback">Geçerli bir telefon numarası giriniz</div>
                    </div>
                    <div class="col-md-6">
                        <label for="emergency_email_${index}" class="form-label">E-posta</label>
                        <input type="email" class="form-control" id="emergency_email_${index}" 
                               name="emergency_contacts[${index}][email]" value="${contact.email || ''}">
                        <div class="invalid-feedback">Geçerli bir e-posta adresi giriniz</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    addEmergencyContact() {
        const newContact = {
            name: '',
            relation: '',
            phone: '',
            email: ''
        };
        
        this.setState({
            emergencyContacts: [...this.state.emergencyContacts, newContact]
        });
    }
    
    removeEmergencyContact(index) {
        const contacts = [...this.state.emergencyContacts];
        contacts.splice(index, 1);
        
        this.setState({
            emergencyContacts: contacts
        });
    }
    
    renderLegalTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">Yasal ve Uyumluluk Bilgileri</h6>
                <div class="row g-3">
                    <div class="col-md-4">
                        <label for="yaka_tipi" class="form-label">Yaka Tipi *</label>
                        <select class="form-select" id="yaka_tipi" name="yaka_tipi" required>
                            <option value="">Seçiniz</option>
                            <option value="Beyaz">Beyaz Yaka</option>
                            <option value="Mavi">Mavi Yaka</option>
                            <option value="Diğer">Diğer</option>
                        </select>
                        <div class="invalid-feedback">Yaka tipi seçiniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="uyruk" class="form-label">Uyruk *</label>
                        <select class="form-select" id="uyruk" name="uyruk" required>
                            <option value="">Seçiniz</option>
                            <option value="TR">Türkiye Cumhuriyeti</option>
                            <option value="US">Amerika Birleşik Devletleri</option>
                            <option value="DE">Almanya</option>
                            <option value="FR">Fransa</option>
                            <option value="GB">İngiltere</option>
                            <option value="OTHER">Diğer</option>
                        </select>
                        <div class="invalid-feedback">Uyruk seçiniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="calisma_izni" class="form-label">Çalışma İzni</label>
                        <select class="form-select" id="calisma_izni" name="calisma_izni">
                            <option value="">Seçiniz</option>
                            <option value="Gerekli Değil">Gerekli Değil</option>
                            <option value="Var">Var</option>
                            <option value="Başvuru Yapıldı">Başvuru Yapıldı</option>
                            <option value="Yok">Yok</option>
                        </select>
                    </div>
                    
                    <div class="col-md-6">
                        <label for="askerlik_durumu" class="form-label">Askerlik Durumu</label>
                        <select class="form-select" id="askerlik_durumu" name="askerlik_durumu">
                            <option value="">Seçiniz</option>
                            <option value="Yapıldı">Yapıldı</option>
                            <option value="Tecilli">Tecilli</option>
                            <option value="Muaf">Muaf</option>
                            <option value="Yapılmadı">Yapılmadı</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="sabika_kaydi" class="form-label">Sabıka Kaydı</label>
                        <select class="form-select" id="sabika_kaydi" name="sabika_kaydi">
                            <option value="">Seçiniz</option>
                            <option value="Temiz">Temiz</option>
                            <option value="Var">Var</option>
                            <option value="Kontrol Edilmedi">Kontrol Edilmedi</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderEducationTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">Eğitim ve Yeterlilik Bilgileri</h6>
                <div class="row g-3">
                    <div class="col-md-4">
                        <label for="egitim_durumu" class="form-label">Eğitim Durumu *</label>
                        <select class="form-select" id="egitim_durumu" name="egitim_durumu" required>
                            <option value="">Seçiniz</option>
                            <option value="İlkokul">İlkokul</option>
                            <option value="Ortaokul">Ortaokul</option>
                            <option value="Lise">Lise</option>
                            <option value="Ön Lisans">Ön Lisans</option>
                            <option value="Lisans">Lisans</option>
                            <option value="Yüksek Lisans">Yüksek Lisans</option>
                            <option value="Doktora">Doktora</option>
                        </select>
                        <div class="invalid-feedback">Eğitim durumu seçiniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="okul_adi" class="form-label">Okul/Üniversite Adı</label>
                        <input type="text" class="form-control" id="okul_adi" name="okul_adi">
                    </div>
                    <div class="col-md-4">
                        <label for="bolum" class="form-label">Bölüm/Alan</label>
                        <input type="text" class="form-control" id="bolum" name="bolum">
                    </div>
                    
                    <div class="col-md-4">
                        <label for="mezuniyet_yili" class="form-label">Mezuniyet Yılı</label>
                        <input type="number" class="form-control" id="mezuniyet_yili" name="mezuniyet_yili" 
                               min="1950" max="2030">
                    </div>
                    <div class="col-md-4">
                        <label for="not_ortalamasi" class="form-label">Not Ortalaması</label>
                        <input type="number" class="form-control" id="not_ortalamasi" name="not_ortalamasi" 
                               min="0" max="4" step="0.01">
                        <small class="text-muted">4.00 üzerinden</small>
                    </div>
                    <div class="col-md-4">
                        <label for="yabanci_dil" class="form-label">Yabancı Dil</label>
                        <select class="form-select" id="yabanci_dil" name="yabanci_dil">
                            <option value="">Seçiniz</option>
                            <option value="İngilizce">İngilizce</option>
                            <option value="Almanca">Almanca</option>
                            <option value="Fransızca">Fransızca</option>
                            <option value="İspanyolca">İspanyolca</option>
                            <option value="Rusça">Rusça</option>
                            <option value="Arapça">Arapça</option>
                            <option value="Diğer">Diğer</option>
                        </select>
                    </div>
                    
                    <div class="col-md-6">
                        <label for="dil_seviyesi" class="form-label">Dil Seviyesi</label>
                        <select class="form-select" id="dil_seviyesi" name="dil_seviyesi">
                            <option value="">Seçiniz</option>
                            <option value="Başlangıç">Başlangıç (A1-A2)</option>
                            <option value="Orta">Orta (B1-B2)</option>
                            <option value="İleri">İleri (C1-C2)</option>
                            <option value="Ana Dil">Ana Dil</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="sertifikalar" class="form-label">Sertifikalar</label>
                        <input type="text" class="form-control" id="sertifikalar" name="sertifikalar"
                               placeholder="TOEFL, IELTS, PMP vb.">
                    </div>
                    
                    <div class="col-12">
                        <label for="yetenekler" class="form-label">Yetenekler ve Beceriler</label>
                        <textarea class="form-control" id="yetenekler" name="yetenekler" rows="3"
                                  placeholder="Teknik beceriler, yazılım bilgisi, özel yetenekler..."></textarea>
                    </div>
                    
                    <div class="col-12">
                        <label for="deneyim" class="form-label">İş Deneyimi</label>
                        <textarea class="form-control" id="deneyim" name="deneyim" rows="4"
                                  placeholder="Önceki iş deneyimlerini kısaca açıklayın..."></textarea>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderHiringTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">İşe Alım ve Sözleşme Bilgileri</h6>
                <div class="row g-3">
                    <div class="col-md-4">
                        <label for="ise_baslama_tarihi" class="form-label">İşe Başlama Tarihi *</label>
                        <input type="date" class="form-control" id="ise_baslama_tarihi" name="ise_baslama_tarihi" required>
                        <div class="invalid-feedback">İşe başlama tarihi giriniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="pozisyon" class="form-label">Pozisyon *</label>
                        <input type="text" class="form-control" id="pozisyon" name="pozisyon" required>
                        <div class="invalid-feedback">Pozisyon giriniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="departman" class="form-label">Departman *</label>
                        <select class="form-select" id="departman" name="departman" required>
                            <option value="">Seçiniz</option>
                            <option value="İnsan Kaynakları">İnsan Kaynakları</option>
                            <option value="Bilgi İşlem">Bilgi İşlem</option>
                            <option value="Muhasebe">Muhasebe</option>
                            <option value="Satış">Satış</option>
                            <option value="Pazarlama">Pazarlama</option>
                            <option value="Üretim">Üretim</option>
                            <option value="Kalite Kontrol">Kalite Kontrol</option>
                            <option value="Ar-Ge">Ar-Ge</option>
                        </select>
                        <div class="invalid-feedback">Departman seçiniz</div>
                    </div>
                    
                    <div class="col-md-4">
                        <label for="sozlesme_turu" class="form-label">Sözleşme Türü *</label>
                        <select class="form-select" id="sozlesme_turu" name="sozlesme_turu" required>
                            <option value="">Seçiniz</option>
                            <option value="Belirsiz Süreli">Belirsiz Süreli</option>
                            <option value="Belirli Süreli">Belirli Süreli</option>
                            <option value="Staj">Staj</option>
                            <option value="Danışmanlık">Danışmanlık</option>
                        </select>
                        <div class="invalid-feedback">Sözleşme türü seçiniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="calisma_sekli" class="form-label">Çalışma Şekli *</label>
                        <select class="form-select" id="calisma_sekli" name="calisma_sekli" required>
                            <option value="">Seçiniz</option>
                            <option value="Tam Zamanlı">Tam Zamanlı</option>
                            <option value="Yarı Zamanlı">Yarı Zamanlı</option>
                            <option value="Uzaktan">Uzaktan</option>
                            <option value="Hibrit">Hibrit</option>
                        </select>
                        <div class="invalid-feedback">Çalışma şekli seçiniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="yonetici" class="form-label">Direkt Yönetici</label>
                        <input type="text" class="form-control" id="yonetici" name="yonetici">
                        <div class="invalid-feedback">Yönetici adı giriniz</div>
                    </div>
                    
                    <div class="col-md-6">
                        <label for="deneme_suresi" class="form-label">Deneme Süresi (Gün)</label>
                        <input type="number" class="form-control" id="deneme_suresi" name="deneme_suresi" min="0" max="365">
                        <small class="text-muted">Varsayılan: 60 gün</small>
                    </div>
                    <div class="col-md-6">
                        <label for="sozlesme_bitis_tarihi" class="form-label">Sözleşme Bitiş Tarihi</label>
                        <input type="date" class="form-control" id="sozlesme_bitis_tarihi" name="sozlesme_bitis_tarihi">
                        <small class="text-muted">Belirsiz süreli ise boş bırakın</small>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderFinancialTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">SGK, Vergi ve Banka Bilgileri</h6>
                <div class="row g-3">
                    <div class="col-md-4">
                        <label for="sgk_no" class="form-label">SGK Sicil No</label>
                        <input type="text" class="form-control" id="sgk_no" name="sgk_no">
                        <div class="invalid-feedback">SGK sicil numarası giriniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="vergi_no" class="form-label">Vergi Kimlik No</label>
                        <input type="text" class="form-control" id="vergi_no" name="vergi_no" pattern="^[0-9]{10}$" maxlength="10">
                        <div class="invalid-feedback">10 haneli vergi kimlik numarası giriniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="vergi_dairesi" class="form-label">Vergi Dairesi</label>
                        <input type="text" class="form-control" id="vergi_dairesi" name="vergi_dairesi">
                        <div class="invalid-feedback">Vergi dairesi giriniz</div>
                    </div>
                    
                    <div class="col-md-6">
                        <label for="iban" class="form-label">IBAN *</label>
                        <input type="text" class="form-control" id="iban" name="iban" 
                               pattern="^TR[0-9]{24}$" maxlength="26" required
                               placeholder="TR00 0000 0000 0000 0000 0000 00">
                        <div class="invalid-feedback">Geçerli bir IBAN giriniz (TR ile başlayan 26 karakter)</div>
                    </div>
                    <div class="col-md-6">
                        <label for="banka_adi" class="form-label">Banka Adı *</label>
                        <select class="form-select" id="banka_adi" name="banka_adi" required>
                            <option value="">Seçiniz</option>
                            <option value="Türkiye İş Bankası">Türkiye İş Bankası</option>
                            <option value="Garanti BBVA">Garanti BBVA</option>
                            <option value="Yapı Kredi">Yapı Kredi</option>
                            <option value="Akbank">Akbank</option>
                            <option value="Ziraat Bankası">Ziraat Bankası</option>
                            <option value="Halkbank">Halkbank</option>
                            <option value="VakıfBank">VakıfBank</option>
                            <option value="Denizbank">Denizbank</option>
                            <option value="QNB Finansbank">QNB Finansbank</option>
                            <option value="Diğer">Diğer</option>
                        </select>
                        <div class="invalid-feedback">Banka seçiniz</div>
                    </div>
                    
                    <div class="col-md-4">
                        <label for="sgk_baslangic" class="form-label">SGK Başlangıç Tarihi</label>
                        <input type="date" class="form-control" id="sgk_baslangic" name="sgk_baslangic">
                    </div>
                    <div class="col-md-4">
                        <label for="sgk_durumu" class="form-label">SGK Durumu</label>
                        <select class="form-select" id="sgk_durumu" name="sgk_durumu">
                            <option value="">Seçiniz</option>
                            <option value="Aktif">Aktif</option>
                            <option value="Pasif">Pasif</option>
                            <option value="Beklemede">Beklemede</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="gelir_vergisi_orani" class="form-label">Gelir Vergisi Oranı (%)</label>
                        <select class="form-select" id="gelir_vergisi_orani" name="gelir_vergisi_orani">
                            <option value="">Seçiniz</option>
                            <option value="15">%15</option>
                            <option value="20">%20</option>
                            <option value="27">%27</option>
                            <option value="35">%35</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderSalaryTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">Ücret ve Yan Haklar</h6>
                <div class="row g-3">
                    <div class="col-md-4">
                        <label for="brut_maas" class="form-label">Brüt Maaş (TL) *</label>
                        <input type="number" class="form-control" id="brut_maas" name="brut_maas" 
                               min="0" step="0.01" required>
                        <div class="invalid-feedback">Brüt maaş giriniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="maas_tipi" class="form-label">Maaş Tipi *</label>
                        <select class="form-select" id="maas_tipi" name="maas_tipi" required>
                            <option value="">Seçiniz</option>
                            <option value="Aylık">Aylık</option>
                            <option value="Saatlik">Saatlik</option>
                            <option value="Günlük">Günlük</option>
                            <option value="Proje Bazlı">Proje Bazlı</option>
                        </select>
                        <div class="invalid-feedback">Maaş tipi seçiniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="odeme_donemi" class="form-label">Ödeme Dönemi *</label>
                        <select class="form-select" id="odeme_donemi" name="odeme_donemi" required>
                            <option value="">Seçiniz</option>
                            <option value="Aylık">Aylık</option>
                            <option value="15 Günlük">15 Günlük</option>
                            <option value="Haftalık">Haftalık</option>
                        </select>
                        <div class="invalid-feedback">Ödeme dönemi seçiniz</div>
                    </div>
                    
                    <div class="col-12">
                        <h6 class="mt-3 mb-3">Yan Haklar</h6>
                    </div>
                    
                    <div class="col-md-4">
                        <label for="yemek_yardimi" class="form-label">Yemek Yardımı (TL)</label>
                        <input type="number" class="form-control" id="yemek_yardimi" name="yemek_yardimi" 
                               min="0" step="0.01">
                    </div>
                    <div class="col-md-4">
                        <label for="ulasim_yardimi" class="form-label">Ulaşım Yardımı (TL)</label>
                        <input type="number" class="form-control" id="ulasim_yardimi" name="ulasim_yardimi" 
                               min="0" step="0.01">
                    </div>
                    <div class="col-md-4">
                        <label for="cocuk_yardimi" class="form-label">Çocuk Yardımı (TL)</label>
                        <input type="number" class="form-control" id="cocuk_yardimi" name="cocuk_yardimi" 
                               min="0" step="0.01">
                    </div>
                    
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="saglik_sigortasi" name="saglik_sigortasi">
                            <label class="form-check-label" for="saglik_sigortasi">
                                Özel Sağlık Sigortası
                            </label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="hayat_sigortasi" name="hayat_sigortasi">
                            <label class="form-check-label" for="hayat_sigortasi">
                                Hayat Sigortası
                            </label>
                        </div>
                    </div>
                    
                    <div class="col-12">
                        <label for="diger_yan_haklar" class="form-label">Diğer Yan Haklar</label>
                        <textarea class="form-control" id="diger_yan_haklar" name="diger_yan_haklar" rows="3"
                                  placeholder="Diğer yan hakları detaylı olarak açıklayın..."></textarea>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderScheduleTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">Çalışma Süreleri ve İzinler</h6>
                <div class="row g-3">
                    <div class="col-12">
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            Puantaj takibi ve detaylar liste ekranından görüntülenebilir.
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="vardiya_plani_var" name="vardiya_plani_var">
                            <label class="form-check-label" for="vardiya_plani_var">
                                Vardiya Planı Var
                            </label>
                        </div>
                    </div>
                    <div class="col-md-6" id="vardiya_sablonu_group" style="display: none;">
                        <label for="vardiya_sablonu" class="form-label">Vardiya Şablonu</label>
                        <select class="form-select" id="vardiya_sablonu" name="vardiya_sablonu">
                            <option value="">Seçiniz</option>
                            <option value="08:00-17:00">08:00-17:00 (Gündüz)</option>
                            <option value="17:00-02:00">17:00-02:00 (Akşam)</option>
                            <option value="02:00-11:00">02:00-11:00 (Gece)</option>
                            <option value="Esnek">Esnek Çalışma</option>
                        </select>
                    </div>
                    
                    <div class="col-12">
                        <h6 class="mt-3 mb-3">İzin Hak Ediş Parametreleri</h6>
                    </div>
                    
                    <div class="col-md-4">
                        <label for="yillik_izin_gun" class="form-label">Yıllık İzin Günü</label>
                        <input type="number" class="form-control" id="yillik_izin_gun" name="yillik_izin_gun" 
                               min="0" max="365" value="14">
                        <small class="text-muted">Varsayılan: 14 gün</small>
                    </div>
                    <div class="col-md-8">
                        <label for="mazeret_izinleri" class="form-label">Mazeret İzinleri</label>
                        <textarea class="form-control" id="mazeret_izinleri" name="mazeret_izinleri" rows="2"
                                  placeholder="Doğum, ölüm, evlilik vb. mazeret izin tanımları..."></textarea>
                    </div>
                    
                    <div class="col-12">
                        <label for="diger_izin_tanimlari" class="form-label">Diğer İzin Tanımları</label>
                        <textarea class="form-control" id="diger_izin_tanimlari" name="diger_izin_tanimlari" rows="3"
                                  placeholder="Özel izin türleri, şartları ve süreleri..."></textarea>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderPerformanceTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">Performans, Gelişim ve Disiplin</h6>
                <div class="row g-3">
                    <div class="col-12">
                        <label for="hedef_seti" class="form-label">Hedef Seti</label>
                        <textarea class="form-control" id="hedef_seti" name="hedef_seti" rows="4"
                                  placeholder="Personelin yıllık/dönemlik hedefleri..."></textarea>
                    </div>
                    
                    <div class="col-12">
                        <h6 class="mt-3 mb-3">Performans Değerlendirmeleri</h6>
                        <div class="border rounded p-3 bg-light">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label for="performans_donem" class="form-label">Dönem</label>
                                    <select class="form-select" id="performans_donem" name="performans_donem">
                                        <option value="">Seçiniz</option>
                                        <option value="Q1-2024">Q1 2024</option>
                                        <option value="Q2-2024">Q2 2024</option>
                                        <option value="Q3-2024">Q3 2024</option>
                                        <option value="Q4-2024">Q4 2024</option>
                                        <option value="Yıllık-2024">Yıllık 2024</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label for="performans_puan" class="form-label">Performans Puanı</label>
                                    <input type="number" class="form-control" id="performans_puan" name="performans_puan" 
                                           min="0" max="100" step="1">
                                    <small class="text-muted">0-100 arası</small>
                                </div>
                                <div class="col-md-4">
                                    <label for="performans_form_dosyasi" class="form-label">Form Dosyası</label>
                                    <input type="file" class="form-control" id="performans_form_dosyasi" name="performans_form_dosyasi"
                                           accept=".pdf,.doc,.docx">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <label for="egitim_plani" class="form-label">Eğitim Planı</label>
                        <textarea class="form-control" id="egitim_plani" name="egitim_plani" rows="4"
                                  placeholder="Personelin eğitim ihtiyaçları ve planları..."></textarea>
                    </div>
                    <div class="col-md-6">
                        <label for="geribildirim_notlari" class="form-label">Geri Bildirim Notları</label>
                        <textarea class="form-control" id="geribildirim_notlari" name="geribildirim_notlari" rows="4"
                                  placeholder="Yönetici ve meslektaş geri bildirimleri..."></textarea>
                    </div>
                    
                    <div class="col-12">
                        <label for="egitim_sertifikalari" class="form-label">Eğitim Katılım Sertifikaları</label>
                        <input type="file" class="form-control" id="egitim_sertifikalari" name="egitim_sertifikalari"
                               accept=".pdf,.jpg,.jpeg,.png" multiple>
                        <small class="text-muted">Birden fazla dosya seçebilirsiniz</small>
                    </div>
                    
                    <div class="col-12">
                        <h6 class="mt-3 mb-3">Disiplin Kayıtları</h6>
                        <div class="form-check form-switch mb-3">
                            <input class="form-check-input" type="checkbox" id="disiplin_kaydi_var" name="disiplin_kaydi_var">
                            <label class="form-check-label" for="disiplin_kaydi_var">
                                Disiplin Kaydı Var
                            </label>
                        </div>
                        
                        <div id="disiplin_detay_group" style="display: none;">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label for="uyari_ihtar_dosyasi" class="form-label">Uyarı/İhtar Dosyası</label>
                                    <input type="file" class="form-control" id="uyari_ihtar_dosyasi" name="uyari_ihtar_dosyasi"
                                           accept=".pdf,.doc,.docx">
                                </div>
                                <div class="col-md-4">
                                    <label for="savunma_dosyasi" class="form-label">Savunma Dosyası</label>
                                    <input type="file" class="form-control" id="savunma_dosyasi" name="savunma_dosyasi"
                                           accept=".pdf,.doc,.docx">
                                </div>
                                <div class="col-md-4">
                                    <label for="kurul_karari" class="form-label">Kurul Kararı</label>
                                    <input type="file" class="form-control" id="kurul_karari" name="kurul_karari"
                                           accept=".pdf,.doc,.docx">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderHealthTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">İSG ve Sağlık</h6>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label for="ise_giris_saglik_raporu" class="form-label">İşe Giriş Sağlık Raporu *</label>
                        <input type="file" class="form-control" id="ise_giris_saglik_raporu" name="ise_giris_saglik_raporu"
                               accept=".pdf,.jpg,.jpeg,.png" required>
                        <div class="invalid-feedback">İşe giriş sağlık raporu zorunludur</div>
                        <small class="text-muted">Mevzuat gereği zorunlu</small>
                    </div>
                    <div class="col-md-6">
                        <label for="periyodik_muayene_raporlari" class="form-label">Periyodik Muayene Raporları</label>
                        <input type="file" class="form-control" id="periyodik_muayene_raporlari" name="periyodik_muayene_raporlari"
                               accept=".pdf,.jpg,.jpeg,.png" multiple>
                        <small class="text-muted">Birden fazla dosya seçebilirsiniz</small>
                    </div>
                    
                    <div class="col-12">
                        <label for="isg_egitim_kayitlari" class="form-label">İSG Eğitim Kayıtları *</label>
                        <input type="file" class="form-control" id="isg_egitim_kayitlari" name="isg_egitim_kayitlari"
                               accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple required>
                        <div class="invalid-feedback">İSG eğitim kayıtları zorunludur</div>
                        <small class="text-muted">Pozisyona göre gerekli eğitimler</small>
                    </div>
                    
                    <div class="col-12">
                        <h6 class="mt-3 mb-3">KKD (Kişisel Koruyucu Donanım) Zimmetleri</h6>
                        <div class="border rounded p-3 bg-light">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label for="kkd_adi" class="form-label">KKD Adı</label>
                                    <input type="text" class="form-control" id="kkd_adi" name="kkd_adi"
                                           placeholder="Baret, eldiven, gözlük vb.">
                                </div>
                                <div class="col-md-4">
                                    <label for="kkd_teslim_tarihi" class="form-label">Teslim Tarihi</label>
                                    <input type="date" class="form-control" id="kkd_teslim_tarihi" name="kkd_teslim_tarihi">
                                </div>
                                <div class="col-md-4">
                                    <label for="kkd_zimmet_formu" class="form-label">Zimmet Formu</label>
                                    <input type="file" class="form-control" id="kkd_zimmet_formu" name="kkd_zimmet_formu"
                                           accept=".pdf,.doc,.docx">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-12">
                        <label for="risk_bilgilendirme_dosyasi" class="form-label">Risk Bilgilendirme Dosyası</label>
                        <input type="file" class="form-control" id="risk_bilgilendirme_dosyasi" name="risk_bilgilendirme_dosyasi"
                               accept=".pdf,.doc,.docx">
                        <small class="text-muted">İş yerindeki riskler hakkında bilgilendirme</small>
                    </div>
                    
                    <div class="col-12">
                        <h6 class="mt-3 mb-3">İş Kazası ve Meslek Hastalığı</h6>
                        <div class="form-check form-switch mb-3">
                            <input class="form-check-input" type="checkbox" id="is_kazasi_meslek_hastaligi" name="is_kazasi_meslek_hastaligi">
                            <label class="form-check-label" for="is_kazasi_meslek_hastaligi">
                                İş Kazası/Meslek Hastalığı Kaydı Var
                            </label>
                        </div>
                        
                        <div id="kaza_kayit_group" style="display: none;">
                            <label for="olay_kayitlari" class="form-label">Olay Kayıtları</label>
                            <input type="file" class="form-control" id="olay_kayitlari" name="olay_kayitlari"
                                   accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple>
                            <small class="text-muted">Kaza raporları, tedavi kayıtları vb.</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderAssetsTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">Varlık ve Erişim Yönetimi</h6>
                <div class="row g-3">
                    <div class="col-12">
                        <h6 class="mb-3">Demirbaş Zimmetleri</h6>
                        <div class="border rounded p-3 bg-light mb-4">
                            <div class="row g-3">
                                <div class="col-md-3">
                                    <label for="varlik_tipi" class="form-label">Varlık Tipi</label>
                                    <select class="form-select" id="varlik_tipi" name="varlik_tipi">
                                        <option value="">Seçiniz</option>
                                        <option value="Dizüstü">Dizüstü Bilgisayar</option>
                                        <option value="Telefon">Telefon</option>
                                        <option value="Tablet">Tablet</option>
                                        <option value="Kart">Kart (Giriş/Yemek)</option>
                                        <option value="Anahtar">Anahtar</option>
                                        <option value="Araç">Araç</option>
                                        <option value="Ekipman">Diğer Ekipman</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label for="marka_model" class="form-label">Marka/Model</label>
                                    <input type="text" class="form-control" id="marka_model" name="marka_model"
                                           placeholder="Apple MacBook Pro vb.">
                                </div>
                                <div class="col-md-3">
                                    <label for="seri_no" class="form-label">Seri No</label>
                                    <input type="text" class="form-control" id="seri_no" name="seri_no">
                                </div>
                                <div class="col-md-3">
                                    <label for="teslim_tarihi" class="form-label">Teslim Tarihi</label>
                                    <input type="date" class="form-control" id="teslim_tarihi" name="teslim_tarihi">
                                </div>
                                <div class="col-md-6">
                                    <label for="iade_tarihi" class="form-label">İade Tarihi</label>
                                    <input type="date" class="form-control" id="iade_tarihi" name="iade_tarihi">
                                    <small class="text-muted">Boş bırakılabilir</small>
                                </div>
                                <div class="col-md-6">
                                    <label for="zimmet_formu" class="form-label">Zimmet Formu</label>
                                    <input type="file" class="form-control" id="zimmet_formu" name="zimmet_formu"
                                           accept=".pdf,.doc,.docx">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-12">
                        <h6 class="mb-3">Yazılım/Hesap Erişimi</h6>
                        <div class="border rounded p-3 bg-light mb-4">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label for="sistem_adi" class="form-label">Sistem Adı</label>
                                    <select class="form-select" id="sistem_adi" name="sistem_adi">
                                        <option value="">Seçiniz</option>
                                        <option value="E-posta">E-posta</option>
                                        <option value="ERP">ERP Sistemi</option>
                                        <option value="CRM">CRM</option>
                                        <option value="Active Directory">Active Directory</option>
                                        <option value="VPN">VPN Erişimi</option>
                                        <option value="Muhasebe">Muhasebe Sistemi</option>
                                        <option value="Diğer">Diğer</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label for="rol_yetki" class="form-label">Rol/Yetki</label>
                                    <input type="text" class="form-control" id="rol_yetki" name="rol_yetki"
                                           placeholder="Admin, User, Read-Only vb.">
                                </div>
                                <div class="col-md-4">
                                    <div class="form-check form-switch mt-4">
                                        <input class="form-check-input" type="checkbox" id="sistem_aktif_mi" name="sistem_aktif_mi" checked>
                                        <label class="form-check-label" for="sistem_aktif_mi">
                                            Aktif
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-12">
                        <label for="veri_guvenligi_taahhutleri" class="form-label">Veri Güvenliği Taahhütleri *</label>
                        <input type="file" class="form-control" id="veri_guvenligi_taahhutleri" name="veri_guvenligi_taahhutleri"
                               accept=".pdf,.doc,.docx" required>
                        <div class="invalid-feedback">Veri güvenliği taahhüdü zorunludur</div>
                        <small class="text-muted">Gizlilik ve veri koruma taahhütleri</small>
                    </div>
                    
                    <div class="col-12">
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            <strong>Log Denetim İzleri:</strong> Sistem erişim logları otomatik olarak kaydedilir ve denetim amaçlı saklanır.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderDocumentsTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">Belge ve Süreç Yönetimi</h6>
                <div class="row g-3">
                    <div class="col-12">
                        <label for="evrak_teslim_kayitlari" class="form-label">Evrak Teslim Kayıtları</label>
                        <input type="file" class="form-control" id="evrak_teslim_kayitlari" name="evrak_teslim_kayitlari"
                               accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple>
                        <small class="text-muted">Teslim edilen evrakların kayıtları</small>
                    </div>
                    
                    <div class="col-12">
                        <label for="e_imza_onaylari" class="form-label">E-İmza Onayları</label>
                        <input type="file" class="form-control" id="e_imza_onaylari" name="e_imza_onaylari"
                               accept=".pdf,.p7s,.xml" multiple>
                        <small class="text-muted">Elektronik imza ile onaylanmış belgeler</small>
                    </div>
                    
                    <div class="col-12">
                        <h6 class="mt-3 mb-3">Politika ve Prosedür Onayları</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="kvkk_onay" name="kvkk_onay">
                                    <label class="form-check-label" for="kvkk_onay">
                                        KVKK Politikası Onayı
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="isg_onay" name="isg_onay">
                                    <label class="form-check-label" for="isg_onay">
                                        İSG Politikası Onayı
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="etik_onay" name="etik_onay">
                                    <label class="form-check-label" for="etik_onay">
                                        Etik Kurallar Onayı
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="uzak_calisma_onay" name="uzak_calisma_onay">
                                    <label class="form-check-label" for="uzak_calisma_onay">
                                        Uzaktan Çalışma Politikası
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-12">
                        <label for="saklama_suresi_imha_plani" class="form-label">Saklama Süresi ve İmha Planı *</label>
                        <select class="form-select" id="saklama_suresi_imha_plani" name="saklama_suresi_imha_plani" required>
                            <option value="">Seçiniz</option>
                            <option value="5-yil">5 Yıl Saklama</option>
                            <option value="10-yil">10 Yıl Saklama</option>
                            <option value="surekli">Sürekli Saklama</option>
                            <option value="ozel-plan">Özel İmha Planı</option>
                        </select>
                        <div class="invalid-feedback">Saklama planı seçiniz</div>
                        <small class="text-muted">Belge bazlı saklama kuralları</small>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderDepartmentTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">Departman Görev</h6>
                <div class="row g-3">
                    <div class="col-12">
                        <label for="gorev_tanimlari" class="form-label">Görev Tanımları</label>
                        <textarea class="form-control" id="gorev_tanimlari" name="gorev_tanimlari" rows="6"
                                  placeholder="Departman bazlı görev tanımları ve sorumluluklar..."></textarea>
                        <small class="text-muted">Departman bazlı detaylı görev açıklamaları</small>
                    </div>
                    
                    <div class="col-12">
                        <label for="gelen_gorsele_gore" class="form-label">Gelen Görsele Göre Görevler</label>
                        <textarea class="form-control" id="gelen_gorsele_gore" name="gelen_gorsele_gore" rows="4"
                                  placeholder="Gelen görsel/dokümana göre özel görev tanımları..."></textarea>
                        <small class="text-muted">Gelen görsele göre özelleştirilmiş görevler</small>
                    </div>
                    
                    <div class="col-12">
                        <label for="gorev_dokumani" class="form-label">Görev Dokümanı</label>
                        <input type="file" class="form-control" id="gorev_dokumani" name="gorev_dokumani"
                               accept=".pdf,.doc,.docx">
                        <small class="text-muted">Detaylı görev tanım dokümanı</small>
                    </div>
                    
                    <div class="col-md-6">
                        <label for="departman_kodu" class="form-label">Departman Kodu</label>
                        <input type="text" class="form-control" id="departman_kodu" name="departman_kodu"
                               placeholder="DEPT001">
                    </div>
                    <div class="col-md-6">
                        <label for="pozisyon_kodu" class="form-label">Pozisyon Kodu</label>
                        <input type="text" class="form-control" id="pozisyon_kodu" name="pozisyon_kodu"
                               placeholder="POS001">
                    </div>
                    
                    <div class="col-12">
                        <div class="alert alert-warning">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            <strong>Not:</strong> Bu sekmedeki bilgiler departman yöneticisi tarafından onaylanmalıdır.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderComingSoonTab(tabName) {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <div class="text-center py-5">
                    <i class="bi bi-tools fs-1 text-muted"></i>
                    <h5 class="mt-3 text-muted">${tabName}</h5>
                    <p class="text-muted">Bu sekme yakında gelecek...</p>
                </div>
            </div>
        `;
    }
    
    afterRender() {
        super.afterRender();
        this.bindEvents();
        
        // Global erişim için
        window.personnelForm = this;
    }
    
    bindEvents() {
        // Tab navigation
        const tabButtons = this.$$('.form-tab-item[data-tab-index]');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabIndex = parseInt(e.target.closest('[data-tab-index]').dataset.tabIndex);
                this.switchTab(tabIndex);
            });
        });
        
        // Önceki/Sonraki butonları
        const prevBtn = this.$('#prev-tab-btn');
        const nextBtn = this.$('#next-tab-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevTab();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextTab();
            });
        }
        
        // Form input değişikliklerini dinle ve submit
        const form = this.$('#personnel-form');
        if (form) {
            form.addEventListener('input', () => {
                this.updateFormValidation();
            });
            
            form.addEventListener('change', () => {
                this.updateFormValidation();
            });
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
        
        // İptal butonu
        const cancelBtn = this.$('#cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (window.router) {
                    window.router.navigate('/personnel-list');
                }
            });
        }
        
        // Acil durum kişisi ekleme
        const addEmergencyBtn = this.$('#add-emergency-contact');
        if (addEmergencyBtn) {
            addEmergencyBtn.addEventListener('click', () => {
                this.addEmergencyContact();
            });
        }
        
        // Koşullu alanlar
        this.setupConditionalFields();
        
        // Initial validation check
        setTimeout(() => {
            this.updateFormValidation();
        }, 100);
    }
    
    setupConditionalFields() {
        // Belge türü değiştiğinde yardım metni güncelle
        const belgeTuruSelect = this.$('#belge_turu');
        if (belgeTuruSelect) {
            belgeTuruSelect.addEventListener('change', (e) => {
                const belgeInput = this.$('#belge_seri_no');
                const helpText = this.$('#belge-help-text');
                
                if (belgeInput && helpText) {
                    switch (e.target.value) {
                        case 'nufus_cuzdani':
                            belgeInput.placeholder = 'Örn: A12345678';
                            helpText.textContent = 'Nüfus cüzdanı seri numarasını giriniz';
                            break;
                        case 'pasaport':
                            belgeInput.placeholder = 'Örn: U1234567';
                            helpText.textContent = 'Pasaport numarasını giriniz';
                            break;
                        case 'ehliyet':
                            belgeInput.placeholder = 'Örn: 34ABC123456';
                            helpText.textContent = 'Ehliyet numarasını giriniz';
                            break;
                        case 'kimlik_karti':
                            belgeInput.placeholder = 'Örn: 123456789';
                            helpText.textContent = 'Kimlik kartı seri numarasını giriniz';
                            break;
                        default:
                            belgeInput.placeholder = '';
                            helpText.textContent = 'Belge türünü seçin';
                    }
                }
                
                this.updateFormValidation();
            });
        }
        
        // Vardiya planı koşullu alanı
        const vardiyaPlaniVar = this.$('#vardiya_plani_var');
        if (vardiyaPlaniVar) {
            vardiyaPlaniVar.addEventListener('change', (e) => {
                const vardiyaSablonuGroup = this.$('#vardiya_sablonu_group');
                if (vardiyaSablonuGroup) {
                    vardiyaSablonuGroup.style.display = e.target.checked ? 'block' : 'none';
                }
            });
        }
        
        // Disiplin kaydı koşullu alanları
        const disiplinKaydiVar = this.$('#disiplin_kaydi_var');
        if (disiplinKaydiVar) {
            disiplinKaydiVar.addEventListener('change', (e) => {
                const disiplinDetayGroup = this.$('#disiplin_detay_group');
                if (disiplinDetayGroup) {
                    disiplinDetayGroup.style.display = e.target.checked ? 'block' : 'none';
                }
            });
        }
        
        // İş kazası koşullu alanları
        const isKazasiVar = this.$('#is_kazasi_meslek_hastaligi');
        if (isKazasiVar) {
            isKazasiVar.addEventListener('change', (e) => {
                const kazaKayitGroup = this.$('#kaza_kayit_group');
                if (kazaKayitGroup) {
                    kazaKayitGroup.style.display = e.target.checked ? 'block' : 'none';
                }
            });
        }
    }
    
    isTabCompleted(tabIndex) {
        return tabIndex < this.state.currentTab;
    }
    
    isFormValid() {
        const form = this.$('#personnel-form');
        if (!form) return false;
        
        // Zorunlu alanları kontrol et
        const requiredFields = form.querySelectorAll('[required]');
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                return false;
            }
            
            // Pattern validation
            if (field.pattern && !new RegExp(field.pattern).test(field.value)) {
                return false;
            }
        }
        
        return true;
    }
    
    switchTab(tabIndex) {
        if (tabIndex >= 0 && tabIndex < this.state.tabs.length) {
            this.setState({ currentTab: tabIndex });
            this.render();
        }
    }
    
    nextTab() {
        if (this.state.currentTab < this.state.tabs.length - 1) {
            this.switchTab(this.state.currentTab + 1);
        }
    }
    
    prevTab() {
        if (this.state.currentTab > 0) {
            this.switchTab(this.state.currentTab - 1);
        }
    }
    
    isFormValid() {
        // Template render sırasında form henüz yoksa false döndür
        const form = this.$('#personnel-form');
        if (!form) return false;
        
        // Zorunlu alanları kontrol et
        const requiredFields = form.querySelectorAll('[required]');
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                return false;
            }
            
            // Pattern validation
            if (field.pattern && !new RegExp(field.pattern).test(field.value)) {
                return false;
            }
        }
        
        return true;
    }
    
    updateFormValidation() {
        const saveBtn = this.$('#save-btn');
        if (saveBtn) {
            const isValid = this.isFormValid();
            saveBtn.disabled = this.state.saving || !isValid;
        }
    }
    
    async loadPersonnelData() {
        this.setState({ loading: true });
        
        try {
            // API çağrısı burada yapılacak
            // const data = await apiClient.get(`/personnel/${this.state.personnelId}`);
            // this.setState({ formData: data, loading: false });
            
            // Mock data
            setTimeout(() => {
                this.setState({ 
                    formData: {
                        personel_sicil: 'HVR23001',
                        ad: 'Ahmet',
                        soyad: 'Yılmaz'
                    }, 
                    loading: false 
                });
                this.render();
            }, 1000);
            
        } catch (error) {
            console.error('Personel verileri yüklenirken hata:', error);
            this.setState({ loading: false });
        }
    }
    
    async handleSubmit() {
        if (!this.isFormValid()) {
            toastr.error('Lütfen tüm zorunlu alanları doldurun');
            return;
        }
        
        this.setState({ saving: true });
        
        try {
            const formData = new FormData(this.$('#personnel-form'));
            const data = Object.fromEntries(formData.entries());
            
            // API çağrısı burada yapılacak
            // if (this.state.isEditMode) {
            //     await apiClient.put(`/personnel/${this.state.personnelId}`, data);
            // } else {
            //     await apiClient.post('/personnel', data);
            // }
            
            // Mock success
            setTimeout(() => {
                toastr.success(this.state.isEditMode ? 'Personel başarıyla güncellendi' : 'Personel başarıyla eklendi');
                
                setTimeout(() => {
                    if (window.router) {
                        window.router.navigate('/personnel-list');
                    }
                }, 1500);
            }, 1500);
            
        } catch (error) {
            console.error('Form kaydedilirken hata:', error);
            toastr.error('Form kaydedilirken hata oluştu');
        } finally {
            this.setState({ saving: false });
        }
    }
}

window.PersonnelForm = PersonnelForm;
