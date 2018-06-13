class Boom  extends EliminateTool
{
    private sceneBoom:SceneBoom;

    public constructor()
    {
        super();
        this.sceneBoom = new SceneBoom(this);
        this.sceneBoom.MoveTo(Scene.Columns/2-1,0);
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
        this.sceneElements.push(this.sceneBoom);
    }

    public OnEliminate():boolean
    {
        super.OnEliminate();
        var specialEliminateEvent = new SpecialEliminateRequestEvent();
        specialEliminateEvent.triggerElement = this.sceneBoom;
        specialEliminateEvent.targetPosList = Tools.GetBoomRangePosList(this.sceneBoom.posx, this.sceneBoom.posy);
        GameMain.GetInstance().DispatchEvent(specialEliminateEvent);
        return true;
    }

    public GetPreViewContainer():egret.DisplayObjectContainer
    {
        var previewContainer = new egret.DisplayObjectContainer();
        var preview:egret.Bitmap = this.sceneBoom.GetPreView();
        previewContainer.addChild(preview);
        return previewContainer;
    }
}