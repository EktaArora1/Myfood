var sessionUtils = require('../utils/sessionUtils');
var util = require('util');
var databaseUtils = require('../utils/databaseUtils');

module.exports = {
    showHomePage: function* (next) {
        yield this.render('home',{

        });
    },

    logout: function* (next) {
        var sessionId = this.cookies.get("SESSION_ID");
        if(sessionId) {
            sessionUtils.deleteSession(sessionId);
        }
        this.cookies.set("SESSION_ID", '', {expires: new Date(1), path: '/'});

        this.redirect('/');
    },
    listrestaurants : function *(next) {
        var res = yield databaseUtils.executeQuery(util.format('select * from restaurant'));
        yield this.render('listrestaurant',{
            restaurants:res
        });
    },
    showRestaurant:function *(next) {
        var rid = this.params.rid;
        var res = yield databaseUtils.executeQuery(util.format('select r.*,u.name as uname,u.email as uemail from restaurant r left join user u on r.id=u.rest_id where r.id="%s"',rid));
        console.log(res);


        yield this.render('adminrestaurant',{
            restaurant:res[0]
        });
    },
    showItems : function *(next) {
        var rid = this.params.iid;
        var query = 'select t.*,i.itemname,i.image,r.name as rname,r.id as rid from type t,items i,restaurant r where t.itemid=i.id and i.restid=r.id and r.id="%s"';
        var res = yield databaseUtils.executeQuery(util.format(query, rid));
        console.log(res);

    //    if (this.currentUser.role == 'customer') {
          //  yield this.render('customeritems', {
       //         items: res
          //  });
     //   } else {


            yield this.render('customeritems', {
                items: res
            });
     //   }
    },
    setrider : function *(next) {
        var oid = this.request.body.oid;
        var rid = this.request.body.rid;
        var res = yield databaseUtils.executeQuery(util.format('update myorder set status=2 where id="%s"',oid));
        res = yield databaseUtils.executeQuery(util.format('insert into riderorder (orderid,riderid) values("%s","%s")',oid,rid));
        this.redirect('/myorders');
    },
    takeorder: function *(next) {
        var oid = this.request.body.oid;
        var res = yield databaseUtils.executeQuery(util.format('update myorder set status=3 where id="%s"',oid));
        this.redirect('/myorders');
    },
    deliver: function *(next) {
        var otp = this.request.body.otp;
        var res = yield databaseUtils.executeQuery(util.format('update myorder m,otp o set m.status=4 where m.otpid=o.id and o.code="%s"',otp));
        console.log(otp,res);
        this.redirect('/myorders');
    }
}
