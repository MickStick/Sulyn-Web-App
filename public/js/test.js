import {test} from 'script.js';
test();
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
        '<div class="container" style="background: rgba(255,50,50,0.8);">' +
        '<div class="row" >' +
        '<div class="col l6 s12">' +
        '<h4 >RIU Jamica Restaurants</h4>' +
        '<p>The Web Application for presentation purposes.</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="footer-copyright">' +
        '<div class="container">' +
        '© 2017 HTM MBCC' +
        '</div>' +
        '</div>' +
        '</footer>' +
        '</div>' +
        '</body>'
};