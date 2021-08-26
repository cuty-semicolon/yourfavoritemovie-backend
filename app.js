const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const config = require('./config');
const port  = process.env.PORT || 3000;

const app = express();

mongoose.connect(config.mongodbUri);
const db = mongoose.connection;
console.log(config.SECRET)
db.on('error', console.error)
db.once('open', ()=>{
    console.log('connected to mongodb server!');
})

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.set('jwt-secret', config.SECRET);

app.get('/', (req,res)=>{
    res.send('Hello JWT');
})

app.use('/user', require('./routes/index'));

app.listen(port, ()=>{
    console.log(`Express server is running on port ${port}`);
})