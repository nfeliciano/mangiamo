var nodemailer = require('nodemailer');
var mailgun = require('nodemailer-mailgun-transport');
var config 	= require('../../config');

module.exports.sendEmail = function(req,res) {
    var transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
            user: config.mail['user'],
            pass: config.mail['pass']
        }
    });

    transporter.sendMail({
        from: req.body.email,
        to: 'linksuppApp@gmail.com',
        subject: 'Linksupp Feedback',
        text: req.body.message,

    }, function(err, results) {
        if (err) {
            console.log(err);
            res.json(500);
        }
        else {
            console.log('Message Sent ' + results.response);
            res.json(200);
        }
    });
}
