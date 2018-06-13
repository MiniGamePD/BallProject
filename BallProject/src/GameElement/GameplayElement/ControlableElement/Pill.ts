class Pill extends ControlableElement
{    
    public pill1:ScenePill;
    public pill2:ScenePill;
    public rotAngle:number; // 必须是0, 90，180，270中的一个值
    public rotatePosListTemp: number[];

    public constructor()
    {       
        super();         
        this.rotAngle = 0;             
        this.pill1 = new ScenePill(this);
        this.pill1.CreatePillLink();
        this.pill2 = new ScenePill(this);
        this.pill1.SetPillType(PillElementType.left);
        this.pill1.RefreshTexture();
        this.pill2.SetPillType(PillElementType.right);
        this.pill2.RefreshTexture();
        this.pill1.BindElement(this.pill2);

        //坐标表示药丸左下角块的坐标, 初始坐标在瓶子正中间的最上方
        this.InitPos(Scene.Columns/2-1,0);
    }

    private AdjustRotateAngle():number
    {
        if(this.pill1.posx == this.pill2.posx)
        {
            if(this.pill1.posy > this.pill2.posy)
            {
                return 90;
            }
            else 
            {
                return 270;
            }
        }
        else
        {
            if(this.pill1.posx > this.pill2.posx)
            {
                return 180;
            }
            else
            {
                return 0;
            }
        }
    }

    public OnRotateACW()
    {
        this.rotAngle = this.AdjustRotateAngle();

        if (this.rotAngle == 0)
        {
            this.pill1.SetPillType(PillElementType.left);
            this.pill2.SetPillType(PillElementType.right);
        }
        else if (this.rotAngle == 90)
        {
            this.pill1.SetPillType(PillElementType.down);
            this.pill2.SetPillType(PillElementType.up);
        }
        else if (this.rotAngle == 180)
        {
            this.pill1.SetPillType(PillElementType.right);
            this.pill2.SetPillType(PillElementType.left);
        }
        else if (this.rotAngle == 270)
        {
            this.pill1.SetPillType(PillElementType.up);
            this.pill2.SetPillType(PillElementType.down);
        }

        // this.pill1.RefreshTexture();
        // this.pill2.RefreshTexture();
    }
    
    public GetRotateACWPosList(): number[]
    {
        this.rotatePosListTemp = [];
        this.rotatePosListTemp.push(this.pill1.posx);
        this.rotatePosListTemp.push(this.pill1.posy);
        var pill2RotatePos = Tools.RotateACW(this.rotatePosListTemp, [this.pill2.posx, this.pill2.posy]);
        this.rotatePosListTemp.push(pill2RotatePos[0]);
        this.rotatePosListTemp.push(pill2RotatePos[1]);
        return this.rotatePosListTemp;
    }

    protected InitPos(posx:number, posy:number):void
    {
        this.posx = posx;
        this.posy = posy;
        this.pill1.MoveTo(this.posx, this.posy);
        this.pill2.MoveTo(this.posx + 1, this.posy);
    }   

    protected FillSceneElementArray()
    {
        this.sceneElements.push(this.pill1);
        this.sceneElements.push(this.pill2);
    }

    public GetPreViewContainer():egret.DisplayObjectContainer
    {
        var previewContainer = new egret.DisplayObjectContainer();
        var link = this.pill1.CreateLinkPreview();
        var preview1:egret.Bitmap = this.pill1.GetPreView();
        preview1.x = 0;
        preview1.y = 0;
        var preview2:egret.Bitmap = this.pill2.GetPreView();
        preview2.x = Tools.MatchViewElementWidth;
        preview2.y = 0;

        previewContainer.addChild(link);
        previewContainer.addChild(preview1);
        previewContainer.addChild(preview2);
        return previewContainer;
    }

    public GetPreviewSize():number{return 2;}
}

