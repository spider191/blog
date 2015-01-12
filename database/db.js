/**
 * Created by zhizhu on 2014/12/14.
 */
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/blog');//；连接数据库
var Schema = mongoose.Schema;   //  创建模型
var wordsScheMa = new Schema({
    title: String,
    small: String,
    fenlei: String,
    words: String,
    time: String,
    comments: [
        {
            comment: String,
            name: String,
            emall: String,
            time: String,
            show: {type: Boolean, default : true}
        },
    ]
});
wordsScheMa.statics = {
    findId: function(id, cb) {
        this.findOne({_id: id}, cb);
    },
    comment: function(id, par, cb) {
        this.findOne({_id: id},{'comments':1},function(err, docs) {
            docs.comments.push(par);
            docs.save(function (err) {
                if(err) console.log(err);
                cb(docs.comments.length);
            })
        });
    }
};
exports.blo = db.model('words', wordsScheMa);