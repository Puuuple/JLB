// ==================== GLOBAL VARIABLES ====================
let currentStep = 1;
const totalSteps = 5;
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
    initializeHeader();
    initializeBookingForm();
    initializeSmoothScroll();
});

// ==================== HEADER ====================
function initializeHeader() {
    const header = document.getElementById('header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    // Sticky header effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
        } else {
            header.style.padding = '20px 0';
        }
    });

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

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
            // Auto-advance to next step
            setTimeout(() => nextStep(), 500);
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

    // Special handling for step 1 to 2
    if (currentStep === 1) {
        if (bookingData.rdvType === 'showroom') {
            // Skip ville selection for showroom
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

    // Special handling for step 2 to 3
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

    // Step 3 to 4
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

    // Step 4 to 5
    if (currentStep === 4) {
        if (!bookingData.time) {
            alert('Veuillez sélectionner un horaire');
            return;
        }
        currentStep = 5;
        showStep(currentStep);

        // Show/hide address field based on RDV type
        const adresseGroup = document.getElementById('adresseGroup');
        if (bookingData.rdvType === 'domicile') {
            adresseGroup.style.display = 'block';
            document.getElementById('adresse').required = true;
        } else {
            adresseGroup.style.display = 'none';
            document.getElementById('adresse').required = false;
        }
        return;
    }
}

function prevStep() {
    if (currentStep === 1) return;

    // Special handling for going back from step 3
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

    // Update progress dots
    document.querySelectorAll('.progress-dot').forEach((dot, index) => {
        if (index < step) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Show/hide navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    prevBtn.style.display = step === 1 ? 'none' : 'inline-block';

    if (step === 5) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
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
    calendarEl.innerHTML = '';

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Day names
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    dayNames.forEach(day => {
        const dayNameEl = document.createElement('div');
        dayNameEl.classList.add('calendar-day', 'day-name');
        dayNameEl.textContent = day;
        calendarEl.appendChild(dayNameEl);
    });

    // Calculate days to show (next 30 days)
    const daysToShow = 28; // 4 weeks

    // Get first day offset (Monday = 0)
    const firstDay = today.getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    // Add empty cells for offset
    for (let i = 0; i < offset; i++) {
        const emptyEl = document.createElement('div');
        emptyEl.classList.add('calendar-day', 'disabled');
        calendarEl.appendChild(emptyEl);
    }

    // Add days
    for (let i = 0; i < daysToShow; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const dayEl = document.createElement('div');
        dayEl.classList.add('calendar-day');

        // Mark today
        if (i === 0) {
            dayEl.classList.add('today');
        }

        // Disable Sundays and past dates
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || i < 0) {
            dayEl.classList.add('disabled');
        }

        dayEl.textContent = date.getDate();
        dayEl.dataset.date = date.toISOString().split('T')[0];

        // Click handler
        if (!dayEl.classList.contains('disabled')) {
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

    // Define time slots
    const morningSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
    const afternoonSlots = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

    // Check if selected date is Saturday
    const selectedDate = new Date(bookingData.date);
    const isSaturday = selectedDate.getDay() === 6;

    // Add morning header
    const morningHeader = document.createElement('div');
    morningHeader.style.gridColumn = '1 / -1';
    morningHeader.style.fontWeight = '700';
    morningHeader.style.marginTop = '10px';
    morningHeader.style.color = 'var(--primary-color)';
    morningHeader.textContent = 'Matin';
    timeSlotsEl.appendChild(morningHeader);

    // Add morning slots
    morningSlots.forEach(time => {
        const slotEl = createTimeSlot(time);
        timeSlotsEl.appendChild(slotEl);
    });

    // Add afternoon slots only if not Saturday
    if (!isSaturday) {
        const afternoonHeader = document.createElement('div');
        afternoonHeader.style.gridColumn = '1 / -1';
        afternoonHeader.style.fontWeight = '700';
        afternoonHeader.style.marginTop = '20px';
        afternoonHeader.style.color = 'var(--primary-color)';
        afternoonHeader.textContent = 'Après-midi';
        timeSlotsEl.appendChild(afternoonHeader);

        afternoonSlots.forEach(time => {
            const slotEl = createTimeSlot(time);
            timeSlotsEl.appendChild(slotEl);
        });
    }
}

function createTimeSlot(time) {
    const slotEl = document.createElement('div');
    slotEl.classList.add('time-slot');
    slotEl.textContent = time;
    slotEl.dataset.time = time;

    // Randomly disable some slots (simulating booked slots)
    const isBooked = Math.random() > 0.7;
    if (isBooked) {
        slotEl.classList.add('disabled');
        slotEl.title = 'Créneau indisponible';
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

    // Here you would normally send the data to a server
    console.log('Booking data:', bookingData);

    // Simulate API call
    setTimeout(() => {
        // Hide form
        document.getElementById('bookingForm').style.display = 'none';

        // Show confirmation
        const confirmationEl = document.getElementById('confirmationMessage');
        const confirmationDetails = document.getElementById('confirmationDetails');

        let detailsHTML = `
            <strong>Type de rendez-vous :</strong> ${bookingData.rdvType === 'showroom' ? 'Showroom' : 'À domicile'}<br>
            ${bookingData.rdvType === 'domicile' ? `<strong>Ville :</strong> ${bookingData.ville}<br>` : ''}
            <strong>Date :</strong> ${formattedDate}<br>
            <strong>Heure :</strong> ${bookingData.time}<br>
            <strong>Contact :</strong> ${bookingData.nom} - ${bookingData.telephone}
        `;

        confirmationDetails.innerHTML = detailsHTML;
        confirmationEl.style.display = 'block';

        // Scroll to confirmation
        confirmationEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Send email notification (in a real app)
        sendBookingNotification(bookingData);
    }, 500);
}

// ==================== EMAIL NOTIFICATION (Simulated) ====================
function sendBookingNotification(data) {
    // In a real application, this would send an email via a backend API
    console.log('Sending notification email...');
    console.log('To: contact@jlb-cuisine.fr');
    console.log('Subject: Nouvelle demande de rendez-vous');
    console.log('Data:', data);

    // For demonstration, we'll just log it
    // In production, you would use a backend service like:
    // - PHP mail()
    // - Node.js with nodemailer
    // - Email service API (SendGrid, Mailgun, etc.)

    /* Example backend call:
    fetch('/api/send-booking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Email sent successfully:', result);
    })
    .catch(error => {
        console.error('Error sending email:', error);
    });
    */
}

// ==================== UTILITY FUNCTIONS ====================
function formatPhoneNumber(phone) {
    // Format French phone number
    return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ==================== ANIMATIONS ====================
// Add fade-in animation for sections on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all service cards and other elements
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.service-card, .step, .avantage-card');

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
