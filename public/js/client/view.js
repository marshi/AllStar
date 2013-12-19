define(['chikuwa', 'tofu'], function ($, tofu) {
	var w = window,
		tag = $.tag,
		container = $('#main'),
		message = tag('#message').tag('.in').gat(),
		emitter = tofu.init(tofu.EventEmitter);

	$.hideAddressBar();

	var top = function() {
		resetView();
		var title = tag('#logo');
		var textbox = tag('input', {type: 'text', id: 'entry-name'});
		var content = tag('div#box')
						.tag('p').text('名前を入力してください').gat()
						.tag('p')
							.append(textbox).gat()
							.tag('#btn-fb').text('クイズに参加する')
							.tap(function() {
								var name = textbox.value();
								if (name !== '') {
									emitter.emit('submit', name);
									textbox.value('');
								}
							})
						.gat();
		title.on('webkitAnimationEnd', function(e){
			$('#box').cls('show');
		});
		container.append(title);
		container.append(content);
		return emitter;
	}

	var resistered = function(data) {
		resetView();
		var content = message.text('エントリーが完了しました。');
		container.append(content);
	};

	var entry = function(state, data) {
		data = data || {};
		if (state === 'start') {
			var content = message.text('只今エントリー受付中です。');
		} else {
			var content = message.text('みんなのエントリーが\n完了しました。')
		}
	};

	var quiz = function (state, data) {
		console.log(data);
		data = data || {};
		resetView()
		var message = tag('div#message')
			.tag('div').cls('in').gat();

		switch (state) {
			case 'show':
				var content = message.text(data.id ? '第' + data.id + '問' : '練習問題');
			break;
			case 'exit':
				var content = message.text('終了!');
			break;
			case 'start':
				var text = data.id ? '第'　+ data.id + '問' : '練習問題';
				var btnHeight = Math.abs(w.orientation) === 90 ? (w.innerHeight - 100) / 2 : (w.innerHeight - 100) / 4;
				var content = tag('div#quiz-show')
								.tag('p').cls('quiz').text(text).gat()
								.tag('div#btns')
									.tag('div#btn-top')
										.tag('div.btn').cls('btn-1').text(1).data({id: 1})
											.tap(select)
											.css({
												height: btnHeight,
												lineHeight: btnHeight
											})
											.on('resize', resize)
										.gat()
										.tag('div.btn').cls('btn-2').text(2).data({id: 2})
											.tap(select)
											.css({
												height: btnHeight,
												lineHeight: btnHeight
											})
											.on('resize', resize)
										.gat()
									.gat()
									.tag('div#btn-top')
										.tag('div.btn').cls('btn-3').text(3).data({id: 3})
											.tap(select)
											.css({
												height: btnHeight,
												lineHeight: btnHeight
											})
											.on('resize', resize)
										.gat()
										.tag('div.btn').cls('btn-4').text(4).data({id: 4})
											.tap(select)
											.css({
												height: btnHeight,
												lineHeight: btnHeight
											})
											.on('resize', resize)
										.gat()
									.gat()
								.gat();

				var selected = false;
				function select(e) {
					if (selected) return;

					var target = $(this);
					var answer = target.data('id');

					target.cls('selected');
					selected = true;
					emitter.emit('answer', answer);
				}

				function resize(e) {
					$(this).css({
						height: btnHeight,
						lineHeight: btnHeight
					});
				}

			break;
			case 'timeup':
				var content = message.text('タイムアップ！');
			break;
			case 'check':
				var content = message.text('アンサーチェック！');
			break;
			case 'answer':
				var content = message.text('正解発表');
			break;
			case 'ranking':
				var content = message.text('ランキング表示中...');
			break;
			default:
			;
		}
		container.append(content);
		return emitter;
	};

	var all = function (state, data) {
		if (state === ranking) {

		} else {

		}
	};


	var resetView = function() { return container.empty();}

	var view = {
		top: top,
		resistered: resistered,
		entry: entry,
		quiz: quiz,
		all: all,
		resetView: resetView
	};

	return view;
});
