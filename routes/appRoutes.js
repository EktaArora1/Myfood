var Router= require('koa-router');
var bodyParser = require('koa-body')();

module.exports = function(app){

    var router = new Router();

    //Welcome Routes
    var welcomeCtrl = require('./../controllers/WelcomeCtrl');
    var restaurantCtrl = require('./../controllers/restaurantCtrl');
    router.get('/home', welcomeCtrl.showHomePage);
    router.post('/addnewitem',restaurantCtrl.addnewitem);
    router.post('/addrider',restaurantCtrl.addrider);
    router.post('/getriders',restaurantCtrl.getriders);

    return router.middleware();
}
