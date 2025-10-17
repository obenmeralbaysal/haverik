/**
 * Personnel Form Component
 * Personel ekleme/düzenleme formu
 */
class PersonnelForm extends Component {
    constructor(element, props = {}) {
        super(element, props);
        
        // URL'den ID parametresini al
        const urlParams = new URLSearchParams(window.location.search);
        const personnelId = urlParams.get('id');
        
        this.state = {
            isEditMode: !!personnelId,
            personnelId: personnelId,
            currentTab: 0,
            formData: {},
            loading: false,
            saving: false,
            tabs: [
                { id: 'identity', name: 'Kimlik ve İletişim', icon: 'bi-person' },
                { id: 'legal', name: 'Yasal ve Uyumluluk', icon: 'bi-shield-check' },
                { id: 'education', name: 'Eğitim ve Yeterlilik', icon: 'bi-mortarboard' },
                { id: 'employment', name: 'İşe Alım ve Sözleşmeler', icon: 'bi-briefcase' },
                { id: 'sgk', name: 'SGK, Vergi ve Banka', icon: 'bi-bank' },
                { id: 'salary', name: 'Ücret ve Yan Haklar', icon: 'bi-currency-dollar' },
                { id: 'schedule', name: 'Çalışma Süreleri ve İzinler', icon: 'bi-calendar' },
                { id: 'performance', name: 'Performans, Gelişim ve Disiplin', icon: 'bi-graph-up' },
                { id: 'health', name: 'İSG ve Sağlık', icon: 'bi-heart-pulse' },
                { id: 'assets', name: 'Varlık ve Erişim Yönetimi', icon: 'bi-laptop' },
                { id: 'documents', name: 'Belge ve Süreç Yönetimi', icon: 'bi-file-text' },
                { id: 'department', name: 'Departman Görev', icon: 'bi-building' }
            ]
        };
        
        // Edit mode ise veriyi yükle
        if (this.state.isEditMode) {
            this.loadPersonnelData();
        }
    }
    
    template() {
        return `
            <div class="personnel-form-container">
                <div class="py-3">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 class="mb-1">${this.state.isEditMode ? 'Personel Düzenle' : 'Yeni Personel Ekle'}</h4>
                            <p class="text-muted mb-0">Personel bilgilerini ${this.state.isEditMode ? 'güncelleyin' : 'ekleyin'}</p>
                        </div>
                    </div>
                </div>
                
                <div class="personnel-form-card card shadow-sm">
                    <div class="personnel-form-body">
                        <!-- Form Content Area -->
                        <div class="form-content-area">
                            <div class="form-tab-content">
                                <form id="personnel-form" novalidate>
                                    <div class="tab-content" id="personnel-tab-content">
                                        ${this.renderCurrentTab()}
                                    </div>
                                </form>
                            </div>
                            
                            <!-- Form Footer -->
                            <div class="form-footer">
                                <button type="button" class="btn btn-outline-secondary" id="cancel-btn">
                                    <i class="bi bi-x-circle me-2"></i>İptal
                                </button>
                                <button type="submit" class="btn btn-success" form="personnel-form" 
                                        id="save-btn" ${this.state.saving || !this.isFormValid() ? 'disabled' : ''}>
                                    ${this.state.saving ? '<span class="spinner-border spinner-border-sm me-2"></span>' : '<i class="bi bi-check-circle me-2"></i>'}
                                    ${this.state.saving ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                            </div>
                        </div>
                        
                        <!-- Form Tabs Sidebar (Right) -->
                        <div class="form-tabs-sidebar">
                            <div class="form-tabs-nav">
                                ${this.renderTabs()}
                            </div>
                            
                            <!-- Tab Navigation Buttons -->
                            <div class="tab-navigation-buttons">
                                <button type="button" class="btn btn-outline-primary btn-sm w-100 mb-2" 
                                        id="prev-tab-btn" ${this.state.currentTab === 0 ? 'disabled' : ''}>
                                    <i class="bi bi-chevron-left me-2"></i>Önceki
                                </button>
                                <button type="button" class="btn btn-primary btn-sm w-100" 
                                        id="next-tab-btn" ${this.state.currentTab === this.state.tabs.length - 1 ? 'disabled' : ''}>
                                    Sonraki<i class="bi bi-chevron-right ms-2"></i>
                                </button>
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
                <p class="mt-2 text-muted">Personel bilgileri yükleniyor...</p>
            </div>
        `;
    }
    
