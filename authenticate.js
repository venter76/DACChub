function checkAuthenticated(req, res, next) {
    if (req.session && req.session.isLoggedIn) {
      return next();
    } else {
        req.session.redirectTo = req.originalUrl;
      res.redirect('/'); // Redirect to login page
    }
  }

  module.exports = checkAuthenticated;