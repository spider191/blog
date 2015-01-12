var express = require('express');
var router = express.Router();
var blo = require('../database/db').blo;
var moment = require('moment');


router.get('/', function(req, res) {
  blo.find({},{'_id':1, 'title':1, 'small':1, 'fenlei':1, 'time':1}).sort({'_id':-1}).exec(function(err, docs) {
    var id = req.query.id;
    var word = {};
    if(id) {
      blo.findId(id, function(err, wor) {
        if(err){
          console.log(err);
        }
        if(wor!=null) {
          res.render('blog', {
            title: '博客 - ZhiYun.me',
            word: wor,
            blist: docs
          });
        } else {
          res.redirect('/blog');
        }
      });
    } else {
        res.render('blog', {
          title: '博客 - ZhiYun.me',
          blist: docs
        });
    }
  });
});
router.post('/',function(req,res){
  var par = {};
  par.comment = req.body.comment;
  par.name = req.body.name;
  par.emall = req.body.emall;
  par.time = moment().format("YYYY-MM-d HH:mm:ss");
  blo.comment(req.body.id, par, function (num) {
    //res.redirect('/blog?id='+req.body.id);
    var re =
        '<li>' +
        '<span>'+par.name+':</span>' +
        '<span class="num">'+num+'#</span>' +
        '<span class="time">'+par.time+'</span>' +
        '<p>'+par.comment+'</p>' +
        '</li>';
    //re.name=par.name;
    //re.num=num;
    //re.time=par.time;
    //re.comment=par.comment;
    res.end(re);
  });
});
module.exports = router;
