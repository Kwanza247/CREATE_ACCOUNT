const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const connectDB = require('./config/dbConnection');
connectDB();

const port = process.env.PORT || 2001;
app.use(express.json());

app.use('/api/users', require('./routes/userRoute'));




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

