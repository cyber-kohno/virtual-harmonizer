class KeyboadSwitchViewer {

    constructor(viewSpaceId) {
        this.SCREEN_WIDTH = 700;
        this.SCREEN_HEIGHT = 145;
        this.MARGIN_SIDE = 10;
        this.MARGIN_LENGTH = 5;
        this.KEY_NUM = 23;
        this.MARGIN_KEY = 3;
        this.KEY_INTERVAL = (this.SCREEN_WIDTH - this.MARGIN_SIDE * 2 + this.MARGIN_KEY) / this.KEY_NUM;
        // this.KEY_INTERVAL = 30;
        this.KEY_HEIGHT = this.SCREEN_HEIGHT - this.MARGIN_LENGTH * 2;
        this.KEY_WIDTH = this.KEY_INTERVAL - this.MARGIN_KEY;
        this.BLACK_HEIGHT = this.KEY_HEIGHT * 0.55;
        this.BLACK_WIDTH = this.KEY_WIDTH * 0.6;
        this.viewSpaceId = viewSpaceId;

        this.table = [];
        for (let i = 0; i < 88; i++) {
            this.table.push({
                down: 0,
                sus: false
            });
        }
    }

    downKeys(orgs, side) {
        for (let i = 0; i < orgs.length; i++) {
            const key = this.table[orgs[i]];
            key.down = side;
            key.sus = true;
        }
        this.updateKeyboad();
    }

    releaseKeys(orgs) {
        for (let i = 0; i < orgs.length; i++) {
            const key = this.table[orgs[i]];
            key.down = 0;
        }
        this.updateKeyboad();
    }

    releaseAllKeys() {
        for (let i = 0; i < this.table.length; i++) {
            const key = this.table[i];
            key.down = 0;
        }
        this.updateKeyboad();
    }

    resetSustain(orgs) {
        for (let i = 0; i < orgs.length; i++) {
            const key = this.table[orgs[i]];
            key.sus = false;
        }
        this.updateKeyboad();
    }

    init(scrennWidth, screenHeight, marginSide, marginLength, keyNum, marginKey, blackKeyRateWidth, blackKeyRateHeight) {
        this.SCREEN_WIDTH = scrennWidth;
        this.SCREEN_HEIGHT = screenHeight;
        this.MARGIN_SIDE = marginSide;
        this.MARGIN_LENGTH = marginLength;
        this.KEY_NUM = keyNum;
        this.MARGIN_KEY = marginKey;
        this.KEY_INTERVAL = (this.SCREEN_WIDTH - this.MARGIN_SIDE * 2 + this.MARGIN_KEY) / this.KEY_NUM;
        // this.KEY_INTERVAL = 30;
        this.KEY_HEIGHT = this.SCREEN_HEIGHT - this.MARGIN_LENGTH * 2;
        this.KEY_WIDTH = this.KEY_INTERVAL - this.MARGIN_KEY;
        this.BLACK_HEIGHT = this.KEY_HEIGHT * blackKeyRateHeight;
        this.BLACK_WIDTH = this.KEY_WIDTH * blackKeyRateWidth;
    }

    updateKeyboad() {

        const canvas = document.getElementById(this.viewSpaceId);
        const ctx = canvas.getContext('2d');

        canvas.width = this.SCREEN_WIDTH;
        canvas.height = this.SCREEN_HEIGHT;

        // ctx.fillStyle = '#000044';
        // ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        this.drawKey(ctx);
    }

    drawKey(ctx) {

        // 白鍵
        for (let i = 0; i < this.KEY_NUM; i++) {
            const X = this.MARGIN_SIDE + this.KEY_INTERVAL * i;

            let whiteKeyColor = '#fff';
            const index = comvertWIndex(i);
            if (index != -1 && this.table[index].sus) {
                whiteKeyColor = '#ffd';
                const val = this.table[index].down;
                if (val) {
                    whiteKeyColor = val == 1 ? '#f85' : '#fc0';
                }
            }
            // if (index != -1) {
            //     const val = this.table[index].down;
            //     if (val != 0) {
            //         whiteKeyColor = val == 1 ? '#f85' : '#fc0';
            //     }
            // }

            setColor(ctx, whiteKeyColor);
            this.drawsq(ctx, X, this.MARGIN_LENGTH, this.KEY_WIDTH, this.KEY_HEIGHT, 0, 3);

            const SHADE_HEIGHT = this.KEY_HEIGHT / 11;
            {
                const SHADE_Y = this.MARGIN_LENGTH + this.KEY_HEIGHT - SHADE_HEIGHT - 10;
                const gradColor = ctx.createLinearGradient(X, SHADE_Y, X, this.MARGIN_LENGTH + this.KEY_HEIGHT);
                gradColor.addColorStop(0, 'rgba(0,0,0,0.5)');
                gradColor.addColorStop(1, 'rgba(0,0,0,0)');
                setColor(ctx, gradColor);
                this.drawsq(ctx, X, SHADE_Y, this.KEY_WIDTH, SHADE_HEIGHT + 10, 0, 3);
            }
            setColor(ctx, whiteKeyColor);
            this.drawsq(ctx, X, this.MARGIN_LENGTH, this.KEY_WIDTH, this.KEY_HEIGHT - SHADE_HEIGHT, 0, 5);

            {
                const gradColor = ctx.createLinearGradient(X, this.MARGIN_LENGTH, X, this.MARGIN_LENGTH + this.KEY_HEIGHT / 2);
                gradColor.addColorStop(0, 'rgba(0,0,0,0.4)');
                gradColor.addColorStop(1, 'rgba(0,0,0,0)');
                setColor(ctx, gradColor);
                this.drawsq(ctx, X, this.MARGIN_LENGTH, this.KEY_WIDTH, this.KEY_HEIGHT / 2, 0, 0);
            }
        }

        // 赤線
        {
            const gradColor = ctx.createLinearGradient(this.MARGIN_SIDE,
                this.MARGIN_LENGTH, this.MARGIN_SIDE, this.MARGIN_LENGTH + 5);
            gradColor.addColorStop(0, '#500');
            gradColor.addColorStop(1, '#c00');
            gradColor.addColorStop(0, '#500');
            // gradColor.addColorStop(2, '#500');
            setColor(ctx, gradColor);
            this.drawsq(ctx, this.MARGIN_SIDE, this.MARGIN_LENGTH, this.SCREEN_WIDTH - this.MARGIN_SIDE * 2, 5, 0, 0);
        }

        // 黒鍵
        for (let i = 0; i < this.KEY_NUM; i++) {
            const X = this.MARGIN_SIDE + this.KEY_INTERVAL * i;

            if (i == this.KEY_NUM - 1) break;

            let blackKeyColor = '#222';
            const index = this.comvertBIndex(i);
            if (index != -1 && this.table[index].sus) {
                blackKeyColor = '#775';
                const val = this.table[index].down;
                if (val) {
                    blackKeyColor = val == 1 ? '#f80' : '#fc0';
                }
            }
            // if (index != -1) {
            //     const val = this.table[index].down;
            //     if (val != 0) {
            //         blackKeyColor = val == 1 ? '#f80' : '#fc0';
            //     }
            // }

            switch (i % 7) {
                case 0:
                case 2:
                case 3:
                case 5:
                case 6:
                    const BT = this.MARGIN_LENGTH + 7;
                    const BX = X + this.KEY_WIDTH + this.MARGIN_KEY / 2 - this.BLACK_WIDTH / 2;

                    setColor(ctx, blackKeyColor);
                    this.drawsq(ctx, BX, BT, this.BLACK_WIDTH, this.BLACK_HEIGHT, 0, 0);

                    const BLACK_BOTTOM = BT + this.BLACK_HEIGHT;
                    const SIDE = 2;
                    const BX2 = BX + SIDE;
                    const W2 = this.BLACK_WIDTH - SIDE * 2;
                    const BLACK_FRONT = this.BLACK_HEIGHT / 6;

                    // 黒鍵の陰（上）
                    {
                        setColor(ctx, blackKeyColor);
                        this.drawsq(ctx, BX2, this.MARGIN_LENGTH + 2, W2, this.BLACK_HEIGHT - 16, 8, 8);

                        const gradColor = ctx.createLinearGradient(BX2, this.MARGIN_LENGTH + 2, BX2, BLACK_BOTTOM - 16);
                        gradColor.addColorStop(0, 'rgba(244,244,244,0)');
                        gradColor.addColorStop(1, 'rgba(244,244,244,0.5)');
                        setColor(ctx, gradColor);
                        this.drawsq(ctx, BX2, this.MARGIN_LENGTH + 2, W2, this.BLACK_HEIGHT - BLACK_FRONT, 8, 8);
                    }

                    // 黒鍵の陰（下）
                    {
                        const gradColor = ctx.createLinearGradient(BX2, BLACK_BOTTOM - (BLACK_FRONT + 2), BX2, BLACK_BOTTOM);
                        gradColor.addColorStop(0, 'rgba(244,244,244,0)');
                        gradColor.addColorStop(1, 'rgba(244,244,244,0.5)');
                        setColor(ctx, gradColor);
                        this.drawsq(ctx, BX2, BLACK_BOTTOM - (BLACK_FRONT + 2), W2, BLACK_FRONT, 7, 0);
                    }

                    // 白鍵に映る陰
                    {
                        const gradColor = ctx.createLinearGradient(BX, BLACK_BOTTOM, BX, BLACK_BOTTOM + 20);
                        gradColor.addColorStop(0, 'rgba(0,0,0,0.2)');
                        gradColor.addColorStop(1, 'rgba(0,0,0,0)');
                        setColor(ctx, gradColor);
                        this.drawsq(ctx, BX, BLACK_BOTTOM, this.BLACK_WIDTH, 20, 0, 10);
                    }
                    break;
            }
        }
    }

    drawsq(context, x, y, w, h, r1, r2) {
        context.beginPath();
        context.lineWidth = 1;
        // context.strokeStyle = color;
        // context.fillStyle = color;
        context.moveTo(x, y + r1);  //←①
        context.arc(x + r2, y + h - r2, r2, Math.PI, Math.PI * 0.5, true);  //←②
        context.arc(x + w - r2, y + h - r2, r2, Math.PI * 0.5, 0, 1);  //←③
        context.arc(x + w - r1, y + r1, r1, 0, Math.PI * 1.5, 1);  //←④
        context.arc(x + r1, y + r1, r1, Math.PI * 1.5, Math.PI, 1);  //←⑤
        context.closePath();  //←⑥
        context.stroke();  //←⑦
        context.fill();  //←⑧
    }

    setColor(context, color) {
        context.strokeStyle = color;
        context.fillStyle = color;
    }

    comvertWIndex(keyIndex) {
        let val = parseInt(keyIndex / 7) * 12;
        const pat = keyIndex % 7;
        switch (pat) {
            case 0:
                return pat + val;
            case 1:
            case 2:
                return pat + val + 1;
            case 3:
                return pat + val + 2;
            case 4:
            case 5:
                return pat + val + 3;
            case 6:
                return pat + val + 4;
        }
    }


    comvertBIndex(keyIndex) {
        let val = parseInt(keyIndex / 7) * 12;
        const pat = keyIndex % 7;
        switch (pat) {
            case 0:
                return pat + val + 1;
            case 2:
                return pat + val + 2;
            case 3:
                return pat + val + 3;
            case 5:
                return pat + val + 4;
            case 6:
                return pat + val + 5;
        }
        return -1;
    }

}