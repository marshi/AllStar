define('master/base', ['chikuwa', 'lodash'], function ($, _) {

	'use strict';

	$('#wrapper').css({
		width: $.viewport().screen.width,
		height: $.viewport().screen.height,
		overflow: 'hidden'
	});

	var center = {
			'display':'-webkit-box',
			'-webkit-box-align': 'center',
			'-webkit-box-pack': 'center',
		},
		tag = $.tag,
		container = $('#container'),
		modal = tag('#modal'),
		header = tag('#header'),
		main = tag('#main');



	var resetView = function() {
		container.empty();
		header.empty();
		main.empty();
		modal.empty();
	};

	return {
		reset: resetView,
		center: center,
		modal: modal,
		header: header,
		main: main,
		container: container
	};
});
