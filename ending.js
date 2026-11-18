
let endingtext={};

async function loadTexts(){
    try{
        const res =await fetch("text.json",{cache:"no-store"});
        endingtext=await res.json();
    }catch(e){
        console.error("text.json読み込み失敗...",e);
        endingtext={};
    }
}

// 「名前「セリフ」」から、セリフの部分だけ取り出す（黒い画面用）
function strip(line){
    const m = line.match(/^.+?「([\s\S]*)」$/);
    return m ? m[1] : line;
}

// 画面切り替え（templateを取り出して入れ替える）
function swapTo(templateId){
    document.querySelectorAll(".prologue-panel, .gamestage").forEach(e=>e.remove());
    const tpl=document.getElementById(templateId);
    document.body.prepend(tpl.content.cloneNode(true));
}
const showBlack = () => swapTo("page-ending");        // 黒い画面（プロローグと同じ）
const showStage = () => swapTo("tpl-ending-stage");   // マップ画面（セリフ枠つき）

// ===== セリフの流し方 =====
// 黒い画面の真ん中に文字を流す（プロローグと同じ表示）。読み終わるまで待つ
function plain(lines){
    return new Promise(resolve => showMessage(lines, resolve));
}

// セリフ枠の中に、名前欄つきで1行ずつ流す。「名前「セリフ」」の形から名前を分ける
function sayLines(lines){
    return (lines || []).reduce((p, line) => p.then(() => new Promise(resolve => {
        const m = line.match(/^(.+?)「([\s\S]*)」$/);
        const name = m ? m[1] : "主人公";
        const text = m ? m[2] : line;
        showMessage([text], resolve, name);
    })), Promise.resolve());
}

// エンド名の画面（黒い画面）。読み終わったらタイトルへ
async function endCard(title, saveKey){
    try { localStorage.setItem(saveKey, "1"); } catch (e) {}   // 回収したエンドを記録
    showBlack();
    await plain([title, ...(endingtext.endcard_help || [])]);
    location.href = "?page=title";
}

// ===== END A「遅かった」 =====
async function initending1(){
    await loadTexts();
    await plain(endingtext.rooftop_arrive || ["屋上についた"]);   // 黒い画面で「屋上についた」
    showStage();                                          // マップとセリフ枠に切り替え
    await sayLines(endingtext.rooftop_1);
    await sayLines(endingtext.rooftop_2);
    await sayLines(endingtext.endA_1);
    await sayLines(endingtext.endA_sorry);
    await sayLines(endingtext.endA_reply);
    await sayLines(endingtext.endA_announce1);
    await sayLines(endingtext.endA_plead);
    await sayLines(endingtext.endA_announce2);
    await endCard("END A　遅かった", "endingA");
}

// ===== END B「あの日の景色」 =====
async function initending2(){
    await loadTexts();
    await plain(endingtext.rooftop_arrive || ["屋上についた"]);
    showStage();
    await sayLines(endingtext.rooftop_1);
    await sayLines(endingtext.rooftop_2);
    await sayLines(endingtext.endB_1);
    await sayLines(endingtext.endB_cut);
    showBlack();                                          // 暗転して、最後の一言だけ黒い画面に出す
    await plain([strip((T.endB_last || [""])[0])]);
    await endCard("END B　あの日の景色", "endingB");
}