    renderForm() {
        return `
            <form id="personnel-form" novalidate>
                <div class="tab-content" id="personnel-tab-content">
                    ${this.renderCurrentTab()}
                </div>
                
                <!-- Form Actions -->
                <div class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                    <button type="button" class="btn btn-outline-secondary" id="cancel-btn">
                        İptal
                    </button>
                    <button type="submit" class="btn btn-primary" id="submit-btn" 
                            ${this.state.saving ? 'disabled' : ''}>
                        ${this.state.saving ? `
                            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                            Kaydediliyor...
                        ` : `
                            <i class="bi bi-check2 me-1"></i>
                            ${this.state.isEditMode ? 'Güncelle' : 'Kaydet'}
                        `}
                    </button>
                </div>
            </form>
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
    
    renderTabNavigation() {
        return `
            <div class="nav nav-pills flex-column" id="form-tabs" role="tablist">
                ${this.state.tabs.map((tab, index) => `
                    <button class="nav-link text-start ${index === this.state.currentTab ? 'active' : ''}" 
                            data-tab-index="${index}" type="button">
                        <i class="bi ${tab.icon} me-2"></i>
                        ${tab.name}
                        ${this.isTabCompleted(index) ? '<i class="bi bi-check-circle text-success ms-auto"></i>' : ''}
                    </button>
                `).join('')}
            </div>
        `;
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
            case 'employment':
                return this.renderEmploymentTab();
            case 'sgk':
                return this.renderSgkTab();
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
    
                        </div>
                        
                        <!-- Form Footer -->
                        <div class="form-footer">
                            <button type="button" class="btn btn-outline-secondary" id="cancel-btn">
                                <i class="bi bi-x-circle me-2"></i>İptal
                            </button>
                            <button type="submit" class="btn btn-success" form="personnel-form" 
                                    id="save-btn" ${this.state.saving || !this.isFormValid() ? 'disabled' : ''}>
                                ${this.state.saving ? '<span class="spinner-border spinner-border-sm me-2"></span>' : '<i class="bi bi-check-circle me-2"></i>'}
                                ${this.state.saving ? 'Kaydediliyor...' : 'Kaydet'}
                            </button>
                        </div>
                    <div class="col-md-4">
                        <label for="yaka_tipi" class="form-label">Yaka Tipi *</label>
                        <select class="form-select" id="yaka_tipi" name="yaka_tipi" required>
                            <option value="">Seçiniz</option>
                            <option value="Beyaz">Beyaz</option>
                            <option value="Mavi">Mavi</option>
                            <option value="Diğer">Diğer</option>
                        </select>
                        <div class="invalid-feedback">Yaka tipi seçiniz</div>
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
                    <div class="col-md-4" id="tc_kimlik_group" style="display: none;">
                        <label for="tc_kimlik_no" class="form-label">TC Kimlik No *</label>
                        <input type="text" class="form-control" id="tc_kimlik_no" name="tc_kimlik_no" 
                               pattern="^[0-9]{11}$" maxlength="11">
                        <div class="invalid-feedback">11 haneli TC kimlik numarası giriniz</div>
                    </div>
                    <div class="col-md-6">
                        <label for="dogum_yeri" class="form-label">Doğum Yeri *</label>
                        <input type="text" class="form-control" id="dogum_yeri" name="dogum_yeri" required>
                        <div class="invalid-feedback">Doğum yeri giriniz</div>
                    </div>
                    <div class="col-md-6">
                        <label for="dogum_tarihi" class="form-label">Doğum Tarihi *</label>
                        <input type="date" class="form-control" id="dogum_tarihi" name="dogum_tarihi" 
                               min="1900-01-01" required>
                        <div class="invalid-feedback">Doğum tarihi seçiniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="cinsiyet" class="form-label">Cinsiyet</label>
                        <select class="form-select" id="cinsiyet" name="cinsiyet">
                            <option value="">Seçiniz</option>
                            <option value="Erkek">Erkek</option>
                            <option value="Kadın">Kadın</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="medeni_durum" class="form-label">Medeni Durum</label>
                        <select class="form-select" id="medeni_durum" name="medeni_durum">
                            <option value="">Seçiniz</option>
                            <option value="Bekar">Bekar</option>
                            <option value="Evli">Evli</option>
                            <option value="Boşanmış">Boşanmış</option>
                            <option value="Dul">Dul</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="foto" class="form-label">Fotoğraf</label>
                        <input type="file" class="form-control" id="foto" name="foto" accept="image/*">
                        <small class="text-muted">Maksimum 5MB</small>
                    </div>
                    <div class="col-12" id="es_bilgileri_group" style="display: none;">
                        <label for="es_bilgileri" class="form-label">Eş Bilgileri</label>
                        <textarea class="form-control" id="es_bilgileri" name="es_bilgileri" rows="3"></textarea>
                    </div>
                    <div class="col-12" id="cocuk_bilgileri_group" style="display: none;">
                        <label for="cocuk_bilgileri" class="form-label">Çocuk Bilgileri</label>
                        <textarea class="form-control" id="cocuk_bilgileri" name="cocuk_bilgileri" rows="3"></textarea>
                    </div>
                    <div class="col-12">
                        <label for="ikamet_adresi" class="form-label">İkamet Adresi *</label>
                        <textarea class="form-control" id="ikamet_adresi" name="ikamet_adresi" rows="3" required></textarea>
                        <div class="invalid-feedback">İkamet adresi giriniz</div>
                    </div>
                    <div class="col-12">
                        <label for="gecici_adres" class="form-label">Geçici Adres</label>
                        <textarea class="form-control" id="gecici_adres" name="gecici_adres" rows="3"></textarea>
                    </div>
                    <div class="col-md-6">
                        <label for="kisisel_tel" class="form-label">Kişisel Telefon *</label>
                        <input type="tel" class="form-control" id="kisisel_tel" name="kisisel_tel" 
                               pattern="^[0-9 +()-]{7,20}$" required>
                        <div class="invalid-feedback">Geçerli telefon numarası giriniz</div>
                    </div>
                    <div class="col-md-6">
                        <label for="kisisel_eposta" class="form-label">Kişisel E-posta *</label>
                        <input type="email" class="form-control" id="kisisel_eposta" name="kisisel_eposta" required>
                        <div class="invalid-feedback">Geçerli e-posta adresi giriniz</div>
                    </div>
                    <div class="col-md-6">
                        <label for="ana_adi" class="form-label">Ana Adı</label>
                        <input type="text" class="form-control" id="ana_adi" name="ana_adi">
                    </div>
                    <div class="col-md-6">
                        <label for="baba_adi" class="form-label">Baba Adı</label>
                        <input type="text" class="form-control" id="baba_adi" name="baba_adi">
                    </div>
                    
                    <!-- Acil Durum Kişileri -->
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="mb-0">Acil Durum Kişileri</h6>
                            <button type="button" class="btn btn-outline-primary btn-sm" id="add-emergency-contact">
                                + Ekle
                            </button>
                        </div>
                        <div id="emergency-contacts-container"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderLegalTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">Yasal ve Uyumluluk</h6>
                <div class="row g-3">
                    <div class="col-12">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="kvkk_aydinlatma_onay" name="kvkk_aydinlatma_onay" required>
                            <label class="form-check-label" for="kvkk_aydinlatma_onay">
                                KVKK Aydınlatma Metni Onayı *
                            </label>
                            <div class="invalid-feedback">KVKK onayı zorunludur</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="acik_riza_gerekli_mi" name="acik_riza_gerekli_mi">
                            <label class="form-check-label" for="acik_riza_gerekli_mi">Açık Rıza Gerekli Mi?</label>
                        </div>
                    </div>
                    <div class="col-md-6" id="acik_riza_group" style="display: none;">
                        <label for="acik_riza_kaydi" class="form-label">Açık Rıza Kaydı</label>
                        <input type="file" class="form-control" id="acik_riza_kaydi" name="acik_riza_kaydi">
                    </div>
                    <div class="col-md-6" id="calisma_izni_group" style="display: none;">
                        <label for="calisma_ikamet_izni_durumu" class="form-label">Çalışma/İkamet İzni Durumu</label>
                        <select class="form-select" id="calisma_ikamet_izni_durumu" name="calisma_ikamet_izni_durumu">
                            <option value="">Seçiniz</option>
                            <option value="Var">Var</option>
                            <option value="Yok">Yok</option>
                        </select>
                    </div>
                    <div class="col-md-6" id="calisma_izni_belge_group" style="display: none;">
                        <label for="calisma_izni_belgesi" class="form-label">Çalışma İzni Belgesi</label>
                        <input type="file" class="form-control" id="calisma_izni_belgesi" name="calisma_izni_belgesi">
                    </div>
                    <div class="col-md-6" id="ikamet_izni_belge_group" style="display: none;">
                        <label for="ikamet_izni_belgesi" class="form-label">İkamet İzni Belgesi</label>
                        <input type="file" class="form-control" id="ikamet_izni_belgesi" name="ikamet_izni_belgesi">
                    </div>
                    <div class="col-md-6">
                        <label for="nufus_belgesi" class="form-label">Nüfus Belgesi</label>
                        <input type="file" class="form-control" id="nufus_belgesi" name="nufus_belgesi">
                    </div>
                    <div class="col-md-6">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="adli_sicil_gerekli_mi" name="adli_sicil_gerekli_mi">
                            <label class="form-check-label" for="adli_sicil_gerekli_mi">Adli Sicil Gerekli Mi?</label>
                        </div>
                    </div>
                    <div class="col-md-6" id="adli_sicil_group" style="display: none;">
                        <label for="adli_sicil_belgesi" class="form-label">Adli Sicil Belgesi</label>
                        <input type="file" class="form-control" id="adli_sicil_belgesi" name="adli_sicil_belgesi">
                    </div>
                    <div class="col-md-4">
                        <label for="ehliyet_sinifi" class="form-label">Ehliyet Sınıfı</label>
                        <select class="form-select" id="ehliyet_sinifi" name="ehliyet_sinifi">
                            <option value="">Seçiniz</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="CE">CE</option>
                            <option value="D">D</option>
                        </select>
                    </div>
                    <div class="col-md-4" id="src_belgesi_group" style="display: none;">
                        <label for="src_belgesi" class="form-label">SRC Belgesi</label>
                        <input type="file" class="form-control" id="src_belgesi" name="src_belgesi">
                    </div>
                    <div class="col-md-4" id="psikoteknik_group" style="display: none;">
                        <label for="psikoteknik_belgesi" class="form-label">Psikoteknik Belgesi</label>
                        <input type="file" class="form-control" id="psikoteknik_belgesi" name="psikoteknik_belgesi">
                    </div>
                    <div class="col-md-6">
                        <label for="engellilik_durumu" class="form-label">Engellilik Durumu</label>
                        <select class="form-select" id="engellilik_durumu" name="engellilik_durumu">
                            <option value="">Seçiniz</option>
                            <option value="Yok">Yok</option>
                            <option value="Var">Var</option>
                        </select>
                    </div>
                    <div class="col-md-3" id="engellilik_orani_group" style="display: none;">
                        <label for="engellilik_orani" class="form-label">Engellilik Oranı (%)</label>
                        <input type="number" class="form-control" id="engellilik_orani" name="engellilik_orani" 
                               min="0" max="100" step="1">
                    </div>
                    <div class="col-md-3" id="engellilik_belgesi_group" style="display: none;">
                        <label for="engellilik_belgesi" class="form-label">Engellilik Belgesi</label>
                        <input type="file" class="form-control" id="engellilik_belgesi" name="engellilik_belgesi">
                    </div>
                    <div class="col-md-6">
                        <label for="emeklilik_durumu" class="form-label">Emeklilik Durumu</label>
                        <select class="form-select" id="emeklilik_durumu" name="emeklilik_durumu">
                            <option value="">Seçiniz</option>
                            <option value="Emekli Değil">Emekli Değil</option>
                            <option value="Emekli">Emekli</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderEducationTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">Eğitim ve Yeterlilik</h6>
                <div class="row g-3">
                    <!-- Eğitim Durumu -->
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="mb-0">Eğitim Durumu</h6>
                            <button type="button" class="btn btn-outline-primary btn-sm" id="add-education">
                                + Eğitim Ekle
                            </button>
                        </div>
                        <div id="education-container"></div>
                    </div>
                    
                    <!-- Sertifikalar -->
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="mb-0">Sertifikalar</h6>
                            <button type="button" class="btn btn-outline-primary btn-sm" id="add-certificate">
                                + Sertifika Ekle
                            </button>
                        </div>
                        <div id="certificates-container"></div>
                    </div>
                    
                    <!-- Yabancı Diller -->
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="mb-0">Yabancı Diller</h6>
                            <button type="button" class="btn btn-outline-primary btn-sm" id="add-language">
                                + Dil Ekle
                            </button>
                        </div>
                        <div id="languages-container"></div>
                    </div>
                    
                    <!-- Referanslar -->
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="mb-0">Referanslar</h6>
                            <button type="button" class="btn btn-outline-primary btn-sm" id="add-reference">
                                + Referans Ekle
                            </button>
                        </div>
                        <div id="references-container"></div>
                    </div>
                    
                    <!-- Geçmiş İş Tecrübesi -->
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="mb-0">Geçmiş İş Tecrübesi</h6>
                            <button type="button" class="btn btn-outline-primary btn-sm" id="add-experience">
                                + Tecrübe Ekle
                            </button>
                        </div>
                        <div id="experience-container"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderEmploymentTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">İşe Alım ve Sözleşmeler</h6>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label for="is_basvuru_formu" class="form-label">İş Başvuru Formu *</label>
                        <input type="file" class="form-control" id="is_basvuru_formu" name="is_basvuru_formu" required>
                        <div class="invalid-feedback">İş başvuru formu yükleyiniz</div>
                    </div>
                    <div class="col-md-6">
                        <label for="ozgecmis" class="form-label">Özgeçmiş</label>
                        <input type="file" class="form-control" id="ozgecmis" name="ozgecmis">
                    </div>
                    <div class="col-md-4">
                        <label for="ise_giris_tarihi" class="form-label">İşe Giriş Tarihi *</label>
                        <input type="date" class="form-control" id="ise_giris_tarihi" name="ise_giris_tarihi" required>
                        <div class="invalid-feedback">İşe giriş tarihi seçiniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="pozisyon" class="form-label">Pozisyon *</label>
                        <input type="text" class="form-control" id="pozisyon" name="pozisyon" required>
                        <div class="invalid-feedback">Pozisyon giriniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="unvan" class="form-label">Ünvan *</label>
                        <input type="text" class="form-control" id="unvan" name="unvan" required>
                        <div class="invalid-feedback">Ünvan giriniz</div>
                    </div>
                    <div class="col-md-6">
                        <label for="bolum" class="form-label">Bölüm *</label>
                        <select class="form-select" id="bolum" name="bolum" required>
                            <option value="">Seçiniz</option>
                            <option value="İnsan Kaynakları">İnsan Kaynakları</option>
                            <option value="IT">IT</option>
                            <option value="Muhasebe">Muhasebe</option>
                            <option value="Satış">Satış</option>
                            <option value="Pazarlama">Pazarlama</option>
                        </select>
                        <div class="invalid-feedback">Bölüm seçiniz</div>
                    </div>
                    <div class="col-md-6">
                        <label for="is_sozlesmesi_tipi" class="form-label">İş Sözleşmesi Tipi *</label>
                        <select class="form-select" id="is_sozlesmesi_tipi" name="is_sozlesmesi_tipi" required>
                            <option value="">Seçiniz</option>
                            <option value="Belirli">Belirli Süreli</option>
                            <option value="Belirsiz">Belirsiz Süreli</option>
                            <option value="Tam">Tam Zamanlı</option>
                            <option value="Yarı">Yarı Zamanlı</option>
                            <option value="Uzaktan">Uzaktan</option>
                            <option value="Hibrit">Hibrit</option>
                        </select>
                        <div class="invalid-feedback">Sözleşme tipi seçiniz</div>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Ek Protokoller</label>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="gizlilik" name="ek_protokoller[]" value="Gizlilik">
                                    <label class="form-check-label" for="gizlilik">Gizlilik</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="rekabet" name="ek_protokoller[]" value="Rekabet">
                                    <label class="form-check-label" for="rekabet">Rekabet</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="baglilik" name="ek_protokoller[]" value="Bağlılık">
                                    <label class="form-check-label" for="baglilik">Bağlılık</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="fikri_haklar" name="ek_protokoller[]" value="Fikri Haklar">
                                    <label class="form-check-label" for="fikri_haklar">Fikri Haklar</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label for="is_tanimi_dokumani" class="form-label">İş Tanımı Dokümanı *</label>
                        <input type="file" class="form-control" id="is_tanimi_dokumani" name="is_tanimi_dokumani" required>
                        <div class="invalid-feedback">İş tanımı dokümanı yükleyiniz</div>
                    </div>
                    <div class="col-md-3">
                        <label for="kidem" class="form-label">Kıdem</label>
                        <input type="number" class="form-control" id="kidem" name="kidem" min="0">
                    </div>
                    <div class="col-md-3">
                        <label for="derece" class="form-label">Derece</label>
                        <input type="number" class="form-control" id="derece" name="derece" min="1">
                    </div>
                </div>
            </div>
        `;
    }

