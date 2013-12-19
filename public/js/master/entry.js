define(['chikuwa', 'lodash', 'master/base'], function ($, _, base) {

	'use strict';

	var container = $('#container');

	function entry(state, data) {
		var view = $.tag('#entry').css(base.center),
			logo, member;
		if (state === 'start') {
			// entry start
			logo = $.tag('img').attr('src', 'img/logo.png');
			member = $.tag('#member');
			view.append(logo);
			view.append(member);
		} else {
			// entry end
			base.reset();
		}

		container.append(view);
	}

	return entry;
});
