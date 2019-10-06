module.exports.setFlash = function(req, res, next){

    //find the flash from req and pass it to response
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }

    next();
}