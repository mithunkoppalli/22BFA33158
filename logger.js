const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs.log');

const logger = (req, res, next) => {
  const log = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | IP: ${req.ip}\n`;
  fs.appendFileSync(logFile, log);
  next();
};

module.exports = logger;
