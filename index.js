const express = require('express');

//require cookie parser
const cookieParser = require('cookie-parser');
const app = express();

const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//reading post request
app.use(express.urlencoded());

//setting up cookie parser
app.use(cookieParser());

//telling app to use express layouts
app.use(expressLayouts);

//to extract style and scripts from sub pages(assets) into the layout 
app.set('layout extractStyles', true);
app.set('layout extractScript', true);

//use express router
app.use('/', require('./routes'));

app.use(express.static('./assets'));

//setting up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, function(err){
    if(err){
        //console.log('Error', err);
        console.log(`Error in running the server : ${err}`);    
    }

    console.log(`Server is running on port: ${port}`);
});