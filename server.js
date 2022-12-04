const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

//Set view engine 
app.set('view engine', 'pug');

//sessions stuff
const session = require('express-session')
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);

//app.use(session({ secret: 'some secret here'}))

app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));



// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useUnifiedTopology: true,
	useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

const db = mongoose.connection

app.use(function(req, res, next) {
    // console.log('request', req.url, req.body, req.method);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-token");
    if(req.method === 'OPTIONS') {
        res.end();
    }
    else {
        next();
    }
});

app.use(cookieParser());
app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: db })
}));

app.get('*', function(req, res, next) {
    next();
  });

// define a simple route
app.get('/', (req, res) => {
    //res.json({"message": "Welcome to the movies application."});
    res.render('pages/index');
});


// require('./app/routes/product.routes.js')(app);
// require('./app/routes/order.routes.js')(app);

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
