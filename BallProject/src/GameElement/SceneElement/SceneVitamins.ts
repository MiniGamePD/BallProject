class SceneVitamins extends SceneElementBase
{
    public constructor(owner:GameplayElementBase)
    {
        super(owner);
        this.renderer = new egret.Bitmap();       
        this.color = this.RandomColor(); 
        this.canDrop = true;
        this.elementType = SceneElementType.Vitamins;
        this.RefreshTexture();
        this.eliminateMinCount = Scene.EliminateMinCount;
        this.eliminateSound = "Boom_mp3";
    }

    protected GetResPathByColor():string
    {
        var path = "pd_res_json.Vitamins_";
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

    protected PlayBoomEffect()
	{
		var playEffectParam = new PaPlayFramesAnimParam()
		playEffectParam.pos = new egret.Point(Tools.ElementPosToGameStagePosX(this.posx), Tools.ElementPosToGameStagePosY(this.posy));
		playEffectParam.textNameSeq = Frame_Anim_SceneBoom_Effect;
		playEffectParam.interval = 50;
		playEffectParam.times = 1;
        playEffectParam.scale = new egret.Point(2,2);
		var event = new PlayProgramAnimationEvent();
        event.param = playEffectParam;
        GameMain.GetInstance().DispatchEvent(event);
	}
}