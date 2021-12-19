
const jwt = require('jsonwebtoken');

module.exports = {
  authenticateToken: (req, res, next) => {
    const token = req.cookies.token
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
      if (err) return res.sendStatus(403);
      next(); 
    });
  },
  generateAccessToken: (username) => {
    return jwt.sign({username: username}, process.env.TOKEN_SECRET, { expiresIn: '12h' });
  }
}