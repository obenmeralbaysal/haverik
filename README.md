# Personel Ekleme/Düzenleme Frontend Uygulaması

Bu proje, personel yönetimi için modern bir frontend uygulamasıdır. Apple tarzı minimal tasarım ile Bootstrap 5, Inter font ve ky HTTP client kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- **Modern UI/UX**: Apple tarzı minimal tasarım
- **Responsive Design**: Tüm cihazlarda uyumlu
- **12 Kapsamlı Sekme**: Personel bilgilerinin detaylı yönetimi
- **Akıllı Validasyon**: Gerçek zamanlı form doğrulama
- **Koşullu Alanlar**: Dinamik form alanları
- **Tekrarlanabilir Gruplar**: Eğitim, sertifika vb. için
- **Dosya Yükleme**: Belgeler ve fotoğraflar için
- **Düzenleme Modu**: Mevcut kayıtları güncelleme
- **Hata Yönetimi**: Kapsamlı hata yakalama ve kullanıcı bildirimleri

## 📋 Gereksinimler

- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- Web sunucusu (Apache, Nginx, IIS)
- Backend API (isteğe bağlı - mock data ile de çalışır)

## 🛠️ Kurulum

### 1. Dosyaları İndirin
```bash
git clone <repository-url>
cd haver_ik
```

### 2. Web Sunucusunda Çalıştırın

#### XAMPP ile:
1. Dosyaları `htdocs/haver_ik` klasörüne kopyalayın
2. XAMPP'ı başlatın
3. `http://localhost/haver_ik` adresine gidin

#### Live Server ile (VS Code):
1. VS Code'da projeyi açın
2. Live Server eklentisini yükleyin
3. `index.html` dosyasına sağ tıklayıp "Open with Live Server" seçin

#### Python ile:
```bash
cd haver_ik
python -m http.server 8000
# Tarayıcıda: http://localhost:8000
```

#### Node.js ile:
```bash
npx serve .
# veya
npx http-server
```

## ⚙️ Yapılandırma

### Environment Variables
Uygulamanın `index.html` dosyasında aşağıdaki değişkenleri ayarlayabilirsiniz:

```html
<script>
    // API Base URL
    window.API_BASE_URL = '/api'; // Backend API URL'i
    
    // Debug Mode
    window.DEBUG_MODE = true; // Geliştirme ortamında true
    
    // App Configuration
    window.APP_CONFIG = {
        apiBaseUrl: '/api',
        redirectUrl: '/personnel-list.html',
        debugMode: true
    };
</script>
```

### Backend API Endpoints
Uygulama aşağıdaki API endpoint'lerini bekler:

```
GET    /api/personnel          - Personel listesi
POST   /api/personnel          - Yeni personel ekleme
GET    /api/personnel/{id}     - Personel detayı
PUT    /api/personnel/{id}     - Personel güncelleme
DELETE /api/personnel/{id}     - Personel silme
POST   /api/upload             - Dosya yükleme
GET    /api/options/{type}     - Dropdown seçenekleri
GET    /api/health             - Sistem durumu
```

## 📁 Dosya Yapısı

```
haver_ik/
├── index.html              # Ana sayfa
├── assets/
│   ├── css/
│   │   └── app.css        # Özel CSS stilleri
│   └── js/
│       ├── apiClient.js   # API iletişim katmanı
│       ├── form.js        # Form yönetimi ve validasyon
│       └── main.js        # Ana uygulama mantığı
├── README.md              # Bu dosya
└── prompts.txt           # Geliştirme workflow'u
```

## 🎯 Kullanım

### Yeni Personel Ekleme
1. `http://localhost/haver_ik` adresine gidin
2. Form sekmelerini doldurun
3. "Kaydet" butonuna tıklayın

### Personel Düzenleme
1. `http://localhost/haver_ik?id=123` formatında URL kullanın
2. Mevcut veriler otomatik yüklenir
3. Değişiklikleri yapın ve "Kaydet" butonuna tıklayın

### Sekmeler ve Alanlar

