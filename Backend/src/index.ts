import express from 'express';
import managerRouter from './Routes/manager';
import meetingRouter from './Routes/meeting';
import employeeRouter from './Routes/employee';
import meetingEmployeeRouter from './Routes/meetingEmployee';

const app = express();

app.use(express.json());
app.use('/manager',managerRouter);
app.use('/meeting',meetingRouter);
app.use('/employee',employeeRouter);
app.use('/meetingEmployee',meetingEmployeeRouter);

const port : number = 3000;
app.listen(port,function(){
    console.log(`Server running on ${port}`)
});