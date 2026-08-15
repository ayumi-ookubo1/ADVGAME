<!-- http://localhost/mygame/ADVGAME/title.php で開く-->
<?php
// ページの切り替え設定
$page = $_GET["page"] ?? "title";
?>
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
    <?php if($page === "title"): ?>
        <div onclick="location.href='?page=Prologue'" class="title" style="cursor: pointer;">
            <h1>あの日をもう一度</h1>
            <p>Press Enter to start</p>
            <script> // エンター押したらプロローグの画面に移行してねという意味
                window.addEventListener('keydown',(e=>{
                    if(e.key==='Enter'){
                        location.href='?page=Prologue';
                    }
                }));
            </script>
        </div>

    <?php elseif($page === "Prologue"): ?>
        <div class="prologue-panel" style="background-color: black; width: 1280px; height: 720px; position: relative;">
            
            <div id="message-window" style="display: block; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px;">
                
            <!-- プロローグのメッセージの部分 -->
                <div id="prologue-message-box" style="color: white; padding: 40px; font-size: 24px; min-height: 100px; cursor: pointer; text-align: center; line-height: 1.8; position: relative;">
                </div>
                
                <div id="next-arrow" class="next-arrow" style="display: none; position: absolute; bottom: 0; right: 40px; color: white;">▼</div>
            </div>
        </div>
        
        <script src="script.js"></script>

    <?php elseif ($page === "gamestart1"): ?>
        <div class="gamestage" tabindex="0">
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
    <?php endif; ?>
</body>
</html>
