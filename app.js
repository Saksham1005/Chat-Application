const express=require("express");
const hbs=require("hbs");
const path=require("path");
const port=3000;
const user_router=require("./routes/route");
const cookie_parser=require("cookie-parser")
require("./mongoose")

const app=express();
const public_directory=path.join(__dirname,"./public")
const views=path.join(__dirname,"./views")
const partials=path.join(__dirname,"./partials")

app.use(express.static(public_directory));
app.set("views-engine","hbs");
app.set("views",views)
hbs.registerPartials(partials)
app.use(cookie_parser())
app.use(express.json())
app.use(express.urlencoded())

app.use(user_router)

app.listen(port,()=>{
    console.log("App is running on port: "+port);
})