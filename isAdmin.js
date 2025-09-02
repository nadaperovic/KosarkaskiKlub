// isAdmin.js
module.exports = function (req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ msg: 'Samo admin može izvršiti ovu akciju' });
};
