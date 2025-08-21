const indexrouter=require('./Router/index')
const express=require('express')
const app = express()
app.use(express.json())
const authRoutes = require('./Router/authroutes');
const bookingRouter = require("./Router/booking");

const port = 4000;

const path = require('path');

app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/',indexrouter)
app.use('/', authRoutes);

app.use('/', bookingRouter);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});