class LobbyView extends GameView
{
    private mResModule: IResModule;
    private mStageWidth: number;
    private mStageHeight: number;
    private textField: egret.TextField;
    private particleSys: particle.GravityParticleSystem;
    private title:egret.Bitmap;
    private logo:egret.Bitmap;

    public CreateView(): void
    {
        this.mResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        this.mStageWidth = GameMain.GetInstance().GetStageWidth();
        this.mStageHeight = GameMain.GetInstance().GetStageHeight();

        this.LoadBackGround();
        this.CreateTitle();
        this.CreateLogo();
        this.PlayBgm();
    }

    private LoadBackGround()
    {
        var bg = new FullScreenCover(0x000000, 1);
        this.addChild(bg);
        // bg.width = this.mStageWidth;
        // bg.height = this.mStageHeight;

        // this.textField = new egret.TextField();
        // this.textField.x = 0;
        // this.textField.y = this.mStageHeight / 4;
        // this.textField.width = this.mStageWidth;
        // this.textField.height = 100;
        // this.textField.rotation = -5;
        // this.textField.fontFamily = "Impact";
        // this.textField.size *= 2;
        // this.textField.textAlign = "center";
        // this.textField.text = "正版！C C 弹";
        // this.addChild(this.textField);

        this.mAdaptedStage = GameMain.GetInstance().GetAdaptedStageContainer();;

        var shape: egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0x00A2E8);
        shape.graphics.drawRect(this.mStageWidth / 2 - 100, this.mStageHeight / 5 * 3, 200, 100);
        shape.graphics.endFill();
        //this.addChild(shape);

        

        var button = new ShapeBgButton(ShapeBgType.RoundRect, 0x00000000, 0, 0, "pd_res_json.Lobby_Play", 193, 82, 193, 82,
            this.OnClickStartGame, this);
        button.x = this.mStageWidth / 2 + 100;
        button.y = 950;
        this.addChild(button);

        var shop = new ShapeBgButton(ShapeBgType.RoundRect, 0x00000000, 0, 0, "pd_res_json.Lobby_ChangBall", 193, 82, 193, 82,
            this.OnClickStartGame, this);
        shop.x = this.mStageWidth / 2 - 100;
        shop.y = 950;
        this.addChild(shop);

        //设置显示对象可以相应触摸事件
        shape.touchEnabled = true;
        //注册事件
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClickStartGame, this);

        // this.PlayParticle();
        // this.PlayParticleAnim();
        // this.AddMovePartical();

        this.PlayLightningAnim(shape);
        // this.PlayMoving(text);
        // this.PlayDynamicMoving();

        // var angle = Tools.GetRotateAngle(0, 0, 1, 1);
        // egret.log("angle = " + angle);
    }

    private CreateTitle()
    {
        this.title = this.mResModule.CreateBitmapByName("pd_res_json.Logo");
        this.title.anchorOffsetX = this.title.width / 2;
        this.title.anchorOffsetY = this.title.height / 2;
        this.title.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.title.y = 200;
        this.addChild(this.title);
    }

    private CreateLogo()
    {
        this.logo = this.mResModule.CreateBitmapByName("pd_res_json.Lobby_platfrom");
        this.logo.anchorOffsetX = this.logo.width / 2;
        this.logo.anchorOffsetY = this.logo.height / 2;
        this.logo.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.logo.y = 600;
        this.addChild(this.logo);
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