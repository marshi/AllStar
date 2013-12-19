var host = location.origin;
var socket = io.connect(host);

socket.emit('register', {
	name: 'aaa'
});

socket.on('registered', function (user) {
	console.log(user);
});

(function(w){

	var d = w.document;

	/**
	* client object for
	*
	*/
	w.Client = function() {
		return this.init.apply(this,arguments);
	}

	w.Client.prototype = {
		id: 0,
		name: '',
		profileUrl: '',
		state: 0,
		quizId: 0,
		init: function(obj){
			var self = this;

			self.wrapper = $('#wrapper');
			self.isLogin = obj.isLogin || false;
			self.facebookId = obj.id || null;
			self.name = obj.name || null;
			self.profileUrl = obj.profileUrl || null;
			self.resize();

			// check login
			if(self.isLogin) {
				self.start();
			} else {
				self.state = CNST.STATE.ENTRY_START
				self.wrapper.append(self.views[self.state].render());
			}

			$(w).on('orientationchange', function(){
				self.resize();
			});

			$(w).on('resize', function(){
				self.resize();
			});

			setTimeout(function(){
				scrollTo(0,1);
			},300);
		},

		start: function(){
			var self = this;

			socket.emit('join',{
				facebookId: this.facebookId,
				name: this.name,
				profileUrl: this.profileUrl,
				userType: CNST.USER_TYPE.USER
			});

			// connect
			socket.on('pushClient', function(data){
			// fordebug
			//w.addEventListener('pushClient', function(e){
				//var data = e.data;

				// if user is not login
				if(data.isLogin != null && !data.isLogin){
					self.setState(CNST.STATE.ENTRY_REFUSED);
				}

				self.wrapper.remove();

				console.log(data);
				switch(data.state) {
					case CNST.STATE.ENTRY_START:
						if(data && data.isLogin) {
							self.setState(CNST.STATE.ENTRY_COMPLETE);
						}
						break;
					case CNST.STATE.ENTRY_END:
						self.setState(CNST.STATE.ENTRY_END);
						break;

					case CNST.STATE.EXHIBITION_START:
						self.setState(CNST.STATE.EXHIBITION_START);
						break;

					case CNST.STATE.EXHIBITION_END:
						self.setState(CNST.STATE.EXHIBITION_END);
						break;

					case CNST.STATE.QUIZ_STAND:
						self.setState(CNST.STATE.QUIZ_STAND);
						break;

					case CNST.STATE.QUIZ_START:
						self.setState(CNST.STATE.QUIZ_START);
						break;

					case CNST.STATE.QUIZ_END:
						self.setState(CNST.STATE.QUIZ_END);
						break;

					default:
						self.setState(CNST.STATE.ENTRY);
				}
				data.facebookId = self.facebookId;

				self.wrapper.append(self.views[self.state].render(data));

			});
		},
		setState: function(state){
			this.state = state;
			console.log('current state is [' + state + ']');
		},
		views: {
			0: {
				render: function() {
					var content = fragment(),
						title = tag('div').id('logo'),
						btn = tag('div').id('btn-fb').text('facebookでログイン'),
						box = tag('div').id('box');

						title.on('webkitAnimationEnd', function(e){
							box.cls('show');
						});

						btn.on('touchend', function(e){
							FB.login(function(response) {
							   // handle the response
							}, {scope: 'email,user_likes'});
						});


					content.append(title,box.append(btn));

					return content;
				}
			},
			1: {
				render: function() {
					return tag('div').id('message')
							.append(tag('div').cls('in').text('みんなのエントリーが\n完了しました。'));
				}
			},
			2: {
				render: function() {
					return tag('div').id('message')
							.append(tag('div').cls('in').text('そろそろ問題が始まるよ'));
				}
			},
			3: {
				render: function() {
					return tag('div').id('message')
							.append(tag('div').cls('in').text('終了！'));
				}
			},
			4: {
				render: function(data) {
					data = data || {};

					var text = data.quiz.quizId ? '第'　+ data.quiz.quizId + '問' : '練習問題' ;
					return tag('div').id('message')
							.append(tag('div').cls('in').text(text));
				}
			},
			5: {
				render: function (data) {
					data = data || {};

					var text = data.quiz.quizId ? '第'　+ data.quiz.quizId + '問' : '練習問題';

					var content = fragment(),
						title = tag('p').cls('quiz').text(text),
						btns = tag('div').id('btns'),
						btnTop = tag('div').id('btn-top'),
						btnBottom = tag('div').id('btn-bottom');

					var btnHeight =  Math.abs(w.orientation) == 90 ? (w.innerHeight - 50)/2 : (w.innerHeight - 90)/4

					var selected = false;
					for (var i=0; i<4; i++) {
						var c = i < 2 ? btnTop : btnBottom ;
						btns.append(
							c.append(tag('div')
								.attr('data-id', i)
								.cls('btn')
								.cls('btn-'+ i)
								.text(i+1)
								.css({
									height: btnHeight + 'px',
									lineHeight: btnHeight + 'px'
								})
								.on('touchstart', function(e){
									if(selected) return;

									var target = $(e.target);
									var answer = target.attr('data-id');
									target.cls('selected');

									socket.emit('answer',{
										facebookId: data.facebookId,
										answer: answer
									})
									selected = true;
								})
								.on('resize', function(e){
									var btnHeight =  Math.abs(w.orientation) == 90 ? (w.innerHeight - 50)/2 : (w.innerHeight - 50)/4

									$(this).css({
										height: btnHeight + 'px',
										lineHeight: btnHeight + 'px'
									});
								})
							)
						);
					}
					return content.append(title, btns);
				}
			},
			6: {
				render: function(){
					return tag('div').id('message')
							.append(tag('div').cls('in').text('タイムアップ!!'));
				}
			},
			7: {
				render: function() {
					return tag('div').id('message').append(
								tag('div').cls('in').text('エントリーを完了しました。'));
				}
			},
			8: {
				render: function() {
					return tag('div').id('message').append(
								tag('div').cls('in').text('エントリーは閉め切りました。'));
				}
			}
		},
		resize: function(){
			var self = this;

			self.wrapper.css({
				width: w.innerWidth + 'px',
				height: w.innerHeight + 100 + 'px'
			});

			setTimeout(function(){
				scrollTo(0,1);
			},300);
		}

	}


	/**
	* wrapper class for DOM content
	* @psrams selector selector of DOM content
	* @params parent parent node
	* returns vanilla object
	*/

	var $ = function(selector, parent){
		parent = parent || d;
		return new vanilla(selector, parent);
	}
	var vanilla = function(){
		this.init.apply(this,arguments);
	}
	vanilla.prototype = {
		content: [],
		listener: {},
		init: function(selector, parent){
			parent = parent || d;
			if (selector instanceof String || typeof selector == 'string') {
				this.content = parent.querySelectorAll(selector);
			} else {
				this.content = [selector];
			}
			this.parent = this.content.parentNode;

			this.cl = this.content[0].className;
			this.cl = this.cl ? this.cl.split(' ') : [];

		},
		append: function(){

			for (var i=0,len=arguments.length; i<len; i++) {
				this.content[0].appendChild(arguments[i].content[0]);
			}

			return this;
		},
		remove: function() {
			this.foreach(function(){
				while(this.firstChild) {
					this.removeChild(this.firstChild);
				}
			});

			return this;
		},
		attr: function(name, value) {

			if (arguments.length === 2) {
				if (name instanceof String || typeof name == 'string') {
					this.content[0].setAttribute(name, value);
				}
				return this;

			} else if (arguments.length === 1) {
				if (name instanceof Object) {
					for (var i in name) {
						this.content[0].setAttribute(i,name[i]);
					}
				} else if (name instanceof String || typeof name == 'string') {
					return this.content[0].getAttribute(name);
				}
			}

		},
		id: function(value) {
			if (arguments.length > 0){
				this.content[0].id = value;
			}
			return this;
		},
		hasCls: function(value) {
			return this.content[0].className.indexOf(value) > 0
		},
		cls: function(value) {
			value = value || [];
			if (arguments.length > 0) {
				if (value instanceof Array) {
					value = value.split(' ');
				} else {
					value = [value];
				}
				for (var i=0,len=value.length; i<len ; i++) {
					this.cl.push(value[i]);
					this.content[0].className += ' ' + value[i];
				}
				return this;
			} else {
				return this.cl;
			}
		},
		removeCls: function(value) {

		},
		on: function(type, cb) {
			this.foreach(function(){
				this.addEventListener(type,function(e){
					cb.call(this,e);
				});
			});

			if (!this.listener[type])
				this.listener[type] = [];
			this.listener[type].push(cb);

			return this;
		},
		off: function(type, listener) {
			var self = this;

			if (arguments.length ==~ 2) {
				self.foreach(function(){
					this.removeEventListener(type, listener);
				});
			} else {
				for (var i=0,len=this.listener[type].length; i<len; i++) {
					this.foreach(function(){
						this.removeEventListener(type, self.listener[type][i]);
					});
				}
				self.listener[type].length = 0;
			}

			return this;
		},
		text: function(text) {

			if (arguments.length > 0) {
				this.content[0].textContent = text;
				return this;
			} else {
				return this.content[0].textContent;
			}

		},
		css: function(css, value) {
			if (css instanceof Object) {
				for (var i in css) {
					this.content[0].style[i] = css[i];
				}
			} else {
				this.content[0].style[css] = value;
			}
			return this;
		},
		show: function() {
			this.content[0].style.display = 'block';
			this.content[0].style.opacity = 1.0;
			return this;
		},
		foreach: function(cb) {
			for (var i=0,len=this.content.length; i<len; i++) {
				cb.call(this.content[i],i);
			}
			return this;
		}
	}

	/*
	* create tag content
	*/
	function tag(name) {
		return $(d.createElement(name));
	}

	function fragment() {
		return $(d.createDocumentFragment());
	}

	/*
	* create dom contents by html
	*/
	function toNode(html) {
		var _range = d.createRange();
		_range.selectNodeContents(d.body);

		return $(_range.createContextualFragment(html));
	}


/**
* for debug functions
*/

/**
* ログ
*/
socket.on('log', function (data) {
	console.dir(data);
});


/*
* trigger custom events
*/
w.trigger = function(element, type, data) {
	var customEvent = d.createEvent("HTMLEvents");
		customEvent.initEvent(type, true, false);
		if(data)
			customEvent.data = data;
	element.dispatchEvent(customEvent);
}

/*
* change state
*/
w.loopState = function(){
	var _state = [
		CNST.STATE.ENTRY_END,//entry 終了
		CNST.STATE.EXHIBITION_START,//quiz 全体開始
		CNST.STATE.EXHIBITION_END,//quiz 全体終了
		CNST.STATE.QUIZ_STAND,//quiz 待機
		CNST.STATE.QUIZ_START,//quiz 開始
		CNST.STATE.QUIZ_END//quiz 終了
	];
	var i=0;
	return function(){
		if(i >= _state.length) i=0;
		trigger(w, 'pushClient', {
			state: _state[i++],
			quizId: '1'
		});
	}
}


})(window);
