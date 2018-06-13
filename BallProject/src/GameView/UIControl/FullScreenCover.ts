class FullScreenCover extends egret.Shape
{
    public constructor(color:number, alpha:number)
    {
        super();
        this.graphics.beginFill(color, alpha);
        this.graphics.drawRect(-1000,-1000,
            GameMain.GetInstance().GetStageWidth()+2000,GameMain.GetInstance().GetStageHeight()+2000);
        this.graphics.endFill();
    }
}