
import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {

    try {
        
        const { dtoken } = req.headers;

        if(!dtoken) 
          return res.status(401).json({success: false, message: "Unauthorized"})

        const tokenDecode = jwt.verify(dtoken, process.env.JWT_SECRIT);

        req.body = req.body || {};

        req.body.docId = tokenDecode.id;

        next();

    } catch (err) {
        
        console.log(err);

        res.status(500).json({success: false, message: err.message})
    }

}

export default authDoctor;