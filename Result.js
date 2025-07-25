// ----------------- TOP BAR RIGHT ICONS -----------------
document.querySelectorAll('.top-bar-right .icon').forEach(icon => {
    icon.addEventListener('click', () => {
        alert('Action performed! (e.g., Save, Copy, Download, Share)');
    });
});


// Save PDF Function
document.querySelector('.save-btn').addEventListener('click', function() {
    window.print(); // simple print dialog (PDF save option)
});

// Share Button Function
document.querySelector('.share-btn').addEventListener('click', function() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        }).then(() => {
            alert('Thanks for sharing!');
        }).catch(console.error);
    } else {
        alert('Share not supported in this browser');
    }
});
// ----------------- HOTEL CAROUSEL (SIMPLE SLIDER) -----------------
let currentIndex = 0;
const hotelContainer = document.querySelector('.hotel-cards-container');
const hotels = document.querySelectorAll('.hotel-card');
const prevBtn = document.querySelectorAll('.carousel-nav img')[0];
const nextBtn = document.querySelectorAll('.carousel-nav img')[1];

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = hotels.length - 1;
    }
    hotelContainer.scrollTo({
        left: hotels[currentIndex].offsetLeft,
        behavior: 'smooth'
    });
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < hotels.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    hotelContainer.scrollTo({
        left: hotels[currentIndex].offsetLeft,
        behavior: 'smooth'
    });
});

// ----------------- DAY SELECTOR EVENT -----------------
document.querySelectorAll('.day-selector').forEach(daySelector => {
    daySelector.addEventListener('click', () => {
        const day = daySelector.querySelector('span').innerText;
        alert(`You clicked on ${day}`);
    });
});

// ----------------- FIND STAY BAR -----------------
document.querySelectorAll('.find-stay-bar').forEach(bar => {
    bar.addEventListener('click', () => {
        alert("Redirecting you to hotel booking options!");
    });
});

// ----------------- OPTIONAL: STICKY HEADER ON SCROLL -----------------
// You can remove it if not needed.
window.addEventListener('scroll', function () {
    const header = document.querySelector('#header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = "#000000d0";
    } else {
        header.style.backgroundColor = "transparent";
    }
});