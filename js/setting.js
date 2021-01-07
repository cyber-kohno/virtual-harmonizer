
function buildSettingTab() {

    const rootEl = document.getElementById('system_cont-setting');
    rootEl.innerHTML = `<input type="number" id="bpm"/>`;
    
    
    const bpmEl = document.getElementById('bpm');
    bpmEl.value = 100;
}

function getBPM() {
    const bpmEl = document.getElementById('bpm');
    const str = bpmEl.value;
    return Number(str);
}