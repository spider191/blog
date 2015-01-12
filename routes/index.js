var express = require('express');
var router = express.Router();
var blo = require('../database/db').blo;
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res) {
    blo.find({},{'_id':1, 'title':1, 'small':1}).sort({'_id':-1}).exec(function(err, docs) {
        //for( var i = 0; i < docs.length; i++) {console.log(moment(docs[i].time).format('MMMM Do YYYY, h:mm:ss a'));
        //    docs[i].time = moment(docs[i].time).format('MMMM Do YYYY, h:mm:ss a');
        //}
      res.render('index', {
        title: '欢迎访问！ - ZhiYun.me',
        blist: docs
      });
    });
});

module.exports = router;
