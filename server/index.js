import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// Import configs & DB
import { connectDB } from './config/db.js';

// Import routes
import dashboardRoutes from './routes/dashboardRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import followupRoutes from './routes/followupRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Import engines / services
import { setIO } from './services/workflowEngine.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for local prototyping
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

// Bind Socket.IO to the Workflow Engine
setIO(io);

// Apply Middlewares
app.use(cors());
app.use(express.json());

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log(`[Socket.IO] New client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// REST Endpoints Routing
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/followups', followupRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/ai', aiRoutes);

// Base route ping
app.get('/api/ping', (req, res) => {
  res.status(200).json({ success: true, message: 'SolveX Flow API Online' });
});

// Custom Error Handling Middleware
app.use((err, req, res, _next) => {
  console.error(`[Error Handler] Catastrophic error: ${err.message}`);
  
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  // Connect Mongoose DB
  await connectDB();
  
  server.listen(PORT, () => {
    console.log(`[Server] Express online running on port ${PORT}`);
  });
};

startServer();
