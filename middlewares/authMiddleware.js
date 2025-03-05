const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Access Denied",
    });
  }

  try {
    jwt.verify(token, process.env.NODE_TRUSTYASIA_JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(200).send({
          success: false,
          message: "Invalid Token",
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: `Auth Failed ${error.message}`,
    });
  }
};
