const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  
  socket.on('join_company_room', (companyId) => {
    socket.join(companyId);
    console.log(`[Socket.IO] Client ${socket.id} joined company room: ${companyId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP headers to allow local frames & speech features
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobfest';

const seedAdmin = require('./utils/seeder');

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully');
    await seedAdmin();
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server (HTTP + WebSockets) is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Routes
const authRoutes = require('./routes/authRoutes');
const featureRoutes = require('./routes/featureRoutes');
const studentRoutes = require('./routes/studentRoutes');
const companyRoutes = require('./routes/companyRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const adminRoutes = require('./routes/adminRoutes');
const queueRoutes = require('./routes/queueRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/queue', queueRoutes);

const SystemSetting = require('./models/SystemSetting');
app.get('/api/settings', async (req, res) => {
  try {
    let datesSetting = await SystemSetting.findOne({ key: 'jobfest_dates' });
    if (!datesSetting) {
      datesSetting = await SystemSetting.create({
        key: 'jobfest_dates',
        value: {
          startDate: '2027-03-30',
          endDate: '2027-03-31',
          eventName: 'JobFest 2027',
          organizer: 'TOPS Technologies'
        }
      });
    }
    res.status(200).json({ success: true, data: datesSetting.value });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('JobFest API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});
