// app.js
var app = require('koa.io')();
var route = require('koa-route');
var serve = require('koa-static');
var views = require('koa-views');
var moment = require('moment');

// ectをテンプレートエンジンとして指定
app.use(views(__dirname + '/views', {
  map: {
    html: 'ect'
  }
}));

// -- routing --
// GET /chat
app.use(route.get('/chat', function *chat(){
  yield this.render('chat.ect', {
    title: 'CHAT',
    version: '1.0.0'
  });
}));

// GET /version
app.use(route.get('/version', function *version(){
  yield this.render('version.ect', {
    title: 'CHAT',
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

// -- WebSocket --

app.io.use(function* (next){
  console.log('[connect]');
  yield* next;
  console.log('[disconnect]');
  if (this.username) {
    this.broadcast.emit('message', { message: 'logout: ' + this.username});
    this.username = '';
  }
});

app.io.route('login', function*(next, args){
  console.log('[login] ' + JSON.stringify(args));
  this.username = args.username;
  var msg = { message: 'login: ' + this.username };
  this.broadcast.emit('message', msg);
  this.emit('message', msg);
});

app.io.route('logout', function*(next){
  console.log('[logout] ' + this.username);
  if (this.username) {
    this.broadcast.emit('message', { message: 'logout: ' + this.username});
    this.username = '';
  }
});

app.io.route('message', function*(next, args){
  console.log('[message] ' + JSON.stringify(args));
  var msg = {
    date: moment().format('hh:mm:ss'),
    username: this.username,
    message: args.message
  };
  this.broadcast.emit('message', msg);
  this.emit('message', msg);
});

app.listen(3000);
