$(document).ready(function() {

    /* ///////////// MATERIALIZE ///////////// */

    $('.carousel.carousel-slider').carousel({fullWidth: true});
    $('.carousel').carousel();

    $(".button-collapse").sideNav(); //Initiaizze button for mobile menu show/hide
    Materialize.updateTextFields();

    $('.side-nav .route-item').click(function(){
        $(".button-collapse").click();
    });

    //// date picker
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });
    $('input').addClass("black-text");
    //// date picker

    //// time picker
    //Using: https://github.com/chingyawhao/materialize-clockpicker/

    //Time Picker:
    $('.timepicker').pickatime({
        default: 'now',
        twelvehour: false, // change to 12 hour AM/PM clock from 24 hour
        donetext: 'OK',
        autoclose: false,
        vibrate: true // vibrate the device when dragging clock hand
    });
    //// time picker

    //// Modal
    $('.modal').modal();
    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%' //, // Ending top style attribute
            // ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
            //   alert("Ready");
            //   console.log(modal, trigger);
            // },
            // complete: function() { alert('Closed'); } // Callback for Modal close
    });
    $('#modal1').modal('open');
    $('#modal1').modal('close');
    $('#modal2').modal('open');
    $('#modal2').modal('close');
    $('.seat').on('click', function(e) {
        e.preventDefault();
    });
    $('.seat').blur(function() {
        $('.guest-form input[name="seat"]').val($(this).text());
        $('.guest-form #table').text($(this).text());
    });

    $('#seatBtn').click(function() {
        console.log("Your table is: " + $('.guest-form input[name="seat"]').val());
    });

    $('.seatUp').blur(function() {
        $('.guest-form input[name="seatUp"]').val($(this).text());
        $('.guest-form #tableUp').text($(this).text());
    });

    $('#seatUpBtn').click(function() {
        console.log("Your table is: " + $('.guest-form input[name="seatUp"]').val());
    });
    //// Modal

    /* ///////////// MATERIALIZE ///////////// */

    console.log(window.location.pathname);
    const users = [{
            name: "Mikhail Shaw",
            password: "pass4040"
        }, ////////////////////////////
        { //
            name: "Wembley Williams", // Hardcoded hostess login
            password: "TheLeo" // information
        }, //
        { /////////////////////////////
            name: "David Rhoden",
            password: "pavt3c"
        }
    ];

    const routes = ["/","/guests","/login","/hostess"]

    function isRoute(path){
        for(var x = 0; x < routes.length; x++){
            if(path == routes[x]){
                return true;
            }
        }

        return false;
    }


    checkStat = () => {
        if (localStorage.getItem("status") != undefined) {
            $('.host-route').css({ "display": "initial" });
            $('.log-route').css({ "display": "none" }); ///////////////////////////////////////
            return true; //  
        } else { // This displays and hides links 
            $('.host-route').css({ "display": "none" }); // that should be showed to a loogged
            $('.log-route').css({ "display": "initial" }); // in hostess or a guest
            return false; //
        } ////////////////////////////////////////
    }

    const views = $('.view'); // Retreives all views and stores them in an array
    setHidden = () => {
        var x = 0; ////////////////////////////////////
        for (x = 0; x < views.length; x++) { // Hides all views for navigation
            views.eq(x).attr("hidden", "true"); ///////////////////////////////////
        }
    }

    checkView = () => {
        if (window.location.pathname == "/") {
            setHidden();
            getView("/home");
        } else if (window.location.pathname == "/hostess") {
            if (localStorage.getItem("status") != undefined) {
                getView(window.location.pathname);
                $('#hostess-name').text("Welcome " + localStorage.getItem("name"));
            } else {
                window.location.pathname = "/login"; ///////////////////////////////////     
            } //
        } else if (window.location.pathname == "/login") { // On page load, check the url and
            if (!checkStat()) { // display the view that 
                getView("/login"); // corresponds with the url
            } else { //
                window.location.pathname = "/hostess"; //////////////////////////////////
                getView("/hostess");
            }
        } else if (window.location.pathname == "/logout") {
            onLogout();
        } else if(window.location.pathname == "/guest/seatup-update" || window.location.pathname == "/guests-seatupd" || window.location.pathname == "/guests/seatup-update" || window.location.pathname == "/guest-seatupd"){
            getView("/guests");
        } else if(!isRoute(window.location.pathname)){
            getView("/home");
        }else {
            getView(window.location.pathname);
        }
    }


    function getView(path) {
        view = path.replace(/\//g, "-");
        console.log("before path as id: ", view);
        console.log("path as id: ", view.replace("-", "#"));
        view = $('' + view.replace("-", "#") + '');
        view.removeAttr("hidden");

        if (isRoute(path.replace('-', '/')) || path.replace('-', '/') == "/home") {
            console.log(path + " is a route");
            $('.route-item').removeClass('activeLink');//css({ "background": "transparent" }); // Sets active link
            $('a[href="' + path.replace('-', '/') + '"]').parent('li').addClass('activeLink');
        }else if (path.match(/guest/g)){
            $('.route-item').removeClass('activeLink');
            $('a[href="/guests"]').parent('li').addClass('activeLink');
        }

        if (path != "/home") { // Ensures that url path is null when on home
            window.history.pushState(null, null, window.location.origin + path.replace('-', '/')); // Changes the url without reload
        } else {
            window.history.pushState(null, null, window.location.origin); // Changes the url without reload
        }
        console.log("Path: ", path.replace('-', '/'));
        return false;
    }

    onLogout = () => {
        localStorage.clear();
        $('.hostess #hostess-name').text(""); ////////////////////////////////////////
        setHidden(); // Logs out hostess then redirects to 
        getView("/login"); // login view
        checkStat(); ////////////////////////////////////////
    }

    function isValid(name, pword) { // Login validation
        for (x = 0; x < users.length; x++) {
            if (name == users[x].name && pword == users[x].password) {
                return true;
            }
        }
        return false;
    }

    function checkTables(){

    }

    checkStat(); // Thease are run onLoad
    checkView(); //

    $('.route').click(function(e) {
        e.preventDefault();
        $('.progress').css({"display":"block"});
        if ($(this).attr("href") == "/logout") {
            onLogout();
        } else {
            setHidden();
            getView($(this).attr("href"));
        }
        console.log("View: ",$(this).attr("href").replace("/","#"));
        if($(''+$(this).attr("href").replace("/","#")).attr("hidden") == undefined){
            $('.progress').css({"display":"none"});
        }
    });

    $('#login-btn').click(function(e) {
        e.preventDefault();
        if (isValid($('.login-form input[name="uname"]').val(), $('.login-form input[name="pword"]').val())) {
            $('.login-form #loginErr').text("");
            localStorage.setItem("status", "logged");
            localStorage.setItem("name", $('.login-form input[name="uname"]').val());
            setHidden();
            $('#hostess-name').text("Welcome " + localStorage.getItem("name"));
            $('.login-form input').val("");
            getView("/hostess");
            checkStat();
        } else {
            $('.login-form #loginErr').text("Invalid Login Credentials");
        }

    });

    const resIsFilled = () => {
        for(var x = 0; x < $('.guest-form input').length; x++){
            if($('.guest-form input').eq(x).val() == "" || $('.guest-form input').eq(x).val() == null){
                return false;
            }
        }
        return true;
    }

    $('#guest-btn').click(function(e) {
        e.preventDefault();
        if(resIsFilled()){
            var reserve = { // Stores reservation form information in a JSON object
                name: $('.guest-form input[name="name"]').val(),
                rNum: $('.guest-form input[name="rNum"]').val(),
                gNum: $('.guest-form input[name="gNum"]').val(),
                time: $('.guest-form input[name="time"]').val(),
                date: $('.guest-form input[name="date"]').val(),
                seat: $('.guest-form input[name="seat"]').val(),
                email: $('.guest-form input[name="email"]').val()
            };
            $.ajax({
                type: 'POST', ////////////////////////////////////////////
                url: '/reserve', // Send info to server to be processed
                data: reserve, ///////////////////////////////////////////
                success: function(data) {
                    setHidden();
                    $('.resConfirm-table #resNum').text(data.ticket);
                    $('.resConfirm-table #resName').text(reserve.name);
                    $('.resConfirm-table #resrNum').text(reserve.rNum);
                    $('.resConfirm-table #resgNum').text(reserve.gNum); ///////////////////////////////////////
                    $('.resConfirm-table #resRest').text(reserve.restaurant); //
                    $('.resConfirm-table #resTime').text(reserve.time); // Receives response containing data.
                    $('.resConfirm-table #resDate').text(reserve.date); // Sets confirmation fields.
                    $('.resConfirm-table #resSeat').text(reserve.seat); //
                    $('.resConfirm-table #resEmail').text(reserve.email); // Calls confirmation view.
                    getView("#resConfirm"); // Sets reservation inputs to null. 
                    $('.guest-form input').val(""); /////////////////////////////////////
                    console.log(data);
                }
            });
        }else{
            alert("You must fill in all fields");
        }
        
    });

    $('#host-btn').click(function(e) {
        e.preventDefault();
        var reserve = { // Stroes info from retreive table in a JSON object
            name: $('.hostess-form input[name="name"]').val(),
            ticket: $('.hostess-form input[name="ticket"]').val()
        };
        $.ajax({
            type: 'POST', ///////////////////////////////////////////
            url: '/getreserve', // Send info to server to be processed
            data: reserve, ///////////////////////////////////////////
            success: function(data) {
                if (data.success) {
                    console.log(data);
                    setHidden();
                    $('.reserve-table #resName').text(data.reservation.name); ///////////////////////////////////////
                    $('.reserve-table #resTime').text(data.reservation.time); //
                    $('.reserve-table #resDate').text(data.reservation.date); // Receives response containing data.
                    $('.reserve-table #resSeat').text(data.reservation.table); // Sets retreived fields.
                    getView("#reservation"); // Calls retreived  view.
                    $('.hostess-form #resErr').text(""); // Sets retireive  inputs to null.
                    $('.hostess-form input').val(""); // Sets error message to null
                } else { //        
                    $('.hostess-form #resErr').text(data.msg); /////////////////////////////////////
                }
            }
        });
    });

    $('#getSeatUp-btn').click(function(e) {
        e.preventDefault();
        var reserve = { // Stroes info from retreive table in a JSON object
            name: $('.getSeat-form input[name="name"]').val(),
            ticket: $('.getSeat-form input[name="ticket"]').val()
        };
        $.ajax({
            type: 'POST', ///////////////////////////////////////////
            url: '/getreserve', // Send info to server to be processed
            data: reserve, ///////////////////////////////////////////
            success: function(data) {
                if (data.success) {
                    console.log(data);
                    setHidden();
                    /*$('.reserve-table #resName').text(data.reservation.name); ///////////////////////////////////////
                    $('.reserve-table #resTime').text(data.reservation.time); //
                    $('.reserve-table #resDate').text(data.reservation.date); // Receives response containing data.
                    $('.reserve-table #resSeat').text(data.reservation.seat); // Sets retreived fields.*/
                    $('.seatUp-form #userGot').text("Hello, " + data.reservation.name);
                    getView("/guest-seatup-update"); // Calls retreived  view.
                    $('.getSeat-form #seatUpErr').text(""); // Sets retireive  inputs to null.
                    $('.getSeat-form input').val(""); // Sets error message to null
                } else { //        
                    $('.getSeat-form #seatUpErr').text(data.msg); /////////////////////////////////////
                }
            }
        });
    });


    $('.guest-form input[name="date"]').blur(function() {
        console.log("date blurred");
        var date = $(this).val().split('-');
        for (x = 0; x < date.length; x++) {
            console.log(date[x]);
        }

    });

    $('.guest-form input[name="time"]').blur(function() {
        console.log("time blurred");
        var time = $(this).val().split(':');
        for (x = 0; x < time.length; x++) {
            console.log(time[x]);
        }

    });

    $('.guest-form select[name="restaurants"]').blur(function() {
        console.log($(this).val());
    });

    var home = document.getElementById("home");
    var observer = new MutationObserver(function(mutations) {
        console.log('hidden changed');
      });
      observer.observe(home, { 
        attributes: true, 
        attributeFilter: ['hidden'] });

});