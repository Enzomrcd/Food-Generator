function login() {
    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;
    
    // Implement basic login logic
    if (username && password) {
        console.log('Login successful for', username);
        // Additional login logic...
    } else {
        alert('Please enter both username and password');
    }
}

function showSignUp() {
    // Display signup form logic here
    alert("Display signup form"); // Replace with actual implementation
}

function toggleMenu() {
    // Logic for toggling hamburger menu visibility
    alert("Toggle menu! Implement your logic here."); // Replace with actual implementation
}
