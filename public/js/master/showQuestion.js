define(['chikuwa', 'lodash', 'master/base'], function ($, _, base) {

	'use strict';

	function showQuestion(state, data) {
		base.reset();

		var quizId = data.id === 7 ? '?' : data.id,
			name = quizId ? '第' + quizId + '問': '練習問題',
			content = $.tag('.quiz-show.box')
				.tag('h2.text-center').text(name).gat()
				.tag('h3.question').css(base.center).text(data.question).gat();

		content.css({
			position: 'relative',
			top: '50%',
			marginTop: -content.height()
		});

		base.modal.append(content);
		base.container.append(base.modal);
	}

	return showQuestion;
});
