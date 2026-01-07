// Global Variables
let currentStep = 1;
const totalSteps = 5;
let currentCalendarMonth = new Date();
let bookingData = {
    rdvType: '',
    ville: '',
    date: '',
    time: '',
    nom: '',
    telephone: '',
    email: '',
    adresse: '',
    projet: ''
};

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeSmoothScroll();
    initializeBookingModal();
    initializeCallbackModal();
    initializeBookingForm();
    initializeBeforeAfterSlider();
    initializeScrollAnimations();
    initializeMap();
});

// Smooth Scroll
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Skip if it's the modal trigger
            if (this.classList.contains('open-modal-btn')) {
                return;
            }
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Booking Modal
function initializeBookingModal() {
    const modal = document.getElementById('bookingModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');

    // Open modal
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scroll
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Callback Modal
function initializeCallbackModal() {
    const modal = document.getElementById('callbackModal');
    const modalOverlay = document.getElementById('callbackOverlay');
    const modalClose = document.getElementById('callbackClose');
    const openCallbackBtns = document.querySelectorAll('.open-callback-btn');
    const form = document.getElementById('callbackForm');

    // Open modal
    openCallbackBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nom = document.getElementById('callbackNom').value;
        const tel = document.getElementById('callbackTel').value;
        const time = document.getElementById('callbackTime').value;
        const message = document.getElementById('callbackMessage').value;

        if (!nom || !tel || !time) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        console.log('Callback request:', { nom, tel, time, message });

        // Show confirmation
        form.style.display = 'none';
        document.getElementById('callbackConfirmation').style.display = 'block';
    });
}

// Before/After Gallery avec filtres et navigation
let currentSlideIndex = 0;
let currentFilter = 'all';
let filteredSlides = [];

function initializeBeforeAfterSlider() {
    const slides = document.querySelectorAll('.ba-slide');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const prevBtn = document.getElementById('baPrevSlide');
    const nextBtn = document.getElementById('baNextSlide');
    const indicatorsContainer = document.getElementById('baIndicators');

    if (slides.length === 0) return;

    // Initialiser toutes les slides
    filteredSlides = Array.from(slides);

    // Initialiser les sliders avant/après pour chaque slide
    slides.forEach(slide => {
        initializeSingleSlider(slide);
    });

    // Filtres par catégorie
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.category;
            filterSlides();
            currentSlideIndex = 0;
            showSlide(currentSlideIndex);
        });
    });

    // Navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex - 1 + filteredSlides.length) % filteredSlides.length;
            showSlide(currentSlideIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex + 1) % filteredSlides.length;
            showSlide(currentSlideIndex);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            currentSlideIndex = (currentSlideIndex - 1 + filteredSlides.length) % filteredSlides.length;
            showSlide(currentSlideIndex);
        } else if (e.key === 'ArrowRight') {
            currentSlideIndex = (currentSlideIndex + 1) % filteredSlides.length;
            showSlide(currentSlideIndex);
        }
    });

    // Initialiser les indicateurs
    updateIndicators();
    showSlide(0);
}

function filterSlides() {
    const allSlides = document.querySelectorAll('.ba-slide');
    if (currentFilter === 'all') {
        filteredSlides = Array.from(allSlides);
    } else {
        filteredSlides = Array.from(allSlides).filter(slide =>
            slide.dataset.category === currentFilter
        );
    }
    updateIndicators();
}

function showSlide(index) {
    const allSlides = document.querySelectorAll('.ba-slide');
    allSlides.forEach(slide => {
        slide.classList.remove('active');
    });

    if (filteredSlides[index]) {
        filteredSlides[index].classList.add('active');
    }

    updateIndicators();
}

function updateIndicators() {
    const indicatorsContainer = document.getElementById('baIndicators');
    if (!indicatorsContainer) return;

    indicatorsContainer.innerHTML = '';

    filteredSlides.forEach((slide, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('ba-indicator');
        if (index === currentSlideIndex) {
            indicator.classList.add('active');
        }
        indicator.addEventListener('click', () => {
            currentSlideIndex = index;
            showSlide(currentSlideIndex);
        });
        indicatorsContainer.appendChild(indicator);
    });
}

