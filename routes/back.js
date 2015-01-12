/**
 * Created by zhizhu on 2014/12/14.
 */
var express = require('express');
var router = express.Router();
var adm =  require('./admin').check;
var moment = require('moment');
//var http = require('http');
//var url = require('url');
//var querystring = require('querystring');

var blo = require('../database/db').blo;
/* GET home page. */
router.get('/', function(req, res) {
    adm(req, res, function(req, res) {
        var de = req.query.de;
        if(de) {
            blo.remove({_id:de}, function(err) {
                if(err) {
                    console.log(err);
                }
                res.redirect('/back');
            });
        }
        var id = req.query.id;
        var hide = req.query.hide;
        var show = req.query.show;
        if(hide||show) {
            blo.findOne({_id: id},{'comments':1},function(err, docs) {
                docs.comments[hide|show].show = hide?false:true;
                docs.save(function (err) {
                    if (err) console.log(err);
                    res.end('done');
                })
            });
        }
        var word = {};
        blo.find({},{'_id':1, 'title':1, 'fenlei':1, 'time':1}).sort({'_id':-1}).exec(function(err, docs) {
            if(id != undefined){
                blo.findId(id, function(err, wor) {
                    if(err){
                        console.log(err);
                    }
                    word = wor;
                    res.render('back', {
                        title: '内容管理 - ZhiYun.me',
                        blist: docs,
                        word: word
                    });
                });
            }else{
                res.render('back', {
                    title: '内容管理 - ZhiYun.me',
                    blist: docs,
                    word: word
                });
            }
        });
    });
});
router.post('/',function(req,res){
    adm(req, res, function(req, res) {
        var _id = req.body.id;
        if(_id) {
            var par = {};
            par.title = req.body.tit;
            par.small = req.body.sma;
            par.fenlei = req.body.cla;
            par.words = req.body.edi;
            blo.update({_id:_id}, {$set:{title:par.title, small:par.small, fenlei:par.fenlei, words:par.words}}, function(err) {
                if(err) console.log(err);
                res.redirect('/back');
            });
        } else {
            var par = {};
            par.title = req.body.tit;
            par.small = req.body.sma;
            par.fenlei = req.body.cla;
            par.words = req.body.edi;
            par.time = moment().format("YYYY-MM-d HH:mm:ss");
            blo.create(par, function () {
                res.redirect('/back');
            });
        }

    });
});

module.exports = router;
