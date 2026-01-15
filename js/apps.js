// ==========================================
// 1. DATABASE & SESSION INITIALIZATION
// ==========================================

// This function ensures we have dummy data to show on the homepage for new visitors
function initDatabase() {
    if (!localStorage.getItem('businesses')) {
        const dummyData = [
            {
                id: 101,
                name: "Tunmise Wears",
                category: "Fashion",
                description: "Premium cargos and vintage shirts. Quality guaranteed.",
                whatsapp: "8123456789",
                tiktokUrl: "https://www.tiktok.com/@tiktok/video/7106869400236084526",
                videoId: "7106869400236084526",
                rating: 5.0,
                sales: 150,
                isVerified: true,
                dateJoined: Date.now() - 500000
            },
            {
                id: 102,
                name: "Ibadan Gadget Hub",
                category: "Tech",
                description: "Clean UK used iPhones and Samsung at best prices.",
                whatsapp: "8000000001",
                tiktokUrl: "https://www.tiktok.com/@tiktok/video/7106869400236084526",
                videoId: "7106869400236084526",
                rating: 4.8,
                sales: 320,
                isVerified: true,
                dateJoined: Date.now() - 1000000
            }
        ];
        localStorage.setItem('businesses', JSON.stringify(dummyData));
    }
}

initDatabase();

// ==========================================
// 2. SHARED UTILITIES
// ==========================================

// Create the Smart WhatsApp Link with the "NaijaBiz" prompt
function getWhatsAppLink(number, bizName) {
    const message = `Hello ${bizName}, I saw your profile on NaijaBiz. I need to make an inquiry.`;
    const encodedMsg = encodeURIComponent(message);
    // Ensure the number starts with 234 and remove leading 0 if present
    const cleanNumber = number.startsWith('0') ? number.substring(1) : number;
    const finalNumber = cleanNumber.startsWith('234') ? cleanNumber : '234' + cleanNumber;
    return `https://wa.me/${finalNumber}?text=${encodedMsg}`;
}

// Generate the HTML for a single Business Card
function createCardHTML(biz) {
    const verifiedBadge = biz.isVerified ? '<span class="verified-badge" title="Verified">✔</span>' : '';
    
    return `
        <div class="business-card">
            <div class="card-header">
                <div class="biz-info">
                    <h3>${biz.name} ${verifiedBadge}</h3>
                    <div class="rating-stars">
                        <span>⭐ ${biz.rating.toFixed(1)}</span> 
                        <span style="font-size:0.8em; color:#888;">(${biz.sales} orders)</span>
                    </div>
                </div>
            </div>
            <p class="description">${biz.description}</p>
            
            <div class="tiktok-container">
               <blockquote class="tiktok-embed" cite="${biz.tiktokUrl}" data-video-id="${biz.videoId}" style="max-width: 605px;min-width: 325px;"> 
                   <section> <a target="_blank" href="${biz.tiktokUrl}">Watch Product Video</a> </section> 
               </blockquote> 
            </div>

            <div class="card-actions">
                <a href="${getWhatsAppLink(biz.whatsapp, biz.name)}" target="_blank" class="btn-whatsapp">
                    Order via WhatsApp
                </a>
            </div>
        </div>
    `;
}

// Refresh TikTok widgets after dynamic loading
function refreshTikTok() {
    if (window.twttr) { window.twttr.widgets.load(); }
    const script = document.createElement('script');
    script.src = "https://www.tiktok.com/embed.js";
    document.body.appendChild(script);
}

// ==========================================
// 3. HOMEPAGE LOGIC
// ==========================================
const newlyVerifiedGrid = document.getElementById('newlyVerifiedGrid');
const topSellingGrid = document.getElementById('topSellingGrid');
const topRatedGrid = document.getElementById('topRatedGrid');

if (newlyVerifiedGrid || topSellingGrid || topRatedGrid) {
    const businesses = JSON.parse(localStorage.getItem('businesses')) || [];

    // Section 1: Newly Verified (Latest signups)
    if (newlyVerifiedGrid) {
        const sortedNew = [...businesses].sort((a, b) => b.dateJoined - a.dateJoined).slice(0, 3);
        newlyVerifiedGrid.innerHTML = sortedNew.map(biz => createCardHTML(biz)).join('');
    }

    // Section 2: Top Selling (Highest Sales)
    if (topSellingGrid) {
        const sortedSales = [...businesses].sort((a, b) => b.sales - a.sales).slice(0, 3);
        topSellingGrid.innerHTML = sortedSales.map(biz => createCardHTML(biz)).join('');
    }

    // Section 3: Top Rated (Highest Star Rating)
    if (topRatedGrid) {
        const sortedRated = [...businesses].sort((a, b) => b.rating - a.rating).slice(0, 3);
        topRatedGrid.innerHTML = sortedRated.map(biz => createCardHTML(biz)).join('');
    }
    
    refreshTikTok();
}

