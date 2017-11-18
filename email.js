const nodemailer = require('nodemailer'),

credentials = require('./email_creds'),
transporter = nodemailer.createTransport({
    service: credentials.provider, //email service
    auth: {
        user: credentials.user, //email address
        pass: credentials.pass //email password
    }
}),
EmailTemplate = require('email-templates').EmailTemplate,
path = require('path'),
Promise = require('bluebird'),
schedule = require('node-schedule');

/**
 * Returns a function that sends the reminder email
 */
module.exports = function(name, email, rest, date){
    
    
        console.log("Remind:-");
        console.log("\n\n/////////////\nEmail: " + email + "\nDate: " + date);
        date = new Date(date);
        let edate = new Date(date);
        let hour = parseInt(date.getHours()) - 12;
        edate.setHours(parseInt(edate.getHours()) - 1 + "");
        console.log("Reminder Date: " + edate + "\n/////////////\n\n");
    
        let users =  [{
            name: name,
            time:  hour + ':' + date.getMinutes(),
            restaurant: rest,
            link: 'http://localhost:8080/guests-cancel'
        }];
    
        let locals = {
            email: email,
            name: name,
            time:  hour + ':' + date.getMinutes(),
            restaurant: rest,
            link: 'http://localhost:8080/guests-cancel'
        }
    
        var j = schedule.scheduleJob(edate, function() {
            let template = new EmailTemplate(path.join(__dirname, 'templates', 'Email_Reminder'));
            template.render(locals, function (err, results) {
                if (err) {
                    return console.error(err)
                }
            
                transporter.sendMail({
                    from: '"RIU Restaurants Jamaica"<'+credentials.user+'>',
                    to: locals.email,
                    subject: 'Dinner Reservation Reminder',
                    html: results.html,
                    text: results.text
                }, function (err, responseStatus) {
                    if (err) {
                        return console.error(err)
                    }
                    console.log("Email Sent..");
                })
            });
        });
    

    // loadTemplate('Password_Reset', users).then((result) => {
    //   console.log(JSON.stringify(result, null, 1));
    // });
}