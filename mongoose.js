const mongoose=require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/chat-app",{
useNewUrlParser: true,
// useCreateIndex:true ,
// useFindAndModify:false,
//Above two were creating problem
useUnifiedTopology: true 
})