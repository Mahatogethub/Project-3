const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const { application } = require('express')
const route=require('./routes/route')

const app=express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Ranamahato:9XBWNazgyvZ41FGS@rana.1qocv4g.mongodb.net/group29Database", {
    useNewUrlParser: true
}).then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


    app.use('/', route);


app.listen(process.env.PORT||3000, function () {
    console.log('Express app running on port ' + (3000||process.env.PORT))
});