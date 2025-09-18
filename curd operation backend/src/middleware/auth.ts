import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const auth = (req: Request, res: Response, next: NextFunction) => {
    console.log("Headers: ", req.headers);
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);

    if(!token){
        return res.status(401).json({
            message: "Authorization failed"
        })
    }

    try {
        const decode = jwt.verify(token, JWT_SECRET as string);
        // req.admin = decode;
        console.log("Decoded token:", decode);
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: "Authorization failed"
        })
    }
}

// module.exports = { auth };