const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

// Gift Box Interaction
const giftOverlay = document.getElementById('gift-overlay');
const mainContent = document.getElementById('main-content');
const bgMusic = document.getElementById('bg-music');

// Dynamic Family Name & Typing Effect
const urlParams = new URLSearchParams(window.location.search);
const nameText = urlParams.get('name') || "Rodriguez family";
const familyNameElement = document.getElementById('family-name');

// Clear initially
if (familyNameElement) {
    familyNameElement.innerText = ""; 
}

function typeWriter(text, element, speed = 150) {
    if (!element) return;
    
    element.classList.add('typing');
    let i = 0;
    element.innerText = "";
    
    function type() {
        if (i < text.length) {
            element.innerText += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Keep cursor blinking for a bit then remove if desired, or just leave it
            // element.classList.remove('typing');
        }
    }
    type();
}

if (giftOverlay) {
    giftOverlay.addEventListener('click', () => {
        // Play Music
        bgMusic.play().catch(error => {
            console.log("Audio play failed:", error);
        });

        // Hide Overlay
        giftOverlay.style.opacity = '0';
        setTimeout(() => {
            giftOverlay.style.display = 'none';
        }, 1000);

        // Show Main Content
        mainContent.classList.remove('hidden');
        mainContent.classList.add('visible');
        
        // Start Typing Effect after a short delay
        setTimeout(() => {
            typeWriter(nameText, familyNameElement);
        }, 500);
    });
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Mouse interaction
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let wind = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Calculate wind based on mouse position relative to center
    // Range: -1 to 1
    wind = (mouseX - window.innerWidth / 2) / (window.innerWidth / 2);
    
    // Parallax effect
    const tree = document.querySelector('.tree');
    const hill = document.querySelector('.snow-hill');
    const moon = document.querySelector('.moon');
    
    if(tree) tree.style.transform = `translateX(${wind * -20}px)`;
    if(hill) hill.style.transform = `translateX(${wind * -10}px)`;
    if(moon) moon.style.transform = `translate(${wind * 5}px, ${mouseY * 0.05}px)`;
});

// Resize handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars(); // Recreate stars on resize
});

// Snowflakes
const snowflakes = [];
const numSnowflakes = 250;

for (let i = 0; i < numSnowflakes; i++) {
    snowflakes.push(createSnowflake());
}

function createSnowflake() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 0.5,
        sway: Math.random() * 0.1 - 0.05, // Random sway
        opacity: Math.random() * 0.5 + 0.5
    };
}

function drawSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snowflakes.forEach((flake) => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();
        
        // Add a subtle glow to some flakes
        if (flake.radius > 2.5) {
            ctx.shadowBlur = 5;
            ctx.shadowColor = "white";
        } else {
            ctx.shadowBlur = 0;
        }
    });
    ctx.shadowBlur = 0; // Reset
}

function updateSnowflakes() {
    snowflakes.forEach((flake) => {
        flake.y += flake.speed;
        flake.x += flake.sway + (wind * 2); // Apply wind

        // Wrap around
        if (flake.y > canvas.height) {
            flake.y = 0;
            flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width) {
            flake.x = 0;
        } else if (flake.x < 0) {
            flake.x = canvas.width;
        }
    });
}

// Background Stars
function createStars() {
    const existingStars = document.querySelectorAll('.star');
    existingStars.forEach(star => star.remove());

    const numStars = 100;
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        document.body.appendChild(star);
    }
}

// Add CSS for stars dynamically
const style = document.createElement('style');
style.innerHTML = `
    .star {
        position: absolute;
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
        opacity: 0;
        z-index: 0;
        animation: twinkle infinite ease-in-out;
    }
    @keyframes twinkle {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.5); box-shadow: 0 0 4px white; }
    }
`;
document.head.appendChild(style);

createStars();

function animate() {
    drawSnowflakes();
    updateSnowflakes();
    requestAnimationFrame(animate);
}

animate();