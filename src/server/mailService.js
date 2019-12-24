var nodemailer = require('nodemailer');
const application_keys = require('../application-keys')

var transporter = nodemailer.createTransport({
    service: application_keys.getKeys.mail_client,
    auth: {
           user: application_keys.getKeys.mail_adress,
           pass: application_keys.getKeys.mail_password
       }
});

var mailOptions = {
    from: application_keys.getKeys.mail_adress, // sender address
    to: 'karl.westgardh@gmail.com', // list of receivers
    subject: '', // Subject line
    html: ``// plain text body
};

module.exports = {
    sendMail : function (subject,text){
        mailOptions.subject = subject
        mailOptions.html = `<p>${text}</p>`
        transporter.sendMail(mailOptions, function (err, info) {
            /* eslint-disable */
            if(err){
                console.log(err)
            }else{
                console.log('Email sent with subject:'+subject)
            }
        });
    }
}