// client.js

// user model
var User = function User(chat){
  var self = this;

  self.username = ko.observable('');
  self.isLogin = ko.observable(false);

  self.login = function(){
    // 接続処理
    self.isLogin(true);
    chat.login(self.username());
  };

  self.logout = function(){
    // 切断処理
    chat.logout(self.username());
    self.isLogin(false);
    self.username('');
  };
};

// message model
var Message = function Message(prm, chat){
  var self = this;

  var opts = {
    date: '',
    username: '',
    message: ''
  };
  if (!prm) {
    prm = {};
  }
  $.extend(opts, prm);

  self.date = opts.date;
  self.username = opts.username;
  self.message = ko.observable(opts.message);

  self.send = function(){
    if (chat) {
      // メッセージ送信
      chat.send({ message: self.message() });
      self.message('');
    }
  };
};

// Chat class
var Chat = function Chat(messageList){
  var self = this;
  var socket = io.connect();

  socket.on('connect', function(){
    console.log('connect');
  });
  socket.on('disconnect', function(){
    console.log('disconnect');
  });

  self.login = function(username){
    socket.emit('login', { username: username });

    socket.on('message', function(data){
      console.log(data);
      messageList.push(new Message({
        date: data.date,
        username: data.username,
        message: data.message
      }));
    });
  };

  self.send = function(msg) {
    socket.emit('message', msg);
  };

  self.logout = function(username) {
    socket.emit('logout', { username: username });
    socket.off('message');
  };
};

// application view model
var AppViewModel = function AppViewModel(){
  var self = this;
  // 受信したメッセージ
  self.messageList = ko.observableArray([]);
  // socket.ioのラッパー
  var chat = new Chat(self.messageList);
  // models
  self.user = new User(chat);
  self.message = new Message({}, chat);

  // 送信
  self.send = function(){
    self.message.send();
  };
};


$(function(){
  ko.applyBindings(new AppViewModel());
});
