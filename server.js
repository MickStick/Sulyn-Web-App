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
        console.log("\n\n//////////////////\nDate set: " + req.body.date + "\n//////////////////\n\n");
        reserveSet = {
            name: req.body.name,
            gNum: req.body.gNum,
            rNum: req.body.rNum,
            rest: req.body.restaurant,
            time: req.body.time,
            date: new Date(req.body.date),
            table: req.body.seat,
            email: req.body.email
        }
        if (reservations[0] != undefined) {
            reserveSet.reservationNum = 1000 + reservations.length;
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
                res.json({ success: false, msg: "Write File Error!" });
            }
            emailReminder(req.body.name, req.body.email, new Date(req.body.date));
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
        if (DATA.length < 1) {
            res.json({ success: true, msg: "No Reservations" });
        } else {
            let tables = [];
            for (var x = 0; x < DATA.length; x++) {
                var d = new Date(DATA[x].date);
                var D = d.getMonth() + " " + d.getDate() + ", " + d.getYear() + " ... " + d.getHours() + ":" + d.getMinutes();
                var rd = new Date(req.body.date);
                var RD = rd.getMonth() + " " + rd.getDate() + ", " + rd.getYear() + " ... " + rd.getHours() + ":" + rd.getMinutes();
                console.log("d: " + D + "\nrd: " + RD);
                if(DATA[x].rest == req.body.rest){
                    if (D == RD) {
                        console.log("pushed");
                        tables.push(DATA[x].table);
                    }
                }
                
            }
            console.log("tables: " + JSON.stringify(tables));
            if (tables.length < 1) {
                res.json({ success: true, msg: "No Reservation on that date" });
            } else {
                res.json({ success: true, data: tables });
            }

        }


    });


});


/**
 * POST function that receive updated table value and updates the specfied reservation
 * @return JSON Object with success and message or data
 */
app.post('/UpTable', urlcp, function(req, res, next) {
    var reservations = null;
    var reserveSet = {};
    fs.readFile('public/js/reserve.json', function(err, data) {
        if (err) {
            console.log(err);
            res.json({ success: false });
        }

        reservations = JSON.parse(data);
        var newRes = {};
        for (var x = 0; x < reservations.length; x++) {
            if (reservations[x].reservationNum == req.body.ticket) {
                reservations[x].table = req.body.newSeat;
                newRes = reservations[x];
                break;
            }
        }
        var DATA = JSON.stringify(reservations);
        Data = DATA.split(",");
        // console.log(Data);
        fs.writeFile('public/js/reserve.json', Data, function(err) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: "Write File Error!" });
            }
        });
        res.json({ success: "supmn", reserve: newRes });
    });
});


/**
 * POST function that receives specific reservation data then overwrites specified
 * resrvation with empty strings to henceforth cancel the resrvation.
 * @return JSON Object with success and message or data
 */
