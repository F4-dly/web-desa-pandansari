const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if(navMenu.classList.contains('active')){
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
});

// 1. CUACA
async function fetchRealTimeWeather() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-8.0333&longitude=112.7833&current_weather=true');
        const data = await response.json();
        
        const temp = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode; 

        let desc = "Cerah";
        let iconClass = "fa-sun";

        if (code === 0) { desc = "Cerah"; iconClass = "fa-sun"; }
        else if (code >= 1 && code <= 3) { desc = "Berawan"; iconClass = "fa-cloud-sun"; }
        else if (code >= 45 && code <= 48) { desc = "Berkabut"; iconClass = "fa-smog"; }
        else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) { desc = "Hujan"; iconClass = "fa-cloud-rain"; }
        else if (code >= 95 && code <= 99) { desc = "Badai Petir"; iconClass = "fa-cloud-bolt"; }

        document.getElementById('weather-temp').innerText = `${temp}°C`;
        document.getElementById('weather-desc').innerText = desc;
        document.getElementById('weather-icon').className = `fa-solid ${iconClass}`;
    } catch (error) {
        console.error("Gagal terhubung ke satelit cuaca:", error);
    }
}

// 2. AGENDA LIBUR NASIONAL OTOMATIS (Masuk ke Strip Emas)
function updateAgendaOtomatis() {
    const holidays = [
        { date: '2026-08-17', name: 'Kemerdekaan RI' },
        { date: '2026-09-16', name: 'Maulid Nabi Muhammad SAW' },
        { date: '2026-12-25', name: 'Hari Raya Natal' },
        { date: '2027-01-01', name: 'Tahun Baru Masehi' },
        { date: '2027-02-08', name: 'Isra Mikraj' },
        { date: '2027-03-03', name: 'Hari Suci Nyepi' }
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const upcomingHolidays = holidays.filter(holiday => new Date(holiday.date) >= today);
    const top3Holidays = upcomingHolidays.slice(0, 3);
    const container = document.getElementById('agenda-nasional-container');
    
    container.innerHTML = ''; 
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

    top3Holidays.forEach(holiday => {
        const dateObj = new Date(holiday.date);
        const day = dateObj.getDate();
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();

        // Template HTML yang akan disuntikkan ke Strip Emas
        const cardHTML = `
            <div class="strip-item">
                <i class="fa-solid fa-bell"></i>
                <div class="strip-text">
                    <h4>${day} ${month} ${year}</h4>
                    <p>${holiday.name}</p>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchRealTimeWeather();
    updateAgendaOtomatis();
});