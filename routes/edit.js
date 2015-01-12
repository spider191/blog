/**
 * Created by zhizhu on 2014/12/14.
 */
var express = require('express');
var router = express.Router();
var adm =  require('./admin').check;
var blo = require('../database/db').blo;
//var blo = require('../database/db').blo;
//var com = require('../database/db').com;
/* GET home page. */
router.get('/', function(req, res) {
    adm(req, res, function(req, res) {
        var id = req.query.id;
        var word = {};
        if(id != undefined){
            blo.findId(id, function(err, wor) {
                if(err){
                    console.log(err);
                }
                word = wor;
                res.render('edit', {
                    title: '修改文章',
                    word: word
                });
            });
        }else{
            res.render('edit', {
                title: '添加文章',
                word: word
            });
        }
    });
});

module.exports = router;
