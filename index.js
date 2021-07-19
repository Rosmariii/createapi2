const express = require("express")
const app = express()
const dotenv = require("dotenv")
const nodemailer = require("nodemailer")

dotenv.config()

let logIp = function (req, res, next) {
    console.log(req.ip)
    next()
}

let checkIp = function ( req, res, next) {

    let blacklist = ['::2']

    if (blacklist.includes(req.ip)) {

        return res.status(403).send('')
    }
    next()
}
// para aplicar esta varialbe a todos los endpoin...
app.use(logIp)

//si se desea utilizar solo un middlere se lo escribe entre la url y la funcion, si es mas de uno se lo guarda en un array [logIp, checkIp]
app.get('/', checkIp, function (req, res){
    res.send('hola mundo')
})

app.get('/contacto', checkIp, async function (req, res){

  //PARA USAR UN MISMO USUARIO SOLO DEBO ELIMINAR LET Y RES Y DESCOMENTAR USER Y PASS
    //let testAccount = await nodemailer.createTestAccount();
    //res.send(testAccount)

    let transporter = nodemailer.createTransport({
      host: process.env.ETHEREAL_HOST,
      port: 587,
      secure: false, 
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,

        //user: testAccount.user, 
        //pass: testAccount.pass, 
      },
    });
 
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', 
      to: "bar@example.com, baz@example.com", 
      subject: "Hello ✔",
      text: "Hello world?", 
      html: "<b>Hello world?</b>", 
    });
  
    //console.log("Message sent: %s", info.messageId);
   
    res.send(nodemailer.getTestMessageUrl(info));
    
})

app.get('/nosotros', checkIp, function (req, res){
    res.send('hola mundo')
})

app.listen(process.env.PORT)