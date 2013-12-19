var _ = require('lodash'),
	question = require('./test').data;

// registered user list
var userList = [];

// correct answer list
var correctAnswerList = [];

// correct answer number each question
var answerCounter = {
	1: 0,
	2: 0,
	3: 0,
	4: 0
};


/**
 * register
 */
exports.register = function (connectionId, data) {
	// get user from list
	var user = _.find(userList, {id: data.id});
	if (user) {
		// reconnected user
		user.connectionId = connectionId;
		console.log(user);
	} else {
		// new user
		user = new User({
			connectionId: connectionId,
			name: data.name
		});

		userList.push(user);
		console.log(user);
	}

	return user;
};


/**
 * get registered number
 */
exports.getRegistered = function () {
	return _.size(userList);
};

/**
 *
 */
exports.getData = function (state) {
	var states = state.split(':');
	switch (states[0]) {
	case 'entry':
		data = userList.length;
		break;
	case 'q':
		data = getQData(state);
		break;
	case 'all':
		data = getAllData(state);
		break;
	}

	return data;
};


function getQData(state) {
	var data,
		states = state.split(':'),
		id = parseInt(states[2], 10),
		q = _.find(question, {id: id});

	switch (states[1]) {
	case 'show':
		data = {
			id: id,
			question: q.question
		};
		break;
	case 'start':
		correctAnswerList = [];
		answerCounter = {
			1: 0,
			2: 0,
			3: 0,
			4: 0
		};
		data = {
			id: id,
			question: q.question,
			type: q.type,
			answerList: q.answerList
		};
		break;
	case 'timeup':
		break;
	case 'check':
		answerCounter.id = id;
		data = answerCounter;
		break;
	case 'answer':
		data = {
			id: id,
			answer: q.answer
		};
		break;
	case 'ranking':
		data = {
			id: id,
			ranking: rankingSort(correctAnswerList)
		};
		break;
	}

	return data;
}

/**
 * ranking sort
 * @param {Array} correct Answers List
 */
function rankingSort(list) {
	var result = _.sortBy(list, function (user) {
		return ~~user.time;
	});

	_.each(result, function (user, index) {
		user.rank = index + 1;
	});

	return result;
}

/**
 * all ranking sort
 */
function allRankingSort(cluster) {
	var result = [];

	// cluster width correct answer
	var _cluster = {};
	_.each(cluster, function (v, k) {
		_cluster[k] = _.sortBy(v, function (user) {
			return ~~user.time;
		});
	});

	var __cluster = _.sortBy(_cluster, function (v, k) {
		return ~~k;
	});

	for (var i = 0, l = __cluster.length; i < l; i++)  {
		var t =  l - i - 1 ;
		result = result.concat(__cluster[t]);
	}

	return result;
}

/**
 * get All Ranking
 */
function getAllRanking() {
	var cluster = {};
	_.each(userList, function (user) {
		var answer = user.answerList;
		var count = 0;
		var timeCount = 0;
		_.each(answer, function (ans) {
			if (ans.flg) {
				count++;
				timeCount += ans.time;
			}
		});
		if (!cluster[count]) {
			cluster[count] = [];
		}
		cluster[count].push({
			id: user.id	,
			name: user.name,
			time: timeCount,
			count: count
		});
	});
	var result = allRankingSort(cluster);
	return result;
}

/**
 * get all data
 */
function getAllData(state) {
	var data;
	var states = state.split(':');
	switch (states[1]) {
	case 'ranking':
		data = {
			ranking: getAllRanking(),
			border: states[2]
		};
		break;
	case 'end':
		break;
	case 'ending':
		break;
	}
	return data;
}

/**
 * answer
 */
exports.answer = function (data) {
	var self = this;
	var state = self.state.get();
	var states = state.split(':');
	var questionId = parseInt(states[2]);

	var q = _.find(question, {id: questionId});
	var ans = q.answer;

	var user = _.find(userList, {id: data.id});
	if (!user) return;
	var already = _.find(user.answerList, {id: questionId});
	if (already) return;

	answerCounter[data.answer]++;
	var flg = false;
	if (data.answer == ans) {
		flg = true;
		correctAnswerList.push({
			name: user.name,
			id: user.id,
			time: data.time
		});
	}
	user.answerList.push({
		id: questionId,
		flg: flg,
		time: data.time
	});

};

exports.state = {
	state: 0,
	stateList: [],
	init: function () {
		var self = this;
		self.stateList.push('entry:start');
		self.stateList.push('entry:exit');

		_.each(question, function (q) {
			var id = q.id;
			self.stateList.push('q:show:' + q.id);
			self.stateList.push('q:start:' + q.id);
			self.stateList.push('q:timeup:' + q.id);
			self.stateList.push('q:check:' + q.id);
			self.stateList.push('q:answer:' + q.id);
			self.stateList.push('q:ranking:' + q.id);
		});

		self.stateList.push('all:end');
		self.stateList.push('all:ranking:50');
		self.stateList.push('all:ranking:20');
		self.stateList.push('all:ranking:5');
		self.stateList.push('all:ranking:4');
		self.stateList.push('all:ranking:3');
		self.stateList.push('all:ranking:2');
		self.stateList.push('all:ranking:1');
		self.stateList.push('all:ending');
		return self.stateList[0];
	},

	get: function () {
		var self = this;
		return self.stateList[self.state];
	},

	next: function () {
		var self = this;
		if ((self.state + 1) < _.size(self.stateList)) {
			self.state++;
		}
		return self.stateList[self.state];
	}
};


exports.timer = {
	state: null,
	time: null,
	start: function () {
		var self = this;
		self.set(new Date());
		self.state = 'start';
	},
	stop: function () {
		self.state = 'stop';
	},
	set: function (time) {
		this.time = time;
	},
	get: function () {
		var self = this;
		var now = new Date();
		return (now - self.time) / 1000;
	}
};


/**
 * User
 * */
function User(opts) {
	this.id = _.uniqueId('ASC_');
	this.connectionId = opts.connectionId;
	this.name = opts.name || '- no name -';
	this.answerList = [];
}




