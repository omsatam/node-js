const express = require("express")
const cors = require("cors");
const sharp = require("sharp")
const fs = require('fs');
const request = require('request');
const path = require('path')


//app config
const app = express()
const PORT =  process.env.port || 8000;

// app middlewares
app.use(express.json())
app.use(cors())



const download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    // console.log('content-type:', res.headers['content-type']);
    // console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(`images/other/${filename}`)).on('close', callback);
  });
};



// api endpoints
app.get("/",(req,res) => 
    res.status(200).send("Hello")
)

app.post("/webp/post/",(req,res) => {
    const data = req.body
    download(data.url,data.filename + ".jpg", function(){
    console.log('done');
    sharp(`images/other/${data.filename}.jpg`).resize(data.height, data.width)
    .jpeg({quality : 80}).toFile( `images/webp/${data.filename}.webp`);
});  

//  res.status(201).sendFile(`${dir}/webp/${data.filename}.webp`)
 res.sendFile(data.filename + ".webp", { root: path.join(__dirname, './images/webp/') });
// res.status(201).send("Hello")

})
//app listeners
app.listen(PORT, () => console.log(`listening on localhost:${PORT}`));