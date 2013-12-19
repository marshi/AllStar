define([
	'chikuwa',
	'lodash',
	'master/base',
	'master/entry',
	'master/showQuestion',
	'master/question',
	'master/ranking',
	'master/end',
	'master/showTotalRanking'
], function (
	$,
	_,
	base,
	entry,
	showQuestion,
	question,
	ranking,
	end,
	showTotalRanking
) {

	'use strict';

	var view = {
		entry: entry,
		showQuestion: showQuestion,
		question: question,
		ranking: ranking,
		end: end,
		showTotalRanking: showTotalRanking
	};

	return view;
});
