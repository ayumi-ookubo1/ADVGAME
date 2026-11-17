async function initending1(){
    const lines = await loadText("ending1");
    showMessage(lines, ()=>{ location.href = "?page=title"; });
}

async function initending2(){
    const lines = await loadText("ending2");
    showMessage(lines, ()=>{ location.href = "?page=title"; });
}