const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { startCronJobs } = require('../helpers/cronJobs');


const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING)
        // .then(() => {
        //     startCronJobs();
        // })
        console.log(
            "DATABASE Connected to MongoDB successfully",
            connect.connection.host,
            connect.connection.name,
        );
        if (connect) {
            console.log("calling startCronJobs...");
            startCronJobs();
        }
        
    }catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;