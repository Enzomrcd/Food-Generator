// Authentication module for CulinaryCompass
// Handles user registration, login, and profile management

// Initialize authentication module
(function() {
    // Auth state
    const auth = {
        currentUser: null,

        // Initialize auth from localStorage
        init: function() {
            // Check for existing session
            const storedUser = localStorage.getItem('auth_user');
            if (storedUser) {
                try {
                    this.currentUser = JSON.parse(storedUser);
                    this.renderAuthUI();
                } catch (e) {
                    console.error('Failed to parse stored user data:', e);
                    localStorage.removeItem('auth_user');
                }
            }

            this.setupAuthUI();
        },

        // Check if user is authenticated
        isAuthenticated: function() {
            return this.currentUser !== null;
        },

        // Get current user
        getCurrentUser: function() {
            return this.currentUser;
        },

        // Set up auth UI
        setupAuthUI: function() {
            const authContainer = document.getElementById('auth-container');
            if (!authContainer) return;

            // Clear existing content first
            authContainer.innerHTML = '';

            // Create auth button
            const authButton = document.createElement('button');
            authButton.id = 'auth-button';
            authButton.className = 'auth-button';

            if (this.isAuthenticated()) {
                // User is logged in
                authButton.innerHTML = `
                    <img src="${this.currentUser.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.currentUser.name)}" alt="${this.currentUser.name}" class="user-avatar">
                    <span>${this.currentUser.name}</span>
                `;

                // Add dropdown for user options
                const dropdown = document.createElement('div');
                dropdown.className = 'auth-dropdown';
                dropdown.innerHTML = `
                    <div class="dropdown-menu">
                        <a href="#" id="profile-link" class="dropdown-item">Profile</a>
                        <a href="#" id="logout-link" class="dropdown-item">Log Out</a>
                    </div>
                `;

                authContainer.appendChild(authButton);
                authContainer.appendChild(dropdown);

                // Toggle dropdown on click
                authButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!authContainer.contains(e.target)) {
                        dropdown.classList.remove('active');
                    }
                });

                // Set up logout
                const logoutLink = document.getElementById('logout-link');
                if (logoutLink) {
                    logoutLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.logout();
                    });
                }

                // Set up profile
                const profileLink = document.getElementById('profile-link');
                if (profileLink) {
                    profileLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showProfileDialog();
                    });
                }

                // Show post form if authenticated
                const postForm = document.getElementById('social-post-form');
                if (postForm) {
                    postForm.classList.remove('hidden');
                }

                // Show social section
                const socialSection = document.getElementById('social-section');
                if (socialSection) {
                    socialSection.classList.remove('hidden');
                }
            } else {
                // User is not logged in
                authButton.innerHTML = `<i class="fas fa-user"></i> Log in or Sign up`;
                authContainer.appendChild(authButton);

                // Show login dialog on click
                authButton.addEventListener('click', () => {
                    this.showAuthDialog();
                });

                // Hide post form if not authenticated
                const postForm = document.getElementById('social-post-form');
                if (postForm) {
                    postForm.classList.add('hidden');
                }

                // Hide social section for non-authenticated users
                const socialSection = document.getElementById('social-section');
                if (socialSection) {
                    socialSection.classList.add('hidden');
                }
            }
        },

        // Render auth UI (update existing UI)
        renderAuthUI: function() {
            const authContainer = document.getElementById('auth-container');
            if (!authContainer) return;

            // Clear existing content
            authContainer.innerHTML = '';

            // Set up UI
            this.setupAuthUI();
        },

        // Show auth dialog
        showAuthDialog: function() {
            // Create dialog
            const dialog = document.createElement('div');
            dialog.className = 'auth-dialog';
            dialog.id = 'auth-dialog';

            dialog.innerHTML = `
                <div class="auth-dialog-content">
                    <button type="button" class="close-auth-btn">&times;</button>
                    <div class="auth-tabs">
                        <button type="button" class="auth-tab active" data-tab="login">Log In</button>
                        <button type="button" class="auth-tab" data-tab="signup">Sign Up</button>
                    </div>
                    <div class="auth-tab-content">
                        <div id="login-tab" class="auth-tab-pane active">
                            <h3>Log In</h3>
                            <form id="login-form">
                                <div class="form-group">
                                    <label for="login-username">Username</label>
                                    <input type="text" id="login-username" placeholder="Enter your username" required>
                                </div>
                                <div class="form-group">
                                    <label for="login-password">Password</label>
                                    <input type="password" id="login-password" placeholder="Enter your password" required>
                                </div>
                                <div class="form-message" id="login-message"></div>
                                <button type="submit" class="auth-submit-btn">Log In</button>
                            </form>
                        </div>
                        <div id="signup-tab" class="auth-tab-pane">
                            <h3>Sign Up</h3>
                            <form id="signup-form">
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
                                    <label for="signup-confirm-password">Confirm Password</label>
                                    <input type="password" id="signup-confirm-password" placeholder="Confirm your password" required>
                                </div>
                                <div class="form-message" id="signup-message"></div>
                                <button type="submit" class="auth-submit-btn">Sign Up</button>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            // Add dialog to body
            document.body.appendChild(dialog);

            // Add event listeners
            const closeBtn = dialog.querySelector('.close-auth-btn');
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(dialog);
            });

            // Click outside to close
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    document.body.removeChild(dialog);
                }
            });

            // Tab switching
            const tabs = dialog.querySelectorAll('.auth-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs and panes
                    tabs.forEach(t => t.classList.remove('active'));
                    dialog.querySelectorAll('.auth-tab-pane').forEach(p => p.classList.remove('active'));

                    // Add active class to clicked tab and corresponding pane
                    tab.classList.add('active');
                    const tabId = tab.getAttribute('data-tab');
                    dialog.querySelector(`#${tabId}-tab`).classList.add('active');
                });
            });

            // Login form submission
            const loginForm = dialog.querySelector('#login-form');
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const username = document.getElementById('login-username').value;
                const password = document.getElementById('login-password').value;

                this.login(username, password, dialog);
            });

            // Signup form submission
            const signupForm = dialog.querySelector('#signup-form');
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const username = document.getElementById('signup-username').value;
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;
                const confirmPassword = document.getElementById('signup-confirm-password').value;

                this.register(username, email, password, confirmPassword, dialog);
            });
        },

        // Show profile dialog
        showProfileDialog: function() {
            if (!this.isAuthenticated()) return;

            // Create dialog
            const dialog = document.createElement('div');
            dialog.className = 'auth-dialog';
            dialog.id = 'profile-dialog';

            dialog.innerHTML = `
                <div class="auth-dialog-content">
                    <button type="button" class="close-auth-btn">&times;</button>
                    <h3>Your Profile</h3>
                    <div class="profile-content">
                        <div class="profile-image-container">
                            <img src="${this.currentUser.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.currentUser.name)}" alt="${this.currentUser.name}" class="profile-avatar">
                            <button type="button" class="change-avatar-btn">Change Avatar</button>
                        </div>
                        <form id="profile-form">
                            <div class="form-group">
                                <label for="profile-username">Username</label>
                                <input type="text" id="profile-username" value="${this.currentUser.name}" required>
                            </div>
                            <div class="form-group">
                                <label for="profile-email">Email</label>
                                <input type="email" id="profile-email" value="${this.currentUser.email || ''}">
                            </div>
                            <div class="form-message" id="profile-message"></div>
                            <button type="submit" class="auth-submit-btn">Save Changes</button>
                        </form>
                    </div>
                </div>
            `;

            // Add dialog to body
            document.body.appendChild(dialog);

            // Add event listeners
            const closeBtn = dialog.querySelector('.close-auth-btn');
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(dialog);
            });

            // Click outside to close
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    document.body.removeChild(dialog);
                }
            });

            // Profile form submission
            const profileForm = dialog.querySelector('#profile-form');
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const username = document.getElementById('profile-username').value;
                const email = document.getElementById('profile-email').value;

                this.updateProfile(username, email, dialog);
            });

            // Change avatar button
            const changeAvatarBtn = dialog.querySelector('.change-avatar-btn');
            changeAvatarBtn.addEventListener('click', () => {
                // Generate a new avatar based on the username
                const username = document.getElementById('profile-username').value;
                const newAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`;

                // Update avatar in dialog
                dialog.querySelector('.profile-avatar').src = newAvatar;

                // Store new avatar URL for saving later
                dialog.querySelector('.profile-avatar').dataset.newAvatar = newAvatar;
            });
        },

        // Login user
        login: function(username, password, dialog) {
            // For demo purposes, check if username and password are not empty
            if (!username || !password) {
                this.showMessage('login-message', 'Please enter both username and password.', 'error');
                return;
            }

            // Check if the user exists in localStorage (registered users)
            const registeredUsers = JSON.parse(localStorage.getItem('registered_users')) || [];
            const userExists = registeredUsers.find(user => user.name === username);

            if (!userExists) {
                this.showMessage('login-message', 'User does not exist. Please sign up first.', 'error');
                return;
            }

            // In a real app, you would verify the password securely
            // This is a simple check for demo purposes
            if (userExists.password !== password) {
                this.showMessage('login-message', 'Incorrect password. Please try again.', 'error');
                return;
            }

            // Simulate API call
            setTimeout(() => {
                // Get the existing user
                const user = {
                    id: userExists.id,
                    name: username,
                    profileImage: userExists.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`,
                    email: userExists.email || ''
                };

                // Store user
                this.currentUser = user;
                localStorage.setItem('auth_user', JSON.stringify(user));

                // Show success message
                this.showMessage('login-message', 'Login successful! Redirecting...', 'success');

                // Close dialog and update UI
                setTimeout(() => {
                    document.body.removeChild(dialog);
                    this.renderAuthUI();

                    // Show post form after login
                    const postForm = document.getElementById('social-post-form');
                    if (postForm) {
                        postForm.classList.remove('hidden');
                    }

                    // Show social section
                    const socialSection = document.getElementById('social-section');
                    if (socialSection) {
                        socialSection.classList.remove('hidden');
                    }

                    // Show hamburger menu after login
                    const hamburgerMenu = document.querySelector('.hamburger-menu');
                    if (hamburgerMenu) {
                        hamburgerMenu.style.display = 'block';
                    }

                    // If on mobile, make sure main nav is properly set up
                    const mainNav = document.getElementById('main-nav');
                    if (mainNav && window.innerWidth < 768) {
                        mainNav.classList.remove('active');
                    }
                }, 1000);
            }, 600);
        },

        // Register user
        register: function(username, email, password, confirmPassword, dialog) {
            // Validate form
            if (!username || !password) {
                this.showMessage('signup-message', 'Please enter both username and password.', 'error');
                return;
            }

            if (password !== confirmPassword) {
                this.showMessage('signup-message', 'Passwords do not match.', 'error');
                return;
            }

            // Check if username already exists
            const registeredUsers = JSON.parse(localStorage.getItem('registered_users')) || [];
            if (registeredUsers.some(user => user.name === username)) {
                this.showMessage('signup-message', 'Username already exists. Please choose another.', 'error');
                return;
            }

            // Simulate API call
            setTimeout(() => {
                const userId = 'user_' + Date.now();
                const user = {
                    id: userId,
                    name: username,
                    password: password, // In a real app, this would be hashed
                    profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`,
                    email: email || ''
                };

                // Store in registered users
                registeredUsers.push(user);
                localStorage.setItem('registered_users', JSON.stringify(registeredUsers));

                // Store current user
                const currentUser = {
                    id: userId,
                    name: username,
                    profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`,
                    email: email || ''
                };

                this.currentUser = currentUser;
                localStorage.setItem('auth_user', JSON.stringify(currentUser));

                // Show success message
                this.showMessage('signup-message', 'Account created successfully! Redirecting...', 'success');

                // Close dialog and update UI
                setTimeout(() => {
                    document.body.removeChild(dialog);
                    this.renderAuthUI();

                    // Show post form after registration
                    const postForm = document.getElementById('social-post-form');
                    if (postForm) {
                        postForm.classList.remove('hidden');
                    }
                }, 1000);
            }, 600);
        },

        // Update user profile
        updateProfile: function(username, email, dialog) {
            if (!this.isAuthenticated()) return;

            // Validate form
            if (!username) {
                this.showMessage('profile-message', 'Username cannot be empty.', 'error');
                return;
            }

            // Get new avatar if set
            const profileAvatar = dialog.querySelector('.profile-avatar');
            const newAvatar = profileAvatar.dataset.newAvatar || this.currentUser.profileImage;

            // Update user
            this.currentUser.name = username;
            this.currentUser.email = email || '';
            this.currentUser.profileImage = newAvatar;

            // Save to localStorage
            localStorage.setItem('auth_user', JSON.stringify(this.currentUser));

            // Show success message
            this.showMessage('profile-message', 'Profile updated successfully!', 'success');

            // Update UI
            setTimeout(() => {
                document.body.removeChild(dialog);
                this.renderAuthUI();
            }, 1000);
        },

        // Logout user
        logout: function() {
            // Clear user data
            this.currentUser = null;
            localStorage.removeItem('auth_user');

            // Update UI
            this.renderAuthUI();

            // Hide post form after logout
            const postForm = document.getElementById('social-post-form');
            if (postForm) {
                postForm.classList.add('hidden');
            }
        },

        // Show message in form
        showMessage: function(elementId, message, type) {
            const messageElement = document.getElementById(elementId);
            if (!messageElement) return;

            messageElement.textContent = message;
            messageElement.className = 'form-message ' + type;

            // Clear message after a timeout
            if (type === 'success') {
                setTimeout(() => {
                    messageElement.textContent = '';
                    messageElement.className = 'form-message';
                }, 5000);
            }
        }
    };

    // Initialize auth when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        auth.init();

        // Expose auth to window for other modules to use
        window.auth = auth;
    });
})();