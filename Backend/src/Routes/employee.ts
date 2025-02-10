import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";


const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

router.use(cookieParser());
router.use(cors({
    credentials : true,
    allowedHeaders: ['Content-Type','Authorization'],
    origin: ["http://localhost:5500"],
    methods:['GET','POST','PUT','DELETE']
}))


router.post('/signup' , async function(req,res){
    const {username,password,fullname,department} = req.body
    try{
        const employee = await prisma.employee.create({
            data:{
                username,
                password,
                fullname,
                department
            }
        });
        res.status(200).json(employee)
    }catch(e){
        console.error("Error:", e);
        res.status(500).json({ error: "Error Creating Profile" });
    }
})

router.post('/signin', async function(req,res){
    const {username, password} = req.body;
    try{
        const employee = await prisma.employee.findFirst({
            where:{
                username,
                password
            }
        });
        if(!employee){
            res.status(500).send("Invalid Username/Password");
            return;
        };
        if(!JWT_SECRET){
            res.status(500).send("Invalid Username/Password");
            return;
        };
        const token = jwt.sign({mainId2: employee.id},JWT_SECRET)
        res.cookie("token",token, {
            httpOnly: true,
        });
        res.json({message: "Looged in Succesfull",token}) 
    }catch(e){
        res.status(500).json({ error: "Error Signing In" });
    };
});


export default router;