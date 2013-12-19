define(['chikuwa', 'lodash', 'master/base'], function ($, _, base) {


	var showTotalRanking = function(data) {
		data = data || {};
		base.reset();
		var content = $.tag('#ending.box')
			.tag('h2.text-center').text('最終結果発表！').gat();
		base.modal.append(content);
		base.container.append(base.modal);
	};

	return showTotalRanking;
});
