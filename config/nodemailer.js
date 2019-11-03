const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path')

//basically these are functions of nodemailer

//createTransport saves the (1). mail protocol to be used (2). email account from which you want the mails 
// to be broadcasted.
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'da1032919',
        pass: 'dummyaccount1!',
    }
});


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