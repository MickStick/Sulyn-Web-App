/**
 * Declartion of variables
 */
///////////////////////////////////////////////////////////////
const express = require('express');
//const vhost = require('vhost');
const path = require('path');
const fs = require('fs');
const bp = require('body-parser');
var urlcp = bp.urlencoded({ extended: false });
const port = 8080;
//////////////////////////////////////////////////////////////

// const master = express(); 
// const domain = "riurs.dev"

/**
 * Initialization of (Express) Server Class
 */
const app = express();
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(vhost)

///////////////////////////////////////////////////////////////
/**
 * Set Server middleware
 */
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
///////////////////////////////////////////////////////////////


/**
 * POST request which receives reservation information from client and stores the data to file "reserve.json";
 * @return JSON Object with success status with message or data
 */
app.post('/reserve', urlcp, function(req, res, next) {
    var reservations = null;
    var reserveSet = {};
    fs.readFile('public/js/reserve.json', function(err, data) {
        if (err) {
            console.log(err);
            res.json({ success: false });
        }

        reservations = JSON.parse(data);
        console.log("\n\n//////////////////\nDate set: "+req.body.date+"\n//////////////////\n\n");
        reserveSet = {
            name: req.body.name,
            gNum: req.body.gNum,
            rNum: req.body.rNum,
            time: req.body.time,
            date: new Date(req.body.date),
            table: req.body.seat,
            email: req.body.email
        }
        if (reservations[0] != undefined) {
            reserveSet.reservationNum = reservations[reservations.length - 1].reservationNum + 1;
        } else {
            reserveSet.reservationNum = 1000;
        }
        reservations.push(reserveSet);
        var DATA = JSON.stringify(reservations);
        Data = DATA.split(",");
        // console.log(Data);
        fs.writeFile('public/js/reserve.json', Data, function(err) {
            if (err) {
                console.log(err);
                res.json({success:false, msg:"Write File Error!"});
            }
            emailReminder(req.body.email, new Date(req.body.date));
        });
        res.json({ success: "supmn", ticket: reserveSet.reservationNum });
    });
});


/**
 * POST request that receive Guest Name and Reservation Ticket from client then checks to see if that reservation was set
 * @return JSON Object success status with message only if fail and with message and data if true
 */
app.post('/getreserve', urlcp, function(req, res, next) {
    console.log("getreserve");
    fs.readFile('public/js/reserve.json', function(err, data) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "File Error" });
        }
        console.log(req.body);
        chk = findReservation(req.body, JSON.parse(data));
        if (!chk) {
            res.json({
                success: false,
                msg: "Reservation Not Found"
            });
        } else {
            res.json({
                success: true,
                msg: "found",
                reservation: chk
            });
        }
    });
});


/**
 * POST requests to check if any tables are taken on the date specified.
 *@return JSON Object with success stats with either a message or data
 */
app.post('/tables', urlcp, function(req, res, next) {
    // console.log("getreserve");
    fs.readFile('public/js/reserve.json', function(err, data) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "File Error" });
        }
        let DATA = JSON.parse(data);

        if(DATA.length < 1){
            res.json({ success: true, msg: "No Reservations" });
        }
        
        let tables = [];
        for(var x = 0; x < DATA.length; x++){
            if(req.body.date == DATA[x].date){
                tables.push(DATA[x].date);
            }
        }
        if(tables.length < 1){
            res.json({ success: true, msg: "No Reservation on that date" });
        }else{
            res.json({ success: true, data: tables });
        }
        
    });


});


/**
 * Main GET request which manages all GET route request and sends index file
 * @return void
 */
app.get('*', function(req, res, next) {
    res.render('index', { name: "Solar-Monkey-Flare" });
    //res.sendFile(path.join(__dirname, '/index.html', {name: "Solar Flare"}));
});


/**
 * This finds a specific reservation.
 * @args array of JSON Data and single JSON data
 * @return JSON data if true or boolean false if fail
 */
