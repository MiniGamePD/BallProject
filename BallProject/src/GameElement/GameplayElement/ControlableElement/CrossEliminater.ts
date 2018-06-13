//横排消除
class CrossEliminater extends EliminateTool
{
    private sceneCrossEliminater:SceneCrossEliminater;
    private range: number;

    public constructor()
    {
        super();
        this.sceneCrossEliminater = new SceneCrossEliminater(this);
        this.sceneCrossEliminater.MoveTo(Scene.Columns/2-1,0);
        this.eliminateType = EliminateType.Cloumn;
        this.range = Math.max(Scene.Rows, Scene.Columns);
    }

    //todo
    public OnRotateACW(){}
    public GetRotateACWPosList(): number[]
    {
        return null;
    }

    protected FillSceneElementArray()
    {
        this.sceneElements.push(this.sceneCrossEliminater);
    }

    public OnEliminate():boolean
    {
        super.OnEliminate();
        var specialEliminateEvent = new SpecialEliminateRequestEvent();
        specialEliminateEvent.triggerElement = this.sceneCrossEliminater;
        specialEliminateEvent.targetPosList = Tools.GetCrossPosList(this.sceneCrossEliminater.posx, this.sceneCrossEliminater.posy, this.range);
        GameMain.GetInstance().DispatchEvent(specialEliminateEvent);
        return true;
    }

    public GetPreViewContainer():egret.DisplayObjectContainer
    {
        var previewContainer = new egret.DisplayObjectContainer();
        var preview:egret.Bitmap = this.sceneCrossEliminater.GetPreView();
        previewContainer.addChild(preview);
        return previewContainer;
    }
}