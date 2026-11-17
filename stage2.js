// stage2を始めるための関数
async function initgamestart2(){
    console.log("stage2-start");
    playAudio("sounds/anotherplanet.mp3")
    const lines=await loadText("gamestart2");
    showMessage(lines);
}

let stage2Cleared = false;
let canExit=false;
let passwordSolved=false;

function isBlocked() {
    const pleft   = player.x - 40;
    const pright  = player.x + 40;
    const pbottom = player.y + player.height;
    const ptop    = pbottom - 30;
    return noarea.some(w =>
        pleft < w.x + w.width && pright > w.x &&
        ptop < w.y + w.height && pbottom > w.y
    );
}

// 机の範囲
const desk=[
    {
        // 1行目の左
        x:165, y:287, width:87, height:104,       
        message:["机に落書きが書いてある。","××シね！ キモイ！ キエロ！ ","この字の書き方...","...見なかったことにしよう。"],
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
        message:["なにか書いてある...","「縺雁燕繧定ｨｱ縺輔↑縺� 9」","なにこれ！読めない！"],
        items:null,
        got:false,
        gotMessage:false,
        clue:true, 
     },

     {
        // 2行目の左
        x:341,y:466,width:87,height:104,
        message:["机の上に花瓶が置いてある","どうしよう？"],
        items:"images/flower.png",
        got:false,
        gotMessage:false 
     },

     {
        // 2行目の右
        x:814,y:473,width:87,height:104,
         message:["机になぜか「8」と書いてある。"],
        items:null,
        got:false,
        gotMessage:false,
        clue:true,
    },

    {
        // 左の掲示板
        x:100,y:30,width:200,height:30,
         message:["クラスの集合写真が貼られている。","あ、自分が写ってる...",
            "全員が笑っている。ひとりだけ、顔がペンで塗りつぶされている。",
            "...その隣で笑っているのは、私だ。",
            "...よくみると小さく「４」と書かれている。なんのことだろう？"
         ],
        items:null,
        got:false,
        gotMessage:false,
        clue:true,
    },

    {
        // 右の掲示板
        x:950,y:30,width:180,height:30,
         message:["掲示板だ。何か書かれている。",
            "「パスワードは四字熟語」「数字のどれか一つは間違いだ。」と書かれている。","なんのパスワードだろう？"
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
            "かすれて書かれているところを見ると「９」と「７」が書かれていた。"
         ],
        items:null,
        got:false,
        gotMessage:false,
        clue:true, 
    },

];
// 机の当たり判定
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

// 主人公が通れない場所
const noarea=[
    {x: 0, y:30, width: 1150, height:140},...desk,
    // 黒板の前までしか歩けない
    {x:1210, y:30, width:80, height:140} ,// 出口の範囲
    {x: 1187, y:558, width: 110, height: 150}
];

// マップ上のアイテム星
const mapItem = {
    x: 170, y: 500, width: 100, height: 100,   
    key: "mapItem",                          
    got: false,
    message: ["何かが落ちている…","学級日誌だ。","中に小さなメモが入っていた","「先生□す□て、■■■にい□められている」","....."]
};
// アイテム星の当たり判定
function mapItemHit(){
    return  player.x < mapItem.x + mapItem.width &&
            player.x + player.width > mapItem.x &&
            player.y < mapItem.y + mapItem.height &&
            player.y + player.height > mapItem.y;
}

