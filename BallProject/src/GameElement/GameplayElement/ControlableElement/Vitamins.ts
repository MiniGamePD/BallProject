//维他命-炸弹
class Vitamins extends EliminateTool
{
    private sceneVitamins:SceneVitamins;
    private range:number; //范围

    public constructor()
    {
        super();
        this.range = 1;
        this.sceneVitamins = new SceneVitamins(this);
        this.sceneVitamins.MoveTo(Scene.Columns/2-1,0);
        this.eliminateType = EliminateType.Range;
    }

    //todo
    public OnRotateACW(){}
    public GetRotateACWPosList(): number[]
    {
        return null;
    }

    protected FillSceneElementArray()
    {
        this.sceneElements.push(this.sceneVitamins);
    }

    public OnEliminate():boolean
    {
        super.OnEliminate();
        var specialEliminateEvent = new SpecialEliminateRequestEvent();
        specialEliminateEvent.triggerElement = this.sceneVitamins;
        specialEliminateEvent.targetPosList = Tools.GetSquareRangePosList(this.sceneVitamins.posx, this.sceneVitamins.posy, this.range);
        GameMain.GetInstance().DispatchEvent(specialEliminateEvent);
        return true;
    }

    public GetPreViewContainer():egret.DisplayObjectContainer
    {
        var previewContainer = new egret.DisplayObjectContainer();
        var preview:egret.Bitmap = this.sceneVitamins.GetPreView();
        previewContainer.addChild(preview);
        return previewContainer;
    }
}