class LobbyView extends GameView
{
    private mResModule: IResModule;
    private mStageWidth: number;
    private mStageHeight: number;
    private textField: egret.TextField;
    private particleSys: particle.GravityParticleSystem;

    public CreateView(): void
    {
        this.mResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        this.mStageWidth = GameMain.GetInstance().GetStageWidth();
        this.mStageHeight = GameMain.GetInstance().GetStageHeight();

        this.LoadBackGround();
        this.PlayBgm();
    }

    private LoadBackGround()
    {
        let bg = this.mResModule.CreateBitmapByName("pd_res_json.NewBackGround");
        this.addChild(bg);
        // bg.width = this.mStageWidth;
        // bg.height = this.mStageHeight;

        this.textField = new egret.TextField();
        this.textField.x = 0;
        this.textField.y = this.mStageHeight / 4;
        this.textField.width = this.mStageWidth;
        this.textField.height = 100;
        this.textField.rotation = -5;
        this.textField.fontFamily = "Impact";
        this.textField.size *= 2;
        this.textField.textAlign = "center";
        this.textField.text = "Pocket Doctor";
        this.addChild(this.textField);

        this.mAdaptedStage = GameMain.GetInstance().GetAdaptedStageContainer();;

        var shape: egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0x00A2E8);
        shape.graphics.drawRect(this.mStageWidth / 2 - 100, this.mStageHeight / 5 * 3, 200, 100);
        shape.graphics.endFill();
        this.addChild(shape);

        //设置显示对象可以相应触摸事件
        shape.touchEnabled = true;
        //注册事件
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClickStartGame, this);

        var text: egret.TextField = new egret.TextField();
        text.text = "start game";
        text.x = 0;
        text.y = this.mStageHeight / 5 * 3;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.width = this.mStageWidth;
        text.height = 100;
        this.addChild(text);
        

        // this.PlayParticle();
        // this.PlayParticleAnim();
        // this.AddMovePartical();

        this.PlayLightningAnim(text);
        // this.PlayMoving(text);
        // this.PlayDynamicMoving();

        var angle = Tools.GetRotateAngle(0, 0, 1, 1);
        egret.log("angle = " + angle);
    }

    private OnClickStartGame(): void
    {
        egret.log("OnClickStartGame");

        GameMain.GetInstance().SwitchGameState(GameStateType.Match);
    }

    private PlayParticle()
    {
        // var texture = RES.getRes("Virus_Red");
        // var config = RES.getRes("newParticle_json");
        // this.particleSys = this.mResModule.CreateParticleByKey("newParticle");
        this.particleSys = this.mResModule.CreateParticle("Particle_Boss_Skill_Fly", "Particle_Boss_Skill_Fly");
        this.addChild(this.particleSys);
        this.particleSys.x = this.mStageWidth / 2;
        this.particleSys.y = this.mStageHeight / 2;
        this.particleSys.rotation = 90
        this.particleSys.start();
    }

    public UpdateView(deltaTime: number): void
    { 
        if (this.particleSys != null)
        {
            // this.particleSys.emitterX += deltaTime * 0.1;
        }
    }

    private PlayBgm()
    {
        // var event: PlaySoundEvent = new PlaySoundEvent("bgm_mp3", -1);
        // event.SoundType = egret.Sound.MUSIC;
        // GameMain.GetInstance().DispatchEvent(event);

        var event = new BgmControlEvent();
        event.bgmStage = BgmStage.Global;
        event.controlType = BgmControlType.Play;
        GameMain.GetInstance().DispatchEvent(event);
    }

    private PlayLightningAnim(displayObj: egret.DisplayObject)
    {
        var param = new PaLightningParam;
        param.displayObj = displayObj;
        param.duration = 2000;
        param.interval = 500;
        param.hideRate = 0.5;
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
    }

    private PlayParticleAnim()
    {
        var param = new PaPlayParticalParam;
        param.textureName = "Particle_Boom_Red";
        param.jsonName = "Particle_Boom";
        param.duration = 5000;
        param.emitDuration = 5000;
        param.posX = 200;
        param.posY = this.mStageHeight / 2 - 100;
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
    }

    private AddMovePartical()
	{
		var param = new PaMoveParticalParam;
	    param.textureName = "huojian";
        param.jsonName = "huojian";
		param.duration = 3000;
		param.flyDuration = 2000;
		param.stayDuration = 0;
		param.stratPosX = 0;
		param.stratPosY = 0;
		param.endPosX = this.mStageWidth / 2;
		param.endPosY = this.mStageHeight / 2;
		param.isMoveEmitter = true;
        param.callBack = this.MoveParticalCallBack;
		var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
	}

    private PlayMoving(displayObj: egret.DisplayObject)
    {
        var param = new PaMovingParam;
        param.displayObj = displayObj;
        param.duration = 2000;
        param.targetPosX = this.mStageWidth / 2;
        param.targetPosY = this.mStageHeight / 2;
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
    }

    private MoveParticalCallBack(runTime: number)
    {
        egret.log("MoveParticalCallBack, runTime=" + runTime);
    }

    private PlayDynamicMoving()
    {
        var headPic = this.mResModule.CreateBitmapByName("huojian1");
        headPic.anchorOffsetX = headPic.width / 2;
        headPic.anchorOffsetY = headPic.height / 2;
        headPic.x = this.mStageWidth / 2;
        headPic.y = this.mStageHeight * 0.256;
        GameMain.GetInstance().GetGameStage().addChild(headPic);
        var param = new PaDynamicMovingParam;
        param.displayObj = headPic;
        param.startSpeed = 100;
        param.targetPos = new egret.Point(this.mStageWidth / 2, this.mStageHeight * 0.75);
        param.acceleration = 100;
        param.needRotate = true;
        var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
    }
}