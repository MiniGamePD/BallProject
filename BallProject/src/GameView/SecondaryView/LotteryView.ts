class LotteryView extends egret.DisplayObjectContainer
{
	private resModule: IResModule;
	private ballConfigModule: IBallConfigModule;

	private bgCover: FullScreenCover;
	private back: ShapeBgButton;
	private callbackObj: any;
	private callbackFun: Function;

	private ballBitmap: egret.Bitmap;
    private ballNameText: egret.TextField;
    private curLevelText: egret.TextField;

	private ballId: number;
	private ballLevel: number;

	public constructor()
	{
		super();
		this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		this.ballConfigModule = <IBallConfigModule>GameMain.GetInstance().GetModule(ModuleType.BALL_CONFIG);

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
		this.back = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.return", 39, 64, 39, 64, this.OnClickBack, this);
		this.back.x = 50;
		this.back.y = 80;
		this.addChild(this.back);
	}

	private OnClickBack(callbackObj:any)
    {
		Tools.DetachDisplayObjFromParent(callbackObj);
		callbackObj.callbackFun(callbackObj.callbackObj);
    }

	private RefreshBallInfo()
    {
        Tools.DetachDisplayObjFromParent(this.ballBitmap);
        Tools.DetachDisplayObjFromParent(this.ballNameText);
        Tools.DetachDisplayObjFromParent(this.curLevelText);

		var randomBall = this.ballConfigModule.RandomBall();
        this.ballId = randomBall.id;
        this.ballLevel = randomBall.level;
		
        var curLevelBallConfig = this.ballConfigModule.GetBallConfig(this.ballId, this.ballLevel);

        this.ballBitmap = this.resModule.CreateBitmapByName(curLevelBallConfig.textureName);
        this.ballBitmap.width = curLevelBallConfig.ballRadius * 10;
        this.ballBitmap.height = curLevelBallConfig.ballRadius * 10;
        Tools.SetAnchor(this.ballBitmap, AnchorType.Center);
        this.ballBitmap.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.ballBitmap.y = 400;
        this.addChild(this.ballBitmap);

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

        this.ballNameText = new egret.TextField();
        this.ballNameText.size = 40;
        this.ballNameText.textColor = 0xFFFFFF;
        this.ballNameText.text = curLevelBallConfig.name;
        this.ballNameText.textAlign = "center";
        this.ballNameText.width = 400;
        this.ballNameText.height = 100;
        Tools.SetAnchor(this.ballNameText, AnchorType.Center);
        this.ballNameText.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.ballNameText.y = 600;
        this.addChild(this.ballNameText);

        this.curLevelText = new egret.TextField();
        this.curLevelText.size = 40;
        this.curLevelText.textColor = 0xFFFFFF;
        this.curLevelText.textFlow = <Array<egret.ITextElement>>
        [
            { text:"等级" + this.ballLevel + "\n", style:{"textColor":0xFFC900, "size":40} },
            { text:"半径: " + curLevelBallConfig.ballRadius + "\n", style:{"textColor":0xFFFFFF, "size":30} },
            { text:"速度: " + curLevelBallConfig.emitSpeed + "\n", style:{"textColor":0xFFFFFF, "size":30} },
            { text:"技能: " + curLevelBallConfig.Describe , style:{"textColor":0xFFC900, "size":30} },
        ]
        this.curLevelText.textAlign = "left";
        this.curLevelText.width = GameMain.GetInstance().GetStageWidth() / 3;
        this.curLevelText.height = 600;
        Tools.SetAnchor(this.curLevelText, AnchorType.Center);
        this.curLevelText.x =  GameMain.GetInstance().GetStageWidth() / 2;
        this.curLevelText.y = 1000;
        this.addChild(this.curLevelText);
    }
}
