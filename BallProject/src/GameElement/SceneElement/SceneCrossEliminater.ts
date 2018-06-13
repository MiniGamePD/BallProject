class SceneCrossEliminater extends SceneElementBase
{
    public directionBitmap: egret.Bitmap[] = [];
    public directionFrameAnim: SyncFramesAnim[] = [];
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.renderer = new egret.Bitmap(); 
        this.accessory = new egret.DisplayObjectContainer();
        this.canDrop = true;
        this.color = GameElementColor.random;
        this.eliminateMinCount = 1;
        this.elementType = SceneElementType.CrossEliminater;
        this.RefreshTexture();
        this.eliminateSound = "EliminateRow_mp3";
    }

    public RefreshTexture():void
    {
        this.framesAnim = this.CreateFramesAnim();
        this.CreateDirFrameAnim(Direction.Right);
        this.CreateDirFrameAnim(Direction.Up);
        this.CreateDirFrameAnim(Direction.Left);
        this.CreateDirFrameAnim(Direction.Down);
    }

    private CreateFramesAnim(): SyncFramesAnim
    {
        var framesAnim = new SyncFramesAnim();
        framesAnim.Init(<egret.Bitmap>this.renderer, Frame_Anim_CrossEliminater, 150);
        return framesAnim;
    }

    private CreateDirFrameAnim(direction: Direction)
    {
        var framesAnim = new SyncFramesAnim();
        var bitmap = new egret.Bitmap();
        framesAnim.Init(bitmap, Frame_Anim_CrossEliminater_Diretion, 200);
        this.directionBitmap.push(bitmap);
        this.directionFrameAnim.push(framesAnim);
        GameMain.GetInstance().AdapteDisplayObject(bitmap);
        this.accessory.addChild(bitmap);
        bitmap.anchorOffsetY = bitmap.height / 2;
        bitmap.rotation = Tools.GetDirectionRotateAngle(direction);
        bitmap.x = Tools.MoveScenePosX(bitmap.x, direction, Tools.MatchViewElementWidth / 2);
        bitmap.y = Tools.MoveScenePosY(bitmap.y, direction, Tools.MatchViewElementHeight / 2);
    }

    protected UpdateFramesAnim()
    {
        super.UpdateFramesAnim();
        if (this.directionFrameAnim != null
         && this.directionFrameAnim != undefined)
        {
            for (var i = 0; i < this.directionFrameAnim.length; ++i)
            {
                this.directionFrameAnim[i].Update();
            }
        }
    }

    protected GetResPathByColor():string
    {
        return "shizixiao";
    }

    public PlayEliminateAnim()
    {
        this.PlayScaling();
        this.PlayEliminateSound();
        // this.MoveOneSide(Direction.Up);
        // this.MoveOneSide(Direction.Down);
        // this.MoveOneSide(Direction.Left);
        // this.MoveOneSide(Direction.Right);

        this.RemoveDirectionBitmap();

        this.PlayCrossEliminaterEffect([Direction.Down, Direction.Up, Direction.Left, Direction.Right]);
    }

    private RemoveDirectionBitmap()
    {
        if (this.directionBitmap != undefined
           && this.directionBitmap != null)
        {
            for (var i = 0; i < this.directionBitmap.length; ++i)
            {
                if (this.directionBitmap[i] != null
                    && this.directionBitmap[i].parent != null)
                {
                    this.directionBitmap[i].parent.removeChild(this.directionBitmap[i]);
                }
            }
            this.directionBitmap = [];
        }
    }
    public Release()
    {
        this.RemoveDirectionBitmap();
        super.Release();
    }
}