const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Simple in-memory database for users (in a real app, this would be a proper database)
const users = [
    {
        id: 'user_1',
        username: 'demo',
        password: 'password',
        email: 'demo@example.com',
        profileImage: 'https://ui-avatars.com/api/?name=Demo+User',
        createdAt: new Date().toISOString()
    }
];

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('./'));

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    // Find user in the database
    const user = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && 
        u.password === password
    );

    if (user) {
        // User authenticated successfully
        const userData = {
            id: user.id,
            name: user.username,
            profileImage: user.profileImage,
            email: user.email || ''
        };

        console.log(`User authenticated: ${username}`);
        return res.status(200).json(userData);
    } else {
        // Authentication failed
        console.log(`Authentication failed for username: ${username}`);
        return res.status(401).json({ error: 'Invalid username or password' });
    }
});

app.post('/api/auth/register', (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    // Check if username already exists
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        console.log(`Registration failed: Username ${username} already exists`);
        return res.status(409).json({ error: 'Username already exists' });
    }

    // Create new user
    const newUser = {
        id: 'user_' + Date.now(),
        username,
        password,
        email,
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`,
        createdAt: new Date().toISOString()
    };

    // Add to database
    users.push(newUser);
    console.log(`New user registered: ${username} (${newUser.id})`);

    // Return success
    return res.status(201).json({ 
        message: 'User registered successfully',
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            profileImage: newUser.profileImage
        }
    });
});

// Fallback for all other routes - serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});


// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});