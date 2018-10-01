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
    private rankMenu:egret.Bitmap;
    private rankMenuBg:egret.Sprite;
    private rankMenuTitle:egret.TextField;
    private rankMenuShare:egret.TextField;

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
        title.text = "跪了 ´◔ ‸◔´";
        title.size = 45;
        title.width = GameMain.GetInstance().GetStageWidth();
        title.height = 60;
        title.textAlign = "center";
        title.anchorOffsetX = title.width / 2;
        title.anchorOffsetY = title.height / 2;
        title.x = 0;
        title.y = -160;
        this.reviveMenu.addChild(title);

        var reviveButton = new ShapeBgButton(ShapeBgType.RoundRect, 0x00FFFF00, 6, 22, "pd_res_json.AdRevive", 
            570 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth, 140,
            295, 78, this.OnClickShapeRevive, this);
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

        this.score.x = 90 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        this.score.y = 110;
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
        scoreNum.text = playerDataModule.GetHistoryHighScore().toFixed(0);
        this.historyHighScore.addChild(scoreNum);

        this.historyHighScore.x = 350 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        this.historyHighScore.y = 115;
    }

    private CreateCoin()
    {
        Tools.DetachDisplayObjFromParent(this.coin);
        var playerDataModule = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);

        this.coin = new egret.DisplayObjectContainer();
        // var coinIcon = (<IResModule>GameMain.GetInstance().GetModule(ModuleType.RES)).CreateBitmapByName("pd_res_json.Coin");
        // coinIcon.width = 40;
        // coinIcon.height = 40;
        // this.coin.addChild(coinIcon);

        var coinNum = new egret.TextField();
        coinNum.x = 0;
        coinNum.size = 40;
        coinNum.textAlign = "left";
        coinNum.verticalAlign = "middle";
        coinNum.textFlow = <Array<egret.ITextElement>>
			[
				{ text: "金币  ", style: { "textColor": 0xFDCF46, "size": 35 } },
				{ text: playerDataModule.GetCoinCurGame().toFixed(0), style: { "textColor": 0xFFFFFF, "size": 35 } },
			]        
        this.coin.addChild(coinNum);

        this.coin.x = 350 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        this.coin.y = 220;

        this.addtionalCoin = new egret.TextField();
        this.addtionalCoin.x = coinNum.textWidth + coinNum.x + 20;
        this.addtionalCoin.size = 40;
        this.addtionalCoin.textAlign = "left";
        this.addtionalCoin.verticalAlign = "middle";
        this.addtionalCoin.textColor = 0xF3C300;
        this.addtionalCoin.text = "+ " + playerDataModule.GetCoinCurGame().toFixed(0);        
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
        
        {
            this.moreCoinText.textFlow = <Array<egret.ITextElement>>
            [
                { text: "观看视频\n", style: { "textColor": 0xFFFFFF, "size": 30 } },
                { text: "金币翻倍", style: { "textColor": 0xFFC900, "size": 30 } },
            ]
        }  
        
        this.moreCoin.addChild(this.moreCoinText);

        this.moreCoinIcon = (<IResModule>GameMain.GetInstance().GetModule(ModuleType.RES)).CreateBitmapByName("pd_res_json.shopItemVideoImg");
        this.moreCoinIcon.x = 63 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        this.moreCoinIcon.width *= GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        this.moreCoinIcon.height *= GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        this.moreCoinIcon.anchorOffsetX = this.moreCoinIcon.width / 2;
        this.moreCoinIcon.anchorOffsetY = this.moreCoinIcon.height / 2;
        this.moreCoin.addChild(this.moreCoinIcon);

        this.moreCoin.x = GameMain.GetInstance().GetStageWidth() / 2 - buttonWidth / 2 - interval / 2;
        this.moreCoin.y = 760;
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
        this.lottery.y = 760;
    }

    private CreateGotoLobby()
    {
        this.gotoLobby = new ShapeBgButton(ShapeBgType.RoundRect, 0xEF004800, 6, 16, "pd_res_json.Home", 
        GameMain.GetInstance().GetStageWidth() / 5 * 4, 130, 70, 62,
            this.OnClickBackToLobby, this);

        this.gotoLobby.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.gotoLobby.y = 920;
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

        this.rankMenu = platform.createOpenDataBitmap(GameMain.GetInstance().GetStageWidth() * 0.8,
            320);
        this.rankMenuBg = new egret.Sprite();
        this.rankMenuBg.graphics.beginFill(0x252525,1);
        this.rankMenuBg.graphics.drawRect(0,0,GameMain.GetInstance().GetStageWidth() * 0.8,370);
        this.rankMenuBg.graphics.endFill();
        this.rankMenuBg.width = GameMain.GetInstance().GetStageWidth() * 0.8;
        this.rankMenuBg.height = 370;
        Tools.SetAnchor(this.rankMenuBg, AnchorType.Center);
        this.rankMenuBg.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.rankMenuBg.y = 478;

        this.rankMenuTitle = new egret.TextField();
        this.rankMenuTitle.text = "好友排行榜";
        this.rankMenuTitle.size = 25;
        this.rankMenuTitle.width = 200;
        this.rankMenuTitle.height = 40;
        this.rankMenuTitle.verticalAlign = "middle";
        this.rankMenuTitle.x = 20;
        this.rankMenuTitle.y = 325;

        this.rankMenuShare = new egret.TextField();
        this.rankMenuShare.text = "炫耀成绩 >";
        this.rankMenuShare.size = 25;
        this.rankMenuShare.width = 200;
        this.rankMenuShare.height = 40;
        this.rankMenuShare.textAlign = "right";
        this.rankMenuShare.verticalAlign = "middle";
        this.rankMenuShare.x = this.rankMenuBg.width - 220;
        this.rankMenuShare.y = 325;
        this.rankMenuShare.touchEnabled = true;
        this.rankMenuShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClickRankShowOff, this);
        
        this.addChild(this.bgCover);
        this.addChild(this.score);
        this.addChild(this.historyHighScore);
        this.addChild(this.coin);
        this.addChild(this.moreCoin);
        this.addChild(this.lottery);
        this.addChild(this.gotoLobby);

        this.CreateHintFinger();

        this.addChild(this.rankMenuBg);
        if (this.rankMenu != null && this.rankMenu != undefined)
        {
            //this.rankMenu.anchorOffsetX = this.rankMenu.width / 2;
            //this.rankMenu.anchorOffsetY = this.rankMenu.height / 2;
            this.rankMenu.x = 0;//GameMain.GetInstance().GetStageWidth() / 2;
            this.rankMenu.y = 0;//468;
            this.rankMenuBg.addChild(this.rankMenu);
            platform.renderGameOverRank("HighScore");

            this.rankMenuBg.addChild(this.rankMenuTitle);
            this.rankMenuBg.addChild(this.rankMenuShare);
        }

        //保存一下
        var playerdata = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
        playerdata.Save();
        playerdata.UploadHistoryHighScore();        

        //显示广告
       this.ShowBannerAd();
    }

    private hasShowBannerAd = false;
    private ShowBannerAd()
    {
        if(this.hasShowBannerAd)
            return;
        this.hasShowBannerAd = true;
        platform.PlayBannerAd('adunit-fc46ade034da151a');
    }

    private HideBannerAd()
    {
        if(this.hasShowBannerAd)
        {
            this.hasShowBannerAd = false;
            platform.HideBannerAd();
        }
    }

    public ShowReviveMenu()
    {
        this.ShowBannerAd();
        this.addChild(this.bgCover);
        this.addChild(this.reviveMenu);
    }

    public Hide()
    {
        this.removeChildren();
    }

    private playingRewardAd:boolean = false;
    private OnClickMoreCoin(callbackObj:any)
    {
        if(callbackObj.playingRewardAd)
            return;

        callbackObj.playingRewardAd = true;

        GameMain.GetInstance().PlayRewardAd('adunit-924684518cec6068', 
            callbackObj.OnRealAddMoreCoin, callbackObj.OnCancleRewardAd, callbackObj);                            
    }

    private OnClickRankShowOff()
    {
        //炫耀成绩
        var playerData = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
        GameMain.GetInstance().ShareAppMsgRank(playerData.GetHistoryHighScore(), true);
    }

    private OnRealAddMoreCoin(callbackobj:any)
    {       
        callbackobj.playingRewardAd = false;

        callbackobj.coin.addChild(callbackobj.addtionalCoin);
        callbackobj.moreCoinText.text = "额外收益\n已到账";
        callbackobj.moreCoinText.textColor = 0x888888;

        var adaptor = GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        var buttonWidth = GameMain.GetInstance().GetStageWidth() / 5 * 2 - 15 * adaptor;

        Tools.DetachDisplayObjFromParent(callbackobj.moreCoinButton);
        callbackobj.moreCoinButton = new ShapeBgButton(ShapeBgType.RoundRect, 0x88888800, 6, 16, null, 
            buttonWidth, 130, 0, 0, null, null);
        callbackobj.moreCoin.addChild(callbackobj.moreCoinButton);

        //Tools.DetachDisplayObjFromParent(this.moreCoinIcon);

        var playerData = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
        playerData.AddCoin(playerData.GetCoinCurGame());
        playerData.Save();
    }

    private OnCancleRewardAd(callbackobj:any)
    {        
        callbackobj.playingRewardAd = false;
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

    private OnClickBackToLobby(callbackObj:any): void
    {
        if (DEBUG)
        {
            egret.log("OnClickBackToLobby");
        }
        callbackObj.HideBannerAd();
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
 
        if(callbackObj.playingRewardAd)
            return;

        callbackObj.playingRewardAd = true;

        GameMain.GetInstance().PlayRewardAd('adunit-924684518cec6068', 
            callbackObj.OnRealRevive, callbackObj.OnCancleRewardAd, callbackObj);  
    }

    private OnRealRevive(callbackobj:any)
    {
        callbackobj.playingRewardAd = false;
        callbackobj.HideBannerAd();
        GameMain.GetInstance().hasRevive = true;
        var event = new ReviveEvent();
        GameMain.GetInstance().DispatchEvent(event);
    }

    public OnGameOverEvent()
    {
        var soundModule = <ISoundModule>GameMain.GetInstance().GetModule(ModuleType.SOUND);
        soundModule.PlaySound("GameOver_mp3", 1);

        var timer = new egret.Timer(1000, 1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.OnReallyGameOverEvent, this);
        timer.start();
    }

    private OnReallyGameOverEvent()
    {
        //因为有了广告，所有都显示复活界面了
        //var result = this.IsEnableShare(); // 是否超过了指定的时间
        if (/*result && */GameMain.GetInstance().hasRevive == false)
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