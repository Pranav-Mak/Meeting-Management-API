"use strict";
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
router.post('/signup', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, fullname, department } = req.body;
        try {
            const manager = yield prisma.manager.create({
                data: {
                    username,
                    password,
                    fullname,
                    department
                }
            });
            res.status(200).json(manager);
        }
        catch (e) {
            console.error("Error:", e);
            res.status(500).json({ error: "Error Creating Profile" });
        }
    });
});
router.post('/signin', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        try {
            const manager = yield prisma.manager.findFirst({
                where: {
                    username,
                    password
                }
            });
            if (!manager) {
                res.status(500).send("Invalid Username/Password");
                return;
            }
            ;
            if (!JWT_SECRET) {
                res.status(500).send("Invalid Username/Password");
                return;
            }
            ;
            const token = jsonwebtoken_1.default.sign({ mainId: manager.id }, JWT_SECRET);
            res.cookie("token", token, {
                httpOnly: true,
            });
            res.json({ message: "Looged in Succesfull", token });
        }
        catch (e) {
            res.status(500).json({ error: "Error Signing In" });
        }
        ;
    });
});
exports.default = router;
