const mongoose= require("mongoose");
const initData = require("./data.js");
//to run this file use node index.js 
//first go init folder using cd init
//after this stop and come back using cd..
const Listing = require("../models/listing");

//DATABASE SETUP
const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

//call to main fuction
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);

});


async function main() {
    await mongoose.connect(MONGO_URL);
    
}

const initDB= async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data inserted");
}

initDB();