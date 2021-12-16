// Define express
const express = require('express');  //Install ALT + Return
const dotenv = require('dotenv');
const app = express();
//
dotenv.config();
// Create HTTP errors for Express, Koa, Connect, etc. with ease.
// https://www.npmjs.com/package/http-errors
const createError = require('http-errors');
// Allows you acccess directory path
const path = require('path');
// The fs module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions.
// Allows you to operate with file system
// https://nodejs.org/api/fs.html
const fs = require('fs');
// Encrypts passwords and compares them
const bCrypt = require('bcrypt');
// Allows operations with Json web tokens
const jwt = require("jsonwebtoken");
// Logger for node
const morgan = require('morgan');

// Morgan
// Writes to log file
// const accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'));
app.use(morgan('Generated: :date[iso] REFERRER :referrer Remote Address :remote-addr User Agent :user-agent HTTP Version :http-version METHOD :method  REQUEST URL :url STATUS :status RESPONSE TIME ms - :response-time[digits]'));
app.use(morgan('dev'));
// Log into mongoose
// / Log Model and Schema
// Start processor
const stream = require('stream');
const carrier = require('carrier');
const passStream = new stream.PassThrough();
app.use(morgan('Generated: :date[iso] REFERRER :referrer Remote Address :remote-addr User Agent :user-agent HTTP Version :http-version METHOD :method  REQUEST URL :url STATUS :status RESPONSE TIME ms - :response-time[digits]', {stream: passStream}));
// Function  write logs to database
onLine = (line) => {
    // console.log(line);
    // let logItem = new LogModel({});
    // logItem.log = line;

    // logItem.save().then(i => {
    //     console.log(i);
    // }).catch(err => {
    //     console.error(err);
    // })
};
const lineStream = carrier.carry(passStream);
lineStream.on('line', onLine);

// app.use(express.limit('1024M'));
// Enables cors
const cors = require("cors");
app.use(cors());

// Operates body
//app.use(express.multipart());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


// const apiRouter = require('../routes/api');
// const authRouter = require('../routes/auth');
//
// app.use('/', apiRouter);
// app.use('/auth', authRouter);
//
// app.use('/static', express.static(__dirname + '../../uploads'));
// app.use('/uploads', express.static(__dirname + '../../uploads'));

const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, onValue } = require("firebase/database");


// Set the configuration for your app
// TODO: Replace with your project's config object
const firebaseConfig = {
    apiKey: process.env.FIR_API_KEY,
    authDomain: process.env.FIR_AUTH_DOMAIN,
    databaseURL: process.env.FIR_DB_URL,
    projectId: process.env.FIR_PROJECT_ID,
    storageBucket: process.env.FIR_STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID

};
const firebase = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(firebase);



app.get('/', (req, res) => {
    console.log(database);
    res.status(200).send({
       success: true,
       message: "Everything works fine :)",
   });
});

app.get('/items', (req, res) => {
    const db = getDatabase();
    const starCountRef = ref(db, 'items/');
    onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        res.status(200).send(data);
    });
});

app.get('/items/:item_id', (req, res) => {
    const db = getDatabase();
    const starCountRef = ref(db, 'items/' + req.params.item_id);
    onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        res.status(200).send(data);
    });
});

app.post('/items', (req, res) => {
    const postData = req.body;
    const db = getDatabase();
    const ephemeralId = Date.now().toString();
    set(ref(db, 'items/' + ephemeralId), postData).then(r => {
        console.log(r);
        res.status(201).send({
            success: true,
            insertedId: ephemeralId,
        });
    }).catch(err => {
        res.status(420).send(err);
    });

});

app.put('/items/:item_id', (req, res) => {

});

app.patch('/items/:item_id', (req, res) => {

});

app.delete('/items/:item_id', (req, res) => {

});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(createError(404));
});
// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    // res.render('error');
    // console.log(err.status);
    res.json({
        error: {
            message: err.message
        }
    });
    next();
});
//
module.exports = app;

