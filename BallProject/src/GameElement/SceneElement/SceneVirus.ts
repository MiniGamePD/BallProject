class SceneVirus extends SceneElementBase
{
    private animType: SceneVirusAnimType;
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.color = this.RandomColor(); 
        this.renderer = new egret.Bitmap();
        this.accessory = new egret.DisplayObjectContainer();
        this.canDrop = true;
        this.eliminateMinCount = Scene.EliminateMinCount;
        this.elementType = SceneElementType.Virus;
        this.RefreshTexture();
        this.eliminateSound = "VirusEliminate_mp3";
        this.animType = SceneVirusAnimType.Idle;
    }

    private GetAnimDelay(): number
    {
        var delay = 0;
        if (this.animType == SceneVirusAnimType.Idle)
        {
            switch(this.color)
            {
                case GameElementColor.red:
                    delay = 0;
                    break;
                case GameElementColor.blue:
                    delay = 250;
                    break;
                case GameElementColor.yellow:
                    delay = 500;
                    break;
            }
        }
        return delay;
    }

    private GetFramesAnimIdle()
    {
        if (this.color == GameElementColor.red)
        {
            return Frame_Anim_Virus_Red_Idle;
        }
        else if (this.color == GameElementColor.blue)
        {
            return Frame_Anim_Virus_Blue_Idle;
        }
        else if (this.color == GameElementColor.yellow)
        {
            return Frame_Anim_Virus_Yellow_Idle;
        }
        return [];
    }
    

    private GetFramesAnimFever()
    {
        if (this.color == GameElementColor.red)
        {
            return Frame_Anim_Virus_Red_Fever;
        }
        else if (this.color == GameElementColor.blue)
        {
            return Frame_Anim_Virus_Blue_Fever;
        }
        else if (this.color == GameElementColor.yellow)
        {
            return Frame_Anim_Virus_Yellow_Fever;
        }
        return [];
    }

    private GetCurAnimSeq()
    {
        if (this.animType == SceneVirusAnimType.Idle)
        {
            return this.GetFramesAnimIdle();
        }
        else if (this.animType == SceneVirusAnimType.Fever)
        {
            return this.GetFramesAnimFever();
        }
        return [];
    }

    public SetFeverState(isFever: boolean)
    {
        super.SetFeverState(isFever);
        var lastAnimType = this.animType;
        this.animType = isFever ? SceneVirusAnimType.Fever : SceneVirusAnimType.Idle;
        if (lastAnimType != this.animType)
        {
            this.RefreshTexture();
        }
    }

    private GetAnimIntervel()
    {
        if (this.animType == SceneVirusAnimType.Idle)
        {
            return 100;
        }
        else if (this.animType == SceneVirusAnimType.Fever)
        {
            return 150;
        }
        return 0;
    }

    private CreateFramesAnim(): SyncFramesAnim
    {
        var framesAnim = new SyncFramesAnim();
        framesAnim.Init(<egret.Bitmap>this.renderer, this.GetCurAnimSeq(), this.GetAnimIntervel(), this.GetAnimDelay());
        return framesAnim;
    }

    public RefreshTexture():void
    {
        this.framesAnim = this.CreateFramesAnim();
    }

    private GetResPrePath()
    {
        var path = "pd_res_json.Virus_";
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

    protected GetResPathByColor():string
    {
        return this.GetResPrePath() + "_Idle1";
    }

    public PlayEliminateAnim()
    {
        this.PlayBoomEffect();
        this.PlayScaling();
        this.PlayEliminateSound();
    }
}

enum SceneVirusAnimType
{
    Idle,
    Fever,
}