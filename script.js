const pages = [
    "images/cover_result.jpg",
    "images/page1.jpg_result.jpg",
    "images/page2.jpg_result.jpg",
    "images/page3.jpg_result.jpg",
    "images/page4.jpg_result.jpg",
    "images/page5.jpg_result.jpg",
    "images/page6.jpg_result.jpg",
    "images/page7.jpg_result.jpg",
    "images/page8.jpg_result.jpg",
    "images/page9.jpg_result.jpg",
    "images/page10.jpg_result.jpg",
    "images/page11.jpg_result.jpg",
    "images/page12.jpg_result.jpg",
    "images/page13.jpg_result.jpg",
    "images/page14.jpg_result.jpg",
    "images/page15.jpg_result.jpg",
    "images/page16.jpg_result.jpg",
    "images/page17.jpg_result.jpg",
    "images/page18.jpg_result.jpg",
    "images/page19.jpg_result.jpg",
    "images/page20.jpg_result.jpg",
    "images/page21.jpg_result.jpg",
    "images/page22.jpg_result.jpg",
    "images/back_cover.jpg_result.jpg"
];

let pageFlip;
let isMusicPlaying = false;

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const welcomeScreen = document.getElementById('welcome-screen');
const albumViewer = document.getElementById('album-viewer');
const progressBar = document.getElementById('progress-bar');
const pageNumSpan = document.getElementById('current-page-num');
const totalPagesSpan = document.getElementById('total-pages-num');
const bgMusic = document.getElementById('bg-music');

// Buttons
const openAlbumBtn = document.getElementById('open-album-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const musicBtn = document.getElementById('music-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// Initialize
function init() {
    totalPagesSpan.innerText = pages.length;
    bgMusic.load(); // Preload music to prevent playback issues
    preloadImages();
}

// Preload Images
function preloadImages() {
    let loadedCount = 0;
    const totalImages = pages.length;

    pages.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            loadedCount++;
            const progress = (loadedCount / totalImages) * 100;
            progressBar.style.width = `${progress}%`;
            
            if (loadedCount === totalImages) {
                setTimeout(showWelcome, 500);
            }
        };
        img.onerror = () => {
            loadedCount++;
            const progress = (loadedCount / totalImages) * 100;
            progressBar.style.width = `${progress}%`;
            if (loadedCount === totalImages) {
                setTimeout(showWelcome, 500);
            }
        };
    });
}

// Screens
function showWelcome() {
    loadingScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
}

function openAlbum() {
    welcomeScreen.classList.add('hidden');
    albumViewer.classList.remove('hidden');
    
    // Zoom into album effect
    const albumContainer = document.getElementById('album-container');
    albumContainer.style.transform = 'scale(0.8)';
    albumContainer.style.opacity = '0';
    
    generatePages();
    
    setTimeout(() => {
        albumContainer.style.transition = 'transform 1s ease, opacity 1s ease';
        albumContainer.style.transform = 'scale(1)';
        albumContainer.style.opacity = '1';
        
        initPageFlip();
    }, 100);

    toggleMusic(true);
}

function generatePages() {
    const bookContainer = document.getElementById('book');
    bookContainer.innerHTML = '';

    pages.forEach((src) => {
        // Treat every image as a full spread so it is perfectly centered
        const leftPage = document.createElement('div');
        leftPage.className = 'page';
        leftPage.innerHTML = `
            <div class="page-content left-side">
                <img src="${src}" class="spread-img">
            </div>
        `;
        bookContainer.appendChild(leftPage);
        
        const rightPage = document.createElement('div');
        rightPage.className = 'page';
        rightPage.innerHTML = `
            <div class="page-content right-side">
                <img src="${src}" class="spread-img">
            </div>
        `;
        bookContainer.appendChild(rightPage);
    });
}

function initPageFlip() {
    const bookElement = document.getElementById('book');
    
    pageFlip = new St.PageFlip(bookElement, {
        width: 800, // Will be overridden by stretch
        height: 900,
        size: "stretch",
        minWidth: 100,
        maxWidth: 5000,
        minHeight: 100,
        maxHeight: 5000,
        maxShadowOpacity: 0.5,
        showCover: false, // Set to false so the book starts open and the cover is centered
        usePortrait: true,
        mobileScrollSupport: true,
        autoSize: true, // Automatically adjust to parent container
        drawShadow: true // Ensure shadows are drawn on pages
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    pageFlip.on('flip', (e) => {
        const imgIndex = Math.floor(e.data / 2);
        pageNumSpan.innerText = imgIndex + 1;
    });
}

function nextPage() {
    if (pageFlip) pageFlip.flipNext();
}

function previousPage() {
    if (pageFlip) pageFlip.flipPrev();
}

// Music
function toggleMusic(forcePlay = false) {
    if (forcePlay || bgMusic.paused) {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicBtn.innerText = '🎵 Pause Music';
                isMusicPlaying = true;
            }).catch(e => {
                console.log('Audio play prevented', e);
                musicBtn.innerText = '🎵 Play Music';
                isMusicPlaying = false;
            });
        } else {
            musicBtn.innerText = '🎵 Pause Music';
            isMusicPlaying = true;
        }
    } else {
        bgMusic.pause();
        musicBtn.innerText = '🎵 Play Music';
        isMusicPlaying = false;
    }
}

// Fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Event Listeners
openAlbumBtn.addEventListener('click', openAlbum);
nextBtn.addEventListener('click', nextPage);
prevBtn.addEventListener('click', previousPage);
musicBtn.addEventListener('click', () => toggleMusic());
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Keyboard Support
document.addEventListener('keydown', (e) => {
    if (albumViewer.classList.contains('hidden')) return; // Only if album is open

    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') previousPage();
    if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    if (e.key === ' ') {
        e.preventDefault();
        toggleMusic();
    }
});



// Start preloading on load
window.onload = init;
