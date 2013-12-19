require.config({
	baseUrl: '',
	paths: {
		lodash: 'js/lib/lodash',
		chikuwa: 'js/lib/chikuwa',
		tofu: 'js/lib/tofu',
		view: 'js/client/view'
	},
	urlArgs: 'bust=' + (new Date()).getTime()
});

define(['lodash', 'chikuwa', 'view'], function (_, $, view) {

	var socket = io.connect(location.origin),
		id = $.storage('_ASD_ID'),
		name = $.storage('name');

	// check registered
	if (id) {
		socket.emit('register', {id: id, name: name});
	} else {
		var top = view.top();
		top.on('submit', function(name) {
			socket.emit('register', {name: name});
		});
	}

	socket.on('registered', function (user) {
		user = user || {};
		view.resistered();

		id = user.id;
		$.storage('_ASD_ID', user.id);
	});

	socket.on('entry:start', function (data) {
	});

	socket.on('entry:exit', function (data) {
		view.entry('exit', data);
	});

	socket.on('q:show', function (data) {
		view.quiz('show', data);
	});

	socket.on('q:start', function (data) {
		var content = view.quiz('start', data);
		content.once('answer', function(num) {
			socket.emit('q:answer', {id: id, answer: num});
		});
	});

	socket.on('q:timeup', function (data) {
		view.quiz('timeup', data);
	});

	socket.on('q:check', function (data) {
		view.quiz('check', data);
	});

	socket.on('q:answer', function (data) {
		view.quiz('answer', data);
	});

	socket.on('q:ranking', function (data) {
		view.quiz('ranking', data);
	});

	socket.on('all:ranking', function (data) {
		view.all('ranking', data);
	});

	socket.on('all:ending', function (data) {
		view.all('ending', data);
	});

});
