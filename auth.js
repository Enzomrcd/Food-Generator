
// Authentication module for CulinaryCompass
// Uses Replit Auth for simple user authentication

let currentUser = null;

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already authenticated
    checkAuthStatus();
    
    // Add auth button to the page if not already present
    setupAuthUI();
});

// Check if user is authenticated
function checkAuthStatus() {
    // Get auth cookie
    const authCookie = getCookie('REPLIT_AUTH');
    
    if (authCookie) {
        // User is authenticated, fetch user info
        fetchUserInfo();
    } else {
        // User is not authenticated
        currentUser = null;
        updateAuthUI(false);
    }
}

// Fetch user info from headers
async function fetchUserInfo() {
    try {
        const response = await fetch('/api/user', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const userData = await response.json();
            currentUser = userData;
            updateAuthUI(true);
        } else {
            // Error fetching user info
            currentUser = null;
            updateAuthUI(false);
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        currentUser = null;
        updateAuthUI(false);
    }
}

// Update UI based on auth status
function updateAuthUI(isAuthenticated) {
    const authContainer = document.getElementById('auth-container');
    if (!authContainer) return;
    
    if (isAuthenticated && currentUser) {
        // User is authenticated, show user info and logout button
        authContainer.innerHTML = `
            <div class="user-info">
                <img src="${currentUser.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name)}" alt="${currentUser.name}" class="user-avatar">
                <span class="user-name">${currentUser.name}</span>
                <button id="logout-button" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Log Out
                </button>
            </div>
        `;
        
        // Add logout event listener
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', logoutUser);
        }
        
        // Show social features
        document.querySelectorAll('.social-feature').forEach(el => {
            el.classList.remove('hidden');
        });
    } else {
        // User is not authenticated, show login button
        authContainer.innerHTML = `
            <div class="login-container">
                <button id="login-button" class="login-btn">
                    <i class="fas fa-sign-in-alt"></i> Log In with Replit
                </button>
                <div id="auth-frame-container"></div>
            </div>
        `;
        
        // Add Replit Auth script
        const authFrameContainer = document.getElementById('auth-frame-container');
        if (authFrameContainer) {
            const script = document.createElement('script');
            script.src = 'https://auth.util.repl.co/script.js';
            script.setAttribute('authed', 'location.reload()');
            authFrameContainer.appendChild(script);
        }
        
        // Hide social features
        document.querySelectorAll('.social-feature').forEach(el => {
            el.classList.add('hidden');
        });
    }
    
    // Update social post form visibility
    updateSocialFormVisibility(isAuthenticated);
}

// Update social post form visibility
function updateSocialFormVisibility(isAuthenticated) {
    const socialPostForm = document.getElementById('social-post-form');
    if (socialPostForm) {
        if (isAuthenticated) {
            socialPostForm.classList.remove('hidden');
        } else {
            socialPostForm.classList.add('hidden');
        }
    }
}

// Logout user
function logoutUser() {
    // Clear auth cookie
    document.cookie = 'REPLIT_AUTH=; Max-Age=0; path=/; domain=.' + location.hostname.split('.').slice(-2).join('.');
    
    // Update UI
    currentUser = null;
    updateAuthUI(false);
    
    // Reload page to clear any user-specific data
    location.reload();
}

// Helper function to get cookie by name
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

// Setup auth UI
function setupAuthUI() {
    // Check if auth container exists
    let authContainer = document.getElementById('auth-container');
    
    // If not, create and add it to the header
    if (!authContainer) {
        authContainer = document.createElement('div');
        authContainer.id = 'auth-container';
        authContainer.className = 'auth-container';
        
        // Add to header
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(authContainer);
        }
    }
    
    // Initialize UI based on current auth status
    updateAuthUI(currentUser !== null);
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Export functions
window.auth = {
    getCurrentUser,
    isAuthenticated,
    checkAuthStatus,
    logoutUser
};
