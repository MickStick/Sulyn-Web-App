$(document).ready(function() {
    
    console.log(window.location);
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
        } else {
            getView(window.location.pathname);
        }
    }

    function getView(path) {
        view = $('' + path.replace("/", "#") + '');
        view.removeAttr("hidden");

        if (view == "#resConfirm" || view == "#reservation") {

        } else {
            $('.route-item').css({ "background": "transparent" }); // Sets active link
            $('a[href="' + path.replace("/", "#") + '"]').parent('li').css({ "background": "rgba(20,180,90,0.5)" });
        }

        if (path != "/home") { // Ensures that url path is null when on home
            window.history.pushState(null, null, window.location.origin + path); // Changes the url without reload
        } else {
            window.history.pushState(null, null, window.location.origin); // Changes the url without reload
        }
        console.log("Path: ", path);
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

    checkStat(); // Thease are run onLoad
    checkView(); //

    $('.route').click(function(e) {
        e.preventDefault();
        if ($(this).attr("href") == "/logout") {
            onLogout();
        } else {
            setHidden();
            getView($(this).attr("href"));
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

    $('#guest-btn').click(function(e) {
        e.preventDefault();
        var reserve = { // Stores reservation form information in a JSON object
            name: $('.guest-form input[name="name"]').val(),
            rNum: $('.guest-form input[name="rNum"]').val(),
            gNum: $('.guest-form input[name="gNum"]').val(),
            restaurant: $('.guest-form select[name="restaurants"]').val(),
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
                    $('.reserve-table #resSeat').text(data.reservation.seat); // Sets retreived fields.
                    getView("#reservation"); // Calls retreived  view.
                    $('.hostess-form #resErr').text(""); // Sets retireive  inputs to null.
                    $('.hostess-form input').val(""); // Sets error message to null
                } else { //        
                    $('.hostess-form #resErr').text(data.msg); /////////////////////////////////////
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

});