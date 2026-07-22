// stage1を始めるための関数
async function initgamestart1(){
    console.log("stage1-start");
    const lines=await loadText("gamestart1");// gamestart1のセリフ（json）を読み込む　awaitは読み込み終わるのを待つ
    showMessage(lines);
}

// ステージ通行止めエリア
const noarea=[
    {x:1080, y:0,width:150,height:520},// 右側黒色の通行止めライン
    {x: 0, y: 0, width: 1280, height:130}// ロッカーの前までしか歩けない
];

function blockstagearea() {
    // playerの範囲　当たり判定の四角形
    const pleft   = player.x;
    const pright  = player.x + player.width;
    const ptop    = player.y;
    const pbottom = player.y + player.height;

    // 壁を1つずつ処理　壁にも当たり判定の四角形を作る
    for (const w of noarea) {

        const wLeft=w.x;
        const wRight=w.x+ w.width;
        const wTop=w.y;
        const wBottom=w.y+ w.height;

        // プレイヤーと壁の四角形が重なっているかどうかチェックする
        const hit =
            pleft < wRight &&
            pright > wLeft &&
            ptop < wBottom &&
            pbottom > wTop;
        // 重なってたらtrue,重なってなかったら何もしない。（進める）
        if (!hit) continue;

        // 重なった方向に応じて押し戻す
        if (keys["ArrowRight"]) player.x = wLeft - player.width;
        if (keys["ArrowLeft"])  player.x = wRight;
        if (keys["ArrowDown"])  player.y = wTop - player.height;
        if (keys["ArrowUp"])    player.y = wBottom;
    }
}

// ロッカーの座標と、メッセージとアイテムとゲットしたかどうか
const locker=[
    {
        x:0,y:0,width:110,height:150,
        message:"",
    },
    {x:110,y:0,width:110,height:150},
    {x:220,y:0,width:110,height:150},
    {x:330,y:0,width:110,height:150},
    {x:440,y:0,width:110,height:150},
    {x:550,y:0,width:110,height:150},
    {x:660,y:0,width:110,height:150},
    {x:770,y:0,width:110,height:150},
];

const lockermessage=[

]



