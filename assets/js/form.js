/**
 * Form Management for Personnel Add/Edit
 * Handles validation, conditional fields, repeatable groups, and form submission
 */

class PersonnelForm {
    constructor() {
        this.form = document.getElementById('personnel-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.cancelBtn = document.getElementById('cancel-btn');
        this.pageTitle = document.getElementById('page-title');
        
        this.isEditMode = false;
        this.personnelId = null;
        this.validationRules = this.initValidationRules();
        this.conditionalFields = this.initConditionalFields();
        this.repeatableGroups = this.initRepeatableGroups();
        
        this.init();
    }

    /**
     * Initialize form manager
     */
    init() {
        this.setupFormValidation();
        this.setupConditionalFields();
        this.setupRepeatableGroups();
        this.setupFileUploads();
        this.setupFormSubmission();
        this.setupRequiredFieldValidation();
        
        console.log('Form manager initialized successfully');
    }

    /**
     * Setup required field validation for submit button
     */
    setupRequiredFieldValidation() {
        const form = document.getElementById('personnel-form');
        const submitBtn = document.getElementById('submit-btn');
        
        if (!form || !submitBtn) return;

        // Check required fields on input change
        const checkRequiredFields = () => {
            const requiredFields = form.querySelectorAll('[required]');
            let allValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    allValid = false;
                }
                
                // Special validation for conditional required fields
                const fieldGroup = field.closest('[id$="_group"]');
                if (fieldGroup && fieldGroup.style.display === 'none') {
                    // Skip validation for hidden conditional fields
                    return;
                }
            });

            submitBtn.disabled = !allValid;
            
