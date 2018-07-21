class GameOverItem extends egret.DisplayObjectContainer
{
    private bgCover: FullScreenCover;

    //复活界面
    private reviveMenu: egret.DisplayObjectContainer;

    //结算界面
    private score: egret.DisplayObjectContainer;
    private historyHighScore: egret.DisplayObjectContainer;
    private coin: egret.DisplayObjectContainer;
    private addtionalCoin:egret.TextField;
    private moreCoin: egret.DisplayObjectContainer;
    private moreCoinText: egret.TextField;
    private moreCoinButton: ShapeBgButton;
    private moreCoinIcon:egret.Bitmap;
    private lottery: egret.DisplayObjectContainer;
    private gotoLobby: ShapeBgButton;
    private hintFinger:egret.Bitmap;

    //商店
    private shop: ShopView;

    public constructor(width: number, height: number)
    {
        super();
        this.bgCover = new FullScreenCover(0x000000, 0.9);
        this.bgCover.touchEnabled = true;

        this.CreateReviveMenu();

        // this.CreateScore();
        // this.CreateHistoryHighScore();
        // this.CreateCoin();
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

        var bg = new ShapeBgButton(ShapeBgType.RoundRect, 0xFFFFFF00, 6, 22, null, 
            600 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth, 460, 0, 0, null, null);
        this.reviveMenu.addChild(bg);

        var title = new egret.TextField();
        title.text = "失败了";
        title.size = 60;
        title.width = GameMain.GetInstance().GetStageWidth();
        title.height = 60;
        title.textAlign = "center";
        title.anchorOffsetX = title.width / 2;
        title.anchorOffsetY = title.height / 2;
        title.x = 0;
        title.y = -160;
        this.reviveMenu.addChild(title);

        var reviveButton = new ShapeBgButton(ShapeBgType.RoundRect, 0x00FFFF00, 6, 22, "pd_res_json.ShareRevive", 
            570 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth, 140,
            296, 52, this.OnClickShapeRevive, this);
        reviveButton.y = -20;
        this.reviveMenu.addChild(reviveButton);

        var giveUpButton = new ShapeBgButton(ShapeBgType.RoundRect, 0xFF930000, 6, 22, "pd_res_json.GameOver", 
            570 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth, 140,
            298, 84, this.OnClickGiveup, this);
        giveUpButton.y = 140;
        this.reviveMenu.addChild(giveUpButton);
    }

    private CreateScore()
    {
        Tools.DetachDisplayObjFromParent(this.score);

        var playerDataModule = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
        
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
        scoreNum.size = 80;
        scoreNum.textAlign = "left";
        scoreNum.fontFamily = "Impact";
        scoreNum.text = playerDataModule.GetCurMatchScore();
        this.score.addChild(scoreNum);

        this.score.x = 100 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        this.score.y = 150;
    }


    private CreateHistoryHighScore()
    {
        Tools.DetachDisplayObjFromParent(this.historyHighScore);
        
        var playerDataModule = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
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
        scoreNum.text = playerDataModule.GetHistoryHighScore().toString();
        this.historyHighScore.addChild(scoreNum);

        this.historyHighScore.x = 350 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        this.historyHighScore.y = 155;
    }

    private CreateCoin()
    {
        Tools.DetachDisplayObjFromParent(this.coin);
        var playerDataModule = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);

        this.coin = new egret.DisplayObjectContainer();
        var coinIcon = (<IResModule>GameMain.GetInstance().GetModule(ModuleType.RES)).CreateBitmapByName("pd_res_json.Coin");
        coinIcon.width = 40;
        coinIcon.height = 40;
        this.coin.addChild(coinIcon);

        var coinNum = new egret.TextField();
        coinNum.x = 60;
        coinNum.size = 40;
        coinNum.textAlign = "left";
        coinNum.text = playerDataModule.GetCoinCurGame().toString();
        this.coin.addChild(coinNum);

        this.coin.x = 350 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        this.coin.y = 270;

        this.addtionalCoin = new egret.TextField();
        this.addtionalCoin.x = coinNum.textWidth + coinNum.x + 20;
        this.addtionalCoin.size = 40;
        this.addtionalCoin.textAlign = "left";
        this.addtionalCoin.textColor = 0xF3C300;
        this.addtionalCoin.text = "+ " + playerDataModule.GetCoinCurGame().toString();
    }

    private CreateMoreCoin()
    {
        this.moreCoin = new egret.DisplayObjectContainer();

        var adaptor = GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        var buttonWidth = GameMain.GetInstance().GetStageWidth() / 5 * 2 - 15 * adaptor;
        var interval = GameMain.GetInstance().GetStageWidth() / 5 * 4 - buttonWidth * 2;
        this.moreCoinButton = new ShapeBgButton(ShapeBgType.RoundRect, 0xFFFFFF00, 6, 16, null, 
            buttonWidth, 130, 0, 0, this.OnClickMoreCoin, this);
        this.moreCoin.addChild(this.moreCoinButton);

        this.moreCoinText = new egret.TextField();
        this.moreCoinText.x = -110 * adaptor
        this.moreCoinText.y = -25;
        this.moreCoinText.size = 30;
        this.moreCoinText.textAlign = "left";
        this.moreCoinText.verticalAlign = "center";
        if(this.IsEnableShare())
        {
            this.moreCoinText.textFlow = <Array<egret.ITextElement>>
            [
                { text: "分享好友\n", style: { "textColor": 0xFFFFFF, "size": 30 } },
                { text: "金币翻倍", style: { "textColor": 0xFFC900, "size": 30 } },
            ]
        }
        else
        {
            this.moreCoinText.text = "挺好玩的\n分享一波";
        }
        
        this.moreCoin.addChild(this.moreCoinText);

        this.moreCoinIcon = (<IResModule>GameMain.GetInstance().GetModule(ModuleType.RES)).CreateBitmapByName("pd_res_json.Share");
        this.moreCoinIcon.x = 60 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        this.moreCoinIcon.width *= GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        this.moreCoinIcon.height *= GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        this.moreCoinIcon.anchorOffsetX = this.moreCoinIcon.width / 2;
        this.moreCoinIcon.anchorOffsetY = this.moreCoinIcon.height / 2;
        this.moreCoin.addChild(this.moreCoinIcon);

        this.moreCoin.x = GameMain.GetInstance().GetStageWidth() / 2 - buttonWidth / 2 - interval / 2;
        this.moreCoin.y = 770;
    }

    private CreateLottery()
    {
        this.lottery = new egret.DisplayObjectContainer();

        var adaptor = GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        var buttonWidth = GameMain.GetInstance().GetStageWidth() / 5 * 2 - 15 * adaptor;
        var interval = GameMain.GetInstance().GetStageWidth() / 5 * 4 - buttonWidth * 2;
        var bgButton = new ShapeBgButton(ShapeBgType.RoundRect, 0xFFFFFF00, 6, 16, null, 
            buttonWidth, 130, 0, 0, this.OnClickLottery, this);
        this.lottery.addChild(bgButton);

        var lotteryText = new egret.TextField();
        lotteryText.x = -110 * adaptor;
        lotteryText.y = -25;
        lotteryText.size = 30;
        lotteryText.textAlign = "left";
        lotteryText.verticalAlign = "center";
        lotteryText.text = "获取\n强力弹球";
        this.lottery.addChild(lotteryText);

        var lotteryIcon = (<IResModule>GameMain.GetInstance().GetModule(ModuleType.RES)).CreateBitmapByName("pd_res_json.Shop");
        lotteryIcon.x = 60 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        lotteryIcon.y = 5;
        lotteryIcon.width *= GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        lotteryIcon.height *= GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        lotteryIcon.anchorOffsetX = lotteryIcon.width / 2;
        lotteryIcon.anchorOffsetY = lotteryIcon.height / 2;
        this.lottery.addChild(lotteryIcon);

        // var costText = new egret.TextField();
        // costText.x = 192 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        // costText.y = -10;
        // costText.size = 30;
        // costText.textAlign = "left";
        // costText.verticalAlign = "center";
        // costText.text = "200";
        // this.lottery.addChild(costText);

        this.lottery.x = GameMain.GetInstance().GetStageWidth() / 2 + buttonWidth / 2 + interval / 2;
        this.lottery.y = 770;
    }

    private CreateGotoLobby()
    {
        this.gotoLobby = new ShapeBgButton(ShapeBgType.RoundRect, 0xEF004800, 6, 16, "pd_res_json.Home", 
        GameMain.GetInstance().GetStageWidth() / 5 * 4, 130, 70, 62,
            this.OnClickBackToLobby, this);

        this.gotoLobby.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.gotoLobby.y = 930;
    }

    private CreateShop()
    {
        this.shop = new ShopView();
        this.shop.Init(this.OnCloseShop, this);
    }

    private CreateHintFinger()
    {
        var ballMgr = <IBallConfigModule>GameMain.GetInstance().GetModule(ModuleType.BALL_CONFIG);
        if(ballMgr.IsNewPlayer() && this.lottery != null && this.lottery != undefined)
        {
            this.hintFinger = (<IResModule>GameMain.GetInstance().GetModule(ModuleType.RES)).CreateBitmapByName("pd_res_json.finger");
            this.hintFinger.x = 0;
            this.hintFinger.y = 20;
            Tools.AdapteDisplayObject(this.hintFinger);
            this.lottery.addChild(this.hintFinger);
            var scaleParam = new PaScalingParam()
            scaleParam.displayObj = this.hintFinger;
            scaleParam.targetScaleX = 0.8;
            scaleParam.targetScaleY = 0.8;
            scaleParam.duration = 50000000;
            scaleParam.interval = 500;
            scaleParam.reverse = true;
            var scaleEvent = new PlayProgramAnimationEvent()
            scaleEvent.param = scaleParam;
            GameMain.GetInstance().DispatchEvent(scaleEvent);
        }
    }

    private OnCloseShop(callbackobj: any)
    {
        Tools.DetachDisplayObjFromParent(callbackobj.shop);
    }

    public ShowGameOverMenu()
    {
        this.Hide();

        this.CreateScore();
        this.CreateHistoryHighScore();
        this.CreateCoin();
        this.CreateHintFinger();

        var rankMenu = platform.createOpenDataBitmap(GameMain.GetInstance().GetStageWidth() * 0.8,
            320);
        
        this.addChild(this.bgCover);
        this.addChild(this.score);
        this.addChild(this.historyHighScore);
        this.addChild(this.coin);
        this.addChild(this.moreCoin);
        this.addChild(this.lottery);
        this.addChild(this.gotoLobby);
        if (rankMenu != null && rankMenu != undefined)
        {
            rankMenu.anchorOffsetX = rankMenu.width / 2;
            rankMenu.anchorOffsetY = rankMenu.height / 2;
            rankMenu.x = GameMain.GetInstance().GetStageWidth() / 2;
            rankMenu.y = 508;
            this.addChild(rankMenu);
            platform.renderGameOverRank("HighScore");
        }

        //保存一下
        var playerdata = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
        playerdata.Save();
        playerdata.UploadHistoryHighScore();

        var soundEvent: PlaySoundEvent = new PlaySoundEvent("GameOver_mp3", 1);
        GameMain.GetInstance().DispatchEvent(soundEvent);
    }

    public ShowReviveMenu()
    {
        this.addChild(this.bgCover);
        this.addChild(this.reviveMenu);
    }

    public Hide()
    {
        this.removeChildren();
    }

    private OnClickMoreCoin(callbackObj:any)
    {
        var playerData = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
        if(playerData.GetHistoryHighScore() > 0)
        {
            GameMain.GetInstance().ShareAppMsgRank(playerData.GetHistoryHighScore());
        } 
        else
        {
            GameMain.GetInstance().ShareAppMsg();
        }   
            
        if(callbackObj.IsEnableShare())
        {
            var timer = new egret.Timer(500,1);
            timer.addEventListener(egret.TimerEvent.TIMER, callbackObj.OnRealAddMoreCoin, callbackObj);
            timer.start();
        }
    }

    private OnRealAddMoreCoin()
    {
        this.coin.addChild(this.addtionalCoin);
        this.moreCoinText.text = "感谢支持，额外收益已到账";
        this.moreCoinText.textColor = 0x888888;

        Tools.DetachDisplayObjFromParent(this.moreCoinButton);
        this.moreCoinButton = new ShapeBgButton(ShapeBgType.RoundRect, 0x88888800, 6, 16, null, 
            GameMain.GetInstance().GetStageWidth() / 5 * 4, 130, 0, 0, null, null);
        this.moreCoin.addChild(this.moreCoinButton);

        Tools.DetachDisplayObjFromParent(this.moreCoinIcon);

        var playerData = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
        playerData.AddCoin(playerData.GetCoinCurGame());
        playerData.Save();
    }

    private OnClickLottery(callbackobj: any)
    {
        //隐藏手指，如果有的话
        if(callbackobj.hintFinger != null && callbackobj.hintFinger != undefined)
        {
            Tools.DetachDisplayObjFromParent(callbackobj.hintFinger);
        }

        callbackobj.shop.OnOpenShop();
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

    private OnClickShapeRevive(callbackObj: any): void
    {
        if (DEBUG)
        {
            egret.log("OnClickShapeRevive");
        }

        GameMain.GetInstance().ShareAppMsgRevive();

        GameMain.GetInstance().hasRevive = true;

        var timer = new egret.Timer(500,1);
        timer.addEventListener(egret.TimerEvent.TIMER, callbackObj.OnRealRevive, callbackObj);
        timer.start();
    }

    private OnRealRevive()
    {
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
        var result = this.IsEnableShare(); // 是否超过了指定的时间
        if (result && GameMain.GetInstance().hasRevive == false)
        {
            this.ShowReviveMenu();
        }
        else
        {
            this.ShowGameOverMenu();
        }
    }

    private IsEnableShare(): boolean
    {
        var networkConfigModule = <INetworkConfigModule>GameMain.GetInstance().GetModule(ModuleType.NETWORK_CONFIG);
        var networkConfig = networkConfigModule.GetNetWorkConfig();
        return networkConfig.EnableShare;
    }
}