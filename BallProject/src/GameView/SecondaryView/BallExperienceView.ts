class BallExperienceView extends egret.DisplayObjectContainer
{
	private resModule: IResModule;
	private ballConfigModule: IBallConfigModule;
	private playerDataModule: IPlayerDataModule;

	private bgCover: FullScreenCover;
	private acceptBtn: ShapeBgButton;
	private rejectBtn: ShapeBgButton;
	private callbackObj: any;
	private callbackFun: Function;

	private lottyTitleBitmap: egret.Bitmap;
	private ballBgBitmap: egret.Bitmap;
	private ballEffectBitmap: egret.Bitmap;

	private ballBitmap: egret.Bitmap;
	private ballNameText: egret.TextField;
	private ballSkillText: egret.TextField;
	private particleSys: particle.GravityParticleSystem;

	private ballId: number;
	private ballLevel: number;
	private randomBallInfo: RandomBallInfo;

	private ballLevelBitmap:egret.Bitmap;
	private ballLevelMaxBitmap:egret.Bitmap;

	public constructor(expBallInfo:RandomBallInfo)
	{
		super();
		this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		this.ballConfigModule = <IBallConfigModule>GameMain.GetInstance().GetModule(ModuleType.BALL_CONFIG);
        this.playerDataModule = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);

		this.CreateBgCover();
		this.CreateButtons();

		this.randomBallInfo = expBallInfo;
		this.RefreshBallInfo();
	}

	public Init(callbackFun: Function, callbackObj: any)
	{
		this.callbackFun = callbackFun;
		this.callbackObj = callbackObj;
	}

	private CreateBgCover()
	{
		this.bgCover = new FullScreenCover(0x000000, 1);
		this.bgCover.touchEnabled = true;
		this.addChild(this.bgCover);
	}

	private CreateButtons()
	{
		var adaptFactor = GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;

        this.acceptBtn = new ShapeBgButton(ShapeBgType.RoundRect, 0x00000000, 0, 0, "pd_res_json.expAccept", 
            228*adaptFactor, 80*adaptFactor, 228*adaptFactor, 80*adaptFactor,
            this.OnClickAccept, this);
		this.acceptBtn.x = (320 + 150) * adaptFactor;
        this.acceptBtn.y = 1000;
        this.addChild(this.acceptBtn);

        this.rejectBtn = new ShapeBgButton(ShapeBgType.RoundRect, 0x00000000, 0, 0, "pd_res_json.expReject", 
            228*adaptFactor, 80*adaptFactor, 228*adaptFactor, 80*adaptFactor,
            this.OnClickReject, this);
        this.rejectBtn.x = (320 - 150)* adaptFactor;
        this.rejectBtn.y = 1000;
        this.addChild(this.rejectBtn);
	}

	private OnClickAccept(callbackObj:any)
	{
		var event = new ChangeBallEvent();
		event.ballId = callbackObj.randomBallInfo.id;
		event.ballLevel = 3;
		GameMain.GetInstance().DispatchEvent(event);

		callbackObj.callbackFun(callbackObj.callbackObj);
	}

	private OnClickReject(callbackObj:any)
	{
		callbackObj.callbackFun(callbackObj.callbackObj);
	}

	private RefreshBallInfo()
	{
		Tools.DetachDisplayObjFromParent(this.ballBitmap);
		Tools.DetachDisplayObjFromParent(this.ballNameText);
		Tools.DetachDisplayObjFromParent(this.ballSkillText);

		var stageWidth = GameMain.GetInstance().GetStageWidth();
		var stageHeight = GameMain.GetInstance().GetStageHeight();

		this.ballId = this.randomBallInfo.id;
		this.ballLevel = this.randomBallInfo.level;

		var curLevelBallConfig = this.ballConfigModule.GetBallConfig(this.ballId, this.ballLevel);

		Tools.DetachDisplayObjFromParent(this.lottyTitleBitmap);
		this.lottyTitleBitmap = this.resModule.CreateBitmap("TianShiJuanGu", stageWidth / 2, 150, this, AnchorType.Center);

		Tools.DetachDisplayObjFromParent(this.ballBgBitmap);
		this.ballBgBitmap = this.resModule.CreateBitmap("lottyBg", stageWidth / 2, 430, this, AnchorType.Center);
		this.ballBgBitmap.width = 500;
		this.ballBgBitmap.height = 500;
		Tools.SetAnchor(this.ballBgBitmap, AnchorType.Center);

		Tools.DetachDisplayObjFromParent(this.ballEffectBitmap);
		this.ballEffectBitmap = this.resModule.CreateBitmap("lottyEff", stageWidth / 2, 450, this);
		this.ballEffectBitmap.width = 300;
		this.ballEffectBitmap.height = 300;
		Tools.SetAnchor(this.ballEffectBitmap, AnchorType.Center);


		var rotationParam = new PaRotationParam();
		rotationParam.displayObj = this.ballEffectBitmap;
		rotationParam.targetRot = 360;
		rotationParam.duration = 5000;
		rotationParam.loop = true;
		var rotationEvent = new PlayProgramAnimationEvent()
		rotationEvent.param = rotationParam;
		GameMain.GetInstance().DispatchEvent(rotationEvent);

		var ballWidth = 200; //curLevelBallConfig.ballRadius * 10;
		this.ballBitmap = this.resModule.CreateBitmap(curLevelBallConfig.textureName, stageWidth / 2, 450, this);
		this.ballBitmap.width = ballWidth;
		this.ballBitmap.height = ballWidth;
		Tools.SetAnchor(this.ballBitmap, AnchorType.Center);

		// 缩放动画
		// this.ballBitmap.scaleX = 0;
		// this.ballBitmap.scaleY = 0;
		// var scaleParam = new PaScalingParam()
		// scaleParam.displayObj = this.ballBitmap;
		// scaleParam.duration = 200;
		// scaleParam.targetScaleX = 1;
		// scaleParam.targetScaleY = 1;
		// scaleParam.interval = scaleParam.duration;
		// var scaleEvent = new PlayProgramAnimationEvent()
		// scaleEvent.param = scaleParam;
		// GameMain.GetInstance().DispatchEvent(scaleEvent);

		// 粒子特效
		Tools.DetachDisplayObjFromParent(this.particleSys);
		this.particleSys = this.resModule.CreateParticle("lottyXingxing", "xingxing");
		this.particleSys.x = stageWidth / 2;
		this.particleSys.y = 450;
		this.addChild(this.particleSys);
		this.particleSys.start();

		// 球的等级
		var adaptFactor = GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;
		this.ballLevelBitmap = this.resModule.CreateBitmapByName("level" + curLevelBallConfig.level);
        this.ballLevelBitmap.x = (320 + 100) * adaptFactor;
        this.ballLevelBitmap.y = 600;
        Tools.SetAnchor(this.ballLevelBitmap, AnchorType.Center);
        this.addChild(this.ballLevelBitmap);
		this.ballLevelMaxBitmap = this.resModule.CreateBitmap("levelMax",
			(320 + 130) * adaptFactor, 630, this, AnchorType.Center);

		this.ballNameText = new egret.TextField();
		this.ballNameText.size = 40;
		this.ballNameText.textColor = 0xFFFFFF;
		this.ballNameText.bold = true;

        this.ballNameText.textFlow = <Array<egret.ITextElement>>
            [
                { text: "本局可免费使用\n\n", style: { "textColor": 0xFFFFFF, "size": 40 } },
                { text: "Lv.Max " + curLevelBallConfig.name+"\n", style: { "textColor": 0xFFC900, "size": 40 } },
            ]

		this.ballNameText.textAlign = "center";
		Tools.SetAnchor(this.ballNameText, AnchorType.Center);
		this.ballNameText.x = GameMain.GetInstance().GetStageWidth() / 2;
		this.ballNameText.y = 750;
		this.ballNameText.strokeColor = 0x000000;
		this.ballNameText.stroke = 2;
		this.addChild(this.ballNameText);

		this.ballSkillText = new egret.TextField();
		this.ballSkillText.size = 26;
		this.ballSkillText.textColor = 0xFFFFFF;
		this.ballSkillText.text = "- " + curLevelBallConfig.skillDes + " -";
		this.ballSkillText.textAlign = "center";
		this.ballSkillText.width = GameMain.GetInstance().GetStageWidth();
		Tools.SetAnchor(this.ballSkillText, AnchorType.Center);
		this.ballSkillText.x = GameMain.GetInstance().GetStageWidth() / 2;
		this.ballSkillText.y = 850;
		this.addChild(this.ballSkillText);
	}
}
