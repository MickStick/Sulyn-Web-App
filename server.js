const express = require('express');
const path = require('path');
const fs = require('fs');
const bp = require('body-parser');
var urlcp = bp.urlencoded({ extended: false });
const port = 8888;

const app = express();

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./public'));

app.post('/reserve', urlcp , function(req,res,next){
    var reservations = null;
    var reserveSet = {};
    fs.readFile('public/js/reserve.json', function(err,data){
        if(err){
            console.log(err);
            res.json({success: false});
        }

        reservations = JSON.parse(data); 
        //console.log(reservations);
        reserveSet = {
            name: req.body.name,
            time: req.body.time,
            date: req.body.date,
            seat: req.body.seat
        }
        if(reservations[0]!= undefined){
            reserveSet.reservationNum = reservations[reservations.length - 1].reservationNum + 1;
        }else{
            reserveSet.reservationNum = 1000;
        }
        reservations.push(reserveSet);
        var DATA = JSON.stringify(reservations);
        DATA = DATA.split(",");
        console.log(DATA);
        fs.writeFile('public/js/reserve.json', DATA, function(err){
            if(err){
                console.log(err);
            }
        });
        res.json({success:"supmn",ticket:reserveSet.reservationNum});
    });
});

app.post('/getreserve', urlcp, function(req, res, next){
    console.log("getreserve");
    fs.readFile('public/js/reserve.json', function(err,data){
        if(err){
            console.log(err);
            res.json({success: false, msg: "File Error"});
        }
        console.log(req.body);
        chk = findReservation(req.body, JSON.parse(data));
        if(!chk){
            res.json({
                success: false, 
                msg: "Reservation Not Found"
            });
        }else{
            res.json({
                success: true, 
                msg: "found",
                reservation: chk
            });
        }
    });
});

app.get('*', function(req,res, next){
    res.sendFile(path.join(__dirname, '/index.html'));
});



function findReservation(Res, data){
    for(x = 0; x < data.length; x++){
        if(Res.name == data[x].name && Res.ticket == parseInt(data[x].reservationNum)){
            return data[x];
        }
    }
    return false;
}

app.listen(port, function(){
    console.log("Server listening to: " + port);
}); 