// ==========================================
// 4. EXPLORE PAGE LOGIC
// ==========================================
const exploreGrid = document.getElementById('exploreGrid');
if (exploreGrid) {
    const businesses = JSON.parse(localStorage.getItem('businesses')) || [];
    exploreGrid.innerHTML = businesses.length > 0 ? 
        businesses.map(biz => createCardHTML(biz)).join('') : 
        '<p style="grid-column: 1/-1; text-align:center;">No businesses found.</p>';
    
    refreshTikTok();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("App.js Loaded. Checking for forms...");

    // ==========================================
    // 1. REGISTRATION LOGIC
    // ==========================================
    const businessForm = document.getElementById('businessForm');

    if (businessForm) {
        console.log("✅ Registration Form Detected!");

        businessForm.addEventListener('submit', function(e) {
            e.preventDefault(); // STOP page refresh
            console.log("🚀 Submit button clicked!");

            // Grab values
            const name = document.getElementById('bizName').value;
            const category = document.getElementById('category').value;
            const description = document.getElementById('description').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const tiktokUrl = document.getElementById('tiktokUrl').value;

            // Simple validation
            if(!name || !whatsapp) {
                alert("Please fill in all details.");
                return;
            }

            // Create Business Object
            const newBiz = {
                id: Date.now(),
                name: name,
                category: category,
                description: description,
                whatsapp: whatsapp,
                tiktokUrl: tiktokUrl,
                rating: 5.0,
                sales: 0,
                isVerified: false,
                dateJoined: Date.now()
            };

            // Save to LocalStorage
            const allBiz = JSON.parse(localStorage.getItem('businesses')) || [];
            allBiz.push(newBiz);
            localStorage.setItem('businesses', JSON.stringify(allBiz));

            // Save Active Session
            localStorage.setItem('loggedInUser', JSON.stringify(newBiz));

            // Success & Redirect
            alert("Registration Successful! Redirecting...");
            window.location.href = 'dashboard.html';
        });
    } else {
        console.log("❌ No Registration form found on this page (This is normal if you are not on register.html)");
    }

    // ==========================================
    // 2. DASHBOARD LOGIC
    // ==========================================
    const dashboardContainer = document.querySelector('.dashboard-container');
    if (dashboardContainer) {
        console.log("✅ Dashboard Detected!");
        const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));

        if (!currentUser) {
            console.log("⛔ No user logged in. Redirecting to register.");
            window.location.href = 'register.html';
        } else {
            console.log("👤 User found:", currentUser.name);
            // Update UI
            if(document.getElementById('navBizName')) document.getElementById('navBizName').textContent = currentUser.name;
            if(document.getElementById('welcomeMessage')) document.getElementById('welcomeMessage').textContent = `Welcome, ${currentUser.name}`;
            if(document.getElementById('displayBizName')) document.getElementById('displayBizName').textContent = currentUser.name;
            if(document.getElementById('displayCategory')) document.getElementById('displayCategory').textContent = currentUser.category;
            if(document.getElementById('displayDesc')) document.getElementById('displayDesc').textContent = currentUser.description;
            
            // Logout
            const logoutBtn = document.getElementById('logoutBtn');
            if(logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('loggedInUser');
                    window.location.href = '../index.html';
                });
            }
        }
    }
});

// ==========================================
// 6. DASHBOARD LOGIC
// ==========================================
const dashboardContainer = document.querySelector('.dashboard-container');
if (dashboardContainer) {
    const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!currentUser) {
        window.location.assign('register.html');
    } else {
        // UI Updates
        document.getElementById('navBizName').textContent = currentUser.name;
        document.getElementById('welcomeMessage').textContent = `Welcome, ${currentUser.name}`;
        document.getElementById('displayBizName').textContent = currentUser.name;
        document.getElementById('displayCategory').textContent = currentUser.category;
        document.getElementById('displayDesc').textContent = currentUser.description;
        
        const tiktokLink = document.getElementById('displayTiktok');
        tiktokLink.href = currentUser.tiktokUrl;
        tiktokLink.textContent = "View Live Video";

        // Logic for Delete Account
        const deleteBtn = document.getElementById('deleteBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('Delete your business permanently?')) {
                    const allBiz = JSON.parse(localStorage.getItem('businesses'));
                    const filtered = allBiz.filter(b => b.id !== currentUser.id);
                    localStorage.setItem('businesses', JSON.stringify(filtered));
                    localStorage.removeItem('loggedInUser');
                    window.location.assign('../index.html');
                }
            });
        }
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.assign('../index.html');
    });
}