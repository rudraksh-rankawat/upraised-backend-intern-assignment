import { Request ,Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.JWT_SECRET || "";


export const authenticate: (req: Request, res: Response, next: NextFunction) => void = 
    (req, res, next) => {
    

        try {

            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ error: "Unauthorized: No token provided" });
            }

            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, SECRET_KEY);
            next()
            
        } catch (error) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

};