            if (allValid) {
                submitBtn.classList.remove('btn-secondary');
                submitBtn.classList.add('btn-primary');
            } else {
                submitBtn.classList.remove('btn-primary');
                submitBtn.classList.add('btn-secondary');
            }
        };

        // Add event listeners to all form inputs
        form.addEventListener('input', checkRequiredFields);
        form.addEventListener('change', checkRequiredFields);
        
        // Initial check
        checkRequiredFields();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Cancel button
        this.cancelBtn.addEventListener('click', () => this.handleCancel());
        
        // Tab navigation validation
        document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (e) => this.onTabChange(e));
        });
        
        // Real-time validation
        this.form.addEventListener('input', (e) => this.handleInputChange(e));
        this.form.addEventListener('change', (e) => this.handleFieldChange(e));
        
        // File input changes
        this.form.addEventListener('change', (e) => {
            if (e.target.type === 'file') {
                this.handleFileChange(e);
            }
        });
    }

    /**
     * Setup form validation
     */
    setupValidation() {
        // Add Bootstrap validation classes
        this.form.classList.add('needs-validation');
        
        // Custom validation messages
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.showFieldError(field);
            });
            
            field.addEventListener('input', () => {
                if (field.checkValidity()) {
                    this.clearFieldError(field);
                }
            });
        });
    }

    /**
     * Initialize validation rules
     */
    initValidationRules() {
        return {
            personel_sicil_no: {
                required: true,
                pattern: /^[A-Za-z0-9-_]{3,32}$/,
                message: 'Geçerli bir sicil numarası giriniz (3-32 karakter, harf, rakam, - ve _ kullanılabilir)'
            },
            ad_soyad: {
                required: true,
                minWords: 2,
                message: 'Ad ve soyad giriniz'
            },
            tc_kimlik_no: {
                pattern: /^[0-9]{11}$/,
                message: '11 haneli TC kimlik numarası giriniz',
                conditional: () => document.getElementById('uyruk').value === 'TR'
            },
            kisisel_tel: {
                required: true,
                pattern: /^[0-9 +()-]{7,20}$/,
                message: 'Geçerli telefon numarası giriniz'
            },
            kisisel_eposta: {
                required: true,
                type: 'email',
                message: 'Geçerli e-posta adresi giriniz'
            },
            iban: {
                pattern: /^TR[0-9A-Z]{24}$/,
                message: 'Geçerli IBAN numarası giriniz (TR ile başlamalı)'
            }
        };
    }

    /**
     * Initialize conditional fields configuration
     */
    initConditionalFields() {
        return {
            // TC Kimlik field - show when nationality is TR
            tc_kimlik_group: {
                trigger: 'uyruk',
                condition: (value) => value === 'TR',
                required: true
            },
            // BES firması - show when BES durumu is Otomatik Katılım
            bes_firmasi_group: {
                trigger: 'bes_durumu',
                condition: (value) => value === 'Otomatik Katılım'
            },
            // Avans limit fields
            avans_limit_group: {
                trigger: 'avans_alir',
                condition: (value) => value === true || value === 'on'
            },
            avans_politika_group: {
                trigger: 'avans_alir',
                condition: (value) => value === true || value === 'on'
            },
            // Vardiya şablonu
            vardiya_sablonu_group: {
                trigger: 'vardiya_plani_var',
                condition: (value) => value === true || value === 'on'
            },
            // Disiplin kaydı fields
            uyari_ihtar_group: {
                trigger: 'disiplin_kaydi_var',
                condition: (value) => value === true || value === 'on'
            },
            savunma_group: {
                trigger: 'disiplin_kaydi_var',
                condition: (value) => value === true || value === 'on'
            },
            kurul_karari_group: {
                trigger: 'disiplin_kaydi_var',
                condition: (value) => value === true || value === 'on'
            },
            // İş kazası olay kayıtları
            olay_kayitlari_group: {
                trigger: 'is_kazasi_meslek_hastaligi',
                condition: (value) => value === true || value === 'on'
            },
            // Spouse info - show when married
            es_bilgileri_group: {
                trigger: 'medeni_durum',
                condition: (value) => value === 'Evli'
            },
            // Children info - show when married (could be enhanced with separate checkbox)
            cocuk_bilgileri_group: {
                trigger: 'medeni_durum',
                condition: (value) => value === 'Evli'
            },
            // Work permit fields - show when nationality is not TR
            calisma_izni_group: {
                trigger: 'uyruk',
                condition: (value) => value !== 'TR' && value !== ''
            },
            calisma_izni_belge_group: {
                trigger: 'calisma_ikamet_izni_durumu',
                condition: (value) => value === 'Var'
            },
            ikamet_izni_belge_group: {
                trigger: 'calisma_ikamet_izni_durumu',
                condition: (value) => value === 'Var'
            },
            // Explicit consent field
            acik_riza_group: {
                trigger: 'acik_riza_gerekli_mi',
                condition: (value) => value === true || value === 'on'
            },
            // Criminal record
            adli_sicil_group: {
                trigger: 'adli_sicil_gerekli_mi',
                condition: (value) => value === true || value === 'on'
            },
            // Driver's license related fields
            src_belgesi_group: {
                trigger: 'ehliyet_sinifi',
                condition: (value) => value !== ''
            },
            psikoteknik_group: {
                trigger: 'ehliyet_sinifi',
                condition: (value) => value !== ''
            },
            // Disability fields
            engellilik_orani_group: {
                trigger: 'engellilik_durumu',
                condition: (value) => value === 'Var'
            },
            engellilik_belgesi_group: {
                trigger: 'engellilik_durumu',
                condition: (value) => value === 'Var'
            }
        };
    }

    /**
     * Initialize repeatable groups configuration
     */
    initRepeatableGroups() {
        return {
            'emergency-contacts': {
                container: 'emergency-contacts-container',
                addButton: 'add-emergency-contact',
                template: this.getEmergencyContactTemplate(),
                maxItems: 5
            },
            'education': {
                container: 'education-container',
                addButton: 'add-education',
                template: this.getEducationTemplate(),
                maxItems: 10
            },
            'certificates': {
                container: 'certificates-container',
                addButton: 'add-certificate',
                template: this.getCertificateTemplate(),
                maxItems: 10
            },
            'languages': {
                container: 'languages-container',
                addButton: 'add-language',
                template: this.getLanguageTemplate(),
                maxItems: 5
            },
            'references': {
                container: 'references-container',
                addButton: 'add-reference',
                template: this.getReferenceTemplate(),
                maxItems: 3
            },
            'experience': {
                container: 'experience-container',
                addButton: 'add-experience',
                template: this.getExperienceTemplate(),
                maxItems: 10
            }
        };
    }

    /**
     * Setup conditional field logic
     */
    setupConditionalFields() {
        Object.keys(this.conditionalFields).forEach(fieldId => {
            const config = this.conditionalFields[fieldId];
            const triggerField = document.getElementById(config.trigger);
            const targetField = document.getElementById(fieldId);
            
            if (triggerField && targetField) {
                // Initial state
                this.toggleConditionalField(fieldId, config, triggerField.value || triggerField.checked);
                
                // Listen for changes
                triggerField.addEventListener('change', (e) => {
                    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
                    this.toggleConditionalField(fieldId, config, value);
                });
            }
        });
    }

    /**
     * Toggle conditional field visibility
     */
    toggleConditionalField(fieldId, config, triggerValue) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        const shouldShow = config.condition(triggerValue);
        
        if (shouldShow) {
            field.style.display = '';
            field.classList.remove('hidden');
            
            // Make required if specified
            if (config.required) {
                const inputs = field.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    if (!input.hasAttribute('data-original-required')) {
                        input.setAttribute('data-original-required', input.required);
                    }
                    input.required = true;
                });
            }
        } else {
            field.style.display = 'none';
            field.classList.add('hidden');
            
            // Remove required and clear values
            const inputs = field.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.required = false;
                if (input.type !== 'file') {
                    input.value = '';
                }
                this.clearFieldError(input);
            });
        }
    }

    /**
     * Setup repeatable groups
     */
    setupRepeatableGroups() {
        Object.keys(this.repeatableGroups).forEach(groupKey => {
            const config = this.repeatableGroups[groupKey];
            const addButton = document.getElementById(config.addButton);
            
            if (addButton) {
                addButton.addEventListener('click', () => {
                    this.addRepeatableItem(groupKey, config);
                });
            }
        });
    }

    /**
     * Add item to repeatable group
     */
    addRepeatableItem(groupKey, config) {
        const container = document.getElementById(config.container);
        if (!container) return;

        const currentItems = container.children.length;
        if (currentItems >= config.maxItems) {
            toastr.warning(`En fazla ${config.maxItems} kayıt ekleyebilirsiniz.`);
            return;
        }

        const itemDiv = document.createElement('div');
        itemDiv.className = 'repeatable-group-item';
        itemDiv.innerHTML = config.template.replace(/\{INDEX\}/g, currentItems);
        
        container.appendChild(itemDiv);

        // Add remove button functionality
        const removeBtn = itemDiv.querySelector('.btn-remove');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                itemDiv.remove();
                this.reindexRepeatableGroup(container);
            });
        }

        // Setup validation for new fields
        this.setupFieldValidation(itemDiv);
    }

    /**
     * Reindex repeatable group items
     */
    reindexRepeatableGroup(container) {
        Array.from(container.children).forEach((item, index) => {
            const inputs = item.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                const name = input.name;
                if (name) {
                    input.name = name.replace(/\[\d+\]/, `[${index}]`);
                    input.id = input.id.replace(/_\d+$/, `_${index}`);
                }
            });
            
            const labels = item.querySelectorAll('label');
            labels.forEach(label => {
                const forAttr = label.getAttribute('for');
                if (forAttr) {
                    label.setAttribute('for', forAttr.replace(/_\d+$/, `_${index}`));
                }
            });
        });
    }

    /**
     * Get emergency contact template
     */
    getEmergencyContactTemplate() {
        return `
            <div class="row g-3">
                <div class="col-md-4">
                    <label for="emergency_contact_name_{INDEX}" class="form-label">Ad Soyad *</label>
                    <input type="text" class="form-control" id="emergency_contact_name_{INDEX}" 
                           name="emergency_contacts[{INDEX}][name]" required>
                    <div class="invalid-feedback">Ad soyad giriniz</div>
                </div>
                <div class="col-md-3">
                    <label for="emergency_contact_relation_{INDEX}" class="form-label">İlişki</label>
                    <select class="form-select" id="emergency_contact_relation_{INDEX}" 
                            name="emergency_contacts[{INDEX}][relation]">
                        <option value="">Seçiniz</option>
                        <option value="Eş">Eş</option>
                        <option value="Anne">Anne</option>
                        <option value="Baba">Baba</option>
                        <option value="Kardeş">Kardeş</option>
                        <option value="Çocuk">Çocuk</option>
                        <option value="Arkadaş">Arkadaş</option>
                        <option value="Diğer">Diğer</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label for="emergency_contact_phone_{INDEX}" class="form-label">Telefon *</label>
                    <input type="tel" class="form-control" id="emergency_contact_phone_{INDEX}" 
                           name="emergency_contacts[{INDEX}][phone]" pattern="^[0-9 +()-]{7,20}$" required>
                    <div class="invalid-feedback">Geçerli telefon numarası giriniz</div>
                </div>
                <div class="col-md-1">
                    <label class="form-label">&nbsp;</label>
                    <button type="button" class="btn btn-outline-danger btn-sm btn-remove w-100">
                        Sil
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get education template
     */
    getEducationTemplate() {
        return `
            <div class="row g-3">
                <div class="col-md-4">
                    <label for="education_school_{INDEX}" class="form-label">Okul *</label>
                    <input type="text" class="form-control" id="education_school_{INDEX}" 
                           name="education[{INDEX}][school]" required>
                    <div class="invalid-feedback">Okul adı giriniz</div>
                </div>
                <div class="col-md-3">
                    <label for="education_department_{INDEX}" class="form-label">Bölüm</label>
                    <input type="text" class="form-control" id="education_department_{INDEX}" 
                           name="education[{INDEX}][department]">
                </div>
                <div class="col-md-3">
                    <label for="education_year_{INDEX}" class="form-label">Mezuniyet Yılı</label>
                    <input type="number" class="form-control" id="education_year_{INDEX}" 
                           name="education[{INDEX}][year]" min="1900" max="2030">
                </div>
                <div class="col-md-1">
                    <label class="form-label">&nbsp;</label>
                    <button type="button" class="btn btn-outline-danger btn-sm btn-remove w-100">
                        Sil
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get certificate template
     */
    getCertificateTemplate() {
        return `
            <div class="row g-3">
                <div class="col-md-3">
                    <label for="certificate_name_{INDEX}" class="form-label">Belge Adı</label>
                    <input type="text" class="form-control" id="certificate_name_{INDEX}" 
                           name="certificates[{INDEX}][name]">
                </div>
                <div class="col-md-3">
                    <label for="certificate_institution_{INDEX}" class="form-label">Kurum</label>
                    <input type="text" class="form-control" id="certificate_institution_{INDEX}" 
                           name="certificates[{INDEX}][institution]">
                </div>
                <div class="col-md-2">
                    <label for="certificate_date_{INDEX}" class="form-label">Tarih</label>
                    <input type="date" class="form-control" id="certificate_date_{INDEX}" 
                           name="certificates[{INDEX}][date]">
                </div>
                <div class="col-md-3">
                    <label for="certificate_file_{INDEX}" class="form-label">Belge Dosyası</label>
                    <input type="file" class="form-control" id="certificate_file_{INDEX}" 
                           name="certificates[{INDEX}][file]">
                </div>
                <div class="col-md-1">
                    <label class="form-label">&nbsp;</label>
                    <button type="button" class="btn btn-outline-danger btn-sm btn-remove w-100">
                        Sil
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get language template
     */
    getLanguageTemplate() {
        return `
            <div class="row g-3">
                <div class="col-md-5">
                    <label for="language_name_{INDEX}" class="form-label">Dil</label>
                    <select class="form-select" id="language_name_{INDEX}" 
                            name="languages[{INDEX}][name]">
                        <option value="">Seçiniz</option>
                        <option value="İngilizce">İngilizce</option>
                        <option value="Almanca">Almanca</option>
                        <option value="Fransızca">Fransızca</option>
                        <option value="İspanyolca">İspanyolca</option>
                        <option value="İtalyanca">İtalyanca</option>
                        <option value="Rusça">Rusça</option>
                        <option value="Arapça">Arapça</option>
                        <option value="Diğer">Diğer</option>
                    </select>
                </div>
                <div class="col-md-5">
                    <label for="language_level_{INDEX}" class="form-label">Seviye</label>
                    <select class="form-select" id="language_level_{INDEX}" 
                            name="languages[{INDEX}][level]">
                        <option value="">Seçiniz</option>
                        <option value="A1">A1 - Başlangıç</option>
                        <option value="A2">A2 - Temel</option>
                        <option value="B1">B1 - Orta Alt</option>
                        <option value="B2">B2 - Orta Üst</option>
                        <option value="C1">C1 - İleri</option>
                        <option value="C2">C2 - Üst Düzey</option>
                    </select>
                </div>
                <div class="col-md-1">
                    <label class="form-label">&nbsp;</label>
                    <button type="button" class="btn btn-outline-danger btn-sm btn-remove w-100">
                        Sil
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get reference template
     */
    getReferenceTemplate() {
        return `
            <div class="row g-3">
                <div class="col-md-5">
                    <label for="reference_name_{INDEX}" class="form-label">Ad Soyad</label>
                    <input type="text" class="form-control" id="reference_name_{INDEX}" 
                           name="references[{INDEX}][name]">
                </div>
                <div class="col-md-5">
                    <label for="reference_contact_{INDEX}" class="form-label">İletişim</label>
                    <input type="text" class="form-control" id="reference_contact_{INDEX}" 
                           name="references[{INDEX}][contact]" placeholder="Telefon veya E-posta">
                </div>
                <div class="col-md-1">
                    <label class="form-label">&nbsp;</label>
                    <button type="button" class="btn btn-outline-danger btn-sm btn-remove w-100">
                        Sil
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get experience template
     */
    getExperienceTemplate() {
        return `
            <div class="row g-3">
                <div class="col-md-3">
                    <label for="experience_company_{INDEX}" class="form-label">Firma Adı</label>
                    <input type="text" class="form-control" id="experience_company_{INDEX}" 
                           name="experience[{INDEX}][company]">
                </div>
                <div class="col-md-3">
                    <label for="experience_position_{INDEX}" class="form-label">Pozisyon</label>
                    <input type="text" class="form-control" id="experience_position_{INDEX}" 
                           name="experience[{INDEX}][position]">
                </div>
                <div class="col-md-2">
                    <label for="experience_start_{INDEX}" class="form-label">Başlangıç</label>
                    <input type="month" class="form-control" id="experience_start_{INDEX}" 
                           name="experience[{INDEX}][start]">
                </div>
                <div class="col-md-2">
                    <label for="experience_end_{INDEX}" class="form-label">Bitiş</label>
                    <input type="month" class="form-control" id="experience_end_{INDEX}" 
                           name="experience[{INDEX}][end]" placeholder="Boş=devam">
                </div>
                <div class="col-md-1">
                    <label class="form-label">&nbsp;</label>
                    <button type="button" class="btn btn-outline-danger btn-sm btn-remove w-100">
                        Sil
                    </button>
                </div>
                <div class="col-md-4">
                    <label for="experience_type_{INDEX}" class="form-label">İç/Dış</label>
                    <select class="form-select" id="experience_type_{INDEX}" 
                            name="experience[{INDEX}][type]">
                        <option value="">Seçiniz</option>
                        <option value="Şirket İçi">Şirket İçi</option>
                        <option value="Şirket Dışı">Şirket Dışı</option>
                    </select>
                </div>
                <div class="col-md-7">
                    <label for="experience_file_{INDEX}" class="form-label">Ayrıntı Dosyası</label>
                    <input type="file" class="form-control" id="experience_file_{INDEX}" 
                           name="experience[{INDEX}][file]">
                </div>
            </div>
        `;
    }

    /**
     * Setup field validation for new elements
     */
    setupFieldValidation(container) {
        const fields = container.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.showFieldError(field);
            });
            
            field.addEventListener('input', () => {
                if (field.checkValidity()) {
                    this.clearFieldError(field);
                }
            });
        });
    }

    /**
     * Handle input changes for real-time validation
     */
    handleInputChange(e) {
        const field = e.target;
        if (field.type === 'file') return;

        // Clear previous validation state
        this.clearFieldError(field);
        
        // Validate field
        if (field.value.trim() !== '') {
            this.validateField(field);
        }
    }

    /**
     * Handle field changes (select, checkbox, etc.)
     */
    handleFieldChange(e) {
        const field = e.target;
        this.validateField(field);
    }

    /**
     * Handle file input changes
     */
    handleFileChange(e) {
        const field = e.target;
        const files = field.files;
        
        if (files.length > 0) {
            // Validate file size and type
            Array.from(files).forEach(file => {
                if (!this.validateFile(file, field)) {
                    field.value = '';
                }
            });
        }
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        const fieldName = field.name.split('[')[0]; // Handle array names
        const rule = this.validationRules[fieldName];
        
        if (!rule) return true;

        // Check if field is conditionally required
        if (rule.conditional && !rule.conditional()) {
            return true;
        }

        let isValid = true;
        let message = '';

        // Required validation
        if (rule.required && (!field.value || field.value.trim() === '')) {
            isValid = false;
            message = rule.message || 'Bu alan zorunludur';
        }
        
        // Pattern validation
        else if (rule.pattern && field.value && !rule.pattern.test(field.value)) {
            isValid = false;
            message = rule.message || 'Geçersiz format';
        }
        
        // Min words validation (for names)
        else if (rule.minWords && field.value) {
            const words = field.value.trim().split(/\s+/).filter(word => word.length > 0);
            if (words.length < rule.minWords) {
                isValid = false;
                message = rule.message || `En az ${rule.minWords} kelime giriniz`;
            }
        }
        
        // Email validation
        else if (rule.type === 'email' && field.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(field.value)) {
                isValid = false;
                message = rule.message || 'Geçerli e-posta adresi giriniz';
            }
        }

        if (isValid) {
            this.clearFieldError(field);
        } else {
            this.showFieldError(field, message);
        }

        return isValid;
    }

    /**
     * Validate file
     */
    validateFile(file, field) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = {
            image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
            document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        };

        // Size validation
        if (file.size > maxSize) {
            this.showFieldError(field, 'Dosya boyutu 5MB\'dan büyük olamaz');
            return false;
        }

        // Type validation for image fields
        if (field.accept && field.accept.includes('image/*')) {
            if (!allowedTypes.image.includes(file.type)) {
                this.showFieldError(field, 'Sadece resim dosyaları yükleyebilirsiniz');
                return false;
            }
        }

        this.clearFieldError(field);
        return true;
    }

    /**
     * Show field error
     */
    showFieldError(field, message = null) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback && message) {
            feedback.textContent = message;
        }
    }

    /**
     * Clear field error
     */
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        if (field.checkValidity() && field.value.trim() !== '') {
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
        }
    }

    /**
     * Validate entire form
     */
    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            // Skip hidden fields
            if (field.closest('.hidden') || field.closest('[style*="display: none"]')) {
                return;
            }
            
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateForm()) {
            toastr.error('Lütfen tüm zorunlu alanları doldurun ve hataları düzeltin.');
            this.focusFirstError();
            return;
        }

        // Disable submit button and show loading
        this.setSubmitLoading(true);

        try {
            // Collect form data
            const formData = this.collectFormData();
            
            let result;
            if (this.isEditMode && this.personnelId) {
                result = await window.apiClient.updatePersonnel(this.personnelId, formData);
            } else {
                result = await window.apiClient.createPersonnel(formData);
            }

            // Success handling
            if (result) {
                toastr.success(this.isEditMode ? 'Personel kaydı güncellendi!' : 'Personel kaydı oluşturuldu!');
                
                // Redirect after delay
                setTimeout(() => {
                    window.location.href = '/personnel-list.html';
                }, 1500);
            }

        } catch (error) {
            console.error('Form submission error:', error);
            // Error is already handled by apiClient
        } finally {
            this.setSubmitLoading(false);
        }
    }

    /**
     * Collect form data
     */
    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};

        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            if (key.includes('[')) {
                // Handle array fields (repeatable groups)
                this.setNestedValue(data, key, value);
            } else {
                data[key] = value;
            }
        }

        return data;
    }

    /**
     * Set nested value for array fields
     */
    setNestedValue(obj, path, value) {
        const keys = path.split(/[\[\]]+/).filter(key => key);
        let current = obj;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            const nextKey = keys[i + 1];
            
            if (!current[key]) {
                current[key] = isNaN(nextKey) ? {} : [];
            }
            current = current[key];
        }
        
        const finalKey = keys[keys.length - 1];
        current[finalKey] = value;
    }

    /**
     * Focus first error field
     */
    focusFirstError() {
        const firstError = this.form.querySelector('.is-invalid');
        if (firstError) {
            firstError.focus();
            
            // Switch to tab containing the error
            const tabPane = firstError.closest('.tab-pane');
            if (tabPane) {
                const tabId = tabPane.id;
                const tabButton = document.querySelector(`[data-bs-target="#${tabId}"]`);
                if (tabButton) {
                    const tab = new bootstrap.Tab(tabButton);
                    tab.show();
                }
            }
        }
    }

    /**
     * Set submit button loading state
     */
    setSubmitLoading(loading) {
        const spinner = this.submitBtn.querySelector('.spinner-border');
        const text = this.submitBtn.childNodes[this.submitBtn.childNodes.length - 1];
        
        if (loading) {
            this.submitBtn.disabled = true;
            spinner.style.display = 'inline-block';
            text.textContent = ' Kaydediliyor...';
        } else {
            this.submitBtn.disabled = false;
            spinner.style.display = 'none';
            text.textContent = ' Kaydet';
        }
    }

    /**
     * Handle cancel button
     */
    handleCancel() {
        if (confirm('Değişiklikler kaydedilmeyecek. Devam etmek istiyor musunuz?')) {
            window.location.href = '/personnel-list.html';
        }
    }

    /**
     * Handle tab change
     */
    onTabChange(e) {
        // Optional: Validate current tab before switching
        // This can be implemented if needed
    }

    /**
     * Check if this is edit mode
     */
    checkEditMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        if (id) {
            this.isEditMode = true;
            this.personnelId = id;
            this.pageTitle.textContent = 'Personel Düzenle';
            this.loadPersonnelData(id);
        }
    }

    /**
     * Load personnel data for editing
     */
    async loadPersonnelData(id) {
        try {
            this.setFormLoading(true);
            const data = await window.apiClient.getPersonnelById(id);
            this.populateForm(data);
        } catch (error) {
            console.error('Error loading personnel data:', error);
            toastr.error('Personel verisi yüklenirken hata oluştu.');
        } finally {
            this.setFormLoading(false);
        }
    }

    /**
     * Populate form with data
     */
    populateForm(data) {
        Object.keys(data).forEach(key => {
            const field = this.form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = data[key];
                } else if (field.type === 'file') {
                    // File fields can't be populated for security reasons
                } else {
                    field.value = data[key] || '';
                }
                
                // Trigger change event for conditional fields
                field.dispatchEvent(new Event('change'));
            }
        });

        // Handle repeatable groups
        if (data.emergency_contacts && Array.isArray(data.emergency_contacts)) {
            this.populateRepeatableGroup('emergency-contacts', data.emergency_contacts);
        }
    }

    /**
     * Populate repeatable group with data
     */
    populateRepeatableGroup(groupKey, items) {
        const config = this.repeatableGroups[groupKey];
        if (!config) return;

        const container = document.getElementById(config.container);
        if (!container) return;

        // Clear existing items
        container.innerHTML = '';

        // Add items
        items.forEach((item, index) => {
            this.addRepeatableItem(groupKey, config);
            
            // Populate fields
            Object.keys(item).forEach(fieldKey => {
                const field = container.querySelector(`[name="${groupKey}[${index}][${fieldKey}]"]`);
                if (field) {
                    field.value = item[fieldKey] || '';
                }
            });
        });
    }

    /**
     * Set form loading state
     */
    setFormLoading(loading) {
        if (loading) {
            this.form.classList.add('loading');
        } else {
            this.form.classList.remove('loading');
        }
    }

    /**
     * Setup toastr configuration
     */
    setupToastr() {
        if (window.toastr) {
            toastr.options = {
                closeButton: true,
                debug: false,
                newestOnTop: true,
                progressBar: true,
                positionClass: "toast-top-right",
                preventDuplicates: false,
                onclick: null,
                showDuration: "300",
                hideDuration: "1000",
                timeOut: "5000",
                extendedTimeOut: "1000",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            };
        }
    }
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.personnelForm = new PersonnelForm();
});
