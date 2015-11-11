// app.js
var app = require('koa')();
var route = require('koa-route');
var serve = require('koa-static');
var views = require('koa-views');

// ectをテンプレートエンジンとして指定
app.use(views(__dirname + '/views', {
  map: {
    html: 'ect'
  }
}));

// GET /version
app.use(route.get('/version', function *version(){
  yield this.render('version.ect', {
    title: 'ROOM TEMPERATURE SURVEY APPLICATION',
    version: '1.0.0'
  });
}));

// GET /room
app.use(route.get('/room', function *rooms(){
  // TODO: ルームのリスト画面を返す
  this.body = 'room list.';
}));

// GET /room/:roomId
app.use(route.get('/room/:roomId', function *room(roomId){
  // TODO: 該当ルームの詳細画面を返す
  this.body = 'room details.';
}));

// static files
app.use(serve(__dirname + '/public'));

app.listen(3000);
