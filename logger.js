const morgan = require('morgan');
const { createLogger, format, transports } = require('winston');

// Winston logger for general logging
const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console(),
  ],
  exitOnError: false,
});

// Morgan middleware for HTTP request logging (to console and combined format)
const requestLogger = morgan('combined', {
  stream: {
    write: message => logger.info(message.trim()),
  },
});

// Optional separate error logger if needed
const errorLogger = logger.child({ level: 'error' });

module.exports = {
  logger,
  requestLogger,
  errorLogger,
};
