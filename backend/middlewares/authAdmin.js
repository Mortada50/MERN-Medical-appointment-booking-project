import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) return res.status(401).json({ success: false, message: "Unauthorized" });
    const tokenDecode = jwt.verify(atoken, process.env.JWT_SECRIT);
    if (tokenDecode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)
      return res.status(401).json({ success: false, message: "invalid token" });
    next();
  } catch (err) {
    console.log("catch an error: ", err);
    res.json({ success: false, message: err.message });
  }
};

export default authAdmin;
