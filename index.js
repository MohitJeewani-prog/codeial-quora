const express = require('express');

//require cookie parser
const cookieParser = require('cookie-parser');
const app = express();

const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//used for session cookie
const session = require('express-session');

const passport = require('passport');
const passportlocal = require('./config/passport-local-strategy');

const MongoStore = require('connect-mongo')(session);

const sassMiddleware = require('node-sass-middleware');

const flash = require('connect-flash');

const customMware = require('./config/middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css',

}));

//reading post request
app.use(express.urlencoded());

//setting up cookie parser
app.use(cookieParser());

//telling app to use express layouts
app.use(expressLayouts);

//to extract style and scripts from sub pages(assets) into the layout 
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static('./assets'));

//setting up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mogo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    //TODO change the secret before deployment in production mode
    secret:'blahsomething',
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