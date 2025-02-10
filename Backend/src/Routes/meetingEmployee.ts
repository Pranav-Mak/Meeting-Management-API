import { Router, Request, Response, NextFunction }  from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import * as dotenv from 'dotenv';


dotenv.config();

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

router.use(cookieParser());
router.use(cors({
    credentials : true,
    allowedHeaders: ['Content-Type','Authorization'],
    origin: ["http://localhost:5500"],
    methods:['GET','POST','PUT','DELETE']
}));

function authMiddleware(req:Request, res:Response, next:NextFunction):void{
    const token = req.cookies.token;
    console.log('Token from cookies:', token);
    if(!token){
        console.error("No token found in cookies");
         res.status(400).json({ error: 'Access Denied1' });
         return
    }
    if(!JWT_SECRET){
         console.error("JWT_SECRET is not defined");
         res.status(400).json({ error: 'Access Denied2' });
         return
    }
    jwt.verify(token,JWT_SECRET,function(err: Error | null, user: any){
        if(err){
            console.error('Token verification failed:', err);
            res.status(400).json({ error: "Access Denied3" });
        }
        req.body.employee = user;
        next();
})
}


router.post('/join', authMiddleware ,async function(req,res){
    const employeeId= req.body.employee.mainId2;
    console.log('Decoded User:', req.body.manager);
    const meetingId= req.body.meetingId;
    try{
        const existingEntry = await prisma.meetingEmployee.findUnique({
            where: {
              meetingId_employeeId: {
                meetingId: parseInt(meetingId),
                employeeId: parseInt(employeeId)
              }
            }
          });
      
        if (existingEntry) {
            res.status(400).json({ message: "Employee has already joined the meeting" });
            return
        }
         const join = await prisma.meetingEmployee.create({
            data: {
                employeeId: parseInt(employeeId),
                meetingId: parseInt(meetingId),
            },
        });
        res.status(200).json({ message: "Joining meeting successful" });
    }catch(e){
        console.error("Error joining todo:", e);
        res.status(500).json({ error: "Error joining todo" });
    }
    })   

export default router;