function initializeSingleSlider(slideElement) {
    const container = slideElement.querySelector('.ba-image-container');
    const handle = slideElement.querySelector('.ba-handle');
    const afterImage = slideElement.querySelector('.ba-after');

    if (!container || !handle || !afterImage) return;

    let isDragging = false;

    function updateSlider(x) {
        const rect = container.getBoundingClientRect();
        let position = ((x - rect.left) / rect.width) * 100;
        position = Math.max(0, Math.min(100, position));

        handle.style.left = position + '%';
        afterImage.style.clipPath = 'polygon(' + position + '% 0, 100% 0, 100% 100%, ' + position + '% 100%)';
    }

    handle.addEventListener('mousedown', () => { isDragging = true; });
    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateSlider(e.clientX);
        }
    });

    container.addEventListener('click', (e) => {
        updateSlider(e.clientX);
    });

    // Touch support
    handle.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    document.addEventListener('touchend', () => { isDragging = false; });
    container.addEventListener('touchmove', (e) => {
        if (e.touches[0]) {
            e.preventDefault();
            updateSlider(e.touches[0].clientX);
        }
    }, { passive: false });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .showroom-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Booking Form
function initializeBookingForm() {
    const form = document.getElementById('bookingForm');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');

    document.querySelectorAll('input[name="rdvType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            bookingData.rdvType = this.value;
            setTimeout(() => nextStep(), 400);
        });
    });

    const villeSelect = document.getElementById('ville');
    if (villeSelect) {
        villeSelect.addEventListener('change', function() {
            bookingData.ville = this.value;
        });
    }

    nextBtn.addEventListener('click', nextStep);
    prevBtn.addEventListener('click', prevStep);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitBooking();
    });

    showStep(currentStep);
}

function nextStep() {
    if (!validateStep(currentStep)) {
        return;
    }

    if (currentStep === 1) {
        if (bookingData.rdvType === 'showroom') {
            currentStep = 3;
            showStep(currentStep);
            generateCalendar();
            return;
        } else {
            currentStep = 2;
            showStep(currentStep);
            return;
        }
    }

    if (currentStep === 2) {
        if (!bookingData.ville) {
            alert('Veuillez sélectionner votre ville');
            return;
        }
        currentStep = 3;
        showStep(currentStep);
        generateCalendar();
        return;
    }

    if (currentStep === 3) {
        if (!bookingData.date) {
            alert('Veuillez sélectionner une date');
            return;
        }
        currentStep = 4;
        showStep(currentStep);
        generateTimeSlots();
        return;
    }

    if (currentStep === 4) {
        if (!bookingData.time) {
            alert('Veuillez sélectionner un horaire');
            return;
        }
        currentStep = 5;
        showStep(currentStep);

        const adresseInput = document.getElementById('adresseInput');
        if (bookingData.rdvType === 'domicile') {
            adresseInput.style.display = 'block';
            document.getElementById('adresse').required = true;
        } else {
            adresseInput.style.display = 'none';
            document.getElementById('adresse').required = false;
        }
        return;
    }
}

function prevStep() {
    if (currentStep === 1) return;

    if (currentStep === 3) {
        if (bookingData.rdvType === 'showroom') {
            currentStep = 1;
        } else {
            currentStep = 2;
        }
        showStep(currentStep);
        return;
    }

    currentStep--;
    showStep(currentStep);
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });

    const currentStepEl = document.querySelector('[data-step="' + step + '"]');
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }

    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const progressPercent = (step / totalSteps) * 100;
        progressFill.style.width = progressPercent + '%';
    }

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    prevBtn.style.display = step === 1 ? 'none' : 'block';

    if (step === 5) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

function validateStep(step) {
    switch(step) {
        case 1:
            return bookingData.rdvType !== '';
        case 2:
            return bookingData.ville !== '' || bookingData.rdvType === 'showroom';
        case 3:
            return bookingData.date !== '';
        case 4:
            return bookingData.time !== '';
        case 5:
            const nom = document.getElementById('nom').value;
            const telephone = document.getElementById('telephone').value;
            const email = document.getElementById('email').value;
            return nom && telephone && email;
        default:
            return true;
    }
}

