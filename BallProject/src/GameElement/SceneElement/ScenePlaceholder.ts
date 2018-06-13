class ScenePlaceholder extends SceneElementBase
{
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        //纯粹的placeHolder不显示任何东西
        this.renderer = null;

        //For DEBUG
        // this.renderer = new egret.Bitmap();
        // let path = "pd_res_json.Virus_Yellow";
        // this.renderer.texture = this.GetTexture(path);
        // this.renderer.alpha = 0.2;
        //For DEBUG

        this.color = owner.color;
        this.canDrop = false;
        this.eliminateMinCount = Scene.EliminateMinCount;
        this.elementType = SceneElementType.PlaceHolder;
    }

    public BlockWidth():number
    {
        return 1;
    }

    public BlockHeight():number
    {
        return 1;
    }

    protected GetResPathByColor():string
    {
        return null;
    }
}