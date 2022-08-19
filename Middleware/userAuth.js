const jwt = require("jsonwebtoken");

const config = process.env;

const verifyTokenUser = (req, res, next) => {
  const token = String(req.headers.authorization)
    .replace(/^bearer|^jwt/i, "")
    .replace(/^\s+|\s+$/gi, "");
  // console.log(token);
  if (!token) {
    return res.status(200).json({
      statusCode: 403,
      msg: "User, A token is required for authentication",
    });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY_USER);
    req.user = decoded;
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      statusCode: 401,
      msg: "User, Invalid Token",
    });
  }
  return next();
};

module.exports = verifyTokenUser;
