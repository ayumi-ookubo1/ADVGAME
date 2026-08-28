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
        message:["開かない..."],
        items:null,
        got:false,
        gotMessage:false 
    },
    {
        x:110,y:0,width:110,height:150,
        message:["開かない..."],
        items:null,
        got:false,
        gotMessage:false 
    },
    {
        x:220,y:0,width:110,height:150,
        message:["開かない..."],
        items:null,
        got:false,
        gotMessage:false 
    },
    {
        x:330,y:0,width:110,height:150,
        message:["ん？何か入ってる!"],
        items:"Indoor_shoes",
        got:false,
        gotMessage:false 
    },
    {
        x:440,y:0,width:110,height:150,
        message:["開かない..."],
        items:null,
        got:false,
        gotMessage:false 
    },
    {
        x:550,y:0,width:110,height:150,
        message:["開かない..."],
        items:null,
        got:false,
        gotMessage:false 
    },
    {
        x:660,y:0,width:110,height:150,
        message:["開かない..."],
        items:null,
        got:false,
        gotMessage:false 
    },
    {
        x:770,y:0,width:110,height:150,
        message:["開かない..."],
        items:null,
        got:false,
        gotMessage:false 
    },
];

function checkLockerHit() {
    for (let i = 0; i < locker.length; i++) {
        const L = locker[i];

        const hit =
            player.x < L.x + L.width &&
            player.x + player.width > L.x &&
            player.y < L.y + L.height &&
            player.y + player.height > L.y;

        if (hit) return i;
    }
    return -1;
}

// ストーリー上ドアを調べてからロッカーを調べてもらいたいのでドアを先に確認させる
let doorchecked=false;

function handleLockerInteract(){
    if(cheakDoorHit()){
        if(!doorchecked){
            doorchecked=true;// door調べたことを確認
            showMessage(exitDoor.message);
        }
        return;
    }

    // ↓ドアをまだ調べていなければ、ロッカーは反応させない
    if(!doorchecked){
        return;
    }

    // ステージ2に行くためのコード
    if(checkSecondExitHit()){
        if(itemDecided){ // 鍵(アイテム選択)が済んでいるときだけ反応させる
            showMessage(secondExit.message, ()=>{
                location.href = "?page=gamestart2"; // セリフが終わったらステージ2へ
            });
        }
        return;
    }

    // 黒い人物の動き
    if(helpcharaHit()){
        if(!itemDecided){
            showMessage(helpchara.beformessage,null,"???");
        }
        else{
            showMessage(helpchara.aftermessage,async()=>{
                console.log("stage1-finish");
                const lines=await loadText("gotkey");
                showMessage(lines,()=>{
                    showItemImage("images/frist_key.png",false);
                });
            },"???");
        }
        return
    }

    const index=checkLockerHit();
    if(index===-1)return;

    const L=locker[index];

    // アイテムが入っていて、まだとっていない場合
    if(L.items&& !L.got){
        L.got = true;
        L.gotMessage = true;

        rokkaSound("sounds/ロッカーを開ける2.mp3");

        console.log("アイテム取得処理開始",L.items);

        const displayName=getItemName(L.items);
        const getMsg = `「${displayName}」を手に入れた。`;

        if(!player.items.includes(L.items)){
            player.items.push(L.items);
            saveInventory();
        }  
        
        // 主人公の名前が表示される
        showMessage([...L.message, getMsg],()=>{
            showItemImage("images/"+L.items+".png");
        }); 
        return;
    }
    if(!L.gotMessage){
        L.gotMessage = true;
        showMessage(L.message);
    }
}

// 水色のマット（入口）
const exitDoor={
    x: 0, y: 330, width: 90, height: 130,
    message: ["あれ？鍵が壊れてて出られない！",
        "困ったな...とりあえずここ以外で出られる方法を探すか"
    ]
}

function cheakDoorHit(){
    const hit=
        player.x<exitDoor.x+exitDoor.width&&
        player.x+player.width>exitDoor.x&&
        player.y<exitDoor.y+exitDoor.height&&
        player.y+player.height>exitDoor.y;
    return hit;
}

// ↓今どこの座標にいるかの確認用。終わったら削除する
window.addEventListener("keydown",(e)=>{
    if(e.key === "p"){
        console.log("player.x:", player.x, "player.y:", player.y);
    }
});

// 黒い人物
const helpchara={
    x: 865, y:0, width: 110, height: 150,
    beformessage: ["..."],
    aftermessage:["見つけたんだね",
        "──それが、君の選択だ。その気持ちを、忘れないで。",
        "出口のカギだ。そこの扉が開ける。次へ進め。",
    ]
}
function helpcharaHit(){
    const hit=
        player.x<helpchara.x+helpchara.width&&
        player.x+player.width>helpchara.x&&
        player.y<helpchara.y+helpchara.height&&
        player.y+player.height>helpchara.y;
    return hit;
}

// 次のステージに行く出口
const secondExit = {
    x: 1080, y: 480, width: 150, height: 200,
    message: ["扉が開いた！"]
};
function checkSecondExitHit(){
    const hit=
        player.x<secondExit.x+secondExit.width&&
        player.x+player.width>secondExit.x&&
        player.y<secondExit.y+secondExit.height&&
        player.y+player.height>secondExit.y;
    return hit;
}