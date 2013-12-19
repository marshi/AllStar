define(['chikuwa', 'lodash', 'master/base'], function ($, _, base) {


	var container = base.container,
		modal = base.modal,
		reset = false;

	/**
	 * show ranking
	 */
	var Ranking = function (state, data) {

		var content = $.tag('#ranking'),
			offset, limit;
		data = data || {};

		var ranking = data.ranking || [];

		if (state === 'q') {

			base.reset();

			var cnt = _.size(ranking);
			var interval = 5000 / cnt;

			setTimeout(function() {
				cnt-- ;
				if (cnt < 0) {
				} else {
					var user = ranking[cnt];
					var rank = user.rank <= 5 ? 'large' : '';
					content
						.prepend(
							$.tag('.ranking-box').cls(rank)
								.tag('.ranking-rank').text(user.rank).gat()
								.tag('.ranking-user').text(user.name).gat()
								.tag('.ranking-time').text(user.time).gat()
						);
					setTimeout(arguments.callee, interval);
				}
			}, interval);

		} else if (state === 'all') {

			var border = data.border;
			if (resetFlg) {
				base.reset();
				reset = true;
			}

			switch (border) {
			case '50':
				limit = ranking.length - border + 1;
				offset = ranking.length;
				break;
			case '20':
				limit = 50 - border;
				offset = 50 - 1;
				break;
			case '5':
				limit = 20 - border;
				offset = 20;
				break;
			case '4':
				limit = 1;
				offset = 4;
				break;
			case '3':
				limit = 1;
				offset = 3;
				break;
			case '2':
				limit = 1;
				offset = 2;
				break;
			case '1':
				limit = 1;
				offset = 1;
				break;
			default:
				// noop
			}
			showRanking(offset, limit, ranking, content);
		}

		modal.append(content);
		container.append(modal);
	};

	function showRanking(offset, limit, ranking, content) {
		var interval = 5000 / limit;
		if (_.isEmpty(ranking)) {
			return;
		}

		setTimeout(function() {
			limit--;
			if (limit < 0) {
				// noop
			} else {
				var user = ranking[--offset];
				var rank = user.rank <= 5 ? 'large' : '';
				content.prepend(
					$.tag('.ranking-box').cls(rank)
						.tag('.ranking-rank').text(user.rank).gat()
						.tag('.ranking-user').text(user.name).gat()
						.tag('.ranking-time').text(user.time).gat()
					);
				ranking.pop();
				setTimeout(arguments.callee, interval);
			}
		}, interval);
	}


	return Ranking;
});
