class GameOverItem extends egret.DisplayObjectContainer
{
    private bgCover:egret.Sprite;
    private gameoverTitle:egret.DisplayObjectContainer;
    private backToLobbyButton:egret.DisplayObjectContainer;
    private replayButton:egret.DisplayObjectContainer;
    private reviveButton:egret.DisplayObjectContainer;

    public constructor(width:number, height:number)
    {
        super();
        this.bgCover = new egret.Sprite();
        this.bgCover.graphics.beginFill(0x000000, 0.8);
        this.bgCover.graphics.drawRect(-1000,-1000,width+2000,height+2000);
        this.bgCover.graphics.endFill();

        this.gameoverTitle = new egret.DisplayObjectContainer();
        let textField = new egret.TextField();
        textField.x = 0;
        textField.y = height / 4;
        textField.width = width;
        textField.height = 100;
        textField.rotation = -5;
        textField.fontFamily = "Impact";
        textField.size *= 2;
        textField.textAlign = "center";
        textField.text = "Game Over";
        this.gameoverTitle.addChild(textField);

        //
        this.backToLobbyButton = new egret.DisplayObjectContainer();
        var shape: egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0x00A2E8);
        shape.graphics.drawRect(width / 2 - 100, height / 5 * 4, 200, 100);
        shape.graphics.endFill();
        this.backToLobbyButton.addChild(shape);

        //设置显示对象可以相应触摸事件
        shape.touchEnabled = true;
        //注册事件
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClickBackToLobby, this);

        var text: egret.TextField = new egret.TextField();
        text.text = "回到大厅";
        text.x = 0;
        text.y = height / 5 * 4;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.width = width;
        text.height = 100;
        this.backToLobbyButton.addChild(text);

        //再玩一次
        this.replayButton = new egret.DisplayObjectContainer();
        var shape: egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0x00A2E8);
        shape.graphics.drawRect(width / 2 - 100, height / 5 * 3, 200, 100);
        shape.graphics.endFill();
        this.replayButton.addChild(shape);

        //设置显示对象可以相应触摸事件
        shape.touchEnabled = true;
        //注册事件
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClickPlayAgain, this);

        var text: egret.TextField = new egret.TextField();
        text.text = "再玩一次";
        text.x = 0;
        text.y = height / 5 * 3;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.width = width;
        text.height = 100;
        this.replayButton.addChild(text);

        //看广告复活
        this.reviveButton = new egret.DisplayObjectContainer();
        var shape: egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0x00A2E8);
        shape.graphics.drawRect(width / 2 - 100, height / 5 * 2, 200, 100);
        shape.graphics.endFill();
        this.reviveButton.addChild(shape);

        //设置显示对象可以相应触摸事件
        shape.touchEnabled = true;
        //注册事件
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClickRevive, this);

        var text: egret.TextField = new egret.TextField();
        text.text = "看广告接着玩";
        text.x = 0;
        text.y = height / 5 * 2;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.width = width;
        text.height = 100;
        this.reviveButton.addChild(text);
    }

    public Show()
    {
        this.addChild(this.bgCover);
        this.addChild(this.gameoverTitle);
        this.addChild(this.backToLobbyButton);
        this.addChild(this.replayButton);
        this.addChild(this.reviveButton);

        var soundEvent: PlaySoundEvent = new PlaySoundEvent("GameOver_mp3", 1);
        GameMain.GetInstance().DispatchEvent(soundEvent);
    }

    public Hide()
    {
        this.removeChildren();
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