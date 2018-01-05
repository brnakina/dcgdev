/*
カトさんへ

_mouseupメソッドで、emitするメソッドが呼んであります。

場に出す: _draw,
相手のリーダーを攻撃する: _attackFace,
相手のフォロワーを攻撃する: _attack,
ターン終了: _finishTurn
これらのメソッドで通信して、帰ってきたbattleを_refreshメソッドに渡すと、_battleが更新されて、canvasを再描画します。

最初のデータ取得は_initメソッドで、battleを取得するように変更してください。

BY 牧
*/

var Main = (function() {
    var

    // これ使わないけど、非同期読み込みせっかく書いたから残しておく
    _cardData = [
        { id: 0, path: 'img/card.jpeg', hp: 0, attack: 0, cost: 0 },
        { id: 1, path: 'img/c01.png', hp: 1, attack: 1, cost: 1 },
        { id: 2, path: 'img/c02.png', hp: 2, attack: 2, cost: 2 },
        { id: 3, path: 'img/c03.png', hp: 3, attack: 3, cost: 3 },
        { id: 4, path: 'img/c04.png', hp: 4, attack: 4, cost: 4 },
        { id: 5, path: 'img/c05.png', hp: 5, attack: 5, cost: 5 },
        { id: 6, path: 'img/c06.png', hp: 6, attack: 6, cost: 6 },
        { id: 7, path: 'img/c07.png', hp: 7, attack: 7, cost: 7 },
        { id: 8, path: 'img/c08.png', hp: 8, attack: 8, cost: 8 },
        { id: 9, path: 'img/c09.png', hp: 9, attack: 9, cost: 9 },
        { id: 10, path: 'img/c10.png', hp: 10, attack: 10, cost: 10 }
    ],

    _myCtx,

    _movingHand = null,     // 選択された手札
    _selectedField = null,  // 選択された場札
    _downFinish = false,

    _battle, // 宣言だけしておく

    _init = function(battle) {
        _battle = battle;
        _myCtx = $('#my_canvas')[0].getContext('2d');
        _attachEvents();
        _drawMyCanvas();
    },

    // イベントハンドラを定義する
    _attachEvents = function() {
        $('#my_canvas').mousedown(_mousedown);

        $('#my_canvas').mouseup(_mouseup);

        $('#my_canvas').mousemove(_mousemove);

        $('#my_canvas').mouseout(_mouseout);
    },

    _getCursorPos = function(e) {
        return {
            x: e.clientX,
            y: e.clientY
        };
    },

    // 現在自分のターンか調べる(自分のターンでないときは操作させないs)
    _isMyTurn = function() {
        if(_battle.initiative && _battle.initiativeUserId === _battle.mine.userId) {// 現在先攻で自分が先行 -> 現在自分のターン
            return true;
        } else if(!_battle.initiative && _battle.initiativeUserId === _battle.opp.userId) {// 現在後攻で相手が先攻 -> 現在自分のターン
            return true;
        } else {
            return false;
        }
    },

    _mousedown = function(e) {
        var pos = _getCursorPos(e); // カーソルの座標を取得

        if(!_isMyTurn()) { return; } // 自分のターンでない

        _movingHand = null;
        _selectedField = null;
        _downFinish = false;
        _inMyHands(_myCtx, _battle.mine.hands, _battle.mine.fields, pos);
        _drawMyCanvas();
    },

    _mousemove = function(e) {
        var pos = _getCursorPos(e);

        if(!_isMyTurn()) { return; } // 自分のターンでない

        if(_movingHand) {// 手札を動かしている
            pos = _getCursorPos(e);
            _movingHand.x = pos.x + _movingHand.diffX;
            _movingHand.y = pos.y + _movingHand.diffY;
            _drawMyCanvas();
        } else if(_selectedField) {
            _selectedField.to.x = pos.x;
            _selectedField.to.y = pos.y;
            _drawMyCanvas();
        }
    },

    _mouseup = function(e) {
        var ret,
            pos = _getCursorPos(e); // カーソルの座標を取得

        if(!_isMyTurn()) { return; } // 自分のターンでない

        if(_movingHand) {// 手札を動かしている
            if(_movingHand.y <= 220) {// 場に出す
                console.log('play');
                _play(_movingHand.card);
                console.log('playはクライアント側で仮実装してある。');
            }
        } else if(_selectedField) {
            ret = _checkAttack(_myCtx);
            if(ret.type === 'face') {
                console.log('attackFace');
                _attackFace(_selectedField.card);
                console.log('attackFaceはクライアント側で仮実装してある。');
            } else if(ret.type === 'field') {
                console.log('attack');
                _attack(_selectedField.card, ret.field.card);
                console.log('attackはクライアント側で仮実装してある。');
            }
        } else if(_downFinish) {
            if(_posInFinish(pos)) {
                 console.log('finishTurn');
                _finishTurn();
            }
        }
        _movingHand = null;
        _selectedField = null;
        _downFinish = false;
        _drawMyCanvas();

    },

    _mouseout = function() {
        if(!_isMyTurn()) { return; } // 自分のターンでない

        _movingHand = null;
        _selectedField = null;
        _downFinish = false;
        _drawMyCanvas();
    },

    _finishTurn = function() {

    },

    // サーバーからbattleを取得したら、このメソッドを呼んでください!!
    _refresh = function(battle) {
        _battle = battle;
        _drawMyCanvas();
    },

    // 手札から場にカードが出た時に呼ばれる(websocketだが現在はクライアント側で仮実装)
    _play = function(card) {
        // 削除する配列の要素のインデックスを取得
        var index = _battle.mine.hands.findIndex(function(elm) {
                return elm.card === card;
            }),
            spliced;

        // 配列から削除する
        if(index >= 0) {
            spliced = _battle.mine.hands.splice(index, 1);
            // 場札に追加
            _battle.mine.fields.push(spliced[0]);
            _battle.mine.fields[_battle.mine.fields.length - 1].state = 0;
            var tmpCard = _battle.mine.fields[_battle.mine.fields.length - 1].card;
            var hp = tmpCard.hp;
            tmpCard.hp = { current: hp, max: hp };
            // PPを減らす
            _battle.pp.current -= spliced[0].card.cost;
        }
    },

    // 攻撃したか(攻撃したなら対象を返す。)
    _checkAttack = function(ctx) {

        var pos = _selectedField.to,
            oppField = null;

        // 相手リーダーを攻撃したか調べる
        var frameRect = {
                width: ctx.canvas.width / 6,
                height: ctx.canvas.height / 6,
            },
            hpPos = {},
            marginHeight = ctx.canvas.height / 36;

        // 枠を描画
        frameRect.x = (ctx.canvas.width - frameRect.width) / 2;
        frameRect.y = marginHeight;

        // 相手リーダーを攻撃した
        if(_posInRect(pos, frameRect)) {
            return {
                type: 'face'
            };
        }

        // 相手フォロワーを攻撃したか調べる

        var marginRight = ctx.canvas.width / 18,
            marginHeight = ctx.canvas.height / 36,
            cardGap = 5,
            cardWidth = 50,
            cardHeight = 66,
            handPaddingLeft = -2,
            handPaddingTop = -2, cardPos = {};
        var fields = _battle.opp.fields;

        cardPos.x = ctx.canvas.width / 2 - (fields.length * cardWidth / 2 + (fields.length - 1) * cardGap / 2);
        cardPos.y = ctx.canvas.height - marginHeight - cardHeight - 80;
        cardPos.y = marginHeight + 100;

        fields.forEach(function(field, i) {
            var card = field.card,
                rect = {};
            rect.x = cardPos.x + (cardWidth + cardGap) * i;
            rect.y = cardPos.y;
            rect.width = cardWidth;
            rect.height = cardHeight;
            if(_posInRect(pos, rect)) {// ヒット
                oppField = field;
            }
        });

        if(oppField) {
            return {
                type: 'field',
                field: oppField
            };
        }

        return  { type: '' };
    },

    // 場札のカードが相手リーダーを攻撃した時に呼ばれる(websocketだが現在はクライアント側で仮実装)
    _attackFace = function(card) {
        // 相手のHPを減らす
        _battle.opp.hp.current -= card.attack;
        // stateを0にする(攻撃済みする)
        _battle.mine.fields[_selectedField.index].state = 0;
    },

    _attack = function(card, attackedCard) {
        var attackId, attackedId;

        attackId = _battle.mine.fields.findIndex(function(elm) {
            return elm.card === card;
        });

        attackedId = _battle.opp.fields.findIndex(function(elm) {
            return elm.card === attackedCard;
        });

        // 相手フォロワーのHPを減算する();
        decrementHp(_battle.opp.fields, attackedId, card.attack);

        // 攻撃したフォロワーのHPを減算する
        decrementHp(_battle.mine.fields, attackId, attackedCard.attack);

        function decrementHp(fields, index, attacked) {
            fields[index].card.hp.current -= attacked;
            if(fields[index].card.hp.current <= 0) {// HPが0以下になった
                fields.splice(index, 1);
            }
        }
    },

    // 座標が手札の矩形内に含まれるか調べる
    _inMyHands = function(ctx, hands, fields, pos) {
        var marginRight = ctx.canvas.width / 18,
            marginHeight = ctx.canvas.height / 36,
            cardGap = 5,
            cardWidth = 50,
            cardHeight = 66,
            cardPos = {};

        cardPos.x = ctx.canvas.width - (hands.length * cardWidth + (hands.length - 1) * cardGap + marginRight);
        cardPos.y = ctx.canvas.height - marginHeight - cardHeight;

        // 手札にヒットするか調べる
        hands.forEach(function(hand, i) {
            var card = hand.card,
                rect = {};
            rect.x = cardPos.x + (cardWidth + cardGap) * i;
            rect.y = cardPos.y;
            rect.width = cardWidth;
            rect.height = cardHeight;

            if(_posInRect(pos, rect) && card.cost <= _battle.pp.current) {// ヒット且つPP以内のカードである
                _movingHand = {
                    card: card,
                    index: i,
                    x: rect.x,
                    y: rect.y,
                    diffX: rect.x - pos.x,
                    diffY: rect.y - pos.y
                };
            }
        });

        if(_movingHand) { return; }

        // 場札にヒットするか調べる

        cardPos.x = ctx.canvas.width / 2 - (fields.length * cardWidth / 2 + (fields.length - 1) * cardGap / 2);
        cardPos.y = ctx.canvas.height - marginHeight - cardHeight - 80;

        fields.forEach(function(field, i) {
            var card = field.card,
                rect = {};
            rect.x = cardPos.x + (cardWidth + cardGap) * i;
            rect.y = cardPos.y;
            rect.width = cardWidth;
            rect.height = cardHeight;
            if(_posInRect(pos, rect) && field.state) {// ヒット且つ行動可能
                _selectedField = {
                    card: card,
                    index: i,
                    from: {
                        x: rect.x + rect.width / 2,
                        y: rect.y + rect.height / 2
                    },
                    to: {
                        x: rect.x + rect.width / 2,
                        y: rect.y + rect.height / 2
                    }
                };
            }
        });

        // ターン終了にヒットするか調べる
        if(_posInFinish(pos)) {
            _downFinish = true;
        }
    },

    _posInFinish = function(pos) {
        var rect = { x:520, y: 100, width: 110, height: 80 };
        return _posInRect(pos, rect);
    },

    // 点が矩形内にあるか調べる
    _posInRect = function(pos, rect) {
        if(rect.x <= pos.x && pos.x <= rect.x + rect.width
        && rect.y <= pos.y && pos.y <= rect.y + rect.height) {
            return true;
        } else {
            return false;
        }
    },

    _initDeck = function() {
        var ret = [],
            i, j;
        for(i = 0; i < 10; i += 1) {
            for(j = 0; j < 3; j += 1) {
                ret.push(i + 1);
            }
        }
        return ret;
    },

    _initCardData = function() {
        return Promise.all(
            _cardData.reduce(function(p, c, i) {
                p.push(_loadImage(c.path));
                return p;
            }, [])
        ).then(function(imgData) {
            imgData.forEach(function(img, i) {
                _cardData[i].image = img;
            });
        });
    },

    // カードの画像データをロードする
    _loadImage = function(path) {
        return new Promise((resolve, reject) => {
            var image = new Image();
            image.onload = function() {
                resolve(image);
            };
            image.src = path;
        });
    },

    // n枚引く(デッキの先頭からカードを引く)
    _draw = function(cnt, deck) {
        var ret = [],
            i, shifted;
        for(i = 0; i < cnt; i += 1) {
            shifted = deck.shift();
            if(typeof shifted !== 'undefined') {
                ret.push(shifted);
            }
        }
        return ret;
    },

    _drawMyCanvas = function() {

        _myCtx.beginPath();
        // 背景を描画
        _drawBackground(_myCtx, '#ffe4e1');

        _drawPp(_myCtx, _battle.pp);

        _drawTurnFinish(_myCtx);

        // 自分のHPを描画
        _drawHp(_myCtx, 'mine', _battle.mine.hp.current);

        // 相手のHPを描画
        _drawHp(_myCtx, 'opp', _battle.opp.hp.current);

        // 自分の手札を描画
        _drawHands(_myCtx, 'mine', _battle.mine.hands);

        // 相手の手札を描画
        _drawHands(_myCtx, 'opp', _battle.opp.hands);

        // 自分の場札を描画
        _drawFields(_myCtx, 'mine', _battle.mine.fields);

        // 相手の場札を描画
        _drawFields(_myCtx, 'opp', _battle.opp.fields);

        if(_selectedField) {
            _drawArrows(_myCtx, 'red', _selectedField.from.x, _selectedField.from.y,
                _selectedField.to.x, _selectedField.to.y, [0, 5, -20, 5, -20, 15]) ;
        }
    },

    // PP描画
    _drawPp = function(ctx, pp) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.font = "18px 'ＭＳ Ｐゴシック'";
        ctx.fillText('PP', ctx.canvas.width - 60, ctx.canvas.height / 2 + 50);
        ctx.fillText(pp.current + '/' + pp.max, ctx.canvas.width - 60, ctx.canvas.height / 2 + 80);
    },

    // ターン終了を描画
    _drawTurnFinish = function(ctx) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.font = "18px 'ＭＳ Ｐゴシック'";
        ctx.fillText('turn finish', ctx.canvas.width - 60, ctx.canvas.height / 2 - 40);

        ctx.strokeStyle = 'black';
        ctx.strokeRect(520, 100, 110, 80);
    },

    _drawBackground = function(ctx, color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    },

    _drawHp = function(ctx, type, hp) {

        var frameRect = {
                width: ctx.canvas.width / 6,
                height: ctx.canvas.height / 6,
            },
            hpPos = {},
            marginHeight = ctx.canvas.height / 36;

        // 枠を描画
        frameRect.x = (ctx.canvas.width - frameRect.width) / 2;
        if(type === 'mine') {
            frameRect.y = ctx.canvas.height - frameRect.height - marginHeight;
        } else {
            frameRect.y = marginHeight;
        }
        ctx.strokeStyle = 'black';
        ctx.rect(frameRect.x, frameRect.y, frameRect.width, frameRect.height);
        ctx.stroke();

        // HPを描画
        hpPos.x = ctx.canvas.width / 2;
        if(type === 'mine') {
            hpPos.y = ctx.canvas.height - frameRect.height - marginHeight + frameRect.height / 2;
        } else {
            hpPos.y = marginHeight + frameRect.height / 2;
        }
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.font = "30px 'ＭＳ Ｐゴシック'";
        ctx.fillText(hp, hpPos.x, hpPos.y);
    },

    // 手札を表示
    _drawHands = function(ctx, type, hands) {
        var marginRight = ctx.canvas.width / 18,
            marginHeight = ctx.canvas.height / 36,
            cardGap = 5,
            cardWidth = 50,
            cardHeight = 66,
            handPaddingLeft = -2,
            handPaddingTop = -2,
            cardPos = {};

        cardPos.x = ctx.canvas.width - (hands.length * cardWidth + (hands.length - 1) * cardGap + marginRight);
        if(type === 'mine') {
            cardPos.y = ctx.canvas.height - marginHeight - cardHeight;
        } else {
            cardPos.y = marginHeight;
        }

        hands.forEach(function(hand, i) {
            var card = hand.card,
                handPos = {},
                image;
            if(type === 'mine' && _movingHand && i === _movingHand.index) {
                return;
            }
            handPos.x = cardPos.x + (cardWidth + cardGap) * i;
            handPos.y = cardPos.y;
            ctx.strokeStyle = 'black';

            ctx.strokeRect(handPos.x, handPos.y, cardWidth, cardHeight);
            if(type === 'mine') {// 自分のカードはコスト、HP、攻撃力を表示する
                // コストを描画
                _drawParam(ctx, { x: handPos.x + handPaddingLeft,
                                  y: handPos.y + handPaddingTop, width: 20, height: 20 }, 'green', card.cost);

                // 攻撃力を描画
                _drawParam(ctx, { x: handPos.x + handPaddingLeft,
                                  y: handPos.y + handPaddingTop + 5 + 20, width: 20, height: 20 }, 'red', card.attack);

                // HPを描画
                _drawParam(ctx, { x: handPos.x + handPaddingLeft,
                                  y: handPos.y + handPaddingTop + 5 * 2 + 20 * 2, width: 20, height: 20 }, 'blue', card.hp);

            }
        });


        if(_movingHand) {
            handPos = { x: _movingHand.x, y: _movingHand.y };

            ctx.strokeStyle = 'gray';
            ctx.strokeRect(handPos.x, handPos.y, cardWidth, cardHeight);
            //ctx.drawImage(_movingHand.card.image, handPos.x, handPos.y, cardWidth, cardHeight);
            // コストを描画
            _drawParam(ctx, { x: handPos.x + handPaddingLeft,
                              y: handPos.y + handPaddingTop, width: 20, height: 20 }, 'green', _movingHand.card.cost);

            // 攻撃力を描画
            _drawParam(ctx, { x: handPos.x + handPaddingLeft,
                              y: handPos.y + handPaddingTop + 5 + 20, width: 20, height: 20 }, 'red', _movingHand.card.attack);

            // HPを描画
            _drawParam(ctx, { x: handPos.x + handPaddingLeft,
                              y: handPos.y + handPaddingTop + 5 * 2 + 20 * 2, width: 20, height: 20 }, 'blue', _movingHand.card.hp);


        }

    },

    _drawFields = function(ctx, type, fields) {
        var marginRight = ctx.canvas.width / 18,
            marginHeight = ctx.canvas.height / 36,
            cardGap = 5,
            cardWidth = 50,
            cardHeight = 66,
            handPaddingLeft = -2,
            handPaddingTop = -2,
            cardPos = {};

        cardPos.x = ctx.canvas.width / 2 - (fields.length * cardWidth / 2 + (fields.length - 1) * cardGap / 2);
        if(type === 'mine') {
            cardPos.y = ctx.canvas.height - marginHeight - cardHeight - 80;
        } else {
            cardPos.y = marginHeight + 100;
        }

        fields.forEach(function(field, i) {
            var card = field.card,
                handPos = {},
                image;
            handPos.x = cardPos.x + (cardWidth + cardGap) * i;
            handPos.y = cardPos.y;
            if(field.state) {// 行動可能
                ctx.strokeStyle = '#00ffff';
            } else {
                ctx.strokeStyle = 'black';
            }
            ctx.strokeRect(handPos.x, handPos.y, cardWidth, cardHeight);

            // 攻撃力を描画
            _drawParam(ctx, { x: handPos.x + handPaddingLeft,
                              y: handPos.y + handPaddingTop + 5 * 2 + 20 * 2, width: 20, height: 20 }, 'red', card.attack);

            // HPを描画
            _drawParam(ctx, { x: handPos.x + handPaddingLeft + cardWidth - 20 + 4,
                              y: handPos.y + handPaddingTop + 5 * 2 + 20 * 2, width: 20, height: 20 }, 'blue', card.hp.current);


        });
    },

    _drawArrows = function(ctx, color, startX, startY, endX, endY, controlPoints) {
        ctx.beginPath();
        ctx.fillStyle = color;
        var dx = endX - startX;
        var dy = endY - startY;
        var len = Math.sqrt(dx * dx + dy * dy);
        var sin = dy / len;
        var cos = dx / len;
        var a = [];
        a.push(0, 0);
        for (var i = 0; i < controlPoints.length; i += 2) {
            var x = controlPoints[i];
            var y = controlPoints[i + 1];
            a.push(x < 0 ? len + x : x, y);
        }
        a.push(len, 0);
        for (var i = controlPoints.length; i > 0; i -= 2) {
            var x = controlPoints[i - 2];
            var y = controlPoints[i - 1];
            a.push(x < 0 ? len + x : x, -y);
        }
        a.push(0, 0);
        for (var i = 0; i < a.length; i += 2) {
            var x = a[i] * cos - a[i + 1] * sin + startX;
            var y = a[i] * sin + a[i + 1] * cos + startY;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    },

    _drawParam = function(ctx, rect, color, param) {
        // 矩形塗りつぶし
        ctx.fillStyle = 'white';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

        // 矩形描画
        ctx.strokeStyle = color;
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

        // 数字描画
        ctx.fillStyle = "black";
        ctx.font = "16px 'ＭＳ Ｐゴシック'";
        ctx.fillText(param, rect.x + rect.width / 2, rect.y + rect.height / 2);
    };

    return {
        refresh: _refresh,
        init: _init
    };
}());