#### 1. Kimlik ve İletişim
- Personel sicil numarası (zorunlu)
- Ad soyad, TC kimlik, uyruk
- İletişim bilgileri
- Acil durum kişileri (tekrarlanabilir)

#### 2. Yasal ve Uyumluluk
- KVKK onayları
- Çalışma/ikamet izinleri
- Adli sicil belgeleri
- Ehliyet bilgileri

#### 3. Eğitim ve Yeterlilik
- Eğitim geçmişi (tekrarlanabilir)
- Sertifikalar
- Yabancı diller
- İş tecrübesi

#### 4. İşe Alım ve Sözleşmeler
- İş başvuru formu
- Pozisyon ve ünvan
- Sözleşme tipi
- Ek protokoller

#### 5. SGK, Vergi ve Banka
- SGK sicil numarası
- IBAN bilgileri
- BES durumu

#### 6. Ücret ve Yan Haklar
- Ücret bilgileri
- Yan haklar
- Avans politikaları

#### 7-12. Diğer Sekmeler
- Çalışma süreleri ve izinler
- Performans değerlendirme
- İSG ve sağlık
- Varlık yönetimi
- Belge yönetimi
- Departman görevleri

## 🔧 Geliştirme

### Teknoloji Stack
- **Frontend Framework**: Vanilla JavaScript
- **CSS Framework**: Bootstrap 5
- **HTTP Client**: ky
- **Font**: Inter (Google Fonts)
- **Notifications**: Toastr
- **Icons**: Bootstrap Icons

### Kod Yapısı

#### ApiClient (apiClient.js)
```javascript
// API çağrıları
await apiClient.createPersonnel(data);
await apiClient.updatePersonnel(id, data);
await apiClient.getPersonnelById(id);
```

#### PersonnelForm (form.js)
```javascript
// Form yönetimi
const form = new PersonnelForm();
form.validateForm();
form.collectFormData();
```

#### PersonnelApp (main.js)
```javascript
// Uygulama yönetimi
const app = new PersonnelApp();
app.detectMode(); // add/edit
```

### Validasyon Kuralları

```javascript
// TC Kimlik
pattern: /^[0-9]{11}$/

// Telefon
pattern: /^[0-9 +()-]{7,20}$/

// IBAN
pattern: /^TR[0-9A-Z]{24}$/

// Personel Sicil
pattern: /^[A-Za-z0-9-_]{3,32}$/
```

### Koşullu Alanlar
```javascript
// Uyruk TR ise TC kimlik göster
tc_kimlik_group: {
    trigger: 'uyruk',
    condition: (value) => value === 'TR'
}
```

### Tekrarlanabilir Gruplar
```javascript
// Acil durum kişileri
emergency-contacts: {
    container: 'emergency-contacts-container',
    addButton: 'add-emergency-contact',
    maxItems: 5
}
```

## 🐛 Hata Ayıklama

### Debug Modu
```javascript
window.DEBUG_MODE = true;
```

### Console Logları
- API istekleri ve yanıtları
- Form validasyon hataları
- Koşullu alan değişiklikleri

### Yaygın Sorunlar

1. **API Bağlantı Hatası**
   - `API_BASE_URL` ayarını kontrol edin
   - CORS ayarlarını kontrol edin

2. **Validasyon Hataları**
   - Pattern'leri kontrol edin
   - Zorunlu alanları kontrol edin

3. **Dosya Yükleme Sorunları**
   - Dosya boyutu (max 5MB)
   - Dosya tipi kontrolü

## 📱 Responsive Design

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

Tüm form alanları ve sekmeler mobil cihazlarda optimize edilmiştir.

## 🔒 Güvenlik

- XSS koruması
- CSRF token desteği (backend gerekli)
- Dosya tipi validasyonu
- Input sanitization

## 🚀 Performans

- Lazy loading için hazır
- Minimal CSS/JS
- CDN kullanımı
- Gzip sıkıştırma önerilir

## 📞 Destek

Sorularınız için:
- GitHub Issues
- Dokümantasyon
- Code review

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**Not**: Bu uygulama frontend-only'dir. Tam işlevsellik için uyumlu bir backend API gereklidir.
