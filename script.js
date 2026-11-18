// ゲームの共通部分を書く
// グローバル変数はここにまとめる
let currentMessage=[];
let msgIndex=0;// 今何番目の文を表示しているか
let charIndex=0;// 今何文字目か
let isTyping=false;// タイピング中かどうか
let typeTimeout;// タイピングのタイマー
let isMessageActive = false;   // メッセージウィンドウが開いてるかどうか
let onMessageEnd = null;
// score/itemsはページ移動しても消えないようlocalStorageから復元
let score = Number(localStorage.getItem("score") || 0);
// 黒い人物
let itemDecided=false;
// BGM
let BGMAudio=null;

// 音楽
function playAudio(src,volume=0.3){
    if(BGMAudio){
        BGMAudio.pause();
    }  // すでに同じ曲が流れていたら鳴らしなおさない

    BGMAudio=new Audio(src);
    BGMAudio.loop=true;
    BGMAudio.volume=volume;
    BGMAudio.play().catch(()=>{
        console.log("自動再生ブロック: 最初のキー入力で鳴らします");
    });
}

const player={
    x:145,
    y:520,
    speed:5,
    width:80,
    height:160,
    items:[]
};

const playerImages={
    up:"images/girl-top.png",
    down:"images/girl.png",
    left:"images/girl-left.png",
    right:"images/girl-right.png"
};

let playerDir="down";// 今向いている向き
let walkCount=0;// 歩いたフレーム

// 画像が変わる時だけ差し替える毎回フレーム変えると、ちらつくため
function setupPlayerImage(src){
    if(!playerEl)return;
    if(!playerEl.src.endsWith(src))playerEl.src=src;
}

// 画像を先に読み込んでおく（初めて切り替わるときの一瞬の空白を防ぐ）
Object.values(playerImages).forEach(src=>{
    new Image().src=src;
});

let playerEl = null;
const keys = {};

//====== ゲーム初期化処理（開始時に必ず呼ぶ）init=初期化　HTMLが読み込まれたらinitCommon()実行する。======
document.addEventListener("DOMContentLoaded",()=>{
    initCommon();
});

function initCommon(){
    console.log("共通処理開始");
    // loadInventory();
    setupMessageSystem();     
    setupPlayer();
    setupKeyInput();
    startGameLoop();

    // phpファイルのURLで判断して自動でステージ移動する
    const page=new URLSearchParams(location.search).get("page");

    if(page&&typeof window["init"+page]==="function"){
        window["init"+page]();
    }
}

// メッセージの表示をゼロの状態にする
function setupMessageSystem(){
    currentMessage = [];
    msgIndex = 0;
    charIndex = 0;
    isTyping = false;
}

// プレイヤー初期化
function setupPlayer(){
    // htmlの女の子の画像をとってきてる。jsで動かせるようにしている
    playerEl=document.querySelector(".stage-chara");
}

// キー入力
function setupKeyInput() {
   window.addEventListener("keydown",(e)=>{
    // 矢印キーでページがスクロールしないようにする
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
    // キーを押しっぱなしにしたときの連続入力を無視する
    if(e.repeat) return;
    keys[e.key]=true;

    // ブロックされていたBGMを、最初のキー入力で鳴らす
    if(BGMAudio && BGMAudio.paused){
        BGMAudio.play().catch(()=>{});
    }

    if(e.key==="Enter"){
        e.preventDefault();
        
        if (isMessageActive) {
        // メッセージ表示中ならセリフ送りだけ
        nextMessage();
        return;
        }   


     // メッセージ表示中でなければロッカー判定を行う
    if (typeof handleLockerInteract === "function") {
        handleLockerInteract();
       } 
    }
   });
   window.addEventListener("keyup",(e)=>keys[e.key]=false);
}

