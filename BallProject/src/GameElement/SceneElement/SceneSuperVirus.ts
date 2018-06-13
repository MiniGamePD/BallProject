class SceneSuperVirus extends ScenePlaceholder
{
    private hpBar:ProgressBar;

    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.renderer = new egret.Bitmap(); 

        var offset = this.ArrangeHpBarPosByColor();
        offset.x *= Tools.MatchViewElementWidth;
        offset.y *= Tools.MatchViewElementHeight;
        var hpBarBgRect = new egret.Rectangle(offset.x, offset.y, Tools.MatchViewElementWidth * 1.5, Tools.MatchViewElementHeight * 0.5);
        var dx = hpBarBgRect.width * 0.05;
        var dy = hpBarBgRect.height * 0.05;
        var hpBarFgRect = hpBarBgRect.clone();
        hpBarFgRect.inflate(-dx, -dy);
        this.hpBar = new ProgressBar("pd_res_json.Pill_Bg", hpBarBgRect, "pd_res_json.Bottle2", hpBarFgRect);
        this.accessory.addChild(this.hpBar);

        this.canDrop = false;
        this.eliminateMinCount = Scene.EliminateMinCount;
        this.elementType = SceneElementType.PlaceHolder;
        this.RefreshTexture();
    }

    protected GetResPathByColor():string
    {
        var path = "pd_res_json.Boss_";
        switch(this.color)
        {
            case GameElementColor.red:
                path += "Red";
                break;
            case GameElementColor.blue:
                path += "Blue";
                break;
            case GameElementColor.yellow:
                path += "Yellow";
                break;
            default:
                if(DEBUG)
                {
                    console.log("Unknow Color:" + this.color);
                }    
                break;
        }
        return path;
    }

    public BlockWidth():number
    {
        return this.owner.blockWidth;
    }

    public BlockHeight():number
    {
        return this.owner.blockHeight;
    }

    private ArrangeHpBarPosByColor():egret.Point
    {
        var result:egret.Point = new egret.Point();
        if(this.color == GameElementColor.red)
        {
            //2x4
            // @@
            // @@
            // @@
            // @@
            result.x = -0.25;
            result.y = 3;
        }
        else if(this.color == GameElementColor.blue)
        {
            //3x3
            // @@@
            // @ @
            // @@@
            result.x = 0.25;
            result.y = 2;
        }
        else if(this.color == GameElementColor.yellow)
        {
            //4x2
            // @@@@
            // @@@@
            result.x = 0.75;
            result.y = 1;
        }

        return result;
    }

    public SetHpBarProgress(progress:number)
    {
        this.hpBar.SetProgress(progress);
    }
}