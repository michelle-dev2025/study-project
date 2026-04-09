const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from current directory
app.use(express.static(__dirname));

// Route for home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║     Zhongqin Stream Server Running     ║
╠════════════════════════════════════════╣
║  Local: http://localhost:${PORT}          ║
║  Press Ctrl+C to stop                  ║
╚════════════════════════════════════════╝
    `);
});
