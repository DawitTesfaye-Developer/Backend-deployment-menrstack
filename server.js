require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
}));
app.use(cors());

const logger = require('./logger');

if (process.env.NODE_ENV === "production") {
  app.use(logger);
}

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: "Server is running" });
});

const { errorLogger, requestLogger, logger } = require('./logger');

// Use request logger middleware in all environments
app.use(requestLogger);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Use environment variable PORT or default 5000
const { connectToDatabase } = require('./db');

const requiredEnvVars = ['PORT', 'MONGODB_URI'];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.error(`ERROR: Environment variable ${varName} is not set.`);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
}

startServer();
