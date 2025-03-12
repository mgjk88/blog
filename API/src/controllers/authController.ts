import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../db/pool";
import { RequestHandler } from "express";
import { UserPayload } from "../../types";

const login: RequestHandler = async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.body.username
        }
    });

    if(!user){
        res.status(401).end();
        return;
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if(!match){
        res.status(401).end();
        return;
    }

    let payload = {id: user.id, username: user.username};

    const token = generateToken(payload);
    res.status(200).json({token});
};

const logout: RequestHandler = () => {

}

const authenticate: RequestHandler = (req, res, next) => {
    const authHdr = req.headers["authorization"];
    if(!authHdr) {
        res.status(401).end();
        return;
    }
    const token = authHdr.split(" ")[1];
    const payload = verifyToken(token);
    if(!payload) {
        res.status(403).end();
        return;
    }
    req.user = payload;
    next()
}

function generateToken(payload: UserPayload): string | null{
    try {
        return jwt.sign(payload, process.env.SECRET as string, {expiresIn: "5min"});        
    } catch (error) {
        return null;
    }
}

function verifyToken(token: string):UserPayload | null{
    try {
        return jwt.verify(token, process.env.SECRET as string) as UserPayload;        
    } catch (error) {
        return null;
    }
}

export default {login, logout, authenticate}