const express =  require("express");
const conexion = require ("./conexion/conexion")
const router = require("./router/routerCelulares")

const app = express();

conexion();

app.use(express.json())
//decodifica la informacion y la convierte en formato json//
app.use(express.urlencoded({extended:true}));

app.use('/public', express.static(`${__dirname}/src`))

app.use("/api", router)

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})