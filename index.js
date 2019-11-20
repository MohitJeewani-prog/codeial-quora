const express = require('express');

const env = require('./config/environment');
const logger = require('morgan');

//require cookie parser
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helpers')(app);

const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//used for session cookie
const session = require('express-session');

const passport = require('passport');
const passportlocal = require('./config/passport-local-strategy');
const passportjwt = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo')(session);

const sassMiddleware = require('node-sass-middleware');

const flash = require('connect-flash');

const customMware = require('./config/middleware');

//setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

const path = require('path');

if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css',
    
    }));
}


//reading post request
app.use(express.urlencoded({extended: false}));

//setting up cookie parser
app.use(cookieParser());

// //make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

//telling app to use express layouts
app.use(expressLayouts);

//to extract style and scripts from sub pages(assets) into the layout 
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static(env.asset_path));

//setting up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    //TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000 * 60 * 1000)
    },
    store: new MongoStore(
        {
        mongooseConnection: db,
        autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());

//use custom middleware
app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        //console.log('Error', err);
        console.log(`Error in running the server : ${err}`);    
    }

    console.log(`Server is running on port: ${port}`);
});