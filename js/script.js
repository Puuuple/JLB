// ==================== GLOBAL VARIABLES ====================
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

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeSmoothScroll();
    initializeBookingForm();
});

// ==================== SMOOTH SCROLL ====================
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

// ==================== BOOKING FORM ====================
function initializeBookingForm() {
    const form = document.getElementById('bookingForm');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');

    // RDV Type selection
    document.querySelectorAll('input[name="rdvType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            bookingData.rdvType = this.value;
            setTimeout(() => nextStep(), 400);
        });
    });

    // Ville selection
    const villeSelect = document.getElementById('ville');
    if (villeSelect) {
        villeSelect.addEventListener('change', function() {
            bookingData.ville = this.value;
        });
    }

    // Navigation buttons
    nextBtn.addEventListener('click', nextStep);
    prevBtn.addEventListener('click', prevStep);

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitBooking();
    });

    // Show first step
    showStep(currentStep);
}

function nextStep() {
    // Validate current step
    if (!validateStep(currentStep)) {
        return;
    }

    // Step 1: RDV type selected
    if (currentStep === 1) {
        if (bookingData.rdvType === 'showroom') {
            // Skip ville for showroom
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

    // Step 2: Ville selected
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

    // Step 3: Date selected
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

    // Step 4: Time selected
    if (currentStep === 4) {
        if (!bookingData.time) {
            alert('Veuillez sélectionner un horaire');
            return;
        }
        currentStep = 5;
        showStep(currentStep);

        // Show/hide address field
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
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });

    // Show current step
    const currentStepEl = document.querySelector(`[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }

    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const progressPercent = (step / totalSteps) * 100;
        progressFill.style.width = progressPercent + '%';
    }

    // Show/hide navigation buttons
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

// ==================== CALENDAR ====================
function generateCalendar() {
    const calendarEl = document.getElementById('calendar');
    const currentMonthEl = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    // Setup month navigation
    prevMonthBtn.onclick = () => {
        currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() - 1);
        generateCalendar();
    };

    nextMonthBtn.onclick = () => {
        currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() + 1);
        generateCalendar();
    };

    // Update month name
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    currentMonthEl.textContent = `${monthNames[currentCalendarMonth.getMonth()]} ${currentCalendarMonth.getFullYear()}`;

    // Clear calendar
    calendarEl.innerHTML = '';

    // Add day names
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
    dayNames.forEach(day => {
        const dayNameEl = document.createElement('div');
        dayNameEl.classList.add('calendar-day', 'day-name');
        dayNameEl.textContent = day;
        calendarEl.appendChild(dayNameEl);
    });

    // Get month details
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get first weekday (0 = Sunday, 1 = Monday, etc.)
    let firstWeekday = firstDay.getDay();
    // Convert Sunday (0) to 6, and shift others by -1
    firstWeekday = firstWeekday === 0 ? 6 : firstWeekday - 1;

    // Add empty cells for days before month starts (only weekdays)
    const emptyCellsNeeded = firstWeekday;
    for (let i = 0; i < emptyCellsNeeded; i++) {
        const emptyEl = document.createElement('div');
        emptyEl.classList.add('calendar-day', 'disabled');
        calendarEl.appendChild(emptyEl);
    }

    // Add all days of the month (only weekdays)
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();

        // Skip weekends (Saturday = 6, Sunday = 0)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            continue;
        }

        const dayEl = document.createElement('div');
        dayEl.classList.add('calendar-day');
        dayEl.textContent = day;

        // Disable past dates
        if (date < today) {
            dayEl.classList.add('disabled');
        } else {
            // Mark today
            if (date.toDateString() === today.toDateString()) {
                dayEl.classList.add('today');
            }

            // Make clickable
            dayEl.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayEl.addEventListener('click', function() {
                // Remove previous selection
                document.querySelectorAll('.calendar-day.selected').forEach(el => {
                    el.classList.remove('selected');
                });

                // Select this day
                this.classList.add('selected');
                bookingData.date = this.dataset.date;
            });
        }

        calendarEl.appendChild(dayEl);
    }
}

// ==================== TIME SLOTS ====================
function generateTimeSlots() {
    const timeSlotsEl = document.getElementById('timeSlots');
    timeSlotsEl.innerHTML = '';

    const selectedDate = new Date(bookingData.date);
    const dayOfWeek = selectedDate.getDay();

    // Morning slots
    const morningSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'];
    // Afternoon slots
    const afternoonSlots = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

    // Combine all slots
    const allSlots = [...morningSlots, ...afternoonSlots];

    allSlots.forEach(time => {
        const slotEl = createTimeSlot(time);
        timeSlotsEl.appendChild(slotEl);
    });
}

function createTimeSlot(time) {
    const slotEl = document.createElement('div');
    slotEl.classList.add('time-slot');
    slotEl.textContent = time;
    slotEl.dataset.time = time;

    // Randomly disable some slots (simulating booked slots)
    const isBooked = Math.random() > 0.75;
    if (isBooked) {
        slotEl.classList.add('disabled');
    } else {
        slotEl.addEventListener('click', function() {
            // Remove previous selection
            document.querySelectorAll('.time-slot.selected').forEach(el => {
                el.classList.remove('selected');
            });

            // Select this slot
            this.classList.add('selected');
            bookingData.time = this.dataset.time;
        });
    }

    return slotEl;
}

// ==================== FORM SUBMISSION ====================
function submitBooking() {
    // Collect form data
    bookingData.nom = document.getElementById('nom').value;
    bookingData.telephone = document.getElementById('telephone').value;
    bookingData.email = document.getElementById('email').value;
    bookingData.adresse = document.getElementById('adresse').value;
    bookingData.projet = document.getElementById('projet').value;

    // Validate
    if (!bookingData.nom || !bookingData.telephone || !bookingData.email) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    // Format date for display
    const dateObj = new Date(bookingData.date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('fr-FR', options);

    // Log booking data (in production, send to server)
    console.log('Booking data:', bookingData);

    // Hide form, show confirmation
    document.getElementById('bookingForm').style.display = 'none';
    const confirmationEl = document.getElementById('confirmationMessage');
    const confirmationDetails = document.getElementById('confirmationDetails');

    let detailsHTML = `
        <strong>${formattedDate}</strong> à <strong>${bookingData.time}</strong><br>
        ${bookingData.rdvType === 'showroom' ? 'Au showroom' : 'À domicile'} ${bookingData.ville ? `(${bookingData.ville})` : ''}<br>
        ${bookingData.nom} - ${bookingData.telephone}
    `;

    confirmationDetails.innerHTML = detailsHTML;
    confirmationEl.style.display = 'block';

    // Scroll to confirmation
    confirmationEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
