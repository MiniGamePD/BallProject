class GameOverItem extends egret.DisplayObjectContainer
{
    private bgCover: FullScreenCover;

    //复活界面
    private reviveMenu: egret.DisplayObjectContainer;

    //结算界面
    private score: egret.DisplayObjectContainer;
    private historyHighScore: egret.DisplayObjectContainer;
    private coin: egret.DisplayObjectContainer;
    private moreCoin: egret.DisplayObjectContainer;
    private lottery: egret.DisplayObjectContainer;
    private gotoLobby: ShapeBgButton;

    //商店
    private shop: ShopView;

    public constructor(width: number, height: number)
    {
        super();
        this.bgCover = new FullScreenCover(0x000000, 0.8);
        this.bgCover.touchEnabled = true;

        this.CreateReviveMenu();

        this.CreateScore();
        this.CreateHistoryHighScore();
        this.CreateCoin();
        this.CreateMoreCoin();
        this.CreateLottery();
        this.CreateGotoLobby();
        this.CreateShop();
    }

    public Init()
    {
        GameMain.GetInstance().AddEventListener(GameOverEvent.EventName, this.OnGameOverEvent, this);
        GameMain.GetInstance().AddEventListener(ReviveEvent.EventName, this.Hide, this);
    }

    public Release()
    {
        GameMain.GetInstance().RemoveEventListener(GameOverEvent.EventName, this.OnGameOverEvent, this);
        GameMain.GetInstance().RemoveEventListener(ReviveEvent.EventName, this.Hide, this);
    }

    private CreateReviveMenu()
    {
        this.reviveMenu = new egret.DisplayObjectContainer();
        this.reviveMenu.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.reviveMenu.y = GameMain.GetInstance().GetStageHeight() / 2;

        var bg = new ShapeBgButton(ShapeBgType.RoundRect, 0xFFFFFF00, 6, 22, null, 600, 460, 0, 0, null, null);
        this.reviveMenu.addChild(bg);

        var title = new egret.TextField();
        title.text = "复活吗？";
        title.size = 60;
        title.width = 300;
        title.height = 60;
        title.textAlign = "center";
        title.anchorOffsetX = title.width / 2;
        title.anchorOffsetY = title.height / 2;
        title.x = 0;
        title.y = -160;
        this.reviveMenu.addChild(title);

        var reviveButton = new ShapeBgButton(ShapeBgType.RoundRect, 0x00FFFF00, 6, 22, "pd_res_json.ShareRevive", 570, 140,
            137, 100, this.OnClickShapeRevive, this);
        reviveButton.y = -20;
        this.reviveMenu.addChild(reviveButton);

        var giveUpButton = new ShapeBgButton(ShapeBgType.RoundRect, 0xFF930000, 6, 22, "pd_res_json.GameOver", 570, 140,
            137, 100, this.OnClickGiveup, this);
        giveUpButton.y = 140;
        this.reviveMenu.addChild(giveUpButton);
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
        var coinIcon = (<IResModule>GameMain.GetInstance().GetModule(ModuleType.RES)).CreateBitmapByName("pd_res_json.Coin");
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

        var bgButton = new ShapeBgButton(ShapeBgType.RoundRect, 0xFFFFFF00, 6, 16, null, 560, 130, 0, 0, this.OnClickMoreCoin, this);
        this.moreCoin.addChild(bgButton);

        var moreCoinText = new egret.TextField();
        moreCoinText.x = -246;
        moreCoinText.y = -10;
        moreCoinText.size = 30;
        moreCoinText.textAlign = "left";
        moreCoinText.verticalAlign = "center";
        moreCoinText.text = "挺好玩的，分享一波";
        this.moreCoin.addChild(moreCoinText);

        var moreCoinIcon = (<IResModule>GameMain.GetInstance().GetModule(ModuleType.RES)).CreateBitmapByName("pd_res_json.Share");
        moreCoinIcon.x = 206;
        moreCoinIcon.width = 60;
        moreCoinIcon.width = 49;
        moreCoinIcon.anchorOffsetX = moreCoinIcon.width / 2;
        moreCoinIcon.anchorOffsetY = moreCoinIcon.height / 2;
        this.moreCoin.addChild(moreCoinIcon);

        this.moreCoin.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.moreCoin.y = 460;
    }

    private CreateLottery()
    {
        this.lottery = new egret.DisplayObjectContainer();

        var bgButton = new ShapeBgButton(ShapeBgType.RoundRect, 0xFFFFFF00, 6, 16, null, 560, 130, 0, 0, this.OnClickLottery, this);
        this.lottery.addChild(bgButton);

        var lotteryText = new egret.TextField();
        lotteryText.x = -246;
        lotteryText.y = -10;
        lotteryText.size = 30;
        lotteryText.textAlign = "left";
        lotteryText.verticalAlign = "center";
        lotteryText.text = "兔女郎的弹珠商店";
        this.lottery.addChild(lotteryText);

        var lotteryIcon = (<IResModule>GameMain.GetInstance().GetModule(ModuleType.RES)).CreateBitmapByName("pd_res_json.Coin");
        lotteryIcon.x = 166;
        lotteryIcon.y = 5;
        lotteryIcon.width = 40;
        lotteryIcon.height = 40;
        lotteryIcon.anchorOffsetX = lotteryIcon.width / 2;
        lotteryIcon.anchorOffsetY = lotteryIcon.height / 2;
        this.lottery.addChild(lotteryIcon);

        var costText = new egret.TextField();
        costText.x = 195;
        costText.y = -10;
        costText.size = 30;
        costText.textAlign = "left";
        costText.verticalAlign = "center";
        costText.text = "100";
        this.lottery.addChild(costText);

        this.lottery.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.lottery.y = 610;
    }

    private CreateGotoLobby()
    {
        this.gotoLobby = new ShapeBgButton(ShapeBgType.RoundRect, 0xEF004800, 6, 16, "pd_res_json.Home", 560, 130, 70, 62,
            this.OnClickBackToLobby, this);

        this.gotoLobby.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.gotoLobby.y = 800;
    }

    private CreateShop()
    {
        this.shop = new ShopView();
        this.shop.Init(this.OnCloseShop, this);
    }

    private OnCloseShop(callbackobj: any)
    {
        callbackobj.removeChild(callbackobj.shop);
    }

    public ShowGameOverMenu()
    {
        this.Hide();

        this.addChild(this.bgCover);
        this.addChild(this.score);
        this.addChild(this.historyHighScore);
        this.addChild(this.coin);
        this.addChild(this.moreCoin);
        this.addChild(this.lottery);
        this.addChild(this.gotoLobby);

        //保存一下
        var playerdata = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
        playerdata.Save();
    }

    public ShowReviveMenu()
    {
        this.addChild(this.bgCover);
        this.addChild(this.reviveMenu);

        var soundEvent: PlaySoundEvent = new PlaySoundEvent("GameOver_mp3", 1);
        GameMain.GetInstance().DispatchEvent(soundEvent);
    }

    public Hide()
    {
        this.removeChildren();
    }

    private OnClickMoreCoin()
    {
        GameMain.GetInstance().ShareAppMsg();
    }

    private OnClickLottery(callbackobj: any)
    {
        callbackobj.addChild(callbackobj.shop);
    }

    private OnClickBackToLobby(): void
    {
        if (DEBUG)
        {
            egret.log("OnClickBackToLobby");
        }
        GameMain.GetInstance().SwitchGameState(GameStateType.Lobby);
    }

    private OnClickPlayAgain(): void
    {
        if (DEBUG)
        {
            egret.log("OnClickPlayAgain");
        }

        let event = new ReplayGameEvent();
        GameMain.GetInstance().DispatchEvent(event);
    }

    private OnClickGiveup(callbackObj: any)
    {
        callbackObj.ShowGameOverMenu();
    }

    private OnClickShapeRevive(): void
    {
        if (DEBUG)
        {
            egret.log("OnClickShapeRevive");
        }

        GameMain.GetInstance().ShareAppMsgRevive();

        GameMain.GetInstance().hasRevive = true;

        var event = new ReviveEvent();
        GameMain.GetInstance().DispatchEvent(event);
    }

    public OnGameOverEvent()
    {
        var timer = new egret.Timer(1000, 1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.OnReallyGameOverEvent, this);
        timer.start();
    }

    private OnReallyGameOverEvent()
    {
        var result = Tools.IsTimeExpired(2018, 6, 22, 18, 0); // 是否超过了指定的时间
        if (result && GameMain.GetInstance().hasRevive == false)
        {
            this.ShowReviveMenu();
        }
        else
        {
            this.ShowGameOverMenu()
        }
    }
}