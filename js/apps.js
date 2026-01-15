// ==========================================
// 1. GLOBAL REGISTRATION FUNCTION (The Direct Fix)
// ==========================================
function handleRegister(event) {
    // 1. Prevent the page from reloading
    event.preventDefault();
    console.log("🚀 Registration Started...");

    try {
        // 2. Get all input values safely
        const nameInput = document.getElementById('bizName');
        const catInput = document.getElementById('category');
        const descInput = document.getElementById('description');
        const waInput = document.getElementById('whatsapp');
        const ttInput = document.getElementById('tiktokUrl');

        // Check if elements exist (Debugging Step)
        if (!nameInput || !catInput || !descInput || !waInput || !ttInput) {
            alert("Error: One of the form inputs is missing in the HTML code.");
            return;
        }

        const name = nameInput.value;
        const category = catInput.value;
        const description = descInput.value;
        const whatsapp = waInput.value;
        const tiktokUrl = ttInput.value;

        // 3. Extract Video ID Logic
        let videoId = '7106869400236084526'; // Default Fallback
        if (tiktokUrl.includes('/video/')) {
            videoId = tiktokUrl.split('/video/')[1].split('?')[0];
        }

        // 4. Create the Business Object
        const newBiz = {
            id: Date.now(),
            name: name,
            category: category,
            description: description,
            whatsapp: whatsapp,
            tiktokUrl: tiktokUrl,
            videoId: videoId,
            rating: 5.0,
            sales: 0,
            isVerified: false,
            dateJoined: Date.now()
        };

        // 5. Save to "Database" (LocalStorage)
        const allBiz = JSON.parse(localStorage.getItem('businesses')) || [];
        allBiz.push(newBiz);
        localStorage.setItem('businesses', JSON.stringify(allBiz));

        // 6. Save "Session" (Login the user)
        localStorage.setItem('loggedInUser', JSON.stringify(newBiz));

        // 7. REDIRECT
        alert("Success! Redirecting to Dashboard...");
        window.location.href = 'dashboard.html';

    } catch (error) {
        // If anything fails, this will tell us exactly what
        console.error("Registration Failed:", error);
        alert("System Error: " + error.message);
    }
}


// ==========================================
// 2. HOMEPAGE & DASHBOARD LOGIC (Runs on Load)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- DASHBOARD CHECK ---
    const dashboardContainer = document.querySelector('.dashboard-container');
    if (dashboardContainer) {
        const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));

        if (!currentUser) {
            // If no user is found, kick them back to register
            window.location.href = 'register.html';
        } else {
            // Fill Dashboard Data
            if(document.getElementById('navBizName')) document.getElementById('navBizName').textContent = currentUser.name;
            if(document.getElementById('welcomeMessage')) document.getElementById('welcomeMessage').textContent = `Welcome, ${currentUser.name}`;
            if(document.getElementById('displayBizName')) document.getElementById('displayBizName').textContent = currentUser.name;
            if(document.getElementById('displayCategory')) document.getElementById('displayCategory').textContent = currentUser.category;
            if(document.getElementById('displayDesc')) document.getElementById('displayDesc').textContent = currentUser.description;
            
            const tiktokLink = document.getElementById('displayTiktok');
            if(tiktokLink) tiktokLink.href = currentUser.tiktokUrl;
            
            // Logout Logic
            const logoutBtn = document.getElementById('logoutBtn');
            if(logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('loggedInUser');
                    window.location.href = '../index.html';
                });
            }
        }
    }

    // --- HOMEPAGE / EXPLORE LOAD ---
    // (This ensures products show up on other pages)
    const grid = document.querySelector('.business-grid');
    if (grid && !dashboardContainer) { 
        loadBusinesses(grid); 
    }
});

// Helper to load businesses
function loadBusinesses(gridElement) {
    const businesses = JSON.parse(localStorage.getItem('businesses')) || [];
    
    // Simple verification check helper
    const getBadge = (biz) => biz.isVerified ? '<span style="color:#1DA1F2">✔</span>' : '';

    if (businesses.length === 0) {
        gridElement.innerHTML = '<p>No businesses yet.</p>';
        return;
    }

    // Generate Cards
    gridElement.innerHTML = businesses.map(biz => `
        <div class="business-card">
            <div class="card-header">
                <h3>${biz.name} ${getBadge(biz)}</h3>
                <span>⭐ ${biz.rating}</span>
            </div>
            <p>${biz.description}</p>
            <div style="margin-top:10px;">
                <a href="${biz.tiktokUrl}" target="_blank" style="color:blue; text-decoration:underline;">Watch Video</a>
            </div>
            <a href="https://wa.me/234${biz.whatsapp}" class="btn-primary" style="display:block; text-align:center; margin-top:10px;">Chat</a>
        </div>
    `).join('');
}