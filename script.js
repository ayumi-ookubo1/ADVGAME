// ゲームの共通部分を書く
// グローバル変数はここにまとめる
let currentMessage=[];
let msgIndex=0;// 今何番目の文を表示しているか
let charIndex=0;// 今何文字目か
let isTyping=false;// タイピング中かどうか
let typeTimeout;// タイピングのタイマー

const player={
    x:145,
    y:520,
    speed:5,
    width:80,
    height:160
};

let playerEl = null;
const keys = {};

//====== ゲーム初期化処理（開始時に必ず呼ぶ）init=初期化　HTMLが読み込まれたらinitCommon()実行する。======
document.addEventListener("DOMContentLoaded",()=>{
    initCommon();
});

function initCommon(){
    console.log("共通処理開始");
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
    keys[e.key]=true;

    if(e.key==="Enter"){
        e.preventDefault();
        // セリフ送り
        nextMessage();

    //      アイテム取得 or キャラ会話
    //      if (typeof checkTalkOrItem === "function") {
    //         checkTalkOrItem();
    }
   });
   window.addEventListener("keyup",(e)=>keys[e.key]=false);
}

// ===メッセージ処理===
// メッセージ開始&初期化＆1文字ずつ表示の開始
function showMessage(messageArray){
    const windowEl = document.getElementById('message-window');
    const boxEl = document.getElementById('prologue-message-box') ||
                  document.getElementById('game-message-box');

    if (!windowEl || !boxEl) return;// 上の要素がなかったら処理しない

    clearTimeout(typeTimeout);// 前のメッセージのタイピングが残ってると困るのでそれをリセット

    currentMessage = messageArray;
    msgIndex = 0;
    charIndex = 0;
    const parentWindow = boxEl.closest('.game-window') ||
                         boxEl.closest('#message-window') ||
                         boxEl.parentElement;

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

    type(boxEl);
}

// 1文字ずつ表示
function type(boxEl) {
    const parentWindow =
        boxEl.closest('.game-window') ||
        boxEl.closest('#message-window') ||
        boxEl.parentElement;

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
    const parentWindow =
        boxEl.closest('.game-window') ||
        boxEl.closest('#message-window') ||
        boxEl.parentElement;

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
    }
}

// ===== プレイヤー処理 ========
function updateplayer() {
    if (!playerEl) return;

    // x=左右 y=上下に動く
    if (keys["ArrowLeft"])  player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;
    if (keys["ArrowUp"])    player.y -= player.speed;
    if (keys["ArrowDown"])  player.y += player.speed;

    player.x = Math.max(0, Math.min(1280 - player.width, player.x));
    player.y = Math.max(0, Math.min(720 - player.height, player.y));

    // 通れないところの当たり判定実装
    if (typeof blockstagearea === "function") {
        blockstagearea();
    }
    // キャラのcssのleft,topを更新して動かしてる
    playerEl.style.left = player.x + "px";
    playerEl.style.top  = player.y + "px";
}

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