const SCREEN_WIDTH = 1800;
const SCREEN_HEIGHT = 170;
const MARGIN_SIDE = 10;
const MARGIN_LENGTH = 5;
const KEY_NUM = 52;
const MARGIN_KEY = 3;
const KEY_INTERVAL = (SCREEN_WIDTH - MARGIN_SIDE * 2 + MARGIN_KEY) / KEY_NUM;
// const KEY_INTERVAL = 30;
const KEY_HEIGHT = SCREEN_HEIGHT - MARGIN_LENGTH * 2;
const KEY_WIDTH = KEY_INTERVAL - MARGIN_KEY;
const BLACK_HEIGHT = KEY_HEIGHT * 0.55;
const BLACK_WIDTH = KEY_WIDTH * 0.6;

function drawKeyboad(orgs) {

    const canvas = document.getElementById('can');
    const ctx = canvas.getContext('2d');

    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;

    // ctx.fillStyle = '#000044';
    // ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    drawKey(ctx, orgs);
}

function drawKey(ctx, orgs) {
    console.log(orgs);

    // 白鍵
    for (let i = 0; i < KEY_NUM; i++) {
        const X = MARGIN_SIDE + KEY_INTERVAL * i;

        setColor(ctx, '#fff');
        drawsq(ctx, X, MARGIN_LENGTH, KEY_WIDTH, KEY_HEIGHT, 0, 3);

        const SHADE_HEIGHT = 15;
        {
            const SHADE_Y = MARGIN_LENGTH + KEY_HEIGHT - SHADE_HEIGHT - 10;
            const gradColor = ctx.createLinearGradient(X, SHADE_Y, X, MARGIN_LENGTH + KEY_HEIGHT);
            gradColor.addColorStop(0, 'rgba(0,0,0,0.5)');
            gradColor.addColorStop(1, 'rgba(0,0,0,0)');
            setColor(ctx, gradColor);
            drawsq(ctx, X, SHADE_Y, KEY_WIDTH, SHADE_HEIGHT + 10, 0, 3);
        }
        setColor(ctx, '#fff');
        drawsq(ctx, X, MARGIN_LENGTH, KEY_WIDTH, KEY_HEIGHT - SHADE_HEIGHT, 0, 5);

        {
            const gradColor = ctx.createLinearGradient(X, MARGIN_LENGTH, X, MARGIN_LENGTH + KEY_HEIGHT / 2);
            gradColor.addColorStop(0, 'rgba(0,0,0,0.4)');
            gradColor.addColorStop(1, 'rgba(0,0,0,0)');
            setColor(ctx, gradColor);
            drawsq(ctx, X, MARGIN_LENGTH, KEY_WIDTH, KEY_HEIGHT / 2, 0, 0);
        }

        // 印
        {
            const SZ = 20;
            const index = comvertWIndex(i);
            if (orgs.includes(index)) {
                console.log(i + '---' + index);
                setColor(ctx, '#00a');
                drawsq(ctx,
                    X + KEY_WIDTH / 2 - SZ / 2,
                    MARGIN_LENGTH + KEY_HEIGHT - KEY_WIDTH / 2 - SZ / 2 - SHADE_HEIGHT,
                    SZ, SZ, SZ / 2, SZ / 2
                );
            }
        }
    }

    // 赤線
    {
        const gradColor = ctx.createLinearGradient(MARGIN_SIDE, MARGIN_LENGTH, MARGIN_SIDE, MARGIN_LENGTH + 5);
        gradColor.addColorStop(0, '#500');
        gradColor.addColorStop(1, '#c00');
        gradColor.addColorStop(0, '#500');
        // gradColor.addColorStop(2, '#500');
        setColor(ctx, gradColor);
        drawsq(ctx, MARGIN_SIDE, MARGIN_LENGTH, SCREEN_WIDTH - MARGIN_SIDE * 2, 5, 0, 0);
    }

    // 黒鍵
    for (let i = 0; i < KEY_NUM; i++) {
        const X = MARGIN_SIDE + KEY_INTERVAL * i;

        if (i == KEY_NUM - 1) break;
        switch (i % 7) {
            case 0:
            case 2:
            case 3:
            case 5:
            case 6:
                const BT = MARGIN_LENGTH + 7;
                const BX = X + KEY_WIDTH + MARGIN_KEY / 2 - BLACK_WIDTH / 2;

                setColor(ctx, '#222222');
                drawsq(ctx, BX, BT, BLACK_WIDTH, BLACK_HEIGHT, 0, 0);

                const BLACK_BOTTOM = BT + BLACK_HEIGHT;
                const SIDE = 2;
                const BX2 = BX + SIDE;
                const W2 = BLACK_WIDTH - SIDE * 2;

                // 黒鍵の陰（上）
                {
                    setColor(ctx, 'rgba(44,44,44,1)');
                    drawsq(ctx, BX2, MARGIN_LENGTH + 2, W2, BLACK_HEIGHT - 16, 8, 8);

                    const gradColor = ctx.createLinearGradient(BX2, MARGIN_LENGTH + 2, BX2, BLACK_BOTTOM - 16);
                    gradColor.addColorStop(0, 'rgba(244,244,244,0)');
                    gradColor.addColorStop(1, 'rgba(244,244,244,0.5)');
                    setColor(ctx, gradColor);
                    drawsq(ctx, BX2, MARGIN_LENGTH + 2, W2, BLACK_HEIGHT - 16, 8, 8);
                }

                // 黒鍵の陰（下）
                {
                    const gradColor = ctx.createLinearGradient(BX2, BLACK_BOTTOM - 18, BX2, BLACK_BOTTOM);
                    gradColor.addColorStop(0, 'rgba(244,244,244,0)');
                    gradColor.addColorStop(1, 'rgba(244,244,244,0.5)');
                    setColor(ctx, gradColor);
                    drawsq(ctx, BX2, BLACK_BOTTOM - 18, W2, 16, 7, 0);
                }

                // 白鍵に映る陰
                {
                    const gradColor = ctx.createLinearGradient(BX, BLACK_BOTTOM, BX, BLACK_BOTTOM + 20);
                    gradColor.addColorStop(0, 'rgba(0,0,0,0.2)');
                    gradColor.addColorStop(1, 'rgba(0,0,0,0)');
                    setColor(ctx, gradColor);
                    drawsq(ctx, BX, BLACK_BOTTOM, BLACK_WIDTH, 20, 0, 10);
                }

                // 印
                {
                    const SZ = 12;
                    const index = comvertBIndex(i);
                    if (orgs.includes(index)) {
                        console.log(i + '---' + index);
                        setColor(ctx, '#00a');
                        drawsq(ctx,
                            BX2 + W2 / 2 - SZ / 2,
                            MARGIN_LENGTH + 2 + BLACK_HEIGHT - 16 - W2,
                            SZ, SZ, 7, 7
                        );
                    }
                }
                break;
        }
    }
}

function drawsq(context, x, y, w, h, r1, r2) {
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

function setColor(context, color) {
    context.strokeStyle = color;
    context.fillStyle = color;
}

function comvertWIndex(keyIndex) {
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


function comvertBIndex(keyIndex) {
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