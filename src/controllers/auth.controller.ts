import { Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken"
import generateToken from "../utils/auth";



const admin_username = process.env.ADMIN_USERNAME
const admin_password = process.env.ADMIN_PASSWORD


export const loginUser: RequestHandler = (req: Request, res: Response) => {
    try {
        
        const { username, password } = req.body;
        if (username != admin_username || password != admin_password) {
            res.status(401).json({ error: "Invalid username or password" });
            return
        }

        const token = generateToken(username);
        res.json({ message: "Login successful", token });
        

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        return
    }
}