class ScenePill extends SceneElementBase
{
    public mPillType: PillElementType;
    public mLink: egret.Bitmap;

    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.renderer = new egret.Bitmap();
        this.color = this.RandomColor();
        this.canDrop = true;
        this.eliminateMinCount = Scene.EliminateMinCount;
        this.elementType = SceneElementType.Pill;  
        this.eliminateSound = "VirusEliminate_mp3";
    }

    public CreatePillLink()
    {
        this.mLink = this.resModule.CreateBitmapByName("pd_res_json.Pill_Middle");
        this.mLink.width = Tools.MatchViewElementWidth;
        this.mLink.height = Tools.MatchViewElementHeight;
        this.mLink.anchorOffsetX = this.mLink.width / 2;
        this.mLink.anchorOffsetY = this.mLink.height / 2;
        this.accessoryBg = new egret.DisplayObjectContainer();
        this.accessoryBg.addChild(this.mLink);
    }

    public DeletePillLink()
    {
        if(this.mLink != undefined)
        {
            this.accessoryBg.removeChild(this.mLink);
            this.mLink = undefined;
        }
    }

    public CreateLinkPreview():egret.Bitmap
    {
        var link = this.resModule.CreateBitmapByName("pd_res_json.Pill_Middle");
        link.width = Tools.MatchViewElementWidth;
        link.height = Tools.MatchViewElementHeight;
        link.anchorOffsetX = this.mLink.width / 2;
        link.anchorOffsetY = this.mLink.height / 2;
        link.x = link.width / 2;
        link.y = 0;
        link.rotation = 90;
        return link;
    }

    public SetPillType(pillType: PillElementType)
    {
        this.mPillType = pillType;

        if(pillType == PillElementType.Single)
        {
            this.DeletePillLink();
        }
        else if (pillType == PillElementType.left)
        {
            if(this.mLink != undefined)
            {
                this.mLink.x = Tools.MatchViewElementWidth / 2;
                this.mLink.y = 0;
                this.mLink.rotation = 90;
            }
        }   
        else if (pillType == PillElementType.right)
        {
            if(this.mLink != undefined)
            {
                this.mLink.x = -Tools.MatchViewElementWidth / 2;
                this.mLink.y = 0;
                this.mLink.rotation = 90;
            }
        }   
        else if (pillType == PillElementType.up)
        {
            if(this.mLink != undefined)
            {
                this.mLink.x = 0;
                this.mLink.y = Tools.MatchViewElementHeight / 2;
                this.mLink.rotation = 0;
            }
        }  
        else if (pillType == PillElementType.down)
        {
            if(this.mLink != undefined)
            {
                this.mLink.x = 0;
                this.mLink.y = -Tools.MatchViewElementHeight / 2;
                this.mLink.rotation = 0;
            }
        }

        this.dirty = true;
    }

    public RefreshTexture(): void
    {
        super.RefreshTexture();

        var textureRotate = 0;
        var scaleX = 1;
        switch (this.mPillType)
        {
            case PillElementType.left:
                {
                    textureRotate = 0;
                    scaleX = 1;
                    break;
                }
            case PillElementType.right:
                {
                    textureRotate = 0;
                    scaleX = -1;
                    break;
                }
            case PillElementType.up:
                {
                    textureRotate = 90;
                    scaleX = 1;
                    break;
                }
            case PillElementType.down:
                {
                    textureRotate = 90;
                    scaleX = -1;
                    break;
                }
        }
        // this.renderer.rotation = textureRotate;
        this.renderer.scaleX = scaleX;
    }

    protected GetResPathByColor():string
    {
        var resPath = "pd_res_json.Pill_";
        // if (this.mPillType == PillElementType.Single)
        {
            resPath += "Single_"
        }
        switch (this.color)
        {
            case GameElementColor.red:
                resPath += "Red";
                break;
            case GameElementColor.blue:
                resPath += "Blue";
                break;
            case GameElementColor.yellow:
                resPath += "Yellow";
                break;
            default:
                if (DEBUG)
                {
                    console.log("Unknow Color:" + this.color);
                }
                break;
        }
        return resPath;
    }

    // 删除捆绑元素后，重新计算药丸的类型
    public UnbindElement(element: SceneElementBase): boolean
    {
        var result = super.UnbindElement(element);
        if (result
            && this.GetBindElements().length == 0)
        {
            this.SetPillType(PillElementType.Single);
        }
        return result;
    }

    // 删除捆绑元素后，重新计算药丸的类型
    public UnbindAllElement()
    {
        super.UnbindAllElement();
        this.SetPillType(PillElementType.Single);
    }    

    public OnRotated()
    {
        var ownerPill:Pill = <Pill>this.owner;
        ownerPill.OnRotateACW();
    }
}

enum PillElementType
{
    left,   //左边
    right,  //右边
    up,     //上边
    down,   //下边
    Single, //独立
}