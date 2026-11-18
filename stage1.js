// stage1を始めるための関数
async function initgamestart1(){
    console.log("stage1-start");
    playAudio("sounds/Carol_of_the_Bell.mp3");
    const lines=await loadText("gamestart1");// gamestart1のセリフ（json）を読み込む　awaitは読み込み終わるのを待つ
    showMessage(lines);
}

// ステージ通行止めエリア
const noarea=[
    {x:1080, y:0,width:150,height:520},// 右側黒色の通行止めライン
    {x: 0, y: 0, width: 1280, height:130}// ロッカーの前までしか歩けない
];

function isBlocked() {
    const pleft   = player.x;
    const pright  = player.x + player.width;
    const ptop    = player.y;
    const pbottom = player.y + player.height;
    return noarea.some(w =>
        pleft < w.x + w.width && pright > w.x &&
        ptop < w.y + w.height && pbottom > w.y
    );
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
        message:["なにかはいってる!","くしゃくしゃになったメモが入っていた。","「全部あいつのせいで、、学校行きたくないな...」と書かれている。"],
        items:"memo",
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
        message:["ん？何か入ってる!","上履きが入っている。内履きの割に結構汚れている..."],
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
        message:["何か入ってる！","新聞紙の切り抜きが入っていた。","日付を見て、手が止まった。","この日は..."],
        items:"newspaper",
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

// 話しかけ用の判定：見た目のキャラの真ん中あたりだけを使う
function hitTalk(o){
    const left   = player.x - 20;
    const right  = player.x + 20;
    const top    = player.y;
    const bottom = player.y + player.height;
    return left < o.x + o.width && right > o.x &&
           top < o.y + o.height && bottom > o.y;
}

function checkLockerHit() {
    for (let i = 0; i < locker.length; i++) {
        if (hitTalk(locker[i])) return i;
    }
    return -1;
}

function helpcharaHit(){
    return hitTalk(helpchara);
}

// ストーリー上ドアを調べてからロッカーを調べてもらいたいのでドアを先に確認させる
let doorchecked=false;
let gotkey=false;

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
        if(gotkey){ // 鍵もらったときだけ反応させる
            showMessage(secondExit.message, ()=>{
                location.href = "?page=gamestart2"; // セリフが終わったらステージ2へ
            });
        }else{
                showMessage(["ここにも扉がある。","鍵があれば出られそうかも...？"]);
            }
        return;
    }

    // 黒い人物の動き
    if(helpcharaHit()){
        if(!itemDecided || !player.items.includes("newspaper")){
            showMessage(helpchara.beformessage,null,"???");
        }
        else{
            if(gotkey){
                showMessage(["もう渡すものはない。"],null,"???");
                return;
            }
            showMessage(helpchara.aftermessage,async()=>{
                console.log("stage1-finish");
                gotkey=true;
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
    message: ["あれ？扉があかない！",
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

// 黒い人物
const helpchara={
    x: 865, y:0, width:95, height: 150,
    beformessage: ["..."],
    aftermessage:["見つけたんだね",
        "──それが、君の選択だ。その気持ちを、忘れないで。",
        "出口のカギだ。そこの扉が開ける。次へ進め。",
    ]
}

// 次のステージに行く出口
const secondExit = {
    x: 1080, y: 480, width: 150, height: 200,
    message: ["扉が開いた！"],
};
function checkSecondExitHit(){
    const hit=
        player.x<secondExit.x+secondExit.width&&
        player.x+player.width>secondExit.x&&
        player.y<secondExit.y+secondExit.height&&
        player.y+player.height>secondExit.y;
    return hit;
}

// ↓今どこの座標にいるかの確認用。終わったら削除する
window.addEventListener("keydown",(e)=>{
    if(e.key === "p"){
        console.log("player.x:", player.x, "player.y:", player.y);
    }
});

// // "古い新聞の切り抜きが入っていた。",
// "日付を見て、手が止まった。",
// "...この日を、私は知っている。",
// "事情を聴かれた生徒って..."