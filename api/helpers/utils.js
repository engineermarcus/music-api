function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_\-\.]/gi, '_').toLowerCase();
}

module.exports = { sanitizeFilename };

