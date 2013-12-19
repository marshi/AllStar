define([], function () {
	var audioList = {
		//ユーザーログイン時に再生
		login: new Audio("audio/login.mp3"),

		//エントリー期間時
		entryBGM: new Audio("audio/60sec_feedout.mp3"),

		//参加締め切り時
		period: new Audio("audio/period.mp3"),

		//問題スタート時
		start: new Audio("audio/start.mp3"),

		//回答数表示の時
		check: new Audio("audio/check.mp3"),

		//正解発表時
		answer: new Audio("audio/answer2.mp3"),

		//問題時BGM
		thinking: new Audio("audio/thinking_time.mp3"),

		//最後の問題時BGM
		thinkingFinal: new Audio("audio/thinking_final.mp3"),

		//回答結果！
		result: new Audio("audio/result_normal.mp3"),

		//最終回答結果！
		champion: new Audio("audio/result_champion.mp3"),
	};
	return audioList;
});
