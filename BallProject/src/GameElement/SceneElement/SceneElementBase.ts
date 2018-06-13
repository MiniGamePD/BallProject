//在scene中占一个格子的元素，处理显示相关，和一些与消除相关逻辑，并转发gameplay的逻辑给到GameplayElement层
abstract class SceneElementBase
{
    public posx: number = 0;
    public posy: number = 0;
    public canDrop: boolean = true;
    public color: GameElementColor;
    public renderer: egret.DisplayObject;
    public dirty: boolean;
    public hasAddToDisplayList: boolean;
    protected resModule: IResModule;
    private bindedElements: SceneElementBase[];
    protected owner: GameplayElementBase;
    public eliminateMinCount: number;
    public eliminateSound: string;
    protected elementType: SceneElementType;
    public accessory: egret.DisplayObjectContainer; //用来放一些除本体外的东西，比如护盾，血条
    public accessoryBg: egret.DisplayObjectContainer; //背景的accessory
    private bubbleShield: egret.Bitmap;
    protected framesAnim: SyncFramesAnim;
    public eliminateDelay: number;
    private isInFever: boolean;

    public constructor(owner: GameplayElementBase) 
    {
        this.owner = owner;
        this.bindedElements = [];
        this.eliminateDelay = 0;
        this.isInFever = false;
        if (this.resModule == null)
        {
            this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        }
    }

    public Adapte(width: number, height: number)
    {
        this.renderer.width = width;
        this.renderer.height = height;
        this.renderer.anchorOffsetX = Tools.MatchViewElementWidth / 2;
        this.renderer.anchorOffsetY = Tools.MatchViewElementHeight / 2;
    }

    public ElementType(): SceneElementType
    {
        return this.elementType;
    }

    public MoveTo(posx: number, posy: number) 
    {
        if (this.posx != posx
            || this.posy != posy) 
        {
            this.posx = posx;
            this.posy = posy;
            this.dirty = true;
        }
    }

    public Move(posx: number, posy: number) 
    {
        this.posx += posx;
        this.posy += posy;
        this.dirty = true;
    }

    protected RandomColor(): GameElementColor 
    {
        return GameElementColorGenerator.RandomColor();
    }

    public RefreshTexture(): void
    {
        let texture: egret.Texture;
        let path = this.GetResPathByColor();
        texture = this.GetTexture(path);
        var bitMap = (<egret.Bitmap>this.renderer)
        if (bitMap != null)
        {
            bitMap.texture = texture;
        }
    }

    public SetRenderPos(x: number, y: number)
    {
        if (this.renderer != null && this.renderer != undefined)
        {
            this.renderer.x = x;
            this.renderer.y = y;
        }

        if (this.accessory != null && this.accessory != undefined)
        {
            this.accessory.x = x;
            this.accessory.y = y;
        }

        if(this.accessoryBg != null && this.accessoryBg != undefined)
        {
            this.accessoryBg.x = x;
            this.accessoryBg.y = y;
        }
    }

    public Update(deltaTime: number)
    {
        if (!this.HasShield())
        {
            this.UpdateFramesAnim();
        }
    }

    protected UpdateFramesAnim()
    {
        if (this.framesAnim != null
        	&& this.framesAnim != undefined)
        {
            this.framesAnim.Update();
        }
    }

    protected abstract GetResPathByColor(): string;

    protected GetTexture(path: string): egret.Texture
    {
        return this.resModule.GetRes(path);
    }

    // 返回捆绑元素的列表
    public GetBindElements(): SceneElementBase[]
    {
        return this.bindedElements;
    }

    // 和某个元素绑定（双向）
    public BindElement(element: SceneElementBase): boolean
    {
        if (element != null)
        {
            let index = this.bindedElements.indexOf(element);
            if (index < 0)
            {
                this.bindedElements.push(element);
                element.BindElement(this);
                return true;
            }
        }
        return false;
    }

    // 和某个元素解除绑定（双向）
    public UnbindElement(element: SceneElementBase): boolean
    {
        if (element != null)
        {
            let index = this.bindedElements.indexOf(element);
            if (index >= 0)
            {
                this.bindedElements.splice(index, 1)
                element.UnbindElement(this);
                return true;
            }
        }
        return false;
    }

