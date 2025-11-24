// middleware/errorHandler.js
// Placeholder for centralized error handling middleware

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({
    status,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
