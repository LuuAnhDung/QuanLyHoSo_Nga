export const ensureManagerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'manager' || req.user.role === 'admin' || req.user.role === 'user')) {
    return next();
  }
  req.flash('error_msg', 'Unauthorized access');
  res.redirect('/dashboard');
}; 