    // 和所有元素绑定（双向）    
    public UnbindAllElement()
    {
        for (var index = this.bindedElements.length - 1; index >= 0; --index)
        {
            var element = this.bindedElements[index];
            if (element != null)
            {
                element.UnbindElement(this);
            }
        }
        this.bindedElements = [];
    }

    //处理一个scene element被消除之后的逻辑，返回true来让scene继续进入消除检测
    public OnEliminate(): boolean
    {
        return this.owner.OnEliminate();
    }

    public BlockWidth(): number
    {
        return this.owner.blockWidth;
    }

    public BlockHeight(): number
    {
        return this.owner.blockHeight;
    }

    public IsOwnerAlive(): boolean
    {
        return this.owner.IsAlive();
    }

    public HasShield(): boolean
    {
        return this.owner.HasShield();
    }

    public AddShield(shield: number)
    {
        this.owner.AddShield(shield);
    }

    public PlayEliminateAnim()
    {
        this.PlayBoomEffect();
        this.PlayScaling();
        this.PlayEliminateSound();
    }

    public PlayEliminateSound()
    {
        if (this.eliminateSound != null
			&& this.eliminateSound != undefined
            && this.eliminateSound != "")
        {
            var playSoundEvent = new PlaySoundEvent(this.eliminateSound , 1);
		    GameMain.GetInstance().DispatchEvent(playSoundEvent);
        }
    }

    protected PlayParticalEff()
    {
        var param = new PaPlayParticalParam;
        param.textureName = "Particle_Boom_Red";
        param.jsonName = "Particle_Boom";
        param.duration = 1000;
        param.emitDuration = 100;
        param.posX = Tools.ElementPosToGameStagePosX(this.posx);
        param.posY = Tools.ElementPosToGameStagePosY(this.posy);
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
    }

    protected PlayCrossEliminaterEffect(dir: Direction[])
    {
        var startX = Tools.ElementPosToGameStagePosX(this.posx);
        var startY = Tools.ElementPosToGameStagePosY(this.posy);
        var param = new PaPlayCrossEliminaterEffectParam;
        param.pos = new egret.Point(startX, startY);
        param.direction = dir;
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
    }

    protected PlayScaling()
    {
        var param = new PaScalingParam;
        param.displayObj = this.renderer;
        param.duration = 100;
        param.targetScaleX = 0;
        param.targetScaleY = 0;
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
    }

    protected PlayBoomEffect()
    {
        var playEffectParam = new PaPlayFramesAnimParam()
		playEffectParam.pos = new egret.Point(Tools.ElementPosToGameStagePosX(this.posx), Tools.ElementPosToGameStagePosY(this.posy));
		playEffectParam.textNameSeq = Frame_Anim_Pill_Boom_Effect;
		playEffectParam.interval = 100;
		playEffectParam.times = 1;
        playEffectParam.scale = new egret.Point(2,2);
		var event = new PlayProgramAnimationEvent();
        event.param = playEffectParam;
        GameMain.GetInstance().DispatchEvent(event);
    }

    public MoveOneSide(dir: Direction)
    {
        var startX = Tools.ElementPosToGameStagePosX(this.posx);
        var startY = Tools.ElementPosToGameStagePosY(this.posy);
        var particleOffset = -100;
        var targetOffset = Math.max(GameMain.GetInstance().GetStageHeight(),
            GameMain.GetInstance().GetStageWidth())

        var particalParam = new PaMoveParticalParam;
        particalParam.textureName = "huojian";
        particalParam.jsonName = "huojian";
        particalParam.duration = 1000;
        particalParam.flyDuration = 1000;
        particalParam.stayDuration = 0;
        particalParam.stratPosX = Tools.MoveScenePosX(startX, dir, particleOffset);
        particalParam.stratPosY = Tools.MoveScenePosY(startY, dir, particleOffset);
        particalParam.endPosX = Tools.MoveScenePosX(startX, dir, targetOffset + particleOffset);
        particalParam.endPosY = Tools.MoveScenePosY(startY, dir, targetOffset + particleOffset);
        particalParam.isMoveEmitter = true;
        var event = new PlayProgramAnimationEvent();
        event.param = particalParam;
        GameMain.GetInstance().DispatchEvent(event);

        var headPic = this.resModule.CreateBitmapByName("huojian1");
        headPic.anchorOffsetX = headPic.width / 2;
        headPic.anchorOffsetY = headPic.height / 2;
        headPic.x = startX;
        headPic.y = startY;
        GameMain.GetInstance().AdapteDisplayObjectScale(headPic);
        GameMain.GetInstance().GetAdaptedStageContainer().addChild(headPic);
        var movingParam = new PaMovingParam;
        movingParam.displayObj = headPic;
        movingParam.duration = 1000;
        movingParam.targetPosX = Tools.MoveScenePosX(startX, dir, targetOffset);
        movingParam.targetPosY = Tools.MoveScenePosY(startY, dir, targetOffset);
        movingParam.needRotate = true;
        movingParam.needRemoveOnFinish = true;
        var event = new PlayProgramAnimationEvent();
        event.param = movingParam;
        GameMain.GetInstance().DispatchEvent(event);
    }