    renderSgkTab() {
        return `
            <div class="tab-pane fade show active" role="tabpanel">
                <h6 class="border-bottom pb-2 mb-3">SGK, Vergi ve Banka</h6>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label for="sgk_sicil_no" class="form-label">SGK Sicil No *</label>
                        <input type="text" class="form-control" id="sgk_sicil_no" name="sgk_sicil_no" required>
                        <div class="invalid-feedback">SGK sicil numarası giriniz</div>
                    </div>
                    <div class="col-md-6">
                        <label for="ise_giris_bildirimi" class="form-label">İşe Giriş Bildirimi</label>
                        <input type="file" class="form-control" id="ise_giris_bildirimi" name="ise_giris_bildirimi">
                    </div>
                    <div class="col-md-8">
                        <label for="iban" class="form-label">IBAN *</label>
                        <input type="text" class="form-control" id="iban" name="iban" 
                               pattern="^TR[0-9A-Z]{24}$" placeholder="TR00 0000 0000 0000 0000 0000 00" required>
                        <div class="invalid-feedback">Geçerli IBAN giriniz (TR ile başlayan 26 karakter)</div>
                    </div>
                    <div class="col-md-4">
                        <label for="banka_adi" class="form-label">Banka Adı *</label>
                        <select class="form-select" id="banka_adi" name="banka_adi" required>
                            <option value="">Seçiniz</option>
                            <option value="Ziraat Bankası">Ziraat Bankası</option>
                            <option value="İş Bankası">İş Bankası</option>
                            <option value="Garanti BBVA">Garanti BBVA</option>
                            <option value="Akbank">Akbank</option>
                            <option value="Yapı Kredi">Yapı Kredi</option>
                            <option value="Diğer">Diğer</option>
                        </select>
                        <div class="invalid-feedback">Banka seçiniz</div>
                    </div>
                    <div class="col-md-6">
                        <label for="bes_durumu" class="form-label">BES Durumu *</label>
                        <select class="form-select" id="bes_durumu" name="bes_durumu" required>
                            <option value="">Seçiniz</option>
                            <option value="Otomatik katılım">Otomatik Katılım</option>
                            <option value="Çıkış">Çıkış</option>
                        </select>
                        <div class="invalid-feedback">BES durumu seçiniz</div>
                    </div>
                    <div class="col-md-6" id="bes_firmasi_group" style="display: none;">
                        <label for="bes_firmasi" class="form-label">BES Firması</label>
                        <select class="form-select" id="bes_firmasi" name="bes_firmasi">
                            <option value="">Seçiniz</option>
                            <option value="Allianz">Allianz</option>
                            <option value="Axa">Axa</option>
                            <option value="Garanti">Garanti</option>
                            <option value="Vakıf">Vakıf</option>
                        </select>
                    </div>
                    <div class="col-12">
                        <label for="aile_durumu_bildirimi" class="form-label">Aile Durumu Bildirimi</label>
                        <input type="file" class="form-control" id="aile_durumu_bildirimi" name="aile_durumu_bildirimi">
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
                        <label for="ucret_tipi" class="form-label">Ücret Tipi *</label>
                        <select class="form-select" id="ucret_tipi" name="ucret_tipi" required>
                            <option value="">Seçiniz</option>
                            <option value="Brüt">Brüt</option>
                            <option value="Net">Net</option>
                        </select>
                        <div class="invalid-feedback">Ücret tipi seçiniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="ucret_tutari" class="form-label">Ücret Tutarı *</label>
                        <input type="number" class="form-control" id="ucret_tutari" name="ucret_tutari" 
                               step="0.01" min="0" required>
                        <div class="invalid-feedback">Ücret tutarı giriniz</div>
                    </div>
                    <div class="col-md-4">
                        <label for="odeme_periyodu" class="form-label">Ödeme Periyodu *</label>
                        <select class="form-select" id="odeme_periyodu" name="odeme_periyodu" required>
                            <option value="">Seçiniz</option>
                            <option value="Aylık">Aylık</option>
                            <option value="Haftalık">Haftalık</option>
                            <option value="Günlük">Günlük</option>
                        </select>
                        <div class="invalid-feedback">Ödeme periyodu seçiniz</div>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Ek Ödeme Politikaları</label>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="prim" name="ek_odeme[]" value="Prim">
                                    <label class="form-check-label" for="prim">Prim</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="ikramiye" name="ek_odeme[]" value="İkramiye">
                                    <label class="form-check-label" for="ikramiye">İkramiye</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="vardiya" name="ek_odeme[]" value="Vardiya">
                                    <label class="form-check-label" for="vardiya">Vardiya</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="fazla_mesai" name="ek_odeme[]" value="Fazla Mesai">
                                    <label class="form-check-label" for="fazla_mesai">Fazla Mesai</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Yan Haklar</label>
                        <div class="row">
                            <div class="col-md-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="yemek" name="yan_haklar[]" value="Yemek">
                                    <label class="form-check-label" for="yemek">Yemek</label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="yol" name="yan_haklar[]" value="Yol">
                                    <label class="form-check-label" for="yol">Yol</label>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="akaryakıt" name="yan_haklar[]" value="Akaryakıt">
                                    <label class="form-check-label" for="akaryakıt">Akaryakıt</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="ozel_saglik" name="yan_haklar[]" value="Özel Sağlık">
                                    <label class="form-check-label" for="ozel_saglik">Özel Sağlık</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="hayat_sigortasi" name="yan_haklar[]" value="Hayat Sigortası">
                                    <label class="form-check-label" for="hayat_sigortasi">Hayat Sigortası</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="yan_hak_detay_dosyasi" class="form-label">Yan Hak Detay Dosyası</label>
                        <input type="file" class="form-control" id="yan_hak_detay_dosyasi" name="yan_hak_detay_dosyasi">
                    </div>
                    <div class="col-md-6">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="avans_alir" name="avans_alir">
                            <label class="form-check-label" for="avans_alir">Avans Alabilir</label>
                        </div>
                    </div>
                    <div class="col-md-3" id="avans_limit_group" style="display: none;">
                        <label for="avans_limit" class="form-label">Avans Limiti</label>
                        <input type="number" class="form-control" id="avans_limit" name="avans_limit" step="0.01" min="0">
                    </div>
                    <div class="col-md-3" id="avans_politika_group" style="display: none;">
                        <label for="avans_politika_dosyasi" class="form-label">Avans Politika Dosyası</label>
                        <input type="file" class="form-control" id="avans_politika_dosyasi" name="avans_politika_dosyasi">
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
                            Puantaj takibi personel listesi ekranından yapılmaktadır.
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="vardiya_plani_var" name="vardiya_plani_var">
                            <label class="form-check-label" for="vardiya_plani_var">Vardiya Planı Var</label>
                        </div>
                    </div>
                    <div class="col-md-6" id="vardiya_sablonu_group" style="display: none;">
                        <label for="vardiya_sablonu" class="form-label">Vardiya Şablonu</label>
                        <input type="file" class="form-control" id="vardiya_sablonu" name="vardiya_sablonu">
                    </div>
                    <div class="col-md-4">
                        <label for="yillik_izin_gun" class="form-label">Yıllık İzin Günü</label>
                        <input type="number" class="form-control" id="yillik_izin_gun" name="yillik_izin_gun" min="0" value="14">
                    </div>
                    <div class="col-md-8">
                        <label for="mazeret_izinleri" class="form-label">Mazeret İzinleri</label>
                        <textarea class="form-control" id="mazeret_izinleri" name="mazeret_izinleri" rows="3"></textarea>
                    </div>
                    <div class="col-12">
                        <label for="diger_izin_tanimlari" class="form-label">Diğer İzin Tanımları</label>
                        <textarea class="form-control" id="diger_izin_tanimlari" name="diger_izin_tanimlari" rows="3"></textarea>
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
                        <textarea class="form-control" id="hedef_seti" name="hedef_seti" rows="4"></textarea>
                    </div>
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="mb-0">Performans Değerlendirmeleri</h6>
                            <button type="button" class="btn btn-outline-primary btn-sm" id="add-performance">
                                + Değerlendirme Ekle
                            </button>
                        </div>
                        <div id="performance-container"></div>
                    </div>
                    <div class="col-md-6">
                        <label for="egitim_plani" class="form-label">Eğitim Planı</label>
                        <input type="file" class="form-control" id="egitim_plani" name="egitim_plani">
                    </div>
                    <div class="col-md-6">
                        <label for="egitim_katilim_sertifikalari" class="form-label">Eğitim Katılım Sertifikaları</label>
                        <input type="file" class="form-control" id="egitim_katilim_sertifikalari" name="egitim_katilim_sertifikalari" multiple>
                    </div>
                    <div class="col-12">
                        <label for="geribildirim_notlari" class="form-label">Geri Bildirim Notları</label>
                        <textarea class="form-control" id="geribildirim_notlari" name="geribildirim_notlari" rows="4"></textarea>
                    </div>
                    <div class="col-md-6">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="disiplin_kaydi_var" name="disiplin_kaydi_var">
                            <label class="form-check-label" for="disiplin_kaydi_var">Disiplin Kaydı Var</label>
                        </div>
                    </div>
                    <div class="col-md-6" id="disiplin_group" style="display: none;">
                        <div class="row g-2">
                            <div class="col-12">
                                <label for="uyari_ihtar_dosyasi" class="form-label">Uyarı/İhtar Dosyası</label>
                                <input type="file" class="form-control" id="uyari_ihtar_dosyasi" name="uyari_ihtar_dosyasi">
                            </div>
                            <div class="col-12">
                                <label for="savunma_dosyasi" class="form-label">Savunma Dosyası</label>
                                <input type="file" class="form-control" id="savunma_dosyasi" name="savunma_dosyasi">
                            </div>
                            <div class="col-12">
                                <label for="kurul_karari" class="form-label">Kurul Kararı</label>
                                <input type="file" class="form-control" id="kurul_karari" name="kurul_karari">
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
                        <input type="file" class="form-control" id="ise_giris_saglik_raporu" name="ise_giris_saglik_raporu" required>
                        <div class="invalid-feedback">İşe giriş sağlık raporu yükleyiniz</div>
                    </div>
                    <div class="col-md-6">
                        <label for="periyodik_muayene_raporlari" class="form-label">Periyodik Muayene Raporları</label>
                        <input type="file" class="form-control" id="periyodik_muayene_raporlari" name="periyodik_muayene_raporlari" multiple>
                    </div>
                    <div class="col-md-6">
                        <label for="isg_egitim_kayitlari" class="form-label">İSG Eğitim Kayıtları *</label>
                        <input type="file" class="form-control" id="isg_egitim_kayitlari" name="isg_egitim_kayitlari" multiple required>
                        <div class="invalid-feedback">İSG eğitim kayıtları yükleyiniz</div>
                    </div>
                    <div class="col-md-6">
                        <label for="risk_bilgilendirme_dosyasi" class="form-label">Risk Bilgilendirme Dosyası</label>
                        <input type="file" class="form-control" id="risk_bilgilendirme_dosyasi" name="risk_bilgilendirme_dosyasi">
                    </div>
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="mb-0">KKD Zimmetleri</h6>
                            <button type="button" class="btn btn-outline-primary btn-sm" id="add-kkd">
                                + KKD Ekle
                            </button>
                        </div>
                        <div id="kkd-container"></div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="is_kazasi_meslek_hastaligi" name="is_kazasi_meslek_hastaligi">
                            <label class="form-check-label" for="is_kazasi_meslek_hastaligi">İş Kazası/Meslek Hastalığı</label>
                        </div>
                    </div>
                    <div class="col-md-6" id="olay_kayitlari_group" style="display: none;">
                        <label for="olay_kayitlari" class="form-label">Olay Kayıtları</label>
                        <input type="file" class="form-control" id="olay_kayitlari" name="olay_kayitlari" multiple>
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
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="mb-0">Demirbaş Zimmetleri</h6>
                            <button type="button" class="btn btn-outline-primary btn-sm" id="add-asset">
                                + Varlık Ekle
                            </button>
                        </div>
                        <div id="assets-container"></div>
                    </div>
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="mb-0">Yazılım/Hesap Erişimi</h6>
                            <button type="button" class="btn btn-outline-primary btn-sm" id="add-software-access">
                                + Erişim Ekle
                            </button>
                        </div>
                        <div id="software-access-container"></div>
                    </div>
                    <div class="col-12">
                        <label for="veri_guvenligi_taahhutleri" class="form-label">Veri Güvenliği Taahhütleri *</label>
                        <input type="file" class="form-control" id="veri_guvenligi_taahhutleri" name="veri_guvenligi_taahhutleri" required>
                        <div class="invalid-feedback">Veri güvenliği taahhütleri yükleyiniz</div>
                    </div>
                    <div class="col-12">
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            Log denetim izleri sistem tarafından otomatik olarak tutulmaktadır.
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
                    <div class="col-md-6">
                        <label for="evrak_teslim_kayitlari" class="form-label">Evrak Teslim Kayıtları</label>
                        <input type="file" class="form-control" id="evrak_teslim_kayitlari" name="evrak_teslim_kayitlari" multiple>
                    </div>
                    <div class="col-md-6">
                        <label for="e_imza_onaylari" class="form-label">E-İmza Onayları</label>
                        <input type="file" class="form-control" id="e_imza_onaylari" name="e_imza_onaylari" multiple>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Politika/Prosedür Onayları</label>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="kvkk_politika" name="politika_onaylari[]" value="KVKK">
                                    <label class="form-check-label" for="kvkk_politika">KVKK</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="isg_politika" name="politika_onaylari[]" value="İSG">
                                    <label class="form-check-label" for="isg_politika">İSG</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="etik_politika" name="politika_onaylari[]" value="Etik">
                                    <label class="form-check-label" for="etik_politika">Etik</label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="uzak_calisma" name="politika_onaylari[]" value="Uzak Çalışma">
                                    <label class="form-check-label" for="uzak_calisma">Uzak Çalışma</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="saklama_suresi_imha_plani" class="form-label">Saklama Süresi/İmha Planı *</label>
                        <input type="file" class="form-control" id="saklama_suresi_imha_plani" name="saklama_suresi_imha_plani" required>
                        <div class="invalid-feedback">Saklama süresi/imha planı yükleyiniz</div>
                    </div>
                    <div class="col-12">
                        <h6 class="border-top pt-3 mb-3">İşten Ayrılış Evrakları (Düzenle Modunda)</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="fesih_bildirimi" class="form-label">Fesih Bildirimi</label>
                                <input type="file" class="form-control" id="fesih_bildirimi" name="fesih_bildirimi">
                            </div>
                            <div class="col-md-6">
                                <label for="cikis_mulakati_formu" class="form-label">Çıkış Mülakat Formu</label>
                                <input type="file" class="form-control" id="cikis_mulakati_formu" name="cikis_mulakati_formu">
                            </div>
                            <div class="col-md-6">
                                <label for="ibraname" class="form-label">İbraname</label>
                                <input type="file" class="form-control" id="ibraname" name="ibraname">
                            </div>
                            <div class="col-md-6">
                                <label for="zimmet_iade_formu" class="form-label">Zimmet İade Formu</label>
                                <input type="file" class="form-control" id="zimmet_iade_formu" name="zimmet_iade_formu">
                            </div>
                            <div class="col-12">
                                <label for="kidem_ihbar_hesap_ozeti" class="form-label">Kıdem/İhbar Hesap Özeti</label>
                                <input type="file" class="form-control" id="kidem_ihbar_hesap_ozeti" name="kidem_ihbar_hesap_ozeti">
                            </div>
                        </div>
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
                        <textarea class="form-control" id="gorev_tanimlari" name="gorev_tanimlari" rows="6" placeholder="Departman bazlı görev tanımlarını giriniz..."></textarea>
                    </div>
                    <div class="col-12">
                        <label for="gelen_gorsele_gore" class="form-label">Gelen Görsele Göre</label>
                        <textarea class="form-control" id="gelen_gorsele_gore" name="gelen_gorsele_gore" rows="6" placeholder="Gelen görsele göre özel tanımları giriniz..."></textarea>
                    </div>
                    <div class="col-12">
                        <label for="departman_gorev_dosyasi" class="form-label">Departman Görev Dosyası</label>
                        <input type="file" class="form-control" id="departman_gorev_dosyasi" name="departman_gorev_dosyasi">
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
    
    bindEvents() {
        // Geri dön butonu
        const backBtn = this.$('#back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (window.router) {
                    window.router.navigate('/personnel-list');
                }
            });
        }
        
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
        
        // Koşullu alanlar
        this.setupConditionalFields();
        
        // Repeatable groups
        this.setupRepeatableGroups();
        
        // Initial validation check
        setTimeout(() => {
            this.updateFormValidation();
        }, 100);
    }
    
    isTabCompleted(tabIndex) {
        // Basit validation - gerçek uygulamada daha detaylı olacak
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
                        personel_sicil_no: 'P001',
                        ad_soyad: 'Ahmet Yılmaz',
                        tc_kimlik: '12345678901',
                        telefon: '0532 123 45 67',
                        email: 'ahmet.yilmaz@example.com'
                    },
                    loading: false 
                });
                this.populateForm();
            }, 1000);
        } catch (error) {
            console.error('Personel verisi yüklenirken hata:', error);
            toastr.error('Personel verisi yüklenirken hata oluştu');
            this.setState({ loading: false });
        }
    }
    
    populateForm() {
        // Form alanlarını doldur
        Object.keys(this.state.formData).forEach(key => {
            const input = this.$(`[name="${key}"]`);
            if (input) {
                input.value = this.state.formData[key];
            }
        });
    }
    
    async handleSubmit() {
        const form = this.$('#personnel-form');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            toastr.warning('Lütfen gerekli alanları doldurun');
            return;
        }
        
        this.setState({ saving: true });
        
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // API çağrısı burada yapılacak
            if (this.state.isEditMode) {
                // await apiClient.put(`/personnel/${this.state.personnelId}`, data);
                toastr.success('Personel bilgileri güncellendi');
            } else {
                // await apiClient.post('/personnel', data);
                toastr.success('Yeni personel eklendi');
            }
            
            // Başarılı kayıt sonrası listeye dön
            setTimeout(() => {
                if (window.router) {
                    window.router.navigate('/personnel-list');
                }
            }, 1500);
            
        } catch (error) {
            console.error('Form kaydedilirken hata:', error);
            toastr.error('Form kaydedilirken hata oluştu');
        } finally {
            this.setState({ saving: false });
        }
    }
    
    setupConditionalFields() {
        // Uyruk değiştiğinde TC kimlik alanını göster/gizle
        const uyruklSelect = this.$('#uyruk');
        if (uyruklSelect) {
            uyruklSelect.addEventListener('change', (e) => {
                const tcGroup = this.$('#tc_kimlik_group');
                const tcInput = this.$('#tc_kimlik_no');
                const calismaIzniGroup = this.$('#calisma_izni_group');
                
                if (e.target.value === 'TR') {
                    tcGroup.style.display = 'block';
                    tcInput.required = true;
                    calismaIzniGroup.style.display = 'none';
                } else if (e.target.value && e.target.value !== 'TR') {
                    tcGroup.style.display = 'none';
                    tcInput.required = false;
                    calismaIzniGroup.style.display = 'block';
                } else {
                    tcGroup.style.display = 'none';
                    tcInput.required = false;
                    calismaIzniGroup.style.display = 'none';
                }
            });
        }
        
        // Medeni durum değiştiğinde eş bilgileri alanını göster/gizle
        const medeniDurumSelect = this.$('#medeni_durum');
        if (medeniDurumSelect) {
            medeniDurumSelect.addEventListener('change', (e) => {
                const esBilgileriGroup = this.$('#es_bilgileri_group');
                const cocukBilgileriGroup = this.$('#cocuk_bilgileri_group');
                
                if (e.target.value === 'Evli') {
                    esBilgileriGroup.style.display = 'block';
                    cocukBilgileriGroup.style.display = 'block';
                } else {
                    esBilgileriGroup.style.display = 'none';
                    cocukBilgileriGroup.style.display = 'none';
                }
            });
        }
        
        // Açık rıza gerekli mi switch'i
        const acikRizaSwitch = this.$('#acik_riza_gerekli_mi');
        if (acikRizaSwitch) {
            acikRizaSwitch.addEventListener('change', (e) => {
                const acikRizaGroup = this.$('#acik_riza_group');
                acikRizaGroup.style.display = e.target.checked ? 'block' : 'none';
            });
        }
        
        // Adli sicil gerekli mi switch'i
        const adliSicilSwitch = this.$('#adli_sicil_gerekli_mi');
        if (adliSicilSwitch) {
            adliSicilSwitch.addEventListener('change', (e) => {
                const adliSicilGroup = this.$('#adli_sicil_group');
                adliSicilGroup.style.display = e.target.checked ? 'block' : 'none';
            });
        }
        
        // Ehliyet sınıfı değiştiğinde belgeler
        const ehliyetSelect = this.$('#ehliyet_sinifi');
        if (ehliyetSelect) {
            ehliyetSelect.addEventListener('change', (e) => {
                const srcGroup = this.$('#src_belgesi_group');
                const psikoteknikGroup = this.$('#psikoteknik_group');
                
                if (e.target.value) {
                    srcGroup.style.display = 'block';
                    psikoteknikGroup.style.display = 'block';
                } else {
                    srcGroup.style.display = 'none';
                    psikoteknikGroup.style.display = 'none';
                }
            });
        }
        
        // Engellilik durumu
        const engellilikSelect = this.$('#engellilik_durumu');
        if (engellilikSelect) {
            engellilikSelect.addEventListener('change', (e) => {
                const oraniGroup = this.$('#engellilik_orani_group');
                const belgesiGroup = this.$('#engellilik_belgesi_group');
                
                if (e.target.value === 'Var') {
                    oraniGroup.style.display = 'block';
                    belgesiGroup.style.display = 'block';
                } else {
                    oraniGroup.style.display = 'none';
                    belgesiGroup.style.display = 'none';
                }
            });
        }
        
        // BES durumu
        const besSelect = this.$('#bes_durumu');
        if (besSelect) {
            besSelect.addEventListener('change', (e) => {
                const besFirmasiGroup = this.$('#bes_firmasi_group');
                besFirmasiGroup.style.display = e.target.value === 'Otomatik katılım' ? 'block' : 'none';
            });
        }
        
        // Avans alabilir switch'i
        const avansSwitch = this.$('#avans_alir');
        if (avansSwitch) {
            avansSwitch.addEventListener('change', (e) => {
                const limitGroup = this.$('#avans_limit_group');
                const politikaGroup = this.$('#avans_politika_group');
                
                if (e.target.checked) {
                    limitGroup.style.display = 'block';
                    politikaGroup.style.display = 'block';
                } else {
                    limitGroup.style.display = 'none';
                    politikaGroup.style.display = 'none';
                }
            });
        }
        
        // Vardiya planı var switch'i
        const vardiyaSwitch = this.$('#vardiya_plani_var');
        if (vardiyaSwitch) {
            vardiyaSwitch.addEventListener('change', (e) => {
                const vardiyaSablonuGroup = this.$('#vardiya_sablonu_group');
                vardiyaSablonuGroup.style.display = e.target.checked ? 'block' : 'none';
            });
        }
        
        // Disiplin kaydı var switch'i
        const disiplinSwitch = this.$('#disiplin_kaydi_var');
        if (disiplinSwitch) {
            disiplinSwitch.addEventListener('change', (e) => {
                const disiplinGroup = this.$('#disiplin_group');
                disiplinGroup.style.display = e.target.checked ? 'block' : 'none';
            });
        }
        
        // İş kazası/meslek hastalığı switch'i
        const isKazasiSwitch = this.$('#is_kazasi_meslek_hastaligi');
        if (isKazasiSwitch) {
            isKazasiSwitch.addEventListener('change', (e) => {
                const olayKayitlariGroup = this.$('#olay_kayitlari_group');
                olayKayitlariGroup.style.display = e.target.checked ? 'block' : 'none';
            });
        }
    }
    
    setupRepeatableGroups() {
        // Acil durum kişileri
        const addEmergencyBtn = this.$('#add-emergency-contact');
        if (addEmergencyBtn) {
            addEmergencyBtn.addEventListener('click', () => {
                this.addEmergencyContact();
            });
        }
        
        // Eğitim ekleme
        const addEducationBtn = this.$('#add-education');
        if (addEducationBtn) {
            addEducationBtn.addEventListener('click', () => {
                this.addEducation();
            });
        }
        
        // Sertifika ekleme
        const addCertificateBtn = this.$('#add-certificate');
        if (addCertificateBtn) {
            addCertificateBtn.addEventListener('click', () => {
                this.addCertificate();
            });
        }
        
        // Dil ekleme
        const addLanguageBtn = this.$('#add-language');
        if (addLanguageBtn) {
            addLanguageBtn.addEventListener('click', () => {
                this.addLanguage();
            });
        }
        
        // Referans ekleme
        const addReferenceBtn = this.$('#add-reference');
        if (addReferenceBtn) {
            addReferenceBtn.addEventListener('click', () => {
                this.addReference();
            });
        }
        
        // Tecrübe ekleme
        const addExperienceBtn = this.$('#add-experience');
        if (addExperienceBtn) {
            addExperienceBtn.addEventListener('click', () => {
                this.addExperience();
            });
        }
    }
    
    addEmergencyContact() {
        const container = this.$('#emergency-contacts-container');
        const index = container.children.length;
        
        const html = `
            <div class="emergency-contact-item border rounded p-3 mb-3 position-relative">
                <button type="button" class="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2" onclick="this.parentElement.remove()">
                    <i class="bi bi-x"></i>
                </button>
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label">Ad Soyad *</label>
                        <input type="text" class="form-control" name="emergency_contacts[${index}][ad_soyad]" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">İlişki</label>
                        <select class="form-select" name="emergency_contacts[${index}][iliski]">
                            <option value="">Seçiniz</option>
                            <option value="Anne">Anne</option>
                            <option value="Baba">Baba</option>
                            <option value="Eş">Eş</option>
                            <option value="Kardeş">Kardeş</option>
                            <option value="Arkadaş">Arkadaş</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Telefon *</label>
                        <input type="tel" class="form-control" name="emergency_contacts[${index}][telefon]" 
                               pattern="^[0-9 +()-]{7,20}$" required>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
    }
    
