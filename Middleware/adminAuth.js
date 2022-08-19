const jwt = require("jsonwebtoken");

const config = process.env;

const verifyTokenAdmin = (req, res, next) => {
  const token = String(req.headers.authorization)
    .replace(/^bearer|^jwt/i, "")
    .replace(/^\s+|\s+$/gi, "");
  // console.log(token);
  if (!token) {
    return res.status(200).json({
      statusCode: 403,
      msg: "Admin, A token is required for authentication",
    });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY_ADMIN);
    req.admin = decoded;
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      statusCode: 401,
      msg: "Admin, Invalid Token",
    });
  }
  return next();
};

module.exports = verifyTokenAdmin;
