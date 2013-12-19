require({
	baseUrl: '',
	paths: {
		lodash: 'js/lib/lodash',
		chikuwa: 'js/lib/chikuwa',
		sounds: 'js/master/sounds',
		view: 'js/master/view',
		jquery: 'js/lib/jq',

		master: 'js/master'
	},
});


define(['lodash', 'chikuwa', 'sounds', 'view'], function (_, $, sounds, view) {

	'use strict';

	var socket = io.connect(location.origin),
		input = null,//window.prompt('required password'),
		token = null;


	// next Event triger
	document.onkeydown = function (e) {
		if (e.keyCode === 13) {
			socket.emit('next', {token: token});
		}
	};


	/**
	 * set socket event
	 * mainly sound and view handling
	 */
	socket

	.on('setMasterToken', function (_token) {
		if (!_token) {
			location.href = location.host;
			return;
		}
		token = _token;
		socket.emit('get:state');
	})

	// added new user
	.on('register:member', function (data) {
		data = data || {};
		sounds.login.load();
		sounds.login.play();
	})

	/**
	 * entry start
	 */
	.on('entry:start', function (data) {
		console.log('entry:start', data);
		sounds.entryBGM.loop = true;
		sounds.entryBGM.play();
		view.entry('start');
	})

	/**
	 * entry end
	 */
	.on('entry:exit', function (data) {
		console.log('entry:exit', data);
		sounds.entryBGM.pause();
		sounds.period.play();
		view.entry('exit', data);
	})

	/**
	 * show question
	 */
	.on('q:show', function (data) {
		console.log('q:show', data);
		sounds.start.load();
		sounds.start.play();
		view.showQuestion('show', data);
	})

	/**
	 * start question
	 */
	.on('q:start', function (data) {
		console.log('q:start',data);
		sounds.thinking.load();
		sounds.thinking.play();
		console.log(socket);
		view.question('start', data, function () {
			socket.emit('next', {token: token});
		});
	})

	/**
	 * timeup question
	 */
	.on('q:timeup', function () {
		console.log('q:timeup');
		view.question('timeup');
	})

	/**
	 * answer check
	 */
	.on('q:check', function (data) {
		console.log('q:check',data);
		sounds.check.load();
		sounds.check.play();
		view.question('check', data);
	})

	/**
	 * show answer
	 */
	.on('q:answer', function (data) {
		console.log('q:answer',data);
		sounds.answer.load();
		sounds.answer.play();
		view.question('answer', data);
	})

	/**
	 * show ranking
	 */
	.on('q:ranking', function (data) {
		console.log('q:ranking',data);
		sounds.result.load();
		sounds.result.play();
		view.ranking('q', data);
	})

	/**
	 * all flow is the end
	 */
	.on('all:end', function() {
		view.showTotalRanking();
	})

	/**
	 * show total ranking
	 */
	.on('all:ranking', function (data) {
		console.log('all:ranking',data);
		sounds.result.load();
		sounds.result.play();
		view.ranking('all' ,data);
	})

	/**
	 * ending
	 */
	.on('all:ending', function (data) {
		console.log('all:ending',data);
		view.end(data);
	});




	/**
	 * get
	 */
	socket.emit('getMasterToken', input);

});