    addEducation() {
        const container = this.$('#education-container');
        const index = container.children.length;
        
        const html = `
            <div class="repeatable-group-item border rounded p-3 mb-3 position-relative">
                <button type="button" class="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2" onclick="this.parentElement.remove()">
                    <i class="bi bi-x"></i>
                </button>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Okul *</label>
                        <input type="text" class="form-control" name="education[${index}][okul]" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Bölüm</label>
                        <input type="text" class="form-control" name="education[${index}][bolum]">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Mezuniyet Yılı</label>
                        <input type="number" class="form-control" name="education[${index}][mezuniyet_yili]" min="1900" max="2030">
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
    }
    
    addCertificate() {
        const container = this.$('#certificates-container');
        const index = container.children.length;
        
        const html = `
            <div class="repeatable-group-item border rounded p-3 mb-3 position-relative">
                <button type="button" class="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2" onclick="this.parentElement.remove()">
                    <i class="bi bi-x"></i>
                </button>
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label">Belge Adı</label>
                        <input type="text" class="form-control" name="certificates[${index}][belge_adi]">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Kurum</label>
                        <input type="text" class="form-control" name="certificates[${index}][kurum]">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Tarih</label>
                        <input type="date" class="form-control" name="certificates[${index}][tarih]">
                    </div>
                    <div class="col-12">
                        <label class="form-label">Belge Dosyası</label>
                        <input type="file" class="form-control" name="certificates[${index}][belge_dosyasi]">
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
    }
    
