const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Esperance",{
    // useNewUrlParser:true,
    // userUnifiedTopology:true,
    // useCreateIndex:true,
}).then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(`${err} no connection`);
})