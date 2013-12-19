/**
 * express server setting
 **/
var express = require('express'),
	http = require('http'),
	path = require('path'),
	io = require('socket.io'),
	routes = require('./routes');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.client);
app.get('/master', routes.index);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});


/**
 * application socket io
 */
var AllStar = require('./src/allStar'),
	state = AllStar.state.init(),
	socket = io.listen(server),
	token = 'kgsihpthjsdfiwojwpea:ofjdsj',
	masterKey = '*';

// set Bug
socket.set('log level', 1);
socket.on('connection', function (client) {

	'use strict';

	/**
	 * clientId
	 */
	var clientId = client.id;

	/**
	 * get flow state
	 */
	client
	.on('get:state', function () {
		var state, data;

		state = AllStar.state.get();
		data = AllStar.getData(state);

		client.emit(state, data);
	})

	/**
	 * receive from master
	 * proceed next flow
	 */
	.on('next', function (data) {
		state = AllStar.state.next();

		var data = AllStar.getData(state),
			_state = state.split(':');

		// question count start
		if (_state[1] === 'start') {
			AllStar.timer.start();
		}

		state = (_state[2])? _state[0]+':'+_state[1] : state;

		// broadcast all connected
		socket.sockets.emit(state, data);
	})

	/**
	 * register
	 */
	.on('register', function (data) {
		if (!data) {
			return;
		}
		var user = AllStar.register(clientId, data);
		client.emit('registered', user);
		socket.sockets.emit('register:member', {sum: AllStar.getRegistered()});
	})

	/**
	 * getMasterToken with simple word check
	 */
	.on('getMasterToken', function (key) {
		// var _token = (key === masterKey) ? token : null;
		client.emit('setMasterToken', 'aa');
	})

	/**
	 * answer from client
	 */
	.on('q:answer', function (data) {
		if (AllStar.timer.state === 'stop') {
			return;
		}

		AllStar.answer({
			id: data.id,
			answer: data.answer,
			time: AllStar.timer.get()
		});

	})

	// disconected
	.on('disconnect', function () {
		// noop
	});
});
