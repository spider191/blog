/**
 * Created by zhizhu on 2014/12/14.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var id = req.cookies[key];
    var info = '登录：';
    if(!id) {
        res.render('admin', {
            title: 'admin',
            info: info
        });
    } else {
        var session = sessions[id];
        if(session && session.cookie.expire > (new Date().getTime())) {
            session.cookie.expire = (new Date().getTime() + EXPIRES);
            req.session = session;
            res.redirect('/back');
        } else {
            delete req.sessions[id];
            res.render('admin', {
                title: 'admin',
                info: info
            });
        }

    }
});
router.post('/', function(req, res) {
    var user={
        username:'admin',
        password:'admin'
    };
    if(req.body.mz===user.username && req.body.pw===user.password){
        var id = req.cookies[key];
        if(!id) {
            req.session = generate();
            res.setHeader('Set-Cookie', serialize(key, req.session.id));
            //res.writeHead(200);
            //res.end('第一次');

            //console.log(sessions);
        } else {
            var session = sessions[id];
            if(session && session.cookie.expire > (new Date().getTime())) {
                session.cookie.expire = (new Date().getTime() + EXPIRES);
                req.session = session;
            } else {
                req.session = generate();
                res.setHeader('Set-Cookie', serialize(key, req.session.id));
            }
        }
        res.redirect('/back');
    } else {
        res.render('admin', {
            title: 'admin',
            info: '密码不对'
        });
    }



});

router.check = function(req, res, cb) {
    var id = req.cookies[key];
    if(!id) {
        res.redirect('/admin');
    } else {
        var session = sessions[id];
        if(session && session.cookie.expire > (new Date().getTime())) {
            session.cookie.expire = (new Date().getTime() + EXPIRES);
            req.session = session;
            cb(req, res);
        } else {
            delete sessions[id];
            res.redirect('/admin');
        }

    }
};

router.logout = function(req, res, cb) {
    var id = req.cookies[key];
    if(id) {
        delete sessions[id];
    }
    res.redirect('/admin');
};
var serialize = function (name, val, opt) {
    var paris = [name + '=' + val];
    opt = opt || {};

    if(opt.maxAge) paris.push('Max-Age=' + opt.maxAge);
    if(opt.domain) paris.push('Domain=' + opt.domain);
    if(opt.path) paris.push('Path=' + opt.path);
    if(opt.expires) paris.push('Expires=' + opt.expires.toUTCString());
    if(opt.httpOnly) pairs.push('HttpOnly');
    if(opt.secure) pairs.push('Secure');

    return paris.join(';');
};

var sessions = {};
var key = 'session_id';
var EXPIRES = 20 * 60 * 1000;

var generate = function() {
    var session = {};
    session.id = (new Date()).getTime() + Math.random();
    session.cookie = {
        expire: (new Date()).getTime() + EXPIRES
    };
    sessions[session.id] = session;
    return session;
};
//var check = function(req, res) {
//    var id = req.cookies[key];
//    if(!id) {
//        req.session = generate();
//    } else {
//        var session = sessions[id];
//        if(session) {
//            if(session.cookie.expire > (new Date()).getTime()) {
//                session.cookie.expire = (new Date()).getTime() + EXPIRES;
//                req.session = session;
//            } else {
//                delete sessions[id];
//                req.session = generate();
//            }
//        } else {
//            req.session = generate();
//        }
//    }
//    handle(req, res);
//};
//var handle = function (req, res) {
//    if(!req.session.isVisit) {
//        req.session.isVisit = true;
//        res.writeHead(200);
//        res.end('first');
//    } else {
//        res.writeHead(200);
//        res.end(' ');
//    }
//};
//exports.doLogin = function(req, res){
//    var user={
//        username:'admin',
//        password:'admin'
//    };
//    if(req.body.mz===user.username && req.body.pw===user.password){
//        req.session.user=user;
//        return res.redirect('/back');
//    } else {
//        req.session.error='用户名或密码不正确';
//        return res.redirect('/admin');
//    }
//};
//exports.logout = function(req, res){
//    req.session.user=null;
//    res.redirect('/');
//};
//exports.home = function(req, res){
//    res.render('home', { title: 'Home'});
//};
//exports.authorize = function(req, res, next) {
//    if (!req.session.user_id) {
//        res.redirect('/admin');
//    } else {
//        next();
//    }
//}
module.exports = router;
