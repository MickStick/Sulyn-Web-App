const express = require('express');
//const vhost = require('vhost');
const path = require('path');
const fs = require('fs');
const bp = require('body-parser');
var urlcp = bp.urlencoded({ extended: false });
const port = 8080;

// const master = express(); 
// const domain = "riurs.dev"

const app = express();
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(vhost)
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.post('/reserve', urlcp, function(req, res, next) {
    var reservations = null;
    var reserveSet = {};
    fs.readFile('public/js/reserve.json', function(err, data) {
        if (err) {
            console.log(err);
            res.json({ success: false });
        }

        reservations = JSON.parse(data);
        //console.log(reservations);
        reserveSet = {
            name: req.body.name,
            gNum: req.body.gNum,
            rNum: req.body.rNum,
            restaurant: req.body.restaurant,
            time: req.body.time,
            date: req.body.date,
            seat: req.body.seat,
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
        console.log(Data);
        fs.writeFile('public/js/reserve.json', Data, function(err) {
            if (err) {
                console.log(err);
            }
        });
        res.json({ success: "supmn", ticket: reserveSet.reservationNum });
    });
});

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


app.get('*', function(req, res, next) {
    res.render('index', { name: "Solar-Monkey-Flare" });
    //res.sendFile(path.join(__dirname, '/index.html', {name: "Solar Flare"}));
});



function findReservation(Res, data) {
    for (x = 0; x < data.length; x++) {
        if (Res.name == data[x].name && Res.ticket == parseInt(data[x].reservationNum)) {
            return data[x];
        }
    }
    return false;
}

var nodemailer = require('nodemailer');
var schedule = require('node-schedule');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mikshaw01@gmail.com',
        pass: 'Cornwall01'
    }
});

var mailOptions = {
    from: 'mikshaw01@gmail.com',
    to: 'mickstick01@hotmail.com',
    subject: 'Testing th NodeJS Mail in a server',
    text: 'That was easy!',
    html: '<h1> Check this out!! </h1> <br> <a href="http://localhost:8888/guest">Click me</a>'
};


var j = schedule.scheduleJob({ hour: 12, minute: 35, dayOfWeek: 6 }, function() {
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
});

// app.use(vhost(domain, express.static(path.join(__dirname, 'public'))));
//master.use(vhost(domain,app));


//master.use(evhost.vhost(master.enabled('trust proxy')));
app.listen(port, function() {
    console.log("Server listening to: " + port);
});

//evhost.register(domain, appFactory());