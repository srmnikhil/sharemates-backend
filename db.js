const mongoose = require("mongoose");
// enable this when using .env
require('dotenv').config();
const mongoURI = process.env.DB_URL;

const connectToMongo = () =>{
    mongoose.connect(mongoURI)
    .then(() =>{ 
        console.log("Connected to Mongo Successfully");
    })
    .catch((error) =>{
        console.log("Failed to Connect: "+(error));
    });
}
module.exports = connectToMongo;