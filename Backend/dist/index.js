"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manager_1 = __importDefault(require("./Routes/manager"));
const meeting_1 = __importDefault(require("./Routes/meeting"));
const employee_1 = __importDefault(require("./Routes/employee"));
const meetingEmployee_1 = __importDefault(require("./Routes/meetingEmployee"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/manager', manager_1.default);
app.use('/meeting', meeting_1.default);
app.use('/employee', employee_1.default);
app.use('/meetingEmployee', meetingEmployee_1.default);
const port = 3000;
app.listen(port, function () {
    console.log(`Server running on ${port}`);
});
