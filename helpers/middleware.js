function middleware(req, res, next) {

  if (req.session.user && req.session.user.username != req.params.username) {
    res.redirect(`/${req.session.user.username}`)
    console.log('===========')
  }
  else if (req.session.user) {
    next();
  }
  else {
    res.redirect('/users/login');
  }
}

module.exports = middleware;