require('dotenv').config()
const connect = require('./helpers/mongoConnect')
const express = require('express');
const bodyParser = require('body-parser')

const personRoute = require('./routes/personRoute');
const treeRoute = require('./routes/treeRoutes');
const PORT = process.env.PORT || 5000;
const app = express();
const cors = require('cors')
app.use(bodyParser.json({limit: '30mb'}))
app.use(bodyParser.urlencoded({extended: true, limit: '30mb'}))
connect()

const corsOpts = {
    origin: '*',
    methods: [
        'GET', 'POST', 'PUT', 'DELETE'
    ],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOpts));

app.get('/',(req,res)=>{
    res.send('Here we go');
})

app.use('/persons',personRoute)
app.use('/trees',treeRoute)


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

