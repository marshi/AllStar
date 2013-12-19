(function(w){

	var host = location.origin;
	var socket = io.connect(host);

	var d = document;
	var elTop = d.getElementById("wrap-top");
	var elWait = d.getElementById("wrap-wait");
	var elStart = d.getElementById("wrap-start");
	var elSelect = d.getElementById("wrap-select");
	var elRanking = d.getElementById("wrap-ranking");
	var elFinalRanking = d.getElementById('wrap-final-title');
	var elFinalRankingResult = d.getElementById('wrap-final-ranking');


	var resultObj ={}; //問題結果格納
	var finalResult;
	var pageMove = 0; //クリック回数
	var roopDefalult = 2; //ループ時の初期値クリック回数
	var quizNum = 0; //クイズ番号
	var flags = {
		start: true,
		select: true,
		time: false,
		answer: true,
		ranking: true,
		finalRanking:true,
		finalRankingResult:true,
	};
	var quizList = {
		0:{
			quizId: 0,
			content: "我らが小林知尋さんはどれでしょう？",
			answerList: {
				0: "<img src='/image/q0-0.jpg' width='300'>",
				1: "<img src='/image/q0-1.jpg' width='300'>",
				2: "<img src='/image/q0-2.jpg' width='300'>",
				3: "<img src='/image/q0-3.jpg' width='300'>"
			},
			answer: 2,
			isImage: 1
		},
		1:{
			quizId: 1,
			content: "正しいHTML5は？",
			answerList: {
				0: "<img src='/image/q1-0.jpg' width='300'>",
				1: "<img src='/image/q1-1.jpg' width='300'>",
				2: "<img src='/image/q1-2.jpg' width='300'>",
				3: "<img src='/image/q1-3.jpg' width='300'>",
			},
			answer: 3,
			isImage: 1
		},
		2:{
			quizId: 2,
			content: "HTML5の要素数は？",
			answerList: {
				0: "<img src='/image/q2-0.jpg' width='300'>",
				1: "<img src='/image/q2-1.jpg' width='300'>",
				2: "<img src='/image/q2-2.jpg' width='300'>",
				3: "<img src='/image/q2-3.jpg' width='300'>",
			},
			answer: 2,
			isImage: 1
		},
		3:{
			quizId: 3,
			content: "HTML4からHTML5に継承された要素は？",
			answerList: {
				0: "s要素",
				1: "font要素",
				2: "big要素",
				3: "center要素",
			},
			answer: 0
		},
		//,
		// 4:{
		// 	quizId: 4,
		// 	content: "セクショニング・コンテンツはどれ？",
		// 	answerList: {
		// 		0: "div",
		// 		1: "p",
		// 		2: "header",
		// 		3: "aside",
		// 	},
		// 	answer: 3
		// },
		// 5:{
		// 	quizId: 5,
		// 	content: "CSSはなんの略？",
		// 	answerList: {
		// 		0: "Casting<br>Symbol<br>Sheets",
		// 		1: "Charlie<br>Synchronize<br>Syndrome",
		// 		2: "Cyber<br>Saiko<br>Saite!!",
		// 		3: "Cascading<br>Style<br>Sheets",
		// 	},
		// 	answer: 3
		// },
		// 6:{
		// 	quizId: 6,
		// 	content: "このCSSはどれ?<br><br>"+
		// 			 "border-radius: 25%;<br>"+
		// 			 "border: groove white 2px;"
		// 	,
		// 	answerList: {
		// 		0: "<div id='q6-0'></div>",
		// 		1: "<div id='q6-1'></div>",
		// 		2: "<div id='q6-2'></div>",
		// 		3: "<div id='q6-3'></div>",
		// 	},
		// 	answer: 0,
		// 	isImage: 1
		// },
		// 7:{
		// 	quizId: 7,
		// 	content: "このCSSはどれ？<br><br>"+
		// 			 "transform: rotate(-45deg);"+
		// 			 "border-left-bottom-radius: 25%;"
		// 	,
		// 	answerList: {
		// 		0: "<div id='q7-0'></div>",
		// 		1: "<div id='q7-1'></div>",
		// 		2: "<div id='q7-2'></div>",
		// 		3: "<div id='q7-3'></div>",
		// 	},
		// 	answer: 1,
		// 	isImage: 1
		// },
		// 8:{
		// 	quizId: 8,
		// 	content: " [ #038243 ] このカラーコードは？",
		// 	answerList: {
		// 		0: "<div id='q8-0'></div>",
		// 		1: "<div id='q8-1'></div>",
		// 		2: "<div id='q8-2'></div>",
		// 		3: "<div id='q8-3'></div>",
		// 	},
		// 	answer: 1,
		// 	isImage: 1
		// },
		// 9:{
		// 	quizId: 9,
		// 	content: "javascriptの拡張子はどれ？",
		// 	answerList: {
		// 		0: "jsx",
		// 		1: "javac",
		// 		2: "japan",
		// 		3: "js",
		// 	},
		// 	answer: 3
		// },
		// 10:{
		// 	quizId: 10,
		// 	content: "console.logで何が表示される？<br><br>"+
		// 			 "var a = 1;<br>"+
		// 			 "var b = 3;<br>"+
		// 			 "function(a, b){<br>"+
		// 			 "&nbsp;&nbsp;var a;<br>"+
		// 			 "&nbsp;&nbsp;a = b;<br>"+
		// 			 "&nbsp;&nbsp;return a * b;<br>"+
		// 			 "}<br>"+
		// 			 "c(b, a);<br>"+
		// 			 "console.log(a+b);",
		// 	answerList: {
		// 		0: "3",
		// 		1: "4",
		// 		2: "1",
		// 		3: "9",
		// 	},
		// 	answer: 1
		// },
		// 11:{
		// 	quizId: 11,
		// 	content: "javascriptを実行した時にエラーが出るのはどれ？",
		// 	answerList: {
		// 		0: "http://charlieee.com<br>console.log('http');",
		// 		1: "var a = a;<br>console.log(a);",
		// 		2: "var a = 'abcde'.length * 10;<br>console.log(a * 'a');",
		// 		3: "var a = 'b' + 2222 + b;<br>console.log(b);",
		// 	},
		// 	answer: 3
		// },

	};


	//masteridの登録
	socket.emit("setMasterId");

	d.onkeydown = function(e) {
		//enterBtn
		if(e.keyCode === 13){
			pageMove++;
			console.log(pageMove);
			switch(pageMove){
				case 1:
					//前頁をhide
					elTop.style.display ="none";
					//自身をshow
					elWait.style.display ="block";

					audioList.entryBGM.loop = true;
					audioList.entryBGM.play();
					break;

				case 2:
					audioList.entryBGM.pause();
					audioList.period.play();

					//エントリーの締め切り
					socket.emit("entryEnd");
					break;

				case 3:
					//問題文画面
					if(flags.start){
						qStart(quizList);
						flags.start = false;
						audioList.start.load();
						audioList.start.play();
					}
					break;

				case 4:
					//解答選択画面
					if(flags.select){
						qSelect(quizList);
						flags.select = false;

						//最終問題
						if(!quizList[quizNum+1]){
							audioList.thinkingFinal.load();
							audioList.thinkingFinal.play();
						}
						//通常問題
						else{
							audioList.thinking.load();
							audioList.thinking.play();
						}
					}
					break;

				case 5:
					//問題投票数表示
					if(flags.time){
						qResult(resultObj);
						flags.time = false;
						audioList.check.load();
						audioList.check.play();
					}else{
						pageMove = 4;
					}
					break;

				case 6:
					if(flags.answer){
						qAnswer(resultObj);
						flags.answer = false;
						audioList.answer.load();
						audioList.answer.play();
					}
					break;

				case 7:
					if(flags.ranking){
						qRanking(resultObj);
						audioList.result.load();
						audioList.result.play();
					}
					break;

				case 8:
					if(flags.finalRanking){
						flags.finalRanking = false;
						elRanking.style.display = 'none';
						elFinalRanking.style.display = 'block';
					}
					break;

				case 9:
					if(flags.finalRankingResult){
						flags.finalRankingResult = false;

						elFinalRanking.style.display = 'none';
						elFinalRankingResult.style.display = 'block';

						qRanking(finalResult);
						audioList.champion.load();
						audioList.champion.play();
					}
					break;
				case 10:
					socket.emit('broadResult');
					break;

			}
		}
	};

	/**
	*ログインユーザの追加、描画
	* @param {String} name ユーザname
	* @param {String} profileUrl ユーザ画像
	*/
	function addUser(user){
		var elDiv = document.createElement("div");
		elDiv.className = "login";
		var img = new Image();
		img.src = user.profileUrl;
		img.onload = function(){
			elDiv.style.background = "url("+img.src+")";
			elWait.appendChild(elDiv);
			audioList.login.load();
			audioList.login.play();
			//連続再生用キャッシュ
			audioLogin = new Audio(audioList.login.src);
		};
	}


	/**
	* 問題文ページ
	*
	*/
	function qStart(quiz){
		var data = {
			quizId: quiz[quizNum].quizId,
			content: quiz[quizNum].content,
			answerList: quiz[quizNum].quizList,
			answer: quiz[quizNum].answer
		};
		//問題文読み上げ
		socket.emit("quizStand",data);
		//自身をshow
		elStart.style.display = "block";
		//問題番号show
		elStart.children[0].style.display = "block";
		//問題文hide
		elStart.children[1].style.display = "none";
		//前頁をhide
		elRanking.style.display ="none";
		//前頁をhide
		elWait.style.display ="none";

		//問題番号
		if(quiz[quizNum].quizId){
			elStart.children[0].innerHTML = "問"+quiz[quizNum].quizId;
		}else{
			elStart.children[0].innerHTML = '練習問題!';
		}
		//問題文

		var str = data.content;
		var length = str.length;
		var cnt = 0;
		elStart.children[1].innerHTML = "";
		elStart.children[0].addEventListener("webkitAnimationEnd", function(){
			//問題番号hide
			elStart.children[0].style.display = "none";
			//問題文show
			elStart.children[1].style.display = "block";
			setTimeout(function(){
				elStart.children[1].innerHTML += str.charAt(cnt)
				if (++cnt < length) setTimeout(arguments.callee,100);
			},100);
		}, false);

		//elStart.children[1].innerHTML = quiz[quizNum].content;
	}

	/**
	* 問題選択ページ
	*/
	function qSelect(quiz){
		var elQContent = d.getElementById("q-content");
		var elUl = d.getElementById("q-list");
		var timeCount = d.getElementById("time-count");

		//問題選択スタート
		socket.emit("quizStart");
		//自身をshow
		elSelect.style.display = "-webkit-flex";
		//前頁をhide

		elStart.style.display ="none";

		//前回正解のリストの背景,投票数リセット
		for(var i = 0; i < 2; i++){
			for(var j = 0; j < 2; j++){
				elUl.children[i].children[j].className = "gradient";
				elUl.children[i].children[j].children[2].innerHTML = "";
			}
		}

		//問題文
		elQContent.innerHTML = quiz[quizNum].content;


		for(var i = 0; i < 2; i++){
			if(quiz[quizNum].isImage)
				elUl.children[i].className = 'flexbox';
			else
				elUl.children[i].className = '';
			for(var j = 0; j < 2; j++){
				elUl.children[i].children[j].children[0].innerHTML = j+i*2 + 1;
				//問題選択肢
				elUl.children[i].children[j].children[1].innerHTML = quiz[quizNum].answerList[j+i*2];
			}
		}


		timeCount.innerHTML = 6;

		//timerカウント
		(function(){
			var clear = setTimeout(arguments.callee,1000);
			timeCount.innerHTML--;
			if(timeCount.innerHTML < 1){
				clearTimeout(clear);
				flags.time = true;
				var data = {
					state: CNST.STATE.QUIZ_END,
					userType: CNST.USER_TYPE.MASTER,
					quizId: quiz[quizNum].quizId,
					answer: quiz[quizNum].answer
				};
				socket.emit("quizEnd", data);
			}
		})();
	}

	/**
	*問題結果の格納
	*/
	function inputResult(data){
		resultObj = data;
	}

	//投票数表示
	function qResult(quiz){
		var elUl = d.getElementById("q-list");

		for(var i = 0; i < 2; i++){
			for(var j = 0; j < 2; j++){
				elUl.children[i].children[j].children[2].innerHTML = quiz.counter[i * 2 + j];
			}
		}
	}

	function qAnswer(quiz){
		//正解点灯
		// elUl.children[quiz.answer].style.background = "#ff0000";
		var target = d.getElementById( "q-list" + (quiz.answer + 1));
		target.className = "flash gradient"


		target.addEventListener("webkitAnimationEnd",function(e){
			e.target.className = "";
		}, false);
	}

	/**
	*ランキングページ
	* @param {Array} user
	* @param {Array} image
	* @param {Array} time
	*/
	function qRanking(quiz){
		console.log(quiz);
		var elUl = d.getElementById("ranking-ul");

		if(!quiz.user.length){
			//自身をshow
			elRanking.style.display = "block";
			//前頁のhide
			elSelect.style.display ="none";
			//リストのリセット?
			elUl.innerHTML = "";
			elUl.innerHTML = "<li class='ranking-list'>該当者なし！！</li>";
			quizNum++;
			if(!quizList[quizNum]){
				socket.emit("exhibitionEnd");
				return;
			}

			//ループリセット
			pageMove = roopDefalult;

			//flags reset
			for(var key in flags){
				if(key === "time"){
					flags[key] = false;
				}
				else{
					flags[key] = true;
				}
			}
			return;
		}

		//正解ユーザ数
		var count = quiz.user.length;
		//自身をshow
		elRanking.style.display = "block";
		//前頁のhide
		elSelect.style.display ="none";
		//リストのリセット?
		elUl.innerHTML = "";

		var html = '';
		for(var i = 0; i < count; i++){
			console.log("hogeeeee");

			//最終ランキング
			if(quiz.state === 2){

	 			html +=	'<li class="ranking-list">'+
							'<div class="ranking-num">'+(i+1)+'</div>'+
							'<img class="ranking-img" src="'+quiz.user[i].profileUrl+'" width="80" height="80">'+
							'<div class="ranking-name">'+quiz.user[i].name+'</div>'+
							'<div class="ranking-allAns">'+quiz.user[i].count+'</div>'+
							'<div class="ranking-time">'+quiz.user[i].time+'</div>'+
						'</li>';

			}
			//通常ランキング
			else{

	 			html +=	'<li class="ranking-list">'+
							'<div class="ranking-num">'+(1+i)+'</div>'+
							'<img class="ranking-img" src="'+quiz.user[i].profileUrl+'" width="80" height="80">'+
							'<div class="ranking-name">'+quiz.user[i].name+'</div>'+
							'<div class="ranking-time">'+quiz.user[i].time+'</div>'+
						'</li>';
			}
		}

		elUl.innerHTML = html;

		//次の問題番号
		quizNum++;
		if(!quizList[quizNum]){
			socket.emit("exhibitionEnd");
			return;
		}

		//ループリセット
		pageMove = roopDefalult;

		//flags reset
		for(var key in flags){
			if(key === "time"){
				flags[key] = false;
			}
			else{
				flags[key] = true;
			}
		}

	}

	socket.on('pushMaster',function(data){
		console.log(data);
		switch(data.state){
			case CNST.MASTER_EVENT.QUIZ_RESULT:
				inputResult(data);
				break;

			case CNST.MASTER_EVENT.ADD_USER:
				addUser(data);
				break;

			case CNST.MASTER_EVENT.EXHIBITION_RESULT:
				finalResult = data;
				break;
		}
	});

	socket.on('log',function(data){
		console.log(data);
	});

})(window);
