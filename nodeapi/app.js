const express = require('express')
const mongoose = require('mongoose')
const morgan = require("morgan")
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const cors = require('cors')
const expressValidator = require('express-validator')
dotenv.config()

const app = express()

//db
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}, )
.then(() => console.log('DB connected'));
mongoose.set('useFindAndModify', false);

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);    
});

//bring in routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

//apiDocs
app.get("/", (req, res) => {
    fs.readFile('docs/apiDocs.json',(err, data) => {
        if(err){
            res.status(400).json({
                error:err
            });
        }
        const docs = JSON.parse(data)
        res.json(docs);
    })
})

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use("/", authRoutes);
app.use("/", userRoutes);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({error : "Unauthorized"});
    }
  });


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`A node js API is listening on port: ${port}`)
});

