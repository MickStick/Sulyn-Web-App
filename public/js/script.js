$(document).ready(function() {

    /* ///////////// MATERIALIZE ///////////// */

    $('.carousel.carousel-slider').carousel({fullWidth: true});
    $('.carousel').carousel();

    $(".button-collapse").sideNav(); //Initiaize button for mobile menu show/hide
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

    ////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * This sets the Table value depending on which table was selected in the table picker modal
     */
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
    ///////////////////////////////////////////////////////////////////////////////////////////////
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

    /////////////////////////////////////////////////////////////////////////////
    /**
     * Array of recognized routes.
     * These routes are the only routes that are allowed onLoad or onReload
     */
    const routes = ["/","/guests","/login","/hostess"];


    /**
     * This checks if specified string is a recognized route
     * @return boolean
     */
    function isRoute(path){
        for(var x = 0; x < routes.length; x++){
            if(path == routes[x]){
                return true;
            }
        }

        return false;
    }
    /////////////////////////////////////////////////////////////////////////////


    /**
     * This displays and hides links that should be showed to a loogged in hostess or a guest
     * @return boolean
     */
    checkStat = () => {
        if (localStorage.getItem("status") != undefined) {
            $('.host-route').css({ "display": "initial" });
            $('.log-route').css({ "display": "none" });
            return true; 
        } else { 
            $('.host-route').css({ "display": "none" }); 
            $('.log-route').css({ "display": "initial" }); 
            return false; 
        } 
    }


    const views = $('.view'); // Retreives all views and stores them in an array

    /**
     * Hides all views for navigation
     * @return void
     */
    setHidden = () => {
        
        var x = 0; 
        for (x = 0; x < views.length; x++) { 
            views.eq(x).attr("hidden", "true"); 
        }
    }

    /**
     * On page load, check the url and display the view that corresponds with the url
     * @return void
     */
    checkView = () => {
        if (window.location.pathname == "/") {
            setHidden();
            getView("/home");
        } else if (window.location.pathname == "/hostess") {
            if (localStorage.getItem("status") != undefined) {
                getView(window.location.pathname);
                $('#hostess-name').text("Welcome " + localStorage.getItem("name"));
            } else {
                window.location.pathname = "/login";
            } 
        } else if (window.location.pathname == "/login") {
            if (!checkStat()) { 
                getView("/login"); 
            } else { 
                window.location.pathname = "/hostess"; 
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

    /**
     * This receives a string containing a view name then hides current view then shows received view
     * @return false
     */
    function getView(path) {
        view = path.replace(/\//g, "-");
        console.log("before path as id: ", view);
        console.log("path as id: ", view.replace("-", "#"));
        view = $('' + view.replace("-", "#") + '');
        view.removeAttr("hidden");

        if (isRoute(path.replace('-', '/')) || path.replace('-', '/') == "/home") {
            console.log(path + " is a route");
            $('.route-item').removeClass('activeLink'); // Sets active link
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
        $('.progress').css({"display":"none"});
        return false;
    }


    /**
     * Logs out hostess then redirects to 
     * @return void
     */
    onLogout = () => {
        localStorage.clear();
        $('.hostess #hostess-name').text(""); 
        setHidden(); 
        getView("/login"); // login view
        checkStat(); 
    }

    /**
     * Validate the login credentials
     * @return boolean
     */
    function isValid(name, pword) { 
        for (x = 0; x < users.length; x++) {
            if (name == users[x].name && pword == users[x].password) {
                return true;
            }
        }
        return false;
    }

    

    checkStat(); // Thease are run onLoad
    checkView(); //


    /**
     * This listens for route click then displays the specific
     * @return false
     */
    $('.route').click(function(e) {
        
        e.preventDefault();
        let route = $(this);
        $('.progress').show("fast",function(){
            if (route.attr("href") == "/logout") {
                onLogout();
            } else {
                setHidden();
                getView(route.attr("href"));
            }
            console.log("View: ",route.attr("href").replace("/","#"));
            if($(''+route.attr("href").replace("/","#")).attr("hidden") == undefined){
                $('.progress').css({"display":"none"});
            }
        });
    });


    /**
     * Listens for login button click then runs login functionality
     * @return false
     */
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


    /**
     * Checks if all fields in the reservation form are filled out
     * @return boolean
     */
    const resIsFilled = () => {
        for(var x = 0; x < $('.guest-form input').length; x++){
            if($('.guest-form input').eq(x).val() == "" || $('.guest-form input').eq(x).val() == null){
                return false;
            }
        }
        return true;
    }


    /**
     * listens for reservation form button click then runs set reservation functionality
     * @return false
     */
    $('#guest-btn').click(function(e) {
        e.preventDefault();
        if(resIsFilled()){//Checks if field are all filled out
            emVal = /^$/
            if(!emVal.test($('.guest-form input[name="email"]').val())){ //Checks if email entered if a valid email address
                $('#emResErr').text("Invalid Email, Chap!"); //Set Email Error
                return false;
            }
            let date = new Date($('.guest-form input[name="date"]').val());
            date.setHours($('.guest-form input[name="time"]').val().split(':')[0]);
            date.setMinutes($('.guest-form input[name="time"]').val().split(':')[1]);
            var reserve = { // Stores reservation form information in a JSON object
                name: $('.guest-form input[name="name"]').val(),
                rNum: $('.guest-form input[name="rNum"]').val(),
                gNum: $('.guest-form input[name="gNum"]').val(),
                time: $('.guest-form input[name="time"]').val(),
                date: date,
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
            $('#emResErr').text("");// Reset Email Error
            $('#setResErr').text("");// Reset Form Error
        }else{
            $('#setResErr').text("Please fill out all fields!"); // Set Form Error
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