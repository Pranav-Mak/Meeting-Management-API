"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
router.use((0, cookie_parser_1.default)());
router.use((0, cors_1.default)({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: ["http://localhost:5500"],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    console.log('Token from cookies:', token);
    if (!token) {
        console.error("No token found in cookies");
        res.status(400).json({ error: 'Access Denied1' });
        return;
    }
    if (!JWT_SECRET) {
        console.error("JWT_SECRET is not defined");
        res.status(400).json({ error: 'Access Denied2' });
        return;
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, function (err, user) {
        if (err) {
            console.error('Token verification failed:', err);
            res.status(400).json({ error: "Access Denied3" });
        }
        req.body.employee = user;
        next();
    });
}
router.post('/join', authMiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const employeeId = req.body.employee.mainId2;
        console.log('Decoded User:', req.body.manager);
        const meetingId = req.body.meetingId;
        try {
            const existingEntry = yield prisma.meetingEmployee.findUnique({
                where: {
                    meetingId_employeeId: {
                        meetingId: parseInt(meetingId),
                        employeeId: parseInt(employeeId)
                    }
                }
            });
            if (existingEntry) {
                res.status(400).json({ message: "Employee has already joined the meeting" });
                return;
            }
            const join = yield prisma.meetingEmployee.create({
                data: {
                    employeeId: parseInt(employeeId),
                    meetingId: parseInt(meetingId),
                },
            });
            res.status(200).json({ message: "Joining meeting successful" });
        }
        catch (e) {
            console.error("Error joining todo:", e);
            res.status(500).json({ error: "Error joining todo" });
        }
    });
});
exports.default = router;
