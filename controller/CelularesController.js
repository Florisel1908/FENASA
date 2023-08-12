const modeloCelular = require("../model/modelCelulares") 
const fs = require('fs');



//npm i multer path 
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage }).single('image');




const saludar = ()=>{
    console.log('Hola');
}


// AGREGAR

const agregar = async (req,res)=>{
    await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: err.message });
          }
          resolve();
        });
      });
  
      
  let image = req.file ? req.file.filename : 'default.png';
  console.log(typeof(image))
  //let img2=JSON.stringify(image)
    let info = req.body;
    
    info.imagen = image
    console.log(info)
    //console.log()
    const celular = new modeloCelular(info);  
    celular.save()
    .then((result) => {
        return res.status(200).send({
            message: "Celular agregado correctamente",
            status:"ok",
            result
        })
    }).catch((err) => {
        return res.status(404).send({
            message: "Error al agregar el celular",
            status:"Error",
            err
        })
    });
    
}

//Mostrar todo

const mostrarTodo = (req,res)=>{
    modeloCelular.find().exec()
    .then((resultado) =>{
        if(!resultado){
            return res.status(202).send({
                mensaje:"No hay registros en la BD",
                status:"ok"
            })
        }
        return res.status(200).send(
            resultado
        )

    }).catch((err)=>{
        return res.status(404).send({
            mensaje:"Error al mostrar la informacion",
            status:"Error",
            err
        })
    });
}


// FILTRO

const filtro = (req, res)=>{
    let consulta = {}
    consulta[req.params.key]=req.params.value;
    
    modeloCelular.find(consulta)
    .then((resultado)=>{
        if(!resultado) res.status(202).send({mesaje:"No hay registro en la DB"})
        return res.status(200).send({
            status: "OK",
            resultado
        })

    }).catch ((e)=>{
        return res.status(404).send({
            status: "Error",
            e
        })
    })
}


//EDITAR

const editar = async(req,res)=>{

    await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: err.message });
          }
          resolve();
        });
      });
  
      
  let image = req.file ? req.file.filename : 'default.png';

    let consulta = {}
    consulta[req.params.key]=req.params.value;
    const img = req.params.img;
    let nuevo =  req.body
    nuevo.imagen = image

    let imgUrl = `src/${img}`;
    fs.unlink(imgUrl, (err => {
        if (err) console.log(err);
        else {
          console.log(`Deleted file: ${img}`);
        }
      }));

    //nuevo.unshift(image)
    console.log(consulta)
    console.log(nuevo)
    modeloCelular.findOneAndUpdate(consulta,nuevo,{new:true})
    .then((resul)=>{
        return res.status(200).send({
            mensaje:"Se actualizo de manera correcta",
            status:"OK",
            resul
        })
    }).catch((e)=>{
        return res.status(404).send({mensaje:"No se realizo la actualizacion del registro", e})
    })
}

//ELIMINAR


const eliminar = (req,res)=>{
    let consulta = {}
    consulta[req.params.key]=req.params.value;
    //console.log(consulta)
    modeloCelular.findOneAndDelete(consulta)
    .then((resul)=>{

        let imgUrl = `src/${resul.imagen}`;
        fs.unlink(imgUrl, (err => {
            if (err) console.log(err);
            else {
              console.log(`Deleted file: ${resul.imagen}`);
            }
          }));

        return res.status(200).send({
            mensaje:"Se elimino correctamente",
            status:"OK",
            resul
        })
    }).catch((e)=>{
        return res.status(404).send({mensaje:"No se realizo la eliminacion del registro", e})
    })
}

module.exports={
    saludar,
    agregar,
    mostrarTodo,
    filtro,
    editar,
    eliminar
}
