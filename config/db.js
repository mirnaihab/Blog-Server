const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// const connectDB = async () => {
//     try {
//         console.log('connectDB function called'); 

//         await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB connected');
//     } catch (error) {
//         console.error(error.message);
//         process.exit(1);
//     }
// };

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); 
    }
};

module.exports = connectDB;
