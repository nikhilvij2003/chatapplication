const http = require('http');
const app = require('./src/app');
const { initialize: initializeSocket } = require('./src/services/socket');

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});