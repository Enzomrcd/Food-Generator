
// Authentication module for CulinaryCompass
// Custom authentication system

let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already authenticated
    checkAuthStatus();
    
    // Add auth button to the page if not already present
    setupAuthUI();
});

// Check if user is authenticated
function checkAuthStatus() {
    // Check if the user is logged in based on session
    const userSession = localStorage.getItem('currentUserSession');
    
    if (userSession) {
        try {
            // User is authenticated, restore user data
            currentUser = JSON.parse(userSession);
            updateAuthUI(true);
            
            // Also update any UI elements that depend on authentication
            updateSocialFeaturesVisibility(true);
        } catch (error) {
            console.error('Error parsing user session:', error);
            currentUser = null;
            updateAuthUI(false);
            updateSocialFeaturesVisibility(false);
        }
    } else {
        // User is not authenticated
        currentUser = null;
        updateAuthUI(false);
        updateSocialFeaturesVisibility(false);
    }
}

// Update visibility of social features based on auth status
function updateSocialFeaturesVisibility(isAuthenticated) {
    const socialFeatures = document.querySelectorAll('.social-feature');
    
    if (isAuthenticated) {
        socialFeatures.forEach(el => el.classList.remove('hidden'));
    } else {
        socialFeatures.forEach(el => el.classList.add('hidden'));
    }
    
    // Update post form visibility
    const socialPostForm = document.getElementById('social-post-form');
    if (socialPostForm) {
        if (isAuthenticated) {
            socialPostForm.classList.remove('hidden');
        } else {
            socialPostForm.classList.add('hidden');
        }
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
                    <i class="fas fa-sign-in-alt"></i> Log In or Sign Up
                </button>
            </div>
        `;
        
        // Add login event listener
        const loginButton = document.getElementById('login-button');
        if (loginButton) {
            loginButton.addEventListener('click', showAuthDialog);
        }
        
        // Hide social features
        document.querySelectorAll('.social-feature').forEach(el => {
            el.classList.add('hidden');
        });
    }
    
    // Update social post form visibility
    updateSocialFormVisibility(isAuthenticated);
}

// Show authentication dialog
function showAuthDialog() {
    // Create auth dialog if it doesn't exist
    let authDialog = document.getElementById('auth-dialog');
    
    if (!authDialog) {
        authDialog = document.createElement('div');
        authDialog.id = 'auth-dialog';
        authDialog.className = 'auth-dialog';
        
        // Add auth form
        authDialog.innerHTML = `
            <div class="auth-dialog-content">
                <button id="close-auth-dialog" class="close-auth-btn">&times;</button>
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">Login</button>
                    <button class="auth-tab" data-tab="signup">Sign Up</button>
                </div>
                
                <div id="login-form" class="auth-form active">
                    <h3>Login to Your Account</h3>
                    <div class="form-group">
                        <label for="login-username">Username</label>
                        <input type="text" id="login-username" placeholder="Enter your username" required>
                    </div>
                    <div class="form-group">
                        <label for="login-password">Password</label>
                        <input type="password" id="login-password" placeholder="Enter your password" required>
                    </div>
                    <div class="form-message" id="login-message"></div>
                    <button id="login-submit" class="auth-submit-btn">Login</button>
                </div>
                
                <div id="signup-form" class="auth-form">
                    <h3>Create a New Account</h3>
                    <div class="form-group">
                        <label for="signup-username">Username</label>
                        <input type="text" id="signup-username" placeholder="Choose a username" required>
                    </div>
                    <div class="form-group">
                        <label for="signup-email">Email (optional)</label>
                        <input type="email" id="signup-email" placeholder="Enter your email">
                    </div>
                    <div class="form-group">
                        <label for="signup-password">Password</label>
                        <input type="password" id="signup-password" placeholder="Choose a password" required>
                    </div>
                    <div class="form-group">
                        <label for="signup-confirm">Confirm Password</label>
                        <input type="password" id="signup-confirm" placeholder="Confirm your password" required>
                    </div>
                    <div class="form-message" id="signup-message"></div>
                    <button id="signup-submit" class="auth-submit-btn">Sign Up</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(authDialog);
        
        // Add close button event listener
        const closeButton = document.getElementById('close-auth-dialog');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                authDialog.style.display = 'none';
            });
        }
        
        // Add tab switching functionality
        const authTabs = authDialog.querySelectorAll('.auth-tab');
        authTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and forms
                authTabs.forEach(t => t.classList.remove('active'));
                authDialog.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding form
                this.classList.add('active');
                const formId = this.getAttribute('data-tab') + '-form';
                document.getElementById(formId).classList.add('active');
            });
        });
        
        // Add login form submit handler
        const loginSubmit = document.getElementById('login-submit');
        if (loginSubmit) {
            loginSubmit.addEventListener('click', handleLogin);
        }
        
        // Add signup form submit handler
        const signupSubmit = document.getElementById('signup-submit');
        if (signupSubmit) {
            signupSubmit.addEventListener('click', handleSignup);
        }
    }
    
    // Show auth dialog
    authDialog.style.display = 'flex';
}

