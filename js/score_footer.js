class ScoreFooterTab {

    static pianoViewer = new KeyboadSwitchViewer('score-preview-keyboad-can');

    constructor() {

    }

    static build() {

        setSelectTab('score-footer', 0);
        ScoreFooterTab.pianoViewer.init(1100, 106, 0, 0, 52, 3, 0.55, 0.6);

        ScoreFooterTab.pianoViewer.updateKeyboad();

        ScoreFooterTab.buildInputTab();
    }

    static buildInputTab() {

        const inputTabEl = document.getElementById('score-footer_cont-input');

        let soundListHtml = '';
        for(let i = 0; i < DEGREE12_FLAT_LIST.length; i ++) {
            const degreeName = DEGREE12_SHARP_LIST[i];
            const soundName = KEY12_SHARP_LIST[i];
            soundListHtml += `
                <div onclick="ScoreFooterTab.selectItem(this)">
                    <span>${degreeName}</span><span>${soundName}</span>
                </div>
            `;
        }
        
        let symbolListHtml = '';
        for(let i = 0; i < SYMBOL_PARAMS_LIST.length; i ++) {
            const json = SYMBOL_PARAMS_LIST[i];
            symbolListHtml += `
                <div onclick="ScoreFooterTab.selectItem(this)">
                    <span>[</span><span>${json.name}</span><span>]</span>
                </div>
            `;
        }
        
        
        let sustainListHtml = '';
        for(let i = 0; i < 8; i ++) {
            const sus = i + 1;
            sustainListHtml += `
                <div onclick="ScoreFooterTab.selectItem(this)">
                    <span>${sus}</span><span>/4</span>
                </div>
            `;
        }
        
        inputTabEl.innerHTML = `
            <div class="root-list">${soundListHtml}</div>
            <div class="symbol-list">${symbolListHtml}</div>
            <div class="sustain-list">${sustainListHtml}</div>
            <div class="addition"><span>addition element!</span></div>
        `;
    }

    static selectItem(obj) {
        const list = obj.parentNode.children;
        for(let i = 0; i < list.length; i ++) {
            const el = list[i];
            el.classList.remove('active');
        }
        obj.classList.add('active');
    }
}