const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path')
const env = require('./environment')

//basically these are functions of nodemailer

//createTransport saves the (1). mail protocol to be used (2). email account from which you want the mails 
// to be broadcasted.
let transporter = nodemailer.createTransport(env.smtp);


//this renders the html to be mailed in the mail body
let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
         if (err){console.log('error in rendering template', err); return}
         
         mailHTML = template;
        }
    )

    return mailHTML;
}


module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}