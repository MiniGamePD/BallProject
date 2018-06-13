class ReadyGoItem extends egret.DisplayObjectContainer
{
    private ready:egret.Bitmap;
    private go:egret.Bitmap;
    private timer:egret.Timer;

    public constructor(x:number, y:number, width:number, height:number)
    {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        var res:IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        this.ready = res.CreateBitmapByName("pd_res_json.ready");
        this.go = res.CreateBitmapByName("pd_res_json.go");
        this.ready.anchorOffsetX = this.ready.width / 2;
        this.ready.anchorOffsetY = this.ready.height / 2;
        this.go.anchorOffsetX = this.go.width / 2;
        this.go.anchorOffsetY = this.go.height / 2;
        this.ready.x = this.go.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.ready.y = this.go.y = 400;
        GameMain.GetInstance().AdapteDisplayObject(this.ready);
        GameMain.GetInstance().AdapteDisplayObject(this.go);
    }

    public Play()
    {
        this.removeChildren();
        this.addChild(this.ready);

        this.timer = new egret.Timer(1000, 1);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.OnReadyDone, this);
        this.timer.start();
        
        let soundEvent = new PlaySoundEvent("Ready_mp3", 1);
        GameMain.GetInstance().DispatchEvent(soundEvent);
    }

    private OnReadyDone(event:egret.TimerEvent)
    {
        this.removeChildren();
        this.addChild(this.go);

        let soundEvent = new PlaySoundEvent("Go_mp3", 1);
        GameMain.GetInstance().DispatchEvent(soundEvent);

        this.timer = new egret.Timer(500, 1);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.OnGoDone, this);
        this.timer.start();
    }

    private OnGoDone(event:egret.TimerEvent)
    {
        this.removeChildren();
        this.timer = null;
    }
}