    public GetPreView(): egret.Bitmap
    {
        var resPath = this.GetResPathByColor();
        if (resPath != null)
        {
            var res: IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
            var preview = res.CreateBitmapByName(resPath);
            preview.width = Tools.MatchViewElementWidth;
            preview.height = Tools.MatchViewElementHeight;
            preview.anchorOffsetX = Tools.MatchViewElementWidth / 2;
            preview.anchorOffsetY = Tools.MatchViewElementHeight / 2;
            return preview;
        }
        return null;
    }

    public PlayShieldCreateAnim()
    {
        if (this.bubbleShield == undefined
            || this.bubbleShield == null)
        {
            var res: IResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
            this.bubbleShield = res.CreateBitmapByName("pd_res_json.Shield");
            this.bubbleShield.width = Tools.MatchViewElementWidth;
            this.bubbleShield.height = Tools.MatchViewElementHeight;
            this.bubbleShield.anchorOffsetX = Tools.MatchViewElementWidth / 2;
            this.bubbleShield.anchorOffsetY = Tools.MatchViewElementHeight / 2;
            this.accessory.addChild(this.bubbleShield);
        }
    }

    public PlayShieldBreakAnim()
    {
        if (this.bubbleShield != undefined
            && this.bubbleShield != null)
        {
            var particalParam = new PaPlayParticalParam();
            particalParam.textureName = "ice_Boom";
            particalParam.jsonName = "ice_Boom";
            particalParam.duration = 2000;
            particalParam.emitDuration = 100;
            particalParam.posX = Tools.ElementPosToGameStagePosX(this.posx);
            particalParam.posY = Tools.ElementPosToGameStagePosY(this.posy);
            var event = new PlayProgramAnimationEvent();
            event.param = particalParam;
            GameMain.GetInstance().DispatchEvent(event);

            this.accessory.removeChild(this.bubbleShield);
            this.bubbleShield = null;
        }
        this.PlayEliminateSound();
    }



    public SetFeverState(isFever: boolean)
    {
        this.isInFever = isFever;
    }

    public IsInFeverState(): boolean
    {
        return this.isInFever;
    }

    public Release()
    {
        if (this.renderer != null
            && this.renderer != undefined
            && this.renderer.parent != null)
        {
            this.renderer.parent.removeChild(this.renderer);
        }
        this.renderer = null;

        if (this.accessory != undefined
            && this.accessory != null
            && this.accessory.parent != null)
        {
            this.accessory.parent.removeChild(this.accessory);
        }
        this.accessory = null;

        if (this.accessoryBg != undefined
            && this.accessoryBg != null
            && this.accessoryBg.parent != null)
        {
            this.accessoryBg.parent.removeChild(this.accessoryBg);
        }
        this.accessoryBg = null;
    }
}

enum GameElementColor 
{
    red,
    blue,
    yellow,
    random,
}

class GameElementColorGenerator
{
    public static RandomColor(iDontWantThatDolor?: GameElementColor): GameElementColor
    {
        let result: GameElementColor = undefined;
        do
        {
            let random = Math.floor(Math.random() * 3);
            if (random == 0) 
            {
                result = GameElementColor.red;
            }
            else if (random == 1) 
            {
                result = GameElementColor.blue;
            }
            else 
            {
                result = GameElementColor.yellow;
            }
        }
        while (iDontWantThatDolor != undefined && result == iDontWantThatDolor)

        return result;
    }

    public PlayEliminateAnim()
    {
    }
}

enum SceneElementType
{
    None,
    Pill,
    Virus,
    Vitamins,
    ColunmEliminater,
    RowEliminater,
    CrossEliminater,
    PlaceHolder,
    Boom,
    Empty,
}