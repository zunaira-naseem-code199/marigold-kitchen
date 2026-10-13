export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid identifier' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'That record already exists' });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  return res.status(status).json({
    message: status >= 500 ? 'Something went wrong on our side. Please try again.' : err.message,
  });
}

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
