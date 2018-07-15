class LotteryView extends egret.DisplayObjectContainer
{
	private resModule: IResModule;
	private ballConfigModule: IBallConfigModule;
	private playerDataModule: IPlayerDataModule;
	private adaptFactor: number;

	private bgCover: FullScreenCover;
	private back: ShapeBgButton;
	private callbackObj: any;
	private callbackFun: Function;

	// private lottyTitleBitmap: egret.Bitmap;
	private ballBgBitmap: egret.Bitmap;
	private ballEffectBitmap: egret.Bitmap;

	private ballBitmap: egret.Bitmap;
	private ballNameText: egret.TextField;
	private ballSkillText: egret.TextField;
	private particleSys: particle.GravityParticleSystem;

	private ballId: number;
	private ballLevel: number;
	private randomBallInfo: RandomBallInfo;

	private selectBtn: ShapeBgButton;
	private returnBtn: ShapeBgButton;

	public constructor(ballId: number)
	{
		super();
		this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		this.ballConfigModule = <IBallConfigModule>GameMain.GetInstance().GetModule(ModuleType.BALL_CONFIG);
		this.playerDataModule = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
		this.adaptFactor = GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;

		this.CreateBgCover();
		this.CreateBack();
		this.ballId = ballId;
		this.RefreshBallInfo();
	}

	public Init(callbackFun: Function, callbackObj: any, needGuide: boolean)
	{
		this.callbackFun = callbackFun;
		this.callbackObj = callbackObj;
		if (needGuide)
		{
			this.CreateGuide();
		}
	}

	private CreateBgCover()
	{
		this.bgCover = new FullScreenCover(0x000000, 1);
		this.bgCover.touchEnabled = true;
		this.addChild(this.bgCover);
	}

	private CreateBack()
	{
		this.back = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.shopReturn", 65, 65, 65, 65, this.OnClickBack, this);
		this.back.x = 50;
		this.back.y = 80;
		this.addChild(this.back);
	}

	private OnClickBack(callbackObj: any)
	{
		Tools.DetachDisplayObjFromParent(callbackObj);
		callbackObj.callbackFun(callbackObj.callbackObj, callbackObj.randomBallInfo);
	}

	private RefreshBallInfo()
	{
		Tools.DetachDisplayObjFromParent(this.ballBitmap);
		Tools.DetachDisplayObjFromParent(this.ballNameText);
		Tools.DetachDisplayObjFromParent(this.ballSkillText);

		var stageWidth = GameMain.GetInstance().GetStageWidth();
		var stageHeight = GameMain.GetInstance().GetStageHeight();

		this.randomBallInfo = this.ballConfigModule.BuyOrUpgradeBall(this.ballId);
		this.ballId = this.randomBallInfo.id;
		this.ballLevel = this.randomBallInfo.level;

		var curLevelBallConfig = this.ballConfigModule.GetBallConfig(this.ballId, this.ballLevel);

		// Tools.DetachDisplayObjFromParent(this.lottyTitleBitmap);
		// this.lottyTitleBitmap = this.resModule.CreateBitmap("lottyTitle", stageWidth / 2, 200, this, AnchorType.Center);

		Tools.DetachDisplayObjFromParent(this.ballBgBitmap);
		this.ballBgBitmap = this.resModule.CreateBitmap("lottyBg", stageWidth / 2, 480, this, AnchorType.Center);
		this.ballBgBitmap.width = 500;
		this.ballBgBitmap.height = 500;
		Tools.SetAnchor(this.ballBgBitmap, AnchorType.Center);

		Tools.DetachDisplayObjFromParent(this.ballEffectBitmap);
		this.ballEffectBitmap = this.resModule.CreateBitmap("lottyEff", stageWidth / 2, 500, this);
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
		this.ballBitmap = this.resModule.CreateBitmap(curLevelBallConfig.textureName, stageWidth / 2, 500, this);
		this.ballBitmap.width = ballWidth;
		this.ballBitmap.height = ballWidth;
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
		this.ballSkillText.y = 830;
		this.addChild(this.ballSkillText);

		var titleY = 200
		if (this.randomBallInfo.randomBallType == RandomBallType.NewBall)
		{
			var bitmap = this.resModule.CreateBitmap("lottyNewBall", stageWidth / 2, titleY, this, AnchorType.Center);
			bitmap.scaleX = 1.3;
			bitmap.scaleY = 1.3;
		}
		else if (this.randomBallInfo.randomBallType == RandomBallType.OldMaxLevelBall)
		{
			this.resModule.CreateBitmap("lottyBackCoin", stageWidth / 2, titleY, this, AnchorType.Center);
			this.playerDataModule.AddCoin(Lotty_Ball_Back);
			this.playerDataModule.Save();
		}
		else
		{
			this.resModule.CreateBitmap("lottyLvUpDes", stageWidth / 2 - 50, titleY, this, AnchorType.Center);
			this.resModule.CreateBitmap("lottyLevel" + (this.randomBallInfo.level - 1), stageWidth / 2 - 50 - 39, titleY, this, AnchorType.Center);
			this.resModule.CreateBitmap("lottyLevel" + this.randomBallInfo.level, stageWidth / 2 - 50 + 195, titleY, this, AnchorType.Center);
		}

		this.selectBtn = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.SelectBall_OK",
			242 * this.adaptFactor, 79 * this.adaptFactor, 242 * this.adaptFactor, 79 * this.adaptFactor, this.OnClickSelectBtn, this);
		this.selectBtn.x = (640 / 4 + 20) * this.adaptFactor;
		this.selectBtn.y = 1000;
		this.addChild(this.selectBtn);

		this.returnBtn = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.lottyReturn",
			242 * this.adaptFactor, 79 * this.adaptFactor, 242 * this.adaptFactor, 79 * this.adaptFactor, this.OnClickBack, this);
		this.returnBtn.x = (640 / 4 * 3 - 20) * this.adaptFactor;
		this.returnBtn.y = 1000;
		this.addChild(this.returnBtn);

	}

	private OnClickSelectBtn(callbackObj: any)
	{
		var ballConfigModule = <IBallConfigModule>GameMain.GetInstance().GetModule(ModuleType.BALL_CONFIG);
		ballConfigModule.ChangeSelectBall(callbackObj.ballId);

		// 退回大厅
		Tools.DetachDisplayObjFromParent(callbackObj);
		callbackObj.callbackFun(callbackObj.callbackObj, callbackObj.randomBallInfo);
	}

	private CreateGuide()
	{
		if (this.selectBtn)
		{
			var hintFinger = this.resModule.CreateBitmapByName("pd_res_json.finger");
			hintFinger.x = this.selectBtn.width / 2;
			hintFinger.y = this.selectBtn.height / 2;
			Tools.AdapteDisplayObject(hintFinger);
			this.selectBtn.addChild(hintFinger);

			var scaleParam = new PaScalingParam()
			scaleParam.displayObj = hintFinger;
			scaleParam.targetScaleX = 0.8;
			scaleParam.targetScaleY = 0.8;
			scaleParam.duration = 50000000;
			scaleParam.interval = 500;
			scaleParam.reverse = true;
			var scaleEvent = new PlayProgramAnimationEvent()
			scaleEvent.param = scaleParam;
			GameMain.GetInstance().DispatchEvent(scaleEvent);
		}
	}
}
