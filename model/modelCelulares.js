const {Schema, model} = require("mongoose");



const celularSchema = Schema({
    imagen: {
        type: String,
    },
    marca: {
        type: String,
        required: true,
        unique:true
    },
    modelo: {
        type: String,
        required: true,
        unique:true
    },
    color: {
        type: String,
        default: "Negro"
    },
    year: {
        type: Date,
        default:Date.now
    },
    precio: {
        type: Number,
        required: true
    },
    descripcion: {
        type:String,
        required: true
    }

})

module.exports=model("celular", celularSchema, "Celular");

