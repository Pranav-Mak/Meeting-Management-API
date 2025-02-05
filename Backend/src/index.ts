import express from 'express';
import managerRouter from './Routes/manager';
import meetingRouter from './Routes/meeting';

const app = express();

app.use(express.json());
app.use('/manager',managerRouter);
app.use('/meeting',meetingRouter);

const port : number = 3000;
app.listen(port,function(){
    console.log(`Server running on ${port}`)
});