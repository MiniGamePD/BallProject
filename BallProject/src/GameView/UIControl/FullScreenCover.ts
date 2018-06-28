class FullScreenCover extends egret.DisplayObjectContainer
{
    private cover:egret.Bitmap;

    public constructor(color:number, alpha:number)
    {
        super();

        var res = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        this.cover = res.CreateBitmapByName("pd_res_json.bgCover");
        this.cover.width = GameMain.GetInstance().GetStageWidth()+2000;
        this.cover.height = GameMain.GetInstance().GetStageHeight()+2000;
        this.cover.x = -1000;
        this.cover.y = -1000;
        this.cover.alpha = alpha;
        this.addChild(this.cover);
    }
}