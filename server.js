const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory user database for demonstration purposes.
// NOTE: In production, use a persistent database and securely hash passwords!
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

// ----------------------
// MIDDLEWARE SETUP
// ----------------------
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '/')));

// ----------------------
// AUTHENTICATION ENDPOINTS
// ----------------------

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  // Find the user (case-insensitive username comparison)
  const user = users.find(u => 
    u.username.toLowerCase() === username.toLowerCase() &&
    u.password === password
  );
  
  if (user) {
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email || '',
      profileImage: user.profileImage
    };
    console.log(`User authenticated: ${username}`);
    return res.status(200).json(userData);
  } else {
    console.log(`Authentication failed for username: ${username}`);
    return res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Registration endpoint
app.post('/api/auth/register', (req, res) => {
  const { username, password, email } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  // Check if username already exists (case-insensitive)
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    console.log(`Registration failed: Username ${username} already exists`);
    return res.status(409).json({ error: 'Username already exists' });
  }
  
  // Create new user (In production, hash the password before storing)
  const newUser = {
    id: 'user_' + Date.now(),
    username,
    password,
    email,
    profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  console.log(`New user registered: ${username} (${newUser.id})`);
  
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

// ----------------------
// FALLBACK ROUTE
// ----------------------
// This serves index.html for any routes not handled above (useful for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// ----------------------
// START THE SERVER
// ----------------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