// ===メッセージ処理===
// メッセージ開始&初期化＆1文字ずつ表示の開始
function showMessage(messageArray,callback,speakerName){
    const windowEl = document.getElementById('message-window');
    const boxEl = document.getElementById('prologue-message-box') ||
                  document.getElementById('game-message-box');

    if (!windowEl || !boxEl) return;// 上の要素がなかったら処理しない

    clearTimeout(typeTimeout);// 前のメッセージのタイピングが残ってると困るのでそれをリセット

    // 話者名を引き渡す
    const namebox=document.getElementById('name-box');
    if (namebox){
        namebox.textContent= speakerName || "主人公"; // 指定がなければ主人公のまま
}
    currentMessage = messageArray;
    msgIndex = 0;
    charIndex = 0;
    onMessageEnd = callback || null;
    console.log("showMessage実行:", messageArray, "callbackあり?", !!callback);

    const parentWindow = windowEl;

    const arrowEl = parentWindow ? parentWindow.querySelector('.next-arrow') : null;
    const isGame = (boxEl.id === 'game-message-box');

    if (isGame) {
        // ゲーム画面だけ矢印を boxEl に入れる
        boxEl.innerHTML = '';
        if (arrowEl) boxEl.appendChild(arrowEl);
    } else {
        // プロローグは矢印を移動させない
        boxEl.textContent = '';
    }

    windowEl.style.display = 'block';
    isMessageActive=true;

    type(boxEl);
}

// 1文字ずつ表示
function type(boxEl) {
    const parentWindow = boxEl.closest('#message-window');

    const arrowEl = parentWindow ? parentWindow.querySelector('.next-arrow') : null;

    if (charIndex < currentMessage[msgIndex].length) {
        isTyping = true;

        // 文字１文字取り出す。charAt()をchで定義した。
        const ch = currentMessage[msgIndex].charAt(charIndex);

        if (boxEl.id === 'game-message-box' && arrowEl) {
            boxEl.insertBefore(document.createTextNode(ch), arrowEl);
        } else {
            boxEl.textContent += ch;
        }

        charIndex++;
        typeTimeout =setTimeout(()=>type(boxEl),100);
    } else {
        isTyping = false;
        if (arrowEl) arrowEl.style.display = 'block';
    }
}

// 次のメッセージへ
function nextMessage() {
    const windowEl = document.getElementById('message-window');
    const boxEl = document.getElementById('prologue-message-box') ||
                  document.getElementById('game-message-box');

    if (!windowEl || isTyping) return;

    msgIndex++;

    // ★Prologue でも gamestart1 でも動く親の探し方
    const parentWindow = boxEl.closest('#message-window');

    const arrowEl = parentWindow ? parentWindow.querySelector('.next-arrow') : null;

    if (arrowEl) arrowEl.style.display = 'none';

    if (msgIndex < currentMessage.length) {
        const isGame = (boxEl.id === 'game-message-box');

    if (isGame) {
        // ゲーム画面だけ矢印を boxEl に入れる
        boxEl.innerHTML = '';
        if (arrowEl) boxEl.appendChild(arrowEl);
    } else {
        // プロローグは矢印を移動させない
        boxEl.textContent = '';
    }
        charIndex = 0;
        type(boxEl);
    } else {
        windowEl.style.display = 'none';
        isMessageActive=false;
        const isGame = (boxEl.id === 'game-message-box');

        if (isGame) {
            // ゲーム画面だけ矢印を boxEl に入れる
            boxEl.innerHTML = '';
            if (arrowEl) boxEl.appendChild(arrowEl);
        } else {
            // プロローグは矢印を移動させない
            boxEl.textContent = '';
        }
        // もしプロローグのセリフが全部終わったらgamestart1(本編)に移動する
        // 次の本編に進むならstage1に書く
        if (location.search.includes("page=Prologue")) {
            location.href = "?page=gamestart1";
        
        }

        if (onMessageEnd) {
            console.log("onMessageEndを実行します"); 
            const cb = onMessageEnd;
            onMessageEnd = null;
            cb();
        }
    }
}

// ===== プレイヤー処理 ========
function updateplayer() {
    if (!playerEl) return;
    if (isMessageActive) return;   // メッセージ中は動かさない
    if (isPopupOpen()) return;     // ポップアップ中も動かさない

    let dx = 0, dy = 0;
    if (keys["ArrowLeft"])  { dx -= player.speed; playerDir = "left"; }
    if (keys["ArrowRight"]) { dx += player.speed; playerDir = "right"; }
    if (keys["ArrowUp"])    { dy -= player.speed; playerDir = "up"; }
    if (keys["ArrowDown"])  { dy += player.speed; playerDir = "down"; }

    // 横に動かして、壁に当たったら元に戻す
    player.x += dx;
    if (typeof isBlocked === "function" && isBlocked()) player.x -= dx;

    // 縦に動かして、壁に当たったら元に戻す
    player.y += dy;
    if (typeof isBlocked === "function" && isBlocked()) player.y -= dy;

    player.x = Math.max(0, Math.min(1280 - 40, player.x));
    player.y = Math.max(0, Math.min(720 - player.height, player.y));

    setupPlayerImage(playerImages[playerDir]);
    playerEl.style.left = player.x + "px";
    playerEl.style.top  = player.y + "px";
}