// Calendar - FIXED: Only weekdays (Mon-Fri), no weekends
function generateCalendar() {
    const calendarEl = document.getElementById('calendar');
    const currentMonthEl = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    prevMonthBtn.onclick = () => {
        currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() - 1);
        generateCalendar();
    };

    nextMonthBtn.onclick = () => {
        currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() + 1);
        generateCalendar();
    };

    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const monthIndex = currentCalendarMonth.getMonth();
    const year = currentCalendarMonth.getFullYear();
    currentMonthEl.textContent = monthNames[monthIndex] + ' ' + year;

    calendarEl.innerHTML = '';

    // Day names - Only weekdays
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
    dayNames.forEach(day => {
        const dayNameEl = document.createElement('div');
        dayNameEl.classList.add('calendar-day', 'day-name');
        dayNameEl.textContent = day;
        calendarEl.appendChild(dayNameEl);
    });

    const month = currentCalendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let firstWeekday = firstDay.getDay();
    firstWeekday = firstWeekday === 0 ? 6 : firstWeekday - 1;

    const emptyCellsNeeded = firstWeekday;
    for (let i = 0; i < emptyCellsNeeded; i++) {
        const emptyEl = document.createElement('div');
        emptyEl.classList.add('calendar-day', 'disabled');
        calendarEl.appendChild(emptyEl);
    }

    // Add all days - SKIP WEEKENDS
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();

        // FIXED: Skip Saturday (6) and Sunday (0)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            continue;
        }

        const dayEl = document.createElement('div');
        dayEl.classList.add('calendar-day');
        dayEl.textContent = day;

        if (date < today) {
            dayEl.classList.add('disabled');
        } else {
            if (date.toDateString() === today.toDateString()) {
                dayEl.classList.add('today');
            }

            const monthStr = String(month + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            dayEl.dataset.date = year + '-' + monthStr + '-' + dayStr;
            dayEl.addEventListener('click', function() {
                document.querySelectorAll('.calendar-day.selected').forEach(el => {
                    el.classList.remove('selected');
                });

                this.classList.add('selected');
                bookingData.date = this.dataset.date;
            });
        }

        calendarEl.appendChild(dayEl);
    }
}

// Time Slots - FIXED: 8h-19h Monday to Friday only
function generateTimeSlots() {
    const timeSlotsEl = document.getElementById('timeSlots');
    timeSlotsEl.innerHTML = '';

    // FIXED: Hours 8h-19h every hour
    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
    ];

    timeSlots.forEach(time => {
        const slotEl = createTimeSlot(time);
        timeSlotsEl.appendChild(slotEl);
    });
}

function createTimeSlot(time) {
    const slotEl = document.createElement('div');
    slotEl.classList.add('time-slot');
    slotEl.textContent = time;
    slotEl.dataset.time = time;

    // All slots are available by default
    slotEl.addEventListener('click', function() {
        document.querySelectorAll('.time-slot.selected').forEach(el => {
            el.classList.remove('selected');
        });

        this.classList.add('selected');
        bookingData.time = this.dataset.time;
    });

    return slotEl;
}

