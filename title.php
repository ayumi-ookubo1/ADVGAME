<!-- http://localhost/mygame/ADVGAME/title.php で開く-->

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>あの日をもう一度</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Nosifer&family=Silkscreen:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="warning">
        <p class="warning-title">⚠ ご注意ください</p>
        <p>このゲームには、いじめや死に関する表現が含まれます。</p>
        <p>画面の揺れや、文字の点滅の演出もあります。</p>
        <p>気分が悪くなったら、無理せずプレイを中断してください。</p>
        <p id="warning-press" class="warning-press" style="visibility:hidden;">Press Enter</p>
    </div>
        <script>
            let ready=false;
            // 3秒たつまで進めない（注意書きを読んでもらうため）
            setTimeout(()=>{
                ready=true;
                document.getElementById("warning-press").style.visibility="visible";
            },3000);

            function goTitle(){
                if(!ready) return;
                location.href='?page=title';
            }
            window.addEventListener('keydown',(e)=>{
                if(e.key==='Enter') goTitle();
            });
            document.addEventListener('click',goTitle);
        </script>

        <div onclick="startGame()" class="title" style="cursor: pointer;">
            <h1>あの日をもう一度</h1>
            <p>Press Enter to start</p>
            <script> // エンター押したらプロローグの画面に移行してねという意味
                let started=false;

                function startGame(){
                    if(started) return;
                    started=true;
                    localStorage.removeItem("score");
                    // 新しく始めるたびに０からスタート
                    const se=new Audio("sounds/horrific_blow1.mp3");
                    se.play();
                    setTimeout(()=>{
                        location.href='?page=Prologue';
                    },3000);
                }

                window.addEventListener('keydown',(e=>{
                    if(e.key==='Enter'){
                        if(e.key==='Enter')startGame();
                    }
                }));
            </script>
        </div>
    
    <!--プロローグ-->
    <div class="prologue-panel" style="background-color: black; width: 1280px; height: 720px; position: relative;">
            
        <div id="message-window" style="display: block; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px;">
                
            <!-- プロローグのメッセージの部分 -->
                <div id="prologue-message-box" style="color: white; padding: 40px; font-size: 24px; min-height: 100px; cursor: pointer; text-align: center; line-height: 1.8; position: relative;">
                </div>
                
                <div id="next-arrow" class="next-arrow" style="display: none; position: absolute; bottom: 0; right: 40px; color: white;">▼</div>
            </div>
        </div>
        
        <script src="script.js"></script>

    <!-- ステージ1 -->
        <div class="gamestage gamestage1" tabindex="0">
            <img src="images/girl.png" class="stage-chara" alt="girl">
            <div id="message-window" class="game-window">
                <div id="name-box" class="game-name-box">主人公</div>
                
                <div id="game-message-box" class="game-message-box">
                    <div id="next-arrow" class="next-arrow">▼</div>
                </div>
            </div>

            <img src="images/help1.png" class="stage1-help" alt="???">

            <div id="itemPopup" class="hidden">
                <img id="itemImage" src="">
                <div id="itemCloseBtn" class="item-close-btn">×</div>

                <!-- 捨てるか取っておくかの選択肢のボタン -->
                <div class="item-choice-btn">
                    <button id="keepbtn">とっておく</button>
                    <button id="discardbtn">すてる</button>
                </div>
            </div>
        </div>
 
        <script src="script.js"></script>
        <script src="stage1.js"></script> 

    <!-- ステージ2 -->
        <div class="gamestage gamestage2" tabindex="0">
            <img src="images/girl.png" class="stage-chara" alt="girl">
            <div id="message-window" class="game-window">
                <div id="name-box" class="game-name-box">主人公</div>
                
                <div id="game-message-box" class="game-message-box">
                    <div id="next-arrow" class="next-arrow">▼</div>
                </div>
            </div>

            <img src="images/help1.png" class="stage2-help" alt="???">

            <div id="itemPopup" class="hidden">
                <img id="itemImage" src="">
                <div id="itemCloseBtn" class="item-close-btn">×</div>


            <!-- 捨てるか取っておくかの選択肢のボタン -->
            <div class="item-choice-btn">
                <button id="keepbtn">とっておく</button>
                <button id="discardbtn">すてる</button>
            </div>
        </div>
        <div id="password-box" class="hidden">
            <button onclick="answerPassword(false)">4899</button>
            <button onclick="answerPassword(true)">4989</button>  <!-- 正解 -->
                <button onclick="answerPassword(false)">4978</button>
            </div>
            <img id="mapItem" src="images/hosi-anime4.gif" class="map-item">
            <img src="images/flower.png" alt="flower" id="flower" class="flower">

        </div>

        <div id="horror" class="hidden"></div>
         
    <script src="script.js"></script>
    <script src="stage2.js"></script> 

    <!-- エンディングページ -->
    <div class="prologue-panel" style="background-color: black; width: 1280px; height: 720px; position: relative;">
        <div id="message-window" style="display: block; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px;">
            <div id="prologue-message-box" style="color: white; padding: 40px; font-size: 24px; min-height: 100px; text-align: center; line-height: 1.8; position: relative;">
            </div>
            <div id="next-arrow" class="next-arrow" style="display: none; position: absolute; bottom: 0; right: 40px; color: white;">▼</div>
        </div>
    </div>

    <script src="script.js"></script>
    <script src="ending.js"></script>
</body>
</html>