app.post('/cancel', urlcp, (req, res, next) => {
    fs.readFile('public/js/reserve.json', function(err, data) {
        if (err) {
            console.log(err);
            res.json({ success: false });
        }

        reservations = JSON.parse(data)
        var cancel = false;
        for (var x = 0; x < reservations.length; x++) {
            if (reservations[x].reservationNum == req.body.ticket && reservations[x].name == req.body.name && reservations[x].rNum == req.body.room) {
                reservations[x].name = "";
                reservations[x].gNum = "";
                reservations[x].rNum = "";
                reservations[x].rest = "";
                reservations[x].time = "";
                reservations[x].date = "";
                reservations[x].table = "";
                reservations[x].email = "";
                cancel = true;
                break;
            }
        }
        if(!cancel){
            res.json({ success: false, emsg: "Reservation Not Found"});
            return true;
        }
        
        DATA = JSON.stringify(reservations);
        Data = DATA.split(",");
        console.log(Data);
        // console.log(Data);
        fs.writeFile('public/js/reserve.json', DATA, function(err) {
            if (err) {
                console.log(err);
                res.json({ success: false, msg: "Write File Error!" });
            }
        });
        res.json({ success: "supmn", msg: "Recervation Canceled"});
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
        if (Res.name == data[x].name && Res.ticket == parseInt(data[x].reservationNum) && Res.room == data[x].rNum) {
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
        if (res.length > 0) {
            let date = new Date(Date());
            for (var x = 0; x < res.length; x++) {
                rdate = new Date(res[x].date);
                if (date.getMonth() + date.getDate() + date.getYear() == rdate.getMonth() + rdate.getDate() + rdate.getYear()) {
                    // console.log("This hour: " + parseInt(date.getHours()));
                    // console.log("Res hour: " + parseInt(rdate.getHours()));
                    // console.log("This Minute: " + parseInt(date.getMinutes()));
                    // console.log("Res Minute: " + parseInt(rdate.getMinutes()));
                    if (parseInt(rdate.getHours()) == parseInt(date.getHours())) {
                        if (parseInt(date.getMinutes()) - parseInt(rdate.getMinutes()) < 1) {
                            let edate = new Date(res[x].date);
                            edate.setHours(parseInt(edate.getHours()) + 1);
                            emailReminder(res[x].name, res[x].email, edate);
                            emailReminder(res[x].name, res[x].email, res[x].date);
                        } else {
                            console.log("No Reservations at this or after the hour");
                        }

                    } else if (parseInt(rdate.getHours()) == parseInt(date.getHours()) + 1) {
                        if (parseInt(date.getMinutes()) - parseInt(rdate.getMinutes()) < 1) {
                            emailReminder(res[x].name, res[x].email, res[x].date);
                        } else {
                            console.log("No Reservations at this or after the hour");
                        }
                    } else if (parseInt(rdate.getHours()) > parseInt(date.getHours())) {
                        if ((parseInt(date.getMinutes()) - parseInt(rdate.getMinutes())) > -1 || parseInt(rdate.getMinutes()) >= parseInt(date.getMinutes())) {
                            // var eDate = new Date(res[x].date);
                            // eDate.setHours(rdate.getHours() - 1);
                            emailReminder(res[x].name, res[x].email, res[x].date);
                        } else {
                            console.log("No Reservations at this or after the hour");
                        }
                    } else {
                        console.log("No Reservations at this or after the hour");
                    }

                } else {
                    console.log("No Reservations for Today");
                }

            }
        } else {
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
 * To change provider, email address and password, 
 * go to email_creds.js 
 */
var credentials = require('./email_creds');
var transporter = nodemailer.createTransport({
    service: credentials.provider, //email service
    auth: {
        user: credentials.user, //email address
        pass: credentials.pass //email password
    }
});


/**
 * This funtions send email to the specified address on the specified time if the server is running.
 * @return void
 */
emailReminder = (name, email, date) => {

    console.log("Remind:-");
    console.log("\n\n/////////////\nEmail: " + email + "\nDate: " + date);
    date = new Date(date);
    let edate = new Date(date);
    let hour = parseInt(date.getHours()) - 12;
    edate.setHours(parseInt(edate.getHours()) - 1 + "");
    console.log("Reminder Date: " + edate + "\n/////////////\n\n");
    var mailOptions = {
        from: '"RIU Jamaica Restaurants" <' + credentials.user + '>',
        to: email,
        subject: 'Dinner Reminder',
        html: '<head>' +
            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css">' +
            '</head>' +
            '<body>' +
            '<div class="container">' +
            '<h1>RUI Jamaica Restaurants</h1>' +
            '<p> Hello ' + name + ', we just wanted to remind you of your dinner reservations at ' + hour + ':' + date.getMinutes() + 'pm today.</p>'
            //+''+ date.getHours() - 12 + ':' + date.getMinutes() + 'pm today.</p>'
            +
            '<footer class="page-footer">' +
            '<div class="container" style="background-color: rgba(255,50,50,0.8);">' +
            '<div class="row" >' +
            '<div class="col l6 s12">' +
            '<h4 class="amber-text">RIU Jamica Restaurants</h4>' +
            '<p class="amber-text">The Web Application for presentation purposes.</p>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="footer-copyright">' +
            '<div class="container amber-text">' +
            '© 2017 HTM MBCC' +
            '</div>' +
            '</div>' +
            '</footer>' +
            '</div>' +
            '</body>'
    };
    var j = schedule.scheduleJob(edate, function() {
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