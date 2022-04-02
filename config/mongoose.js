const mongoose=require('mongoose')
const env=require("../config/environment")

mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`,{
useNewUrlParser: true,
// useCreateIndex:true ,
// useFindAndModify:false,
//Above two were creating problem
useUnifiedTopology: true 
})

const db=mongoose.connection;
module.exports=db;