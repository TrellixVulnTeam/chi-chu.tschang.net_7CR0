var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var logger = require('morgan');
var ejsLayouts = require('express-ejs-layouts')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
const goodreads = require('goodreads-api-node');
const request = require('request');
const parseXML = require('xml2js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(__dirname +'/static', {dotfiles: 'allow'}));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//pull books from Goodreads with goodreads url
let apikey = 'm9aCHYOPGgBepD8nkp7Q'
let url = 'https://www.goodreads.com/review/list/1589736.xml'+'?key='+apikey
var parser = new parseXML.Parser();

request(url, function(err, response, body){
  if (err){
    console.log('error:', error);
        } else {
    parser.parseString(body, function(err, result){
      var title = result.GoodreadsResponse.books[0].book[0].title;
      var author = result.GoodreadsResponse.books[0].book[0].authors[0].author[0].name;
      console.log(title);
      console.log(author);
    })
  }
});

//pull books from Goodreads with goodreads-api-node

  var userID = '1589736';
  let goodreadCredentials = {
    key: 'm9aCHYOPGgBepD8nkp7Q',
    secret: 'Fz2Xvo5VyeUELXtWGNRZxQwziH52lIKhOGX61vld4'
  }

  const gr = goodreads(goodreadCredentials);

  //gr.getUserInfo(userID).then(console.log);
  //gr.getReview(userID).then(console.log);

  gr.getUsersShelves(userID).then(console.log);


//goodreadsClient.getBooksByAuthor('175417').then(console.log);

        // res.json({
        //   book: extractedData.GoodreadsResponse.books[0].book.title.map(
        //     work => ({
        //       title: work.book[0].title,
        //     })
        //   )
        // })


      // console.log('body:', body);




module.exports = app;
