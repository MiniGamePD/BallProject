class PauseItem extends egret.DisplayObjectContainer
{
    //暂停界面
    private bgCover:FullScreenCover;
    private pauseIcon:egret.Bitmap;
    private pauseTitle:egret.DisplayObjectContainer;
    private continueButton:egret.DisplayObjectContainer;
    private gotoLobbyButton:egret.DisplayObjectContainer;

    //帮助界面
    private bgCoverHelp:FullScreenCover;
    private helpDetail1:egret.Bitmap;
    private helpDetail2:egret.Bitmap;
    private helpIcon:egret.Bitmap;
    private helpQuitHint:egret.TextField;
    private controlSelector1On:ShapeBgButton;
    private controlSelector1Off:ShapeBgButton;
    private controlSelector2On:ShapeBgButton;
    private controlSelector2Off:ShapeBgButton;
    
    //体验球界面，为了流程方便，叠在帮助界面上面
    private ballExpView:BallExperienceView;
    private hasShowBallExpView:boolean = false;

    public constructor(x:number, y:number, width:number, height:number)
    {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.CreatePauseIcon();
        this.CreateHelpIcon();
        this.CreatePauseMenu(width, height);
        this.CreateHelpDetail();
    }

    private CreatePauseIcon()
    {
        var res:IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        this.pauseIcon = res.CreateBitmapByName("pd_res_json.pause");
        this.pauseIcon.anchorOffsetX = this.pauseIcon.width / 2;
        this.pauseIcon.anchorOffsetY = this.pauseIcon.height / 2;
        this.pauseIcon.x = 50 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        this.pauseIcon.y = 80;
        //设置显示对象可以相应触摸事件
        this.pauseIcon.touchEnabled = true;
        //注册事件
        this.pauseIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClickPauseButton, this);

        this.addChild(this.pauseIcon);
    }

    private CreateHelpIcon()
    {
        var res:IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        this.helpIcon = res.CreateBitmapByName("pd_res_json.HelpIcon");
        this.helpIcon.anchorOffsetX = this.helpIcon.width / 2;
        this.helpIcon.anchorOffsetY = this.helpIcon.height / 2;
        this.helpIcon.x = 120 * GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        this.helpIcon.y = 80;

        this.helpIcon.touchEnabled = true;
        this.helpIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClickHelp, this);

        this.addChild(this.helpIcon);
    }

    private CreatePauseMenu(width:number, height:number)
    {
        this.bgCover = new FullScreenCover(0x000000, 0.9);

        this.pauseTitle = new egret.DisplayObjectContainer();
        let textField = new egret.TextField();
        textField.x = 0;
        textField.y = height / 4;
        textField.width = width;
        textField.height = 100;
        textField.fontFamily = "Impact";
        textField.size = 60;
        textField.textAlign = "center";
        textField.text = "暂停";
        this.pauseTitle.addChild(textField);

        //回到大厅
        var gotoLobby = new ShapeBgButton(ShapeBgType.RoundRect, 0xFFFFFF00, 6, 16, "pd_res_json.Home", 
            width / 5 * 3, 130, 70, 62, 
            this.OnClickBackToLobby, this);
        this.gotoLobbyButton = new egret.DisplayObjectContainer();
        this.gotoLobbyButton.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.gotoLobbyButton.y = 600;
        this.gotoLobbyButton.addChild(gotoLobby);

         //继续游戏
        var con = new ShapeBgButton(ShapeBgType.RoundRect, 0xFFFFFF00, 6, 16, "pd_res_json.play",
            width / 5 * 3, 130, 56, 56, 
            this.OnClickContinue, this);
        this.continueButton = new egret.DisplayObjectContainer();
        this.continueButton.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.continueButton.y = 750;
        this.continueButton.addChild(con);
    }

    private CreateHelpDetail()
    {
        var res:IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        var helpDetailFactor = GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
        //摇杆操作引导图
        this.helpDetail1 = res.CreateBitmapByName("pd_res_json.Help");
        this.helpDetail1.width *= helpDetailFactor;
        this.helpDetail1.height *= helpDetailFactor;
        this.helpDetail1.anchorOffsetX = this.helpDetail1.width / 2;
        this.helpDetail1.anchorOffsetY = this.helpDetail1.height / 2;
        this.helpDetail1.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.helpDetail1.y = GameMain.GetInstance().GetStageHeight() / 2;
        //点击操作引导图
        this.helpDetail2 = res.CreateBitmapByName("pd_res_json.Help1");
        this.helpDetail2.width *= helpDetailFactor;
        this.helpDetail2.height *= helpDetailFactor;
        this.helpDetail2.anchorOffsetX = this.helpDetail2.width / 2;
        this.helpDetail2.anchorOffsetY = this.helpDetail2.height / 2;
        this.helpDetail2.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.helpDetail2.y = GameMain.GetInstance().GetStageHeight() / 2;

        var controlSelectorWidth = (this.helpDetail1.width - 30) / 2;
        this.controlSelector1On = this.CreateControlSelector(controlSelectorWidth, "摇杆操作", 0xFFFFFF00, 0xFFFFFF, null);
        this.controlSelector1Off = this.CreateControlSelector(controlSelectorWidth, "摇杆操作", 0x88888800, 0x888888, this.OnChooseJoyStick);
        this.controlSelector2On = this.CreateControlSelector(controlSelectorWidth, "点击操作", 0xFFFFFF00, 0xFFFFFF, null);
        this.controlSelector2Off = this.CreateControlSelector(controlSelectorWidth, "点击操作", 0x88888800, 0x888888, this.OnChooseTouch);
        this.controlSelector2On.x = this.helpDetail1.x - 30 / 2 - controlSelectorWidth / 2;
        this.controlSelector2Off.x = this.controlSelector2On.x;
        this.controlSelector2On.y = this.helpDetail1.y + this.helpDetail1.height / 2 + 10 + controlSelectorWidth / 2;
        this.controlSelector2Off.y = this.controlSelector2On.y;
        this.controlSelector1On.x = this.helpDetail1.x + 30 / 2 + controlSelectorWidth / 2;
        this.controlSelector1Off.x = this.controlSelector1On.x;
        this.controlSelector1On.y = this.helpDetail1.y + this.helpDetail1.height / 2 + 10 + controlSelectorWidth / 2;
        this.controlSelector1Off.y = this.controlSelector1On.y;

        this.bgCoverHelp = new FullScreenCover(0x000000, 0.9);
        this.bgCoverHelp.touchEnabled = true;
        this.bgCoverHelp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnCloseHelp, this);

        this.helpQuitHint = new egret.TextField();
        this.helpQuitHint.y = 250;
        this.helpQuitHint.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.helpQuitHint.width = GameMain.GetInstance().GetStageWidth();
        this.helpQuitHint.height = 200;
        this.helpQuitHint.size = 40;
        this.helpQuitHint.anchorOffsetX = this.helpQuitHint.width / 2;
        this.helpQuitHint.anchorOffsetY = this.helpQuitHint.height / 2;
        this.helpQuitHint.textAlign = "center";
        this.helpQuitHint.text = "点击按钮选择操作模式\n\n点击屏幕其他位置继续游戏";
    }

    private CreateBallExpView()
    {
        if(!this.hasShowBallExpView)
        {
            //如果这句没有体验的资格，但是也算已经show过了
            this.hasShowBallExpView = true;

            var ballMgr = <IBallConfigModule>GameMain.GetInstance().GetModule(ModuleType.BALL_CONFIG);
            var ballExpInfo = ballMgr.GetExpBall();
            if(ballExpInfo != null && ballExpInfo != undefined)
            {
                this.ballExpView = new BallExperienceView(ballExpInfo);
                this.ballExpView.Init(this.OnCloseBallExpView, this);
                this.addChild(this.ballExpView);
            }
        }
    }

    private OnCloseBallExpView(callbackObj:any)
    {
        if(callbackObj.ballExpView != null && callbackObj.ballExpView != undefined)
        {
            Tools.DetachDisplayObjFromParent(callbackObj.ballExpView);
        }
    }

    private CreateControlSelector(width:number, desc:string, bgColor:number, textColor:number, callback:Function):ShapeBgButton
    {
        var result = new ShapeBgButton(ShapeBgType.RoundRect, bgColor, 6, 16, null,
            width, width / 2, 0, 0, 
            callback, this);
        var text = new egret.TextField();
        text.text = desc;
        text.textColor = textColor;
        text.size = 35;
        text.width = width;
        text.height = width / 2;
        text.anchorOffsetX = text.width / 2;
        text.anchorOffsetY = text.height / 2;
        text.x = text.width / 2;
        text.y = text.height / 2;
        text.textAlign = "center";
        text.verticalAlign = "middle";
        result.addChild(text);

        return result;
    }

    public Init()
    {
        GameMain.GetInstance().AddEventListener(HUDEvent.EventName, this.OnHudEvent, this);
    }

    public Release()
    {
        GameMain.GetInstance().RemoveEventListener(HUDEvent.EventName, this.OnHudEvent, this);
    }

    private OnHudEvent(event:HUDEvent)
    {
        switch(event.eventType)
        {
            case HUDEventType.ShowPauseMenu:
                this.ShowPauseMenu();
                break;
            case HUDEventType.HidePauseMenu:
                this.HidePauseMenu();
                break;
            case HUDEventType.ShowHelpDetail:
                this.ShowHelpDetail();
                break;
            case HUDEventType.HideHelpDetail:
                this.HideHelpDetail();
                break;
            //Add More..
        }
    }

    private OnPauseTrue(help:boolean)
    {
        var event = new PauseEvent();
        event.pause = true;
        event.help = help;
        GameMain.GetInstance().DispatchEvent(event);
    }

    private OnPauseFalse(help:boolean)
    {
        var event = new PauseEvent();
        event.pause = false;
        event.help = help;
        GameMain.GetInstance().DispatchEvent(event);
    }

    private OnClickPauseButton()
    {
        this.OnPauseTrue(false);
    }

    private OnClickBackToLobby()
    {
        GameMain.GetInstance().SwitchGameState(GameStateType.Lobby);
    }

    private OnClickContinue(callbackObj:any)
    {
        callbackObj.OnPauseFalse(false);
    }

    private OnClickHelp()
    {
        this.OnPauseTrue(true);
    }

    private OnCloseHelp()
    {
        this.OnPauseFalse(true);
    }

    private OnChooseJoyStick(callbackObj:any)
    {
        Tools.DetachDisplayObjFromParent(callbackObj.controlSelector1On);
        Tools.DetachDisplayObjFromParent(callbackObj.controlSelector1Off);
        Tools.DetachDisplayObjFromParent(callbackObj.controlSelector2On);
        Tools.DetachDisplayObjFromParent(callbackObj.controlSelector2Off);
        Tools.DetachDisplayObjFromParent(callbackObj.helpDetail1);
        Tools.DetachDisplayObjFromParent(callbackObj.helpDetail2);

        var playerData = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
        playerData.SetControlType(BallControllerType.TouchMove);
        playerData.Save();
        callbackObj.addChild(callbackObj.controlSelector1On);
        callbackObj.addChild(callbackObj.controlSelector2Off);
        callbackObj.addChild(callbackObj.helpDetail1);

        var event:SwitchControlTypeEvent = new SwitchControlTypeEvent();
        event.newControlType = BallControllerType.TouchMove;
        GameMain.GetInstance().DispatchEvent(event);
    }

    private OnChooseTouch(callbackObj:any)
    {
        Tools.DetachDisplayObjFromParent(callbackObj.controlSelector1On);
        Tools.DetachDisplayObjFromParent(callbackObj.controlSelector1Off);
        Tools.DetachDisplayObjFromParent(callbackObj.controlSelector2On);
        Tools.DetachDisplayObjFromParent(callbackObj.controlSelector2Off);
        Tools.DetachDisplayObjFromParent(callbackObj.helpDetail1);
        Tools.DetachDisplayObjFromParent(callbackObj.helpDetail2);

        var playerData = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
        playerData.SetControlType(BallControllerType.TouchPoint);
        playerData.Save();
        callbackObj.addChild(callbackObj.controlSelector1Off);
        callbackObj.addChild(callbackObj.controlSelector2On);
        callbackObj.addChild(callbackObj.helpDetail2);

        var event:SwitchControlTypeEvent = new SwitchControlTypeEvent();
        event.newControlType = BallControllerType.TouchPoint;
        GameMain.GetInstance().DispatchEvent(event);
    }

    private ShowHelpDetail()
    {
        this.addChild(this.bgCoverHelp);
        this.addChild(this.helpQuitHint);

        //1 is touchMove, 2 is touch point
        var playerData = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
        if(playerData.GetControlType() == BallControllerType.TouchMove)
        {
            this.addChild(this.controlSelector1On);
            this.addChild(this.controlSelector2Off);
            this.addChild(this.helpDetail1);
        }
        else if(playerData.GetControlType() == BallControllerType.TouchPoint)
        {
            this.addChild(this.controlSelector1Off);
            this.addChild(this.controlSelector2On);
            this.addChild(this.helpDetail2);
        }
        else
        {
            if(DEBUG)
            {
                console.error("未知的操作类型：" + playerData.GetControlType());
            }
            playerData.SetControlType(BallControllerType.TouchMove);
            this.addChild(this.controlSelector1On);
            this.addChild(this.controlSelector2Off);
            this.addChild(this.helpDetail1);
        }

        this.CreateBallExpView();
    }

    private HideHelpDetail()
    {
        Tools.DetachDisplayObjFromParent(this.bgCoverHelp);
        Tools.DetachDisplayObjFromParent(this.helpDetail1);
        Tools.DetachDisplayObjFromParent(this.helpDetail2);
        Tools.DetachDisplayObjFromParent(this.helpQuitHint);
        Tools.DetachDisplayObjFromParent(this.controlSelector1On);
        Tools.DetachDisplayObjFromParent(this.controlSelector1Off);
        Tools.DetachDisplayObjFromParent(this.controlSelector2On);
        Tools.DetachDisplayObjFromParent(this.controlSelector2Off);
    }

    public ShowPauseMenu()
    {
        this.addChild(this.bgCover);
        this.addChild(this.pauseTitle);
        this.addChild(this.gotoLobbyButton);
        this.addChild(this.continueButton);
    }

    public HidePauseMenu()
    {
        Tools.DetachDisplayObjFromParent(this.bgCover);
        Tools.DetachDisplayObjFromParent(this.pauseTitle);
        Tools.DetachDisplayObjFromParent(this.gotoLobbyButton);
        Tools.DetachDisplayObjFromParent(this.continueButton);
    }
}