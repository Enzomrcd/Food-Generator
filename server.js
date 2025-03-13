// Simple server for CulinaryCompass to handle authentication and API requests
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple in-memory database for users (in a real app, this would be a proper database)
const users = [];

// Create HTTP server
const server = http.createServer((req, res) => {
    // Set CORS headers to allow requests from your site
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Parse URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Static file server
    if (req.method === 'GET' && !pathname.startsWith('/api/')) {
        // Default to index.html for root path
        let filePath = '.' + pathname;
        if (pathname === '/') {
            filePath = './index.html';
        }

        // Get file extension
        const extname = path.extname(filePath);

        // Set content type based on file extension
        let contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
        }

        // Read and serve file
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // File not found
                    fs.readFile('./404.html', (err, content) => {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    });
                } else {
                    // Server error
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                // Success
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
        return;
    }

    // API endpoints
    if (pathname === '/api/user' && req.method === 'GET') {
        // Parse Replit Auth headers
        const userId = req.headers['x-replit-user-id'];
        const userName = req.headers['x-replit-user-name'];
        const userRoles = req.headers['x-replit-user-roles'] || '';

        if (userId && userName) {
            // Get user from database or create new user
            let user = users.find(u => u.id === userId);

            if (!user) {
                // Create new user
                user = {
                    id: userId,
                    name: userName,
                    roles: userRoles,
                    profileImage: `https://replit.com/cdn-cgi/image/width=32,quality=80,format=auto/${userName}`,
                    createdAt: new Date().toISOString()
                };

                // Add to database
                users.push(user);
                console.log(`New user created: ${userName} (${userId})`);
            }

            // Return user data
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
            console.log(`User authenticated: ${userName} (${userId})`);
        } else {
            // User not authenticated
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not authenticated' }));
            console.log('Authentication failed: No valid headers found');
        }
        return;
    }

    // Handle 404 for API routes
    if (pathname.startsWith('/api/')) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
        return;
    }

    // Default handler for unmatched routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

// Set port (use environment variable PORT if available, or default to 5000)
const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}/`);
});