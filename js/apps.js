// ==========================================
// 1. INITIAL DATABASE & DUMMY DATA SETUP
// ==========================================

// If no data exists, we create some "Fake" businesses so the homepage isn't empty.
// We give them different 'sales' and 'rating' numbers to test the sorting.
if (!localStorage.getItem('businesses')) {
    const dummyData = [
        {
            id: 1,
            name: "Lagos Gadget Hub",
            category: "Tech",
            description: "Best iPhones and MacBooks in Ikeja.",
            whatsapp: "8000000001",
            tiktokUrl: "https://www.tiktok.com/@tiktok/video/7106869400236084526",
            videoId: "7106869400236084526",
            rating: 4.5,
            sales: 120, // High sales
            dateJoined: Date.now() - 100000
        },
        {
            id: 2,
            name: "Mama T's Kitchen",
            category: "Food",
            description: "Delicious Party Jollof delivered to you.",
            whatsapp: "8000000002",
            tiktokUrl: "https://www.tiktok.com/@tiktok/video/7106869400236084526",
            videoId: "7106869400236084526",
            rating: 5.0, // Top Rated
            sales: 85,
            dateJoined: Date.now() - 50000
        },
        {
            id: 3,
            name: "Vintage Flow NG",
            category: "Fashion",
            description: "Retro shirts and baggy jeans.",
            whatsapp: "8000000003",
            tiktokUrl: "https://www.tiktok.com/@tiktok/video/7106869400236084526",
            videoId: "7106869400236084526",
            rating: 4.2,
            sales: 40,
            dateJoined: Date.now() // Newly joined
        }
    ];
    localStorage.setItem('businesses', JSON.stringify(dummyData));
}

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

// A. Generate Smart WhatsApp Link
function getWhatsAppLink(number, bizName) {
    // This adds the specific text you asked for
    const message = `Hello ${bizName}, from NaijaBiz. I need to make an inquiry about your product.`;
    const encodedMsg = encodeURIComponent(message);
    return `https://wa.me/234${number}?text=${encodedMsg}`;
}

// B. Create the HTML for a single Card
function createCardHTML(biz) {
    return `
        <div class="business-card">
            <div class="card-header">
                <div class="biz-info">
                    <h3>${biz.name} <span class="verified-badge">✔</span></h3>
                    <div class="rating-stars">
                        <span>⭐ ${biz.rating}</span> 
                        <span style="font-size:0.8em; color:#888;">(${biz.sales} sold)</span>
                    </div>
                </div>
            </div>
            <p class="description">${biz.description}</p>
            
            <div class="tiktok-container">
               <blockquote class="tiktok-embed" cite="${biz.tiktokUrl}" data-video-id="${biz.videoId}" style="max-width: 605px;min-width: 325px;"> 
               <section> <a target="_blank" href="${biz.tiktokUrl}">Watch on TikTok</a> </section> 
               </blockquote> 
            </div>

            <div class="card-actions">
                <a href="${getWhatsAppLink(biz.whatsapp, biz.name)}" target="_blank" class="btn-whatsapp">
                    Chat on WhatsApp
                </a>
            </div>
        </div>
    `;
}

// C. Reload TikTok Script (Required to make videos appear after JS runs)
function reloadTikTokScript() {
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

if (newlyVerifiedGrid) {
    const businesses = JSON.parse(localStorage.getItem('businesses'));

    // A. Newly Verified (Sort by Date Joined, take top 3)
    const newBiz = [...businesses].sort((a, b) => b.dateJoined - a.dateJoined).slice(0, 3);
    newlyVerifiedGrid.innerHTML = newBiz.map(biz => createCardHTML(biz)).join('');

    // B. Top Selling (Sort by Sales, take top 3)
    const topSales = [...businesses].sort((a, b) => b.sales - a.sales).slice(0, 3);
    topSellingGrid.innerHTML = topSales.map(biz => createCardHTML(biz)).join('');

    // C. Top Rated (Sort by Rating, take top 3)
    const topRated = [...businesses].sort((a, b) => b.rating - a.rating).slice(0, 3);
    topRatedGrid.innerHTML = topRated.map(biz => createCardHTML(biz)).join('');

    reloadTikTokScript();
}


// ==========================================
// 4. EXPLORE PAGE LOGIC
// ==========================================
const exploreGrid = document.getElementById('exploreGrid');

if (exploreGrid) {
    const businesses = JSON.parse(localStorage.getItem('businesses'));
    
    // Show everyone
    if (businesses.length === 0) {
        exploreGrid.innerHTML = '<p>No businesses found.</p>';
    } else {
        exploreGrid.innerHTML = businesses.map(biz => createCardHTML(biz)).join('');
        reloadTikTokScript();
    }
}


// ==========================================
// 5. REGISTRATION PAGE LOGIC
// ==========================================
const businessForm = document.getElementById('businessForm');

if (businessForm) {
    businessForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('bizName').value;
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const tiktokUrl = document.getElementById('tiktokUrl').value;

        // Extract Video ID logic
        let videoId = '7106869400236084526'; // Default fallback
        try {
            if (tiktokUrl.includes('/video/')) {
                videoId = tiktokUrl.split('/video/')[1].split('?')[0];
            }
        } catch (err) { console.error("Link parsing error", err); }

        // Create new business object
        const newBusiness = {
            id: Date.now(),
            name: name,
            category: category,
            description: description,
            whatsapp: whatsapp,
            tiktokUrl: tiktokUrl,
            videoId: videoId,
            rating: 5.0, // New users start with 5 stars
            sales: 0,    // New users start with 0 sales
            dateJoined: Date.now()
        };

        // Save to LocalStorage
        const existingData = JSON.parse(localStorage.getItem('businesses')) || [];
        existingData.push(newBusiness);
        localStorage.setItem('businesses', JSON.stringify(existingData));

        alert('Registration Successful! Redirecting to Dashboard...');
        window.location.href = 'dashboard.html';
    });
}


// ==========================================
// 6. DASHBOARD LOGIC
// ==========================================
const dashboardContainer = document.querySelector('.dashboard-container');

if (dashboardContainer) {
    const businesses = JSON.parse(localStorage.getItem('businesses')) || [];
    // Get the most recent user
    const currentUser = businesses[businesses.length - 1];

    if (!currentUser) {
        alert("Please register first.");
        window.location.href = 'register.html';
    } else {
        // Fill in the details
        document.getElementById('navBizName').textContent = currentUser.name;
        document.getElementById('welcomeMessage').textContent = `Welcome, ${currentUser.name}`;
        
        document.getElementById('displayBizName').textContent = currentUser.name;
        document.getElementById('displayCategory').textContent = currentUser.category;
        document.getElementById('displayDesc').textContent = currentUser.description;
        document.getElementById('displayTiktok').href = currentUser.tiktokUrl;
    }

    // Delete Account Logic
    document.getElementById('deleteBtn').addEventListener('click', function() {
        if(confirm('Are you sure? This cannot be undone.')) {
            businesses.pop(); // Remove last user
            localStorage.setItem('businesses', JSON.stringify(businesses));
            window.location.href = '../index.html';
        }
    });

    // Logout Logic
    document.getElementById('logoutBtn').addEventListener('click', function() {
        window.location.href = '../index.html';
    });
}