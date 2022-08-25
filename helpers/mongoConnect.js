
const mongoose = require('mongoose');

const connection= async(req,res)=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Database connected!")
    }catch(err){
         console.log(err);
    }
}
module.exports = connection