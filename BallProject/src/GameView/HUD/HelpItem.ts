class HelpItem extends egret.DisplayObjectContainer
{
    private helpDetail:egret.Bitmap;
    private helpIcon:egret.TextField;
    private bgCover:FullScreenCover;

    public constructor(x:number, y:number, width:number, height:number)
    {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        var res:IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);

        this.helpDetail = res.CreateBitmapByName("pd_res_json.NewBackGround");
        this.helpDetail.width = GameMain.GetInstance().GetStageWidth() * 0.8;
        this.helpDetail.height = GameMain.GetInstance().GetStageHeight() * 0.8;
        this.helpDetail.anchorOffsetX = this.helpDetail.width / 2;
        this.helpDetail.anchorOffsetY = this.helpDetail.height / 2;
        this.helpDetail.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.helpDetail.y = GameMain.GetInstance().GetStageHeight() / 2;

        this.bgCover = new FullScreenCover(0x000000, 0.8);
        this.bgCover.touchEnabled = true;
        this.bgCover.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnCloseHelp, this);

        this.helpIcon = new egret.TextField();
        this.helpIcon.x = 100;
        this.helpIcon.y = 25;
        this.helpIcon.width = 50;
        this.helpIcon.height = 50;
        this.helpIcon.textAlign = "center";
        this.helpIcon.text = "?";
        this.helpIcon.size = 60;
        this.addChild(this.helpIcon);

        this.helpIcon.touchEnabled = true;
        this.helpIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClickHelp, this);
    }

    public Init()
    {

    }

    public Release()
    {

    }

    private OnClickHelp()
    {
        this.addChild(this.bgCover);
        this.addChild(this.helpDetail);
    }

    private OnCloseHelp()
    {
        this.removeChild(this.bgCover);
        this.removeChild(this.helpDetail);
    }
}