/**
 * Reports Component
 * Raporlar ve istatistikler sayfası
 */
class Reports extends Component {
    constructor(element, props = {}) {
        super(element, props);
        this.state = {
            stats: {
                totalPersonnel: 127,
                activePersonnel: 115,
                onLeavePersonnel: 8,
                inactivePersonnel: 4
            },
            loading: false
        };
    }
    
    template() {
        return `
            <div class="row">
                <!-- İstatistik Kartları -->
                <div class="col-md-6 col-lg-3 mb-4">
                    <div class="card text-white bg-primary">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <h6 class="card-title">Toplam Personel</h6>
                                    <h3 class="mb-0">${this.state.stats.totalPersonnel}</h3>
                                </div>
                                <div class="ms-3">
                                    <i class="bi bi-people fs-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 col-lg-3 mb-4">
                    <div class="card text-white bg-success">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <h6 class="card-title">Aktif Personel</h6>
                                    <h3 class="mb-0">${this.state.stats.activePersonnel}</h3>
                                </div>
                                <div class="ms-3">
                                    <i class="bi bi-person-check fs-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 col-lg-3 mb-4">
                    <div class="card text-white bg-warning">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <h6 class="card-title">İzinli Personel</h6>
                                    <h3 class="mb-0">${this.state.stats.onLeavePersonnel}</h3>
                                </div>
                                <div class="ms-3">
                                    <i class="bi bi-calendar-x fs-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 col-lg-3 mb-4">
                    <div class="card text-white bg-danger">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <h6 class="card-title">Pasif Personel</h6>
                                    <h3 class="mb-0">${this.state.stats.inactivePersonnel}</h3>
                                </div>
                                <div class="ms-3">
                                    <i class="bi bi-person-x fs-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <!-- Grafik Alanı -->
                <div class="col-lg-8 mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Departman Bazında Personel Dağılımı</h5>
                        </div>
                        <div class="card-body">
                            <div class="text-center py-5">
                                <i class="bi bi-bar-chart fs-1 text-muted"></i>
                                <h6 class="mt-3 text-muted">Grafik Entegrasyonu</h6>
                                <p class="text-muted">Chart.js veya benzeri kütüphane ile grafik gösterilecek</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Son İşlemler -->
                <div class="col-lg-4 mb-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Son İşlemler</h5>
                        </div>
                        <div class="card-body">
                            <div class="list-group list-group-flush">
                                <div class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                        <div class="fw-bold">Yeni Personel Eklendi</div>
                                        <small>Ali Veli - IT Departmanı</small>
                                    </div>
                                    <small>2 saat önce</small>
                                </div>
                                <div class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                        <div class="fw-bold">İzin Talebi Onaylandı</div>
                                        <small>Ayşe Yılmaz - 5 gün yıllık izin</small>
                                    </div>
                                    <small>4 saat önce</small>
                                </div>
                                <div class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                        <div class="fw-bold">Bordro Oluşturuldu</div>
                                        <small>Ekim 2024 bordrosu hazırlandı</small>
                                    </div>
                                    <small>1 gün önce</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // Rapor butonları için event listener'lar eklenebilir
        console.log('Reports component loaded');
    }
}

window.Reports = Reports;
