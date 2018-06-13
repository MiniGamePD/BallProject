//横排消除
class ColumnEliminater extends EliminateTool
{
    private sceneColumnEliminater:SceneColunmEliminater;
    private range: number;

    public constructor()
    {
        super();
        this.sceneColumnEliminater = new SceneColunmEliminater(this);
        this.sceneColumnEliminater.MoveTo(Scene.Columns/2-1,0);
        this.eliminateType = EliminateType.Cloumn;
        this.range = Scene.Rows;
    }

    //todo
    public OnRotateACW(){}
    public GetRotateACWPosList(): number[]
    {
        return null;
    }

    protected FillSceneElementArray()
    {
        this.sceneElements.push(this.sceneColumnEliminater);
    }

    public OnEliminate():boolean
    {
        super.OnEliminate();
        var specialEliminateEvent = new SpecialEliminateRequestEvent();
        specialEliminateEvent.triggerElement = this.sceneColumnEliminater;
        specialEliminateEvent.targetPosList = Tools.GetColunmPosList(this.sceneColumnEliminater.posx, this.sceneColumnEliminater.posy, this.range);
        GameMain.GetInstance().DispatchEvent(specialEliminateEvent);
        return true;
    }

    public GetPreViewContainer():egret.DisplayObjectContainer
    {
        var previewContainer = new egret.DisplayObjectContainer();
        var preview:egret.Bitmap = this.sceneColumnEliminater.GetPreView();
        previewContainer.addChild(preview);
        return previewContainer;
    }
}