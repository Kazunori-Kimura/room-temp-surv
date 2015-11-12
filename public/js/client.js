// client.js
var User = function User(){
  var self = this;

  self.username = ko.observable('');
  self.isLogin = ko.observable(false);

  self.login = function(){
    console.log('login: %s', self.username());
    // TODO: 接続処理
    self.isLogin(true);
  };

  self.logout = function(){
    console.log('logout: %s', self.username());
    // TODO: 切断処理
    self.isLogin(false);
  };
};

var Message = function Message(prm){
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
    console.log('send: %s > %s', self.username, self.message());
    // TODO: メッセージ送信
    self.message('');
  };
};

var AppViewModel = function AppViewModel(){
  var self = this;

  self.user = new User();
  self.message = new Message();
  self.messageList = ko.observableArray([]);

  self.send = function(){
    self.message.date = new Date();
    self.message.username = self.user.username();
    self.message.send();
  }
};


$(function(){
  ko.applyBindings(new AppViewModel());
});
