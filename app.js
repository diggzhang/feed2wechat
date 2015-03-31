var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

// require into config.js / wechat-enterprise-api / feed-read
var config = require('./config');
var API = require('wechat-enterprise-api');
var feed = require('feed-read');
//api(corpid, secret, product_id)
var api = new API(config.corpid, config.corpsecret, 10);

// message send configure
// send to @all(alluser)
var to = {
    "touser": "@all"
}
// send message format
var message = {
    "msgtype" : "news",
    "news" : {
        "articles" : [
            {
                "title":"Title",
                "description":"Description",
                "url":"URL",
                "picurl":"http://i-store.qiniudn.com/RSbgrLMmjaDOieNPufTw.png"
            },  
            {   
                "title":"Title",
                "description":"Description",
                "url":"URL",
                "picurl":"http://i-store.qiniudn.com/eaTwVWYUMlKFmufkynXh.png"
            }   
        ]   
    },  
    "safe" : "0" 
};

// feed list
feedList = [
//    "http://dev.guanghe.tv/feed.xml",
    "https://github.com/blog.atom"
];

// feed-read in feed-read>>>strore in DB>>>if(!push)push else findnext
feed(feedList, function (err, articles) {
    if (err) {
        throw err;
    };
    
    // catch title/link/content/.. to message 
    // article #1
    message.news.articles[0].title = articles[0].title;
    message.news.articles[0].url   = articles[0].link;
    console.log(articles[0].link);
    // article #2
    message.news.articles[1].title = articles[1].title;
    message.news.articles[1].url   = articles[1].link;
    console.log(articles[1].link);

    api.send(to, message, function (err, data, res) {
        if (err) {
            console.log(err);
        };
        console.log(" feed Already Push");
    });


});

var app = express();

// wechat api.send
//api.send(to, message, function (err, data, res) {
//    if (err) {
//        console.log(err);
//    };
//    console.log("Already Push");
//});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
