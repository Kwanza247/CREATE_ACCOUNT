const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(
            "DATABASE Connected to MongoDB successfully",
            connect.connection.host,
            connect.connection.name,
            connect.connection.port,
        );
        
    }catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;