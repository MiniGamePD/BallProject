class LotteryView extends egret.DisplayObjectContainer
{
	private resModule: IResModule;
	private ballConfigModule: IBallConfigModule;
	private playerDataModule: IPlayerDataModule;

	private bgCover: FullScreenCover;
	private back: ShapeBgButton;
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

	public constructor()
	{
		super();
		this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		this.ballConfigModule = <IBallConfigModule>GameMain.GetInstance().GetModule(ModuleType.BALL_CONFIG);
        this.playerDataModule = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);

		this.CreateBgCover();
		this.CreateBack();

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

	private CreateBack()
	{
		this.back = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.shopReturn", 82, 82, 82, 82, this.OnClickBack, this);
		this.back.x = 50;
		this.back.y = 80;
		this.addChild(this.back);
	}

	private OnClickBack(callbackObj: any)
	{
		Tools.DetachDisplayObjFromParent(callbackObj);
		callbackObj.callbackFun(callbackObj.callbackObj);
	}

	private RefreshBallInfo()
	{
		Tools.DetachDisplayObjFromParent(this.ballBitmap);
		Tools.DetachDisplayObjFromParent(this.ballNameText);
		Tools.DetachDisplayObjFromParent(this.ballSkillText);

		var stageWidth = GameMain.GetInstance().GetStageWidth();
		var stageHeight = GameMain.GetInstance().GetStageHeight();

		var randomBall = this.ballConfigModule.RandomBall();
		this.ballId = randomBall.id;
		this.ballLevel = randomBall.level;

		var curLevelBallConfig = this.ballConfigModule.GetBallConfig(this.ballId, this.ballLevel);

		Tools.DetachDisplayObjFromParent(this.lottyTitleBitmap);
		this.lottyTitleBitmap = this.resModule.CreateBitmap("lottyTitle", stageWidth / 2, 200, this, AnchorType.Center);

		Tools.DetachDisplayObjFromParent(this.ballBgBitmap);
		this.ballBgBitmap = this.resModule.CreateBitmap("lottyBg", stageWidth / 2, 480, this, AnchorType.Center);

		Tools.DetachDisplayObjFromParent(this.ballEffectBitmap);
		this.ballEffectBitmap = this.resModule.CreateBitmap("lottyEff", stageWidth / 2, 500, this, AnchorType.Center);

		var rotationParam = new PaRotationParam();
		rotationParam.displayObj = this.ballEffectBitmap;
		rotationParam.targetRot = 360;
		rotationParam.duration = 5000;
		rotationParam.loop = true;
		var rotationEvent = new PlayProgramAnimationEvent()
		rotationEvent.param = rotationParam;
		GameMain.GetInstance().DispatchEvent(rotationEvent);

		this.ballBitmap = this.resModule.CreateBitmap(curLevelBallConfig.textureName, stageWidth / 2, 500, this);
		this.ballBitmap.width = curLevelBallConfig.ballRadius * 10;
		this.ballBitmap.height = curLevelBallConfig.ballRadius * 10;
		Tools.SetAnchor(this.ballBitmap, AnchorType.Center);

		// 缩放动画
		this.ballBitmap.scaleX = 0;
		this.ballBitmap.scaleY = 0;
		var scaleParam = new PaScalingParam()
		scaleParam.displayObj = this.ballBitmap;
		scaleParam.duration = 200;
		scaleParam.targetScaleX = 1;
		scaleParam.targetScaleY = 1;
		scaleParam.interval = scaleParam.duration;
		var scaleEvent = new PlayProgramAnimationEvent()
		scaleEvent.param = scaleParam;
		GameMain.GetInstance().DispatchEvent(scaleEvent);

		// 粒子特效
		Tools.DetachDisplayObjFromParent(this.particleSys);
		this.particleSys = this.resModule.CreateParticle("lottyXingxing", "xingxing");
		this.particleSys.x = stageWidth / 2;
		this.particleSys.y = 500;
		this.addChild(this.particleSys);
		this.particleSys.start();

		this.ballNameText = new egret.TextField();
		this.ballNameText.size = 60;
		this.ballNameText.textColor = 0xFFFFFF;
		this.ballNameText.bold = true;
		this.ballNameText.text = curLevelBallConfig.name;
		this.ballNameText.textAlign = "center";
		Tools.SetAnchor(this.ballNameText, AnchorType.Center);
		this.ballNameText.x = GameMain.GetInstance().GetStageWidth() / 2;
		this.ballNameText.y = 800;
		this.ballNameText.strokeColor = 0x000000;
		this.ballNameText.stroke = 2;
		this.addChild(this.ballNameText);

		this.ballSkillText = new egret.TextField();
		this.ballSkillText.size = 35;
		this.ballSkillText.textColor = 0xFFFFFF;
		this.ballSkillText.text = "- " + curLevelBallConfig.skillDes + " -";
		this.ballSkillText.textAlign = "center";
		this.ballSkillText.width = GameMain.GetInstance().GetStageWidth();
		Tools.SetAnchor(this.ballSkillText, AnchorType.Center);
		this.ballSkillText.x = GameMain.GetInstance().GetStageWidth() / 2;
		this.ballSkillText.y = 880;
		this.addChild(this.ballSkillText);

		if (randomBall.randomBallType == RandomBallType.NewBall)
		{
			this.resModule.CreateBitmap("lottyNewBall", stageWidth / 2, 950, this, AnchorType.Center);
		}
		else if (randomBall.randomBallType == RandomBallType.OldMaxLevelBall)
		{
			this.resModule.CreateBitmap("lottyBackCoin", stageWidth / 2, 950, this, AnchorType.Center);
			this.playerDataModule.AddCoin(Lotty_Ball_Back);
		}
		else
		{
			this.resModule.CreateBitmap("lottyLvUpDes", stageWidth / 2 - 50, 950, this, AnchorType.Center);
			this.resModule.CreateBitmap("lottyLevel" + (randomBall.level - 1), stageWidth / 2 - 50 - 39, 950, this, AnchorType.Center);
			this.resModule.CreateBitmap("lottyLevel" + randomBall.level, stageWidth / 2 - 50 + 195, 950, this, AnchorType.Center);
		}
	}
}
