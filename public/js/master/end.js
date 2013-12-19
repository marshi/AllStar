define(['chikuwa', 'lodash', 'master/base'], function ($, _, base) {


	/**
	 * end all question
	 */
	var end = function(data) {
		data = data || {};
		base.reset();
		var content = $.tag('#ending.box')
			.tag('h2.text-center').text('問題終了').gat();

		base.modal.append(content);
		base.container.append(base.modal);
	};

	return end;
});
