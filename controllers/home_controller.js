module.exports.home = function(req, res){

    //req.cookies gets the value of the cookie
    console.log(req.cookies); 

    // to change the cookie received from the browser
    res.cookie('user_id', 25);

    //render ejs
    return res.render('home', {
        title:"Home"
    });

}