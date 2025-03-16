// auth.js

document.addEventListener('DOMContentLoaded', function() {
  // ----------------------
  // DOM ELEMENTS
  // ----------------------
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const loginModal = document.getElementById('loginModal');
  const signupModal = document.getElementById('signupModal');
  const closeLogin = document.getElementById('closeLogin');
  const closeSignup = document.getElementById('closeSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const userInfoDiv = document.getElementById('user-info');
  const welcomeMsg = document.getElementById('welcomeMsg');
  const logoutBtn = document.getElementById('logoutBtn');

  // ----------------------
  // MODAL TOGGLE FUNCTIONS
  // ----------------------
  function openModal(modal) {
    modal.classList.remove('hidden');
  }

  function closeModal(modal) {
    modal.classList.add('hidden');
  }

  // ----------------------
  // EVENT LISTENERS FOR AUTH BUTTONS
  // ----------------------
  loginBtn.addEventListener('click', () => openModal(loginModal));
  signupBtn.addEventListener('click', () => openModal(signupModal));

  closeLogin.addEventListener('click', () => closeModal(loginModal));
  closeSignup.addEventListener('click', () => closeModal(signupModal));

  // Close modal when clicking outside modal content
  window.addEventListener('click', function(event) {
    if (event.target === loginModal) {
      closeModal(loginModal);
    }
    if (event.target === signupModal) {
      closeModal(signupModal);
    }
  });

  // ----------------------
  // USER AUTHENTICATION (Demo using localStorage)
  // ----------------------
  // Retrieve stored users from localStorage
  function getStoredUsers() {
    return JSON.parse(localStorage.getItem('users')) || {};
  }

  // Save users to localStorage
  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  // ----------------------
  // SIGN UP FUNCTIONALITY
  // ----------------------
  signupForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!username || !password) {
      alert('Please fill in all fields.');
      return;
    }

    let users = getStoredUsers();
    if (users[username]) {
      alert('Username already exists. Please choose another.');
      return;
    }

    // For demonstration, we store the password in plain text (do NOT do this in production)
    users[username] = { password: password };
    saveUsers(users);
    alert('Sign up successful! You can now log in.');
    signupForm.reset();
    closeModal(signupModal);
  });

  // ----------------------
  // LOGIN FUNCTIONALITY
  // ----------------------
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
      alert('Please fill in all fields.');
      return;
    }

    let users = getStoredUsers();
    if (!users[username] || users[username].password !== password) {
      alert('Invalid username or password.');
      return;
    }

    alert('Login successful!');
    // Save current user (using sessionStorage for the session)
    sessionStorage.setItem('currentUser', username);
    updateAuthUI();
    loginForm.reset();
    closeModal(loginModal);
  });

  // ----------------------
  // LOGOUT FUNCTIONALITY
  // ----------------------
  logoutBtn.addEventListener('click', function() {
    sessionStorage.removeItem('currentUser');
    updateAuthUI();
  });

  // Update the UI based on login state
  function updateAuthUI() {
    const currentUser = sessionStorage.getItem('currentUser');
    const homeLink = document.querySelector('[data-section="home-section"]')?.parentElement;
    const feedLink = document.querySelector('[data-section="feed-section"]')?.parentElement;
    const donateLink = document.querySelector('[data-section="donate-section"]')?.parentElement;
    const hamburgerMenu = document.querySelector('.hamburger-menu');

    if (currentUser) {
        loginBtn.classList.add('hidden');
        signupBtn.classList.add('hidden');
        userInfoDiv.classList.remove('hidden');
        welcomeMsg.innerText = `Welcome, ${currentUser}`;
        if (homeLink) homeLink.style.display = 'block';
        if (feedLink) feedLink.style.display = 'block';
        if (hamburgerMenu) hamburgerMenu.style.display = 'block';
    } else {
        loginBtn.classList.remove('hidden');
        signupBtn.classList.remove('hidden');
        userInfoDiv.classList.add('hidden');
        welcomeMsg.innerText = '';
        if (homeLink) homeLink.style.display = 'none';
        if (feedLink) feedLink.style.display = 'none';
        if (hamburgerMenu) hamburgerMenu.style.display = 'none';
    }

    if (donateLink) donateLink.style.display = 'block';
}

  // Initialize UI on page load
  updateAuthUI();
});