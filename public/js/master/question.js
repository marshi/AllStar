define(['chikuwa', 'lodash', 'master/base'], function ($, _, base) {

	'use strict';

	var container = base.container,
		header = base.header,
		main = base.main;

	/**
	 * start quiz
	 */
	function Question(state, data, call) {
		data = data || {};
		var type = data.type || null;

		// quiz start
		if (state === 'start') {
			base.reset();
			var quizId = data.id === 7 ? '?' : data.id ,
				name = quizId ? '第' + quizId + '問' : '練習問題',
				list, question, title, content;

			if (type === 'text') {

				list = data.answerList;
				question = data.question;

				title = $.tag('h2.title').text(name + ': ' + question);
				header.append(title);
				content = $.tag('#quiz')
					.tag('.answer-list')
						.tag('.answer-line').attr('id','a'+list[0].id)
							.text(list[0].id+'. '+list[0].content).gat()
						.tag('.answer-line').attr('id','a'+list[1].id)
							.text(list[1].id+'. '+list[1].content).gat()
						.tag('.answer-line').attr('id','a'+list[2].id)
							.text(list[2].id+'. '+list[2].content).gat()
						.tag('.answer-line').attr('id','a'+list[3].id)
							.text(list[3].id+'. '+list[3].content).gat()
					.gat();
				main.append(content);

			} else if (type === 'image') {

				list = data.answerList;
				question = data.question;
				title = $.tag('h2.title').text(name + ': ' + question);
				header.append(title);

				content = $.tag('#quiz')
					.tag('.top-container')
						.tag('.answer-box').attr({id: 'a' + list[0].id})
							.tag('.number').text('1').gat()
							.tag('.in')
								.tag('img').attr({src: list[0].content}).gat()
							.gat()
						.gat()
						.tag('.answer-box').attr({id: 'a' + list[1].id})
							.tag('.number').text('2').gat()
							.tag('.in')
								.tag('img').attr({src: list[1].content}).gat()
							.gat()
						.gat()
					.gat()
					.tag('.bottom-container')
						.tag('.answer-box').attr({id: 'a' + list[2].id})
							.tag('.number').text('3').gat()
							.tag('.in')
								.tag('img').attr({src: list[2].content}).gat()
							.gat()
						.gat()
						.tag('.answer-box').attr({id: 'a' + list[3].id})
							.tag('.number').text('4').gat()
							.tag('.in')
								.tag('img').attr({src: list[3].content}).gat()
						.gat()
					.gat()
				.gat();

				main.append(content);
			}

			/**
			 * start timer
			 */
			var time = 15,
				timer = $.tag('#timer').text(time),
				timerId = setInterval(function() {
					if (time <= 0) {
						clearInterval(timerId);
						call();
						return;
					}
					time--;
					timer.text(String(time));
				}, 1000);

			header.append(timer);
			container.append(header);
			container.append(main);

		// time up
		} else if (state === 'timeup') {
			$('#timer').cls('timeup');
		// answer check
		} else if (state === 'check') {

			$('#a1').append($.tag('.answer-count').text(String(data[1])));
			$('#a2').append($.tag('.answer-count').text(String(data[2])));
			$('#a3').append($.tag('.answer-count').text(String(data[3])));
			$('#a4').append($.tag('.answer-count').text(String(data[4])));

		// show answer
		} else if (state === 'answer') {
			var answer = data.answer || 1;
			$('#a'+answer).cls('answer');
		}
	}

	return Question;
});
