import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRIT);
    req.body = req.body || {};
    req.body.userId = tokenDecode.id;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export default authUser;
