class PauseItem extends egret.DisplayObjectContainer
{
    private pauseIcon:egret.Bitmap;

    private bgCover:egret.Sprite;
    private pauseTitle:egret.DisplayObjectContainer;
    private continueButton:egret.DisplayObjectContainer;
    private gotoLobbyButton:egret.DisplayObjectContainer;

    public constructor(x:number, y:number, width:number, height:number)
    {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        var res:IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);

        this.pauseIcon = res.CreateBitmapByName("pd_res_json.pause");
        this.pauseIcon.anchorOffsetX = this.pauseIcon.width / 2;
        this.pauseIcon.anchorOffsetY = this.pauseIcon.height / 2;
        this.pauseIcon.x = 50;
        this.pauseIcon.y = 50;
        GameMain.GetInstance().AdapteDisplayObject(this.pauseIcon);

        this.addChild(this.pauseIcon);

        this.bgCover = new egret.Sprite();
        this.bgCover.graphics.beginFill(0x000000, 0.8);
        this.bgCover.graphics.drawRect(-1000,-1000,width+2000,height+2000);
        this.bgCover.graphics.endFill();

        this.pauseTitle = new egret.DisplayObjectContainer();
        let textField = new egret.TextField();
        textField.x = 0;
        textField.y = height / 4;
        textField.width = width;
        textField.height = 100;
        textField.rotation = -5;
        textField.fontFamily = "Impact";
        textField.size *= 2;
        textField.textAlign = "center";
        textField.text = "暂停";
        this.pauseTitle.addChild(textField);

        //回到大厅
        this.gotoLobbyButton = new egret.DisplayObjectContainer();
        var shape: egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0x00A2E8);
        shape.graphics.drawRect(width / 2 - 100, height / 5 * 3, 200, 100);
        shape.graphics.endFill();
        this.gotoLobbyButton.addChild(shape);

        //设置显示对象可以相应触摸事件
        shape.touchEnabled = true;
        //注册事件
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClickBackToLobby, this);

        var text: egret.TextField = new egret.TextField();
        text.text = "回到大厅";
        text.x = 0;
        text.y = height / 5 * 3;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.width = width;
        text.height = 100;
        this.gotoLobbyButton.addChild(text);

        //继续游戏
        this.continueButton = new egret.DisplayObjectContainer();
        var shape: egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0x00A2E8);
        shape.graphics.drawRect(width / 2 - 100, height / 5 * 2, 200, 100);
        shape.graphics.endFill();
        this.continueButton.addChild(shape);

        //设置显示对象可以相应触摸事件
        shape.touchEnabled = true;
        //注册事件
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClickContinue, this);

        var text: egret.TextField = new egret.TextField();
        text.text = "继续游戏";
        text.x = 0;
        text.y = height / 5 * 2;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.width = width;
        text.height = 100;
        this.continueButton.addChild(text);
    }

    public Init()
    {
        GameMain.GetInstance().RegisterInGameTouchableUI(this.pauseIcon);

        //设置显示对象可以相应触摸事件
        this.pauseIcon.touchEnabled = true;
        //注册事件
        this.pauseIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnPauseTrue, this);
    }

    public Release()
    {
        GameMain.GetInstance().UnregisterInGameTouchableUI(this.pauseIcon);

        this.pauseIcon.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.OnPauseTrue, this);
    }

    private OnPauseTrue()
    {
        var event = new PauseEvent();
        event.pause = true;
        GameMain.GetInstance().DispatchEvent(event);
    }

    private OnPauseFalse()
    {
        var event = new PauseEvent();
        event.pause = false;
        GameMain.GetInstance().DispatchEvent(event);
    }

    private OnClickBackToLobby(): void
    {
        if(DEBUG)
        {
            egret.log("OnClickBackToLobby");
        }
        GameMain.GetInstance().SwitchGameState(GameStateType.Lobby);
    }

    private OnClickContinue(): void
    {
        if(DEBUG)
        {
            egret.log("OnClickContinue");
        }
       
        this.OnPauseFalse();
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