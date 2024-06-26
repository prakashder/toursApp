const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const tourRouter = require('./routes/tourRoutes');
dotenv.config({ path: './.env' })
const app = express();
app.use(express.json());



const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(con => {
  // console.log(con.connection);
  console.log("DB connection successfull")
})

app.use('/api/v1/tours', tourRouter);



const port = process.env.PORT || 1111
app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
})