// Handle login form submission
function handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const messageElement = document.getElementById('login-message');
    
    // Basic validation
    if (!username || !password) {
        messageElement.innerHTML = 'Please enter both username and password';
        messageElement.className = 'form-message error';
        return;
    }
    
    // Check if user exists
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    
    if (user) {
        // Login successful
        messageElement.innerHTML = 'Login successful! Redirecting...';
        messageElement.className = 'form-message success';
        
        // Set current user
        currentUser = {
            id: user.id,
            name: user.username,
            profileImage: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`,
            email: user.email || ''
        };
        
        // Save user session
        localStorage.setItem('currentUserSession', JSON.stringify(currentUser));
        
        // Update UI
        updateAuthUI(true);
        
        // Close dialog after a short delay
        setTimeout(() => {
            const authDialog = document.getElementById('auth-dialog');
            if (authDialog) {
                authDialog.style.display = 'none';
            }
        }, 1000);
    } else {
        // Login failed
        messageElement.innerHTML = 'Invalid username or password';
        messageElement.className = 'form-message error';
    }
}

// Handle signup form submission
function handleSignup() {
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const messageElement = document.getElementById('signup-message');
    
    // Basic validation
    if (!username || !password) {
        messageElement.innerHTML = 'Please enter username and password';
        messageElement.className = 'form-message error';
        return;
    }
    
    if (password !== confirm) {
        messageElement.innerHTML = 'Passwords do not match';
        messageElement.className = 'form-message error';
        return;
    }
    
    // Check if username already exists
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        messageElement.innerHTML = 'Username already exists';
        messageElement.className = 'form-message error';
        return;
    }
    
    // Create new user
    const newUser = {
        id: 'user_' + Date.now(), // Generate a unique ID
        username: username,
        password: password,
        email: email,
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`,
        createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Show success message
    messageElement.innerHTML = 'Account created successfully! You can now log in.';
    messageElement.className = 'form-message success';
    
    // Switch to login tab after a short delay
    setTimeout(() => {
        const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
        if (loginTab) {
            loginTab.click();
        }
    }, 1500);
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
    // Clear user session
    localStorage.removeItem('currentUserSession');
    
    // Update UI
    currentUser = null;
    updateAuthUI(false);
    
    // Update social features visibility
    updateSocialFeaturesVisibility(false);
    
    // Navigate back to the home section
    const homeLink = document.querySelector('.nav-link[data-section="generator-section"]');
    if (homeLink) {
        homeLink.click();
    }
}

// Helper function to get cookie by name (keeping for compatibility)
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

// Add some pre-defined users for testing
if (users.length === 0) {
    users = [
        {
            id: 'user_1',
            username: 'demo',
            password: 'password',
            email: 'demo@example.com',
            profileImage: 'https://ui-avatars.com/api/?name=Demo+User',
            createdAt: new Date().toISOString()
        }
    ];
    localStorage.setItem('users', JSON.stringify(users));
}
