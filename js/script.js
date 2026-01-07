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
    initializeBookingForm();
    initializeBeforeAfterSlider();
    initializeScrollAnimations();
});

// Smooth Scroll
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Before/After Slider
function initializeBeforeAfterSlider() {
    const container = document.querySelector('.ba-image-container');
    const handle = document.getElementById('baHandle');
    const afterImage = document.querySelector('.ba-after');

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

    document.querySelectorAll('.why-item, .showroom-card').forEach(el => {
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

    // FIXED: Hours 8h-19h
    const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
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

    console.log('Booking data:', bookingData);

    document.getElementById('bookingForm').style.display = 'none';
    const confirmationEl = document.getElementById('confirmationMessage');
    const confirmationDetails = document.getElementById('confirmationDetails');

    let detailsHTML = '<strong>' + formattedDate + '</strong> à <strong>' + bookingData.time + '</strong><br>';
    detailsHTML += (bookingData.rdvType === 'showroom' ? 'Au showroom' : 'À domicile');
    if (bookingData.ville) {
        detailsHTML += ' (' + bookingData.ville + ')';
    }
    detailsHTML += '<br>' + bookingData.nom + ' - ' + bookingData.telephone;

    confirmationDetails.innerHTML = detailsHTML;
    confirmationEl.style.display = 'block';

    confirmationEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