// ポップアップが開いているか
function isPopupOpen() {
    const popup = document.getElementById("itemPopup");
    return popup && !popup.classList.contains("hidden");
}

// アイテムを手に入れた後に画像を表示
function showItemImage(src,showChoices=true){
    console.log("showItemImage呼び出し。画像パス:", src); 
    const popup = document.getElementById("itemPopup");
    const img = document.getElementById("itemImage");
    const choiceBox = document.querySelector(".item-choice-btn");
    const closeBtn=document.getElementById("itemCloseBtn")

    img.src = src;
    popup.classList.remove("hidden");
    // 選択肢があるときは×を隠して、必ず選ばせる（鍵のように選択肢がないときだけ×を出す）
    if(closeBtn){
        closeBtn.style.display = showChoices ? "none" : "flex";
    }
    if(choiceBox){
        choiceBox.style.display = showChoices ? "flex" : "none";
    }
}

// アイテム名登録（ここにアイテムを追加していく）
const itemName={
    "Indoor_shoes":"汚れた上履き",
    "frist_key":"扉のカギ",
    "mapItem":"古びた学級日誌",
    "newspaper":"古い新聞の切り抜き"
};

// ロッカーの開けた時の音
function rokkaSound(src){
    const audio=new Audio(src);
    audio.play();
}

// itemNameの中身を返す
function getItemName(itemkey){
    return itemName[itemkey]|| itemkey;
}

// 選択肢を保存
function saveInventory(){
    localStorage.setItem("playerItems", JSON.stringify(player.items));
}
function loadInventory(){
    player.items = JSON.parse(localStorage.getItem("playerItems") || "[]");
}

// itemPopupを閉じる
function closePopup(){
    console.log("closePopup実行。ポップアップを閉じます");
    document.getElementById("itemPopup").classList.add("hidden");
}
document.addEventListener("DOMContentLoaded",()=>{
    const closeBtn=document.getElementById("itemCloseBtn");
    if(closeBtn){
         closeBtn.addEventListener("click",closePopup);
    }

    // 画像の下に選択肢ボタン
    const keepBtn=document.getElementById("keepbtn");
    const discardBtn = document.getElementById("discardbtn");

    if(keepBtn){
        keepBtn.addEventListener('click',()=>{
            score+=1;
            localStorage.setItem("score",score);
            itemDecided=true;
            console.log("とっておくを選択。現在のスコア：",score);
            closePopup();
        });
    }

    if(discardBtn){
        discardBtn.addEventListener("click",()=>{
            score-=1;
            localStorage.setItem("score",score);
            itemDecided=true;
            console.log("捨てるを選択。現在のスコア：",score);
            closePopup();
        });
    }
});

function startGameLoop() {
    requestAnimationFrame(gameloop);
}

function gameloop() {
    updateplayer();
    requestAnimationFrame(gameloop);
}

async function loadText(stageName) {
    try{
        const res=await fetch("text.json")
        const data=await res.json();
        return data[stageName] || []; 
    }catch(e){
        console.error("json読み込み失敗",e);
        return[];
    }
}

// Prologueのセリフをjsonで読み込む
async function initPrologue(){
    console.log("prologuestart!");
    const lines=await loadText("Prologue");
    showMessage(lines);
}

// // 確認用: クリックした場所のゲーム座標を表示する(終わったら削除)
// document.addEventListener("click",(e)=>{
//     const stage = document.querySelector(".gamestage");
//     const rect = stage.getBoundingClientRect();
//     const scale = rect.width / 1280;   // 縮小率(縮んでいなければ1)
//     console.log(
//         "x:", Math.round((e.clientX - rect.left) / scale),
//         "y:", Math.round((e.clientY - rect.top) / scale)
//     );
// });

// 確認用: 通れない範囲を赤枠で表示する(終わったら削除)
//   window.addEventListener("DOMContentLoaded", ()=>{
//       const stage = document.querySelector(".gamestage");
//      noarea.forEach(w=>{
//           const box = document.createElement("div");
//           box.style.cssText =
//               `position:absolute; left:${w.x}px; top:${w.y}px; width:${w.width}px; height:${w.height}px;` +
//               `border:2px solid red; z-index:20; pointer-events:none;`;
//           stage.appendChild(box);
//       });
//   });