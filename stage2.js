// stage1を始めるための関数
async function initgamestart2(){
    console.log("stage2-start");
    const lines=await loadText("gamestart2");
    showMessage(lines);
}

function blockstagearea() {
    // playerの範囲　当たり判定の四角形
    const pleft   = player.x-40;
    const pright  = player.x +40;
    const pbottom = player.y + player.height;
    const ptop    = pbottom - 30;

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
        if (keys["ArrowRight"]) player.x = wLeft - 40;
        if (keys["ArrowLeft"])  player.x = wRight+40;
        if (keys["ArrowDown"])  player.y = wTop - player.height;
        if (keys["ArrowUp"])    player.y = wBottom-player.height+30;
    }
}
// 黒い人物
const helpchara={
    x: 1145, y:515, width: 110, height: 150,
    beformessage: ["..."],
    aftermessage:[
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

// 机の範囲
const desk=[
    {
        // 1行目の左
        x:165, y:287, width:87, height:104,       
        message:["ただの机だ。"],
        items:null,
        got:false,
        gotMessage:false 
    },

     {
        // 1行目の真ん中
        x:588,y:284,width:87,height:104,
        message:["ただの机だ。"],
        items:null,
         got:false,
        gotMessage:false 
     },

     {
        // 1行目の右
        x:1005,y:286,width:87,height:104,
        message:["ただの机だ。"],
        items:null,
        got:false,
        gotMessage:false 
     },

     {
        // 2行目の左
        x:341,y:466,width:87,height:104,
        message:["ただの机だ。"],
        items:null,
        got:false,
        gotMessage:false 
     },

     {
        // 2行目の右
        x:814,y:473,width:87,height:104,
         message:["ただの机だ。"],
        items:null,
        got:false,
        gotMessage:false 
    },

    {
        // 左の掲示板
        x:100,y:30,width:200,height:30,
         message:["クラスの集合写真が貼られている。",
            "...よくみると小さく「４」と書かれている。"
         ],
        items:null,
        got:false,
        gotMessage:false 
    },

    {
        // 黒板
        x:445,y:30,width:390,height:30,
         message:["日直と日付が書かれている。",
            "ところどころきれいに消せていない。きたねぇ黒板だ。",
            "かすれて書かれているところに「９」が書かれていた。数学でもやってたのかな..."
         ],
        items:null,
        got:false,
        gotMessage:false 
    },

    {
        // 出口
        x:1210,y:30,width:80,height:80,
        beformessage: ["また開かないんだが！",
            "とにかく出る方法を探そう"
        ],
        aftermessage:["...",
        ],
        items:null,
        got:false,
        gotMessage:false 
    },
    
];
function checkDeskHit() {
    const margin=10;
    for (let i = 0; i < desk.length; i++) {
        const L = desk[i];

        const hit =
            player.x < L.x + L.width+margin &&
            player.x + player.width > L.x-margin &&
            player.y < L.y + L.height+margin &&
            player.y + player.height > L.y-margin;

        if (hit) return i;
    }
    return -1;
}
const noarea=[
    {x: 0, y:30, width: 1210, height:130},...desk// 黒板の前までしか歩けない
];

// マップ上のアイテム星
const mapItem = {
    x: 170, y: 200, width: 160, height: 160,   // 主人公が近づいて届く範囲を少し広めに
    key: "item_name",                          // itemNameに登録するキー
    got: false,
    message: ["何かが落ちている…"]
};

function mapItemHit(){
    return player.x < mapItem.x + mapItem.width &&
           player.x + player.width > mapItem.x &&
           player.y < mapItem.y + mapItem.height &&
           player.y + player.height > mapItem.y;
}

// 黒い人物
const helpchara2={
    x: 1187, y:558, width: 110, height: 150,
    beformessage: ["縺雁燕繧定ｨｱ縺輔↑縺�"],
    aftermessage:["見つけたんだね",
            ]
}
function helpchara2Hit(){
    const hit=
        player.x<helpchara2.x+helpchara2.width&&
        player.x+player.width>helpchara2.x&&
        player.y<helpchara2.y+helpchara2.height&&
        player.y+player.height>helpchara2.y;
    return hit;
}

// enterで反応させる
function handleLockerInteract(){
    // 黒い人物
    if(helpchara2Hit()){
        showMessage(helpchara2.beformessage, null, "???");
        return;
    }

    // マップ上のアイテム
    if(mapItemHit() && !mapItem.got){
        mapItem.got = true;
        const getMsg = `「${getItemName(mapItem.key)}」を手に入れた。`;

        showMessage([...mapItem.message, getMsg], ()=>{
            document.getElementById("mapItem").classList.add("hidden");  // マップ上の動画を消す
            showItemImage("images/" + mapItem.key + ".png");              // ステージ1と同じポップアップ
        });
        return;
    }

    // 机
    const index = checkDeskHit();
    if(index === -1) return;

    const D = desk[index];
    if(!D.gotMessage){
        D.gotMessage = true;
        showMessage(D.message);
    }
}