// Form Submission
function submitBooking() {
    bookingData.nom = document.getElementById('nom').value;
    bookingData.telephone = document.getElementById('telephone').value;
    bookingData.email = document.getElementById('email').value;
    bookingData.adresse = document.getElementById('adresse').value;
    bookingData.projet = document.getElementById('projet').value;

    if (!bookingData.nom || !bookingData.telephone || !bookingData.email) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    const dateObj = new Date(bookingData.date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('fr-FR', options);

    // Envoi de l'email de confirmation (à implémenter côté backend)
    sendConfirmationEmail({
        nom: bookingData.nom,
        email: bookingData.email,
        telephone: bookingData.telephone,
        date: formattedDate,
        time: bookingData.time,
        type: bookingData.rdvType,
        ville: bookingData.ville,
        adresse: bookingData.adresse,
        projet: bookingData.projet
    });

    console.log('Booking data:', bookingData);

    document.getElementById('bookingForm').style.display = 'none';
    const confirmationEl = document.getElementById('confirmationMessage');
    const confirmationDetails = document.getElementById('confirmationDetails');

    let detailsHTML = '<strong>' + formattedDate + '</strong> à <strong>' + bookingData.time + '</strong><br>';
    detailsHTML += (bookingData.rdvType === 'showroom' ? 'Au showroom' : 'À domicile');
    if (bookingData.ville) {
        detailsHTML += ' (' + bookingData.ville + ')';
    }
    detailsHTML += '<br><br>Un email de confirmation a été envoyé à :<br><strong>' + bookingData.email + '</strong>';

    confirmationDetails.innerHTML = detailsHTML;
    confirmationEl.style.display = 'block';

    confirmationEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Retour à la page d'accueil après 5 secondes
    setTimeout(function() {
        window.location.href = '#accueil';
        location.reload();
    }, 5000);
}

// Envoi email de confirmation (à connecter avec un backend)
function sendConfirmationEmail(data) {
    // Simulation - Dans un vrai projet, faire un appel API
    console.log('Email de confirmation envoyé à:', data.email);
    console.log('Détails:', data);

    // Exemple d'appel API (à implémenter côté backend):
    /*
    fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    */
}

// Initialize Interactive Map
function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || typeof L === 'undefined') return;

    // Coordinates for Rillieux-la-Pape center (showroom location)
    const showroomLat = 45.8197;
    const showroomLng = 4.8978;

    // Initialize map with better view
    const map = L.map('map', {
        center: [showroomLat, showroomLng],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: false
    });

    // Add better quality tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(map);

    // Define coverage area first (so it appears below markers)
    L.circle([showroomLat, showroomLng], {
        color: '#c9a961',
        fillColor: '#c9a961',
        fillOpacity: 0.12,
        radius: 15000,
        weight: 2,
        opacity: 0.6,
        dashArray: '5, 10'
    }).addTo(map);

    // Enhanced custom icon for showroom with animation
    const showroomIcon = L.divIcon({
        className: 'custom-showroom-marker',
        html: '<div class="showroom-pin"><div class="pin-icon">🏢</div><div class="pin-label">Notre Showroom<br><small>Rillieux-la-Pape</small></div></div>',
        iconSize: [140, 80],
        iconAnchor: [70, 70]
    });

    // Add marker for showroom with detailed popup
    L.marker([showroomLat, showroomLng], { icon: showroomIcon })
        .addTo(map)
        .bindPopup('<div style="text-align: center; padding: 8px;"><strong style="font-size: 16px;">JLB Cuisine & Agencement</strong><br><br>📍 Rillieux-la-Pape<br>🕐 Lun - Ven : 8h - 19h<br><br><a href="tel:0637878141" style="color: #c9a961; font-weight: 600;">📞 06 37 87 81 41</a></div>')
        .openPopup();

    // Add markers for main cities with subtle style
    const cities = [
        { name: 'Lyon', lat: 45.7640, lng: 4.8357 },
        { name: 'Villeurbanne', lat: 45.7667, lng: 4.8800 },
        { name: 'Caluire-et-Cuire', lat: 45.7950, lng: 4.8500 },
        { name: 'Vaulx-en-Velin', lat: 45.7867, lng: 4.9200 },
        { name: 'Bron', lat: 45.7333, lng: 4.9167 },
        { name: 'Décines-Charpieu', lat: 45.7700, lng: 4.9600 },
        { name: 'Meyzieu', lat: 45.7667, lng: 5.0033 },
        { name: 'Saint-Priest', lat: 45.6972, lng: 4.9439 },
        { name: 'Vénissieux', lat: 45.6972, lng: 4.8872 }
    ];

    cities.forEach(city => {
        L.circleMarker([city.lat, city.lng], {
            radius: 6,
            fillColor: '#0a0a0a',
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map)
          .bindPopup('<strong>' + city.name + '</strong><br><small>Zone d\'intervention</small>');
    });
}
