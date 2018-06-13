class ComboItem extends egret.DisplayObjectContainer
{
    private comboSprite:egret.Bitmap;
    private comboNumTenPlace:egret.Bitmap;
    private comboNumOnePlace:egret.Bitmap;
    private comboEvaluation:egret.Bitmap;
    private res:IResModule;
    private comboTimer:egret.Timer;
    private evaluationTimer:egret.Timer;

    public constructor()
    {
        super();
        this.res = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);

        this.comboSprite = this.res.CreateBitmapByName("pd_res_json.lianxiao");
        this.comboSprite.anchorOffsetX = this.comboSprite.width / 2;
        this.comboSprite.anchorOffsetY = this.comboSprite.height / 2;
        this.comboSprite.x = GameMain.GetInstance().GetStageWidth() / 2 - 50;
        this.comboSprite.y = 250;
        GameMain.GetInstance().AdapteDisplayObject(this.comboSprite);
    }

    public Init()
    {
    }

    public Release()
    {
    }

    public ShowCombo(comboNum:number)
    {
        if(comboNum > 99)
        {
            comboNum = 99;
        }

        var tenPlace = comboNum / 10;
        var onePlace = comboNum % 10;

        this.comboNumTenPlace = this.res.CreateBitmapByName("pd_res_json.lianxiao" + tenPlace);
        this.comboNumTenPlace.anchorOffsetX = this.comboNumTenPlace.width / 2;
        this.comboNumTenPlace.anchorOffsetY = this.comboNumTenPlace.height / 2;
        this.comboNumTenPlace.x = GameMain.GetInstance().GetStageWidth() / 2 + 75;
        this.comboNumTenPlace.y = 250;
        GameMain.GetInstance().AdapteDisplayObject(this.comboNumTenPlace);

        this.comboNumOnePlace = this.res.CreateBitmapByName("pd_res_json.lianxiao" + onePlace);
        this.comboNumOnePlace.anchorOffsetX = this.comboNumOnePlace.width / 2;
        this.comboNumOnePlace.anchorOffsetY = this.comboNumOnePlace.height / 2;
        this.comboNumOnePlace.x = this.comboNumTenPlace.x + this.comboNumTenPlace.width;
        this.comboNumOnePlace.y = 250;
        GameMain.GetInstance().AdapteDisplayObject(this.comboNumTenPlace);

        this.addChild(this.comboSprite);
        this.addChild(this.comboNumTenPlace);
        this.addChild(this.comboNumOnePlace);

        if(this.comboTimer != null)
        {
            this.comboTimer.stop();
        }

        this.comboTimer = new egret.Timer(1000, 1);
        this.comboTimer.addEventListener(egret.TimerEvent.TIMER, this.HideCombo, this);
        this.comboTimer.start();
    }

    private HideCombo()
    {
        this.removeChild(this.comboSprite);
        this.removeChild(this.comboNumTenPlace);
        this.removeChild(this.comboNumOnePlace);
        this.comboTimer = null;
    }

    public ShowEvaluation(evaluation:string)
    {
        this.comboEvaluation = this.res.CreateBitmapByName("pd_res_json." + evaluation);
        this.comboEvaluation.anchorOffsetX = this.comboEvaluation.width / 2;
        this.comboEvaluation.anchorOffsetY = this.comboEvaluation.height / 2;
        this.comboEvaluation.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.comboEvaluation.y = 400;
        GameMain.GetInstance().AdapteDisplayObject(this.comboEvaluation);

        this.addChild(this.comboEvaluation);

        this.evaluationTimer = new egret.Timer(1000, 1);
        this.evaluationTimer.addEventListener(egret.TimerEvent.TIMER, this.HideEvaluation, this);
        this.evaluationTimer.start();
    }

    private HideEvaluation()
    {
        this.removeChild(this.comboEvaluation);
        this.evaluationTimer = null;
    }
}