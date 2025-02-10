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
        req.body.manager = user;
        next();
})
}


router.post('/',authMiddleware,async function(req,res){
    const {meetingName,date,time } = req.body;
    console.log('Decoded User:', req.body.manager);
    const managerId= req.body.manager.mainId;
    
    try{
        const meeting = await prisma.meeting.create({
            data:{
                meetingName,
                date,
                time,
                managerId:parseInt(managerId)
            }
        })
        res.status(200).json(meeting)
    }catch(e){
        console.error("Error:", e);
        res.status(500).json({ error: "Error Creating Meeting" });
    }
})


router.put('/',authMiddleware,async function(req,res){
    const {id,meetingName,date,time } = req.body;
    const managerId= req.body.manager.mainId;

    console.log(`Updating meeting with ID: ${id}`); // Log the ID for debugging
    try{
        const meeting = await prisma.meeting.update({
            where:{
                id:parseInt(id),
            },
            data:{
                meetingName,
                date,
                time,
                managerId:parseInt(managerId)
            }
        })
        res.status(200).json(meeting)
    }catch(e){
        console.error("Error:", e);
        res.status(500).json({ error: "Error Creating Meeting" });
    }
})


router.get('/bulk', async (req, res) => {
    try {
      const meetings = await prisma.meeting.findMany();
      
      res.status(200).json(meetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({ error: "Error fetching meetings" });
    }
  });
  

  router.delete('/:id', authMiddleware, async function(req, res) {
    const { id } = req.params;  // Get the meeting id from the URL parameter
    const managerId = req.body.manager.mainId;  // Assuming you have userId available via middleware

    try {
        const meeting = await prisma.meeting.findFirst({
            where: { id: parseInt(id) }
        });
        
        if (!meeting) {
            res.status(404).json({ error: "Meeting not found" });
            return;
        }

        if (meeting.managerId !== parseInt(managerId)) {
            res.status(403).json({ error: "You are not authorized to delete this meeting" });
            return;
        }

        await prisma.meetingEmployee.deleteMany({
            where: { meetingId: parseInt(id) },
        });
        
        await prisma.meeting.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: "Meeting deleted successfully" });
    } catch (e) {
        console.error("Error deleting meeting:", e);
        res.status(500).json({ error: "Error deleting meeting" });
    }
});


router.get('/meetMembers', authMiddleware, async function(req,res){
    try {
        const meetings = await prisma.meetingEmployee.findMany({
          include: {
            employee: true,  // Include employee data
          }
        });
        res.status(200).json(meetings);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        res.status(500).json({ error: "Error fetching meetings" });
      }
    });

export default router;