function findReservation(Res, data) {
    for (x = 0; x < data.length; x++) {
        if (Res.name == data[x].name && Res.ticket == parseInt(data[x].reservationNum)) {
            return data[x];
        }
    }
    return false;
}


/**
 * This function checks reservations to see if their are any email reminders to send out.
 * This function is run onLoad of the server.
 * @return boolean or void
 */
emailOnRun = () => {
    fs.readFile('public/js/reserve.json', function(err, data) {
        if (err) {
            console.log(err);
            return false;
        }
        var res = JSON.parse(data);
        if(res.length > 0){
            let date = new Date();
            for(var x = 0; x < res.length; x ++){
                rdate = new Date(res[x].date);
                if(date.getMonth() + date.getDate() + date.getYear() == rdate.getMonth() + rdate.getDate() + rdate.getYear()){
                    // console.log("This hour: " + parseInt(date.getHours()));
                    // console.log("Res hour: " + parseInt(rdate.getHours()));
                    // console.log("This Minute: " + parseInt(date.getMinutes()));
                    // console.log("Res Minute: " + parseInt(rdate.getMinutes()));
                    if(parseInt(rdate.getHours()) ==  parseInt(date.getHours()) ){
                        if(parseInt(rdate.getMinutes()) >= parseInt(date.getMinutes())){
                            emailReminder(res[x].email, res[x].date);
                        }else{
                            console.log("No Reservations at this or after the hour");
                        }
                        
                    }else if(parseInt(rdate.getHours()) == parseInt(date.getHours()) + 1){
                        if((parseInt(date.getMinutes()) - parseInt(rdate.getMinutes())) > -1 || parseInt(rdate.getMinutes()) >= parseInt(date.getMinutes())){
                            emailReminder(res[x].email, Date());
                        }else{
                            console.log("No Reservations at this or after the hour");
                        }
                    }else if(parseInt(rdate.getHours()) > parseInt(date.getHours())){
                        if((parseInt(date.getMinutes()) - parseInt(rdate.getMinutes())) > -1 || parseInt(rdate.getMinutes()) >= parseInt(date.getMinutes())){
                            var eDate = new Date(res[x].date);
                            eDate.setHours(rdate.getHours() - 1);
                            emailReminder(res[x].email, eDate);
                        }else{
                            console.log("No Reservations at this or after the hour");
                        }
                    }else{
                        console.log("No Reservations at this or after the hour");
                    }
                    
                }else{
                    console.log("No Reservations for Today");
                }
                
            }
        }else{
            console.log("No Reservations...");
        }
    });
    
}


///////////////////////////////////////////////////////
/**
 * Declaring Nodemailer and Node-Scheduler variables
 */
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
///////////////////////////////////////////////////////


/**
 * Initialization of Nodemailer Transporter Class
 */
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mikshaw01@gmail.com',
        pass: 'Cornwall01'
    }
});


/**
 * This funtions send email to the specified address on the specified time if the server is running.
 * @return void
 */
emailReminder = (email, date) => {
    console.log("Remind:-");
    console.log("\n\n/////////////\nEmail: " + email + "\nDate: " + date + "\n/////////////\n\n");
    var mailOptions = {
        from: 'mikshaw01@gmail.com',
        to: email,
        subject: 'Testing th NodeJS Mail in a server',
        text: 'That was easy!',
        html: '<h1> Check this out!! </h1> <br> <a href="http://localhost:8888/guest">Click me</a>'
    };
    var j = schedule.scheduleJob(date, function() {
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
}


// app.use(vhost(domain, express.static(path.join(__dirname, 'public'))));
//master.use(vhost(domain,app));


//master.use(evhost.vhost(master.enabled('trust proxy')));

/**
 * Starts the server and attempts to listen to specified port
 */
app.listen(port, function() {
    console.log("Server listening to: " + port);
    console.log("Today's Date: " + Date());
    emailOnRun();
});

//evhost.register(domain, appFactory());