    addLanguage() {
        const container = this.$('#languages-container');
        const index = container.children.length;
        
        const html = `
            <div class="repeatable-group-item border rounded p-3 mb-3 position-relative">
                <button type="button" class="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2" onclick="this.parentElement.remove()">
                    <i class="bi bi-x"></i>
                </button>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Dil</label>
                        <select class="form-select" name="languages[${index}][dil]">
                            <option value="">Seçiniz</option>
                            <option value="İngilizce">İngilizce</option>
                            <option value="Almanca">Almanca</option>
                            <option value="Fransızca">Fransızca</option>
                            <option value="İspanyolca">İspanyolca</option>
                            <option value="Arapça">Arapça</option>
                            <option value="Diğer">Diğer</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Seviye</label>
                        <select class="form-select" name="languages[${index}][seviye]">
                            <option value="">Seçiniz</option>
                            <option value="A1">A1 - Başlangıç</option>
                            <option value="A2">A2 - Temel</option>
                            <option value="B1">B1 - Orta Alt</option>
                            <option value="B2">B2 - Orta Üst</option>
                            <option value="C1">C1 - İleri</option>
                            <option value="C2">C2 - Uzman</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
    }
    
    addReference() {
        const container = this.$('#references-container');
        const index = container.children.length;
        
        const html = `
            <div class="repeatable-group-item border rounded p-3 mb-3 position-relative">
                <button type="button" class="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2" onclick="this.parentElement.remove()">
                    <i class="bi bi-x"></i>
                </button>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Ad Soyad</label>
                        <input type="text" class="form-control" name="references[${index}][ad_soyad]">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">İletişim</label>
                        <input type="text" class="form-control" name="references[${index}][iletisim]" placeholder="Telefon veya e-posta">
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
    }
    
    addExperience() {
        const container = this.$('#experience-container');
        const index = container.children.length;
        
        const html = `
            <div class="repeatable-group-item border rounded p-3 mb-3 position-relative">
                <button type="button" class="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2" onclick="this.parentElement.remove()">
                    <i class="bi bi-x"></i>
                </button>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Firma Adı</label>
                        <input type="text" class="form-control" name="experience[${index}][firma_adi]">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Pozisyon</label>
                        <input type="text" class="form-control" name="experience[${index}][pozisyon]">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Başlangıç</label>
                        <input type="month" class="form-control" name="experience[${index}][baslangic]">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Bitiş</label>
                        <input type="month" class="form-control" name="experience[${index}][bitis]" placeholder="Boş=devam ediyor">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">İç/Dışı</label>
                        <select class="form-select" name="experience[${index}][ic_disi]">
                            <option value="">Seçiniz</option>
                            <option value="Şirket içi">Şirket İçi</option>
                            <option value="Şirket dışı">Şirket Dışı</option>
                        </select>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Ayrıntı Dosyası</label>
                        <input type="file" class="form-control" name="experience[${index}][ayrinti_dosya]">
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
    }
}

window.PersonnelForm = PersonnelForm;
