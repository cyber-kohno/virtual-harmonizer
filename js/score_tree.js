class ScoreTree {

    static buildScoreTree() {
        ScoreTree.initScoreTreeCommandEvent();

        const params = {};
        const rootEl = ScoreTree.getScroeTreeEl();

        rootEl.innerHTML = `
        <div>
            <div class="root" onclick="selectScoreNode(this)">
                <span>SCORE-ROOT</span>
            </div>
            <div class="param">${JSON.stringify(params)}</div>
        </div>
    `;
    }


    static getScroeTreeEl() {
        return document.getElementById('score-tree');
    }

    static initScoreTreeCommandEvent() {
        const rootEl = document.getElementById('score-tree');

        rootEl.addEventListener('keydown', function (e) {
            // alert(`[${e.key}]`);
            switch (e.key) {
                case 'a':
                    ScoreTree.addChildChordNode();
                    break;
            }
        });
    }
}