// 黒い人物
const helpchara2={
    x: 1185, y:560, width: 110, height: 150,
    beformessage: ["まだその時ではない..."],
    aftermessage:["あなた宛てにスマホを預かっているの。","パスワードは？",
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

// 出口
const exitDoor2={
    x:1210,y:30,width:80,height:80,
        beformessage: ["また開かないんだが！",
            "とにかく出る方法を探そう"],
        aftermessage:["屋上に向かおう。",
        ],
        items:null,
        got:false,
        gotMessage:false 
}
 
function exitDoor2Hit(){
    const hit=
        player.x<exitDoor2.x+exitDoor2.width&&
        player.x+player.width>exitDoor2.x&&
        player.y<exitDoor2.y+exitDoor2.height&&
        player.y+player.height>exitDoor2.y;
    return hit;
}
    
// enterで反応させる
function handleLockerInteract(){
    if(document.querySelector(".horror-layer"))return;
    if(!document.getElementById("password-box").classList.contains("hidden")) return;
    // 黒い人物
    if(helpchara2Hit()){
        if(passwordSolved){
            showMessage(["もう渡すものはない。早く出ていけ。"],null,"???")
        return;} // パスワード正解したらもうそのイベントは話しかけても起きない
        if(!allclueChecked()){
        showMessage(helpchara2.beformessage, null, "???");
    }else{
        showMessage(helpchara2.aftermessage, showPassWord, "???");
    }
    return;
    }

    // マップ上のアイテム
    if(mapItemHit() && !mapItem.got){
        mapItem.got = true;
        const getMsg = `「${getItemName(mapItem.key)}」を手に入れた。`;

        showMessage([...mapItem.message, getMsg], ()=>{
            document.getElementById("mapItem").classList.add("hidden");  // マップ上の動画を消す
            setChoice("とっておく","すてる"); 
            document.getElementById("itemImage").style.maxWidth="";
            showItemImage("images/note.png");    
            stage2Cleared = true;    
        });
        return;
    }

    if(exitDoor2Hit()){
        if(!canExit){
            showMessage(exitDoor2.beformessage);
        }else{
            showMessage(exitDoor2.aftermessage, ()=>{
                // セリフが終わったら、スコアでページを切り替える
                location.href = score>0 ? "?page=ending1" : "?page=ending2";
            });
        }
        return;
    }

    // 机
    const index = checkDeskHit();
    if(index === -1) return;

    const D = desk[index];
    if(D.items&&D.got)return;
    D.gotMessage = true;
    showMessage(D.message,()=>{
        if(D.items){
            D.got=true;
            document.getElementById("itemImage").style.maxWidth="250px"
            setChoice("かたづける","そのままにする");
            showItemImage(D.items);
        }
    });
}

// passwordを選択する
function showPassWord(){
    console.log("password")
    document.getElementById("password-box").classList.remove("hidden");
}

function setChoice(keep,discard){
    document.getElementById("keepbtn").textContent=keep;
    document.getElementById("discardbtn").textContent=discard;
}
// 「片づける」(1つ目のボタン)を押したとき
document.getElementById("keepbtn").addEventListener("click",()=>{
    if(document.getElementById("itemImage").src.includes("flower")){
        document.getElementById("flower").classList.add("hidden");   // 花瓶を消す
        showMessage(["花瓶を片づけた。きれいになった。"]);
    }
});

// 「そのままにしておく」(2つ目のボタン)を押したとき
document.getElementById("discardbtn").addEventListener("click",()=>{
    if(document.getElementById("itemImage").src.includes("flower")){
        showMessage(["いや、そのままにしておこう..."]);
    }
});

function answerPassword(correct){
    document.getElementById("password-box").classList.add("hidden");
    if(correct){
        rokkaSound("sounds/Quiz-maru.mp3");
        stage2Cleared=true;
        passwordSolved=true; // 正解したらこのイベントは１回限り。
        showMessage(["正解","はい、スマホ。どうぞ。"], startHorror, "???");   // ここにスマホの演出を足す
    }else{
        rokkaSound("sounds/Quiz-batu.mp3");
        showMessage(["違う"], null, "???");
    }
}

function allclueChecked(){
    return desk.filter(d=>d.clue).every(d=>d.gotMessage);
}

function startHorror(){
    BGMAudio.pause();
    BGMAudio=null;
    document.body.classList.add("shake");

    const horrorse=new Audio("sounds/CellPhone.mp3");
    horrorse.loop=true;
    horrorse.volume=1;
    horrorse.play();

    // 黒い幕
    const layer=document.createElement("div");
    layer.className="horror-layer";
    document.querySelector(".gamestage").appendChild(layer);
    const words=["死ね","消えろ","逃がさない"];

    const timer=setInterval(()=>{
        const t=document.createElement("span");
        t.textContent=words[Math.floor(Math.random()*words.length)];
        t.style.left=Math.random()*90+"%";               // ランダムな位置
        t.style.top=Math.random()*90+"%";
        t.style.fontSize=(20+Math.random()*60)+"px";     // ランダムな大きさ
        layer.appendChild(t);
    },30);    // 0.03秒ごと

    setTimeout(()=>{
        clearInterval(timer);
        horrorse.pause();
        document.body.classList.remove("shake");
        layer.remove();
        startCommonStory();
    },3000);
}

function startCommonStory(){
    console.log("startCommonStory実行");
    const schoolbell=new Audio("sounds/dinner_chime.mp3");
    const open_door=new Audio("sounds/open_door.mp3");
    
    showMessage(["びっくりしたぁ！！！",
        "送信履歴が、全部私の名前になってる。",
        "宛先は、ぜんぶ同じ人だ。",
        "...私が、送ったの？"
    ],()=>{
        // 2.チャイム
        schoolbell.play();
        showMessage(["これから「あの日」を再生します"], ()=>{
            //3 主人公セリフ
            showMessage(["え？なになに！"],()=>{
                // 4扉の音、セリフ、出口出れる
                open_door.play();
                showMessage(["ん？なんか扉の開く音がしたような...","行ってみよう。"],()=>{
                    canExit=true;
                },"主人公");
            },"主人公");
        },"???");
        },"主人公");
}

