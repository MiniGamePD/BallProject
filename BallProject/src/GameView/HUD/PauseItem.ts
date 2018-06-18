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
    private helpDetail:egret.Bitmap;
    private helpIcon:egret.Bitmap;

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
        this.bgCover = new FullScreenCover(0x000000, 0.3);

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
        this.helpDetail = res.CreateBitmapByName("pd_res_json.Help");
        this.helpDetail.width = GameMain.GetInstance().GetStageWidth() * 0.8;
        this.helpDetail.height = GameMain.GetInstance().GetStageHeight() * 0.8;
        this.helpDetail.anchorOffsetX = this.helpDetail.width / 2;
        this.helpDetail.anchorOffsetY = this.helpDetail.height / 2;
        this.helpDetail.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.helpDetail.y = GameMain.GetInstance().GetStageHeight() / 2;

        this.bgCoverHelp = new FullScreenCover(0x000000, 0.8);
        this.bgCoverHelp.touchEnabled = true;
        this.bgCoverHelp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnCloseHelp, this);
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

    private ShowHelpDetail()
    {
        this.addChild(this.bgCoverHelp);
        this.addChild(this.helpDetail);
    }

    private HideHelpDetail()
    {
        this.removeChild(this.bgCoverHelp);
        this.removeChild(this.helpDetail);
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
        this.removeChild(this.bgCover);
        this.removeChild(this.pauseTitle);
        this.removeChild(this.gotoLobbyButton);
        this.removeChild(this.continueButton);
    }
}