class GameOverItem extends egret.DisplayObjectContainer
{
    private bgCover:FullScreenCover;
    private gameoverTitle:egret.DisplayObjectContainer;
    private backToLobbyButton:egret.DisplayObjectContainer;
    private replayButton:egret.DisplayObjectContainer;
    private reviveButton:egret.DisplayObjectContainer;

    private score:egret.DisplayObjectContainer;
    private historyHighScore:egret.DisplayObjectContainer;
    private coin:egret.DisplayObjectContainer;
    private moreCoin:egret.DisplayObjectContainer;
    private lottery:egret.DisplayObjectContainer;
    private gotoLobby:ShapeBgButton;

    public constructor(width:number, height:number)
    {
        super();
        this.bgCover = new FullScreenCover(0x000000, 0.8);
        this.bgCover.touchEnabled = true;

        this.CreateScore();
        this.CreateHistoryHighScore();
        this.CreateCoin();
        this.CreateMoreCoin();
        this.CreateLottery();
        this.CreateGotoLobby();
    }

    private CreateScore()
    {
        this.score = new egret.DisplayObjectContainer();
        var scoreTitle = new egret.TextField();
        scoreTitle.size = 60;
        scoreTitle.width = 200;
        scoreTitle.height = 80;
        scoreTitle.textAlign = "left";
        scoreTitle.textColor = 0xFFCE00;
        scoreTitle.text = "得分";
        this.score.addChild(scoreTitle);

        var scoreNum = new egret.TextField();
        scoreNum.y = 80;
        scoreNum.size = 100;
        scoreNum.textAlign = "left";
        scoreNum.fontFamily = "Impact";
        scoreNum.text = "70";
        this.score.addChild(scoreNum);

        this.score.x = 100;
        this.score.y = 150;
    }


    private CreateHistoryHighScore()
    {
        this.historyHighScore = new egret.DisplayObjectContainer();
        var scoreTitle = new egret.TextField();
        scoreTitle.size = 40;
        scoreTitle.width = 100;
        scoreTitle.height = 60;
        scoreTitle.textAlign = "left";
        scoreTitle.textColor = 0xFFCE00;
        scoreTitle.text = "最高";
        this.historyHighScore.addChild(scoreTitle);

        var scoreNum = new egret.TextField();
        scoreNum.x = 100;
        scoreNum.size = 40;
        scoreNum.textAlign = "left";
        scoreNum.text = "100";
        this.historyHighScore.addChild(scoreNum);

        this.historyHighScore.x = 350;
        this.historyHighScore.y = 155;
    }

    private CreateCoin()
    {
        this.coin = new egret.DisplayObjectContainer();
        var coinIcon = (<IResModule>GameMain.GetInstance().GetModule(ModuleType.RES)).CreateBitmapByName("pd_res_json.FeverTime_xingxing");
        coinIcon.width = 40;
        coinIcon.height = 40;
        this.coin.addChild(coinIcon);

        var coinNum = new egret.TextField();
        coinNum.x = 60;
        coinNum.size = 40;
        coinNum.textAlign = "left";
        coinNum.text = "36";
        this.coin.addChild(coinNum);

        this.coin.x = 350;
        this.coin.y = 270;
    }

    private CreateMoreCoin()
    {
        this.moreCoin = new egret.DisplayObjectContainer();

        var bgButton = new ShapeBgButton(ShapeBgType.RoundRect, 0x212121FF, 0, 16, null, 560, 130, 0, 0, this.OnClickMoreCoin, this);
        this.moreCoin.addChild(bgButton);

        var moreCoinText = new egret.TextField();
        moreCoinText.x = -246;
        moreCoinText.y = -10;
        moreCoinText.size = 30;
        moreCoinText.textAlign = "left";
        moreCoinText.verticalAlign = "center";
        moreCoinText.text = "可以，这很好玩";
        this.moreCoin.addChild(moreCoinText);

        var moreCoinIcon = (<IResModule>GameMain.GetInstance().GetModule(ModuleType.RES)).CreateBitmapByName("pd_res_json.shangxiaxiao");
        moreCoinIcon.x = 206;
        moreCoinIcon.width = 80;
        moreCoinIcon.width = 80;
        moreCoinIcon.anchorOffsetX = moreCoinIcon.width / 2;
        moreCoinIcon.anchorOffsetY = moreCoinIcon.height / 2;
        this.moreCoin.addChild(moreCoinIcon);

        this.moreCoin.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.moreCoin.y = 460;
    }

    private CreateLottery()
    {
        this.lottery = new egret.DisplayObjectContainer();

        var bgButton = new ShapeBgButton(ShapeBgType.RoundRect, 0x212121FF, 0, 16, null, 560, 130, 0, 0, this.OnClickLottery, this);
        this.lottery.addChild(bgButton);

        var lotteryText = new egret.TextField();
        lotteryText.x = -246;
        lotteryText.y = -10;
        lotteryText.size = 30;
        lotteryText.textAlign = "left";
        lotteryText.verticalAlign = "center";
        lotteryText.text = "抽弹珠";
        this.lottery.addChild(lotteryText);

        var lotteryIcon = (<IResModule>GameMain.GetInstance().GetModule(ModuleType.RES)).CreateBitmapByName("pd_res_json.shangxiaxiao");
        lotteryIcon.x = 206;
        lotteryIcon.width = 80;
        lotteryIcon.width = 80;
        lotteryIcon.anchorOffsetX = lotteryIcon.width / 2;
        lotteryIcon.anchorOffsetY = lotteryIcon.height / 2;
        this.lottery.addChild(lotteryIcon);

        this.lottery.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.lottery.y = 610;
    }

    private CreateGotoLobby()
    {
        this.gotoLobby = new ShapeBgButton(ShapeBgType.RoundRect, 0xEF0048FF, 0, 16, "pd_res_json.xingxing1", 560, 130, 100, 100,
            this.OnClickBackToLobby, this);

        this.gotoLobby.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.gotoLobby.y = 800;
    }

    public Show()
    {
        this.addChild(this.bgCover);
        this.addChild(this.score);
        this.addChild(this.historyHighScore);
        this.addChild(this.coin);
        this.addChild(this.moreCoin);
        this.addChild(this.lottery);
        this.addChild(this.gotoLobby);

        var soundEvent: PlaySoundEvent = new PlaySoundEvent("GameOver_mp3", 1);
        GameMain.GetInstance().DispatchEvent(soundEvent);
    }

    public Hide()
    {
        this.removeChildren();
    }

    private OnClickMoreCoin()
    {

    }

    private OnClickLottery()
    {

    }

    private OnClickBackToLobby(): void
    {
        if(DEBUG)
        {
            egret.log("OnClickBackToLobby");
        }
        GameMain.GetInstance().SwitchGameState(GameStateType.Lobby);
    }

    private OnClickPlayAgain(): void
    {
        if(DEBUG)
        {
            egret.log("OnClickPlayAgain");
        }
       
        let event = new ReplayGameEvent();
        GameMain.GetInstance().DispatchEvent(event);
    }

    private OnClickRevive(): void
    {
        if(DEBUG)
        {
            egret.log("OnClickRevive");
        }

        var event = new ReviveEvent();
        GameMain.GetInstance().DispatchEvent(event);
    }
}