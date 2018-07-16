class ShareView extends egret.DisplayObjectContainer
{
	private resModule: IResModule;
	private playerDataModule: IPlayerDataModule;
	private adaptFactor: number;

	private bgCover: FullScreenCover;
	private callbackObj: any;
	private callbackFun: Function;

	private shareBg: egret.Bitmap;
	private shareBtn: ShapeBgButton;

	private coinBitmap: egret.Bitmap;
	private coinText: egret.TextField;
	private addCoinBtn: ShapeBgButton;

	private TipText: egret.TextField;
	public constructor()
	{
		super();
		this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		this.playerDataModule = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
		this.adaptFactor = GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;

		this.CreateBgCover();
		this.CreateCoinInfo();
		if (this.playerDataModule.CanShowLotteryTips())
		{
			this.CreateTipsTextInfo();
			this.CreateShareBg();
		}
		else
		{
			this.CreateNoMoneyBg();
		}

	}

	public Init(callbackFun: Function, callbackObj: any)
	{
		this.callbackFun = callbackFun;
		this.callbackObj = callbackObj;
	}

	private CreateBgCover()
	{
		this.bgCover = new FullScreenCover(0x000000, 0.7);
		this.bgCover.touchEnabled = true;
		this.addChild(this.bgCover);
		this.bgCover.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClickBack, this);
	}

	private OnClickBack()
	{
		Tools.DetachDisplayObjFromParent(this);
		this.callbackFun(this.callbackObj, false);
	}

	private CreateTipsTextInfo()
	{
		this.TipText = new egret.TextField();
		this.TipText.size = 40;
		this.TipText.textColor = 0xFFFFFF;
		this.TipText.textAlign = "center";
		this.TipText.width = 400;
		this.TipText.height = 100;
		this.TipText.x = GameMain.GetInstance().GetStageWidth() / 2;
		this.TipText.y = 330;
		this.TipText.stroke = 2;
		this.TipText.strokeColor = 0x000000;
		var LeftNum = this.playerDataModule.GetTodayLeftLotteryShowTipCnt();
		this.TipText.textFlow = <Array<egret.ITextElement>>
			[
				{ text: "今天剩余", style: { "textColor": 0xFFFFFF, "size": 30 } },
				{ text: LeftNum, style: { "textColor": 0xFFC900, "size": 30 } },
				{ text: "次数", style: { "textColor": 0xFFFFFF, "size": 30 } },

			]

		//this.TipText.text = "当天剩余" +  + "次";
		Tools.SetAnchor(this.TipText, AnchorType.Center);
		this.addChild(this.TipText);
	}

	private CreateCoinInfo()
	{
		this.coinBitmap = this.resModule.CreateBitmapByName("shopCoin");
		this.coinBitmap.x = 320 * this.adaptFactor;
		this.coinBitmap.y = 85;
		Tools.SetAnchor(this.coinBitmap, AnchorType.Center);
		this.addChild(this.coinBitmap);

		this.coinText = new egret.TextField();
		this.coinText.size = 40 * this.adaptFactor;
		this.coinText.text = this.playerDataModule.GetCoin().toString();
		this.coinText.textColor = 0xFFFFFF;
		this.coinText.textAlign = "center";
		this.coinText.verticalAlign = egret.VerticalAlign.MIDDLE;
		this.coinText.stroke = 2;
		this.coinText.strokeColor = 0x000000;
		this.coinText.x = 330 * this.adaptFactor;
		this.coinText.y = 87;
		Tools.SetAnchor(this.coinText, AnchorType.Center);
		this.addChild(this.coinText);

		this.addCoinBtn = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.addCoin",
			200, 50, 46, 50, this.OnClickAddCoinBtn, this);
		this.addCoinBtn.x = (this.coinBitmap.x + this.coinBitmap.width / 2 - 23);
		this.addCoinBtn.y = 85;

		this.addChild(this.addCoinBtn);
	}

	private OnClickAddCoinBtn(callbackObj: any)
    {
    }

	private CreateNoMoneyBg()
	{
		this.shareBg = this.resModule.CreateBitmap("pd_res_json.noMoneyTips", GameMain.GetInstance().GetStageWidth() / 2, GameMain.GetInstance().GetStageHeight() / 2,
			this, AnchorType.Center);

		this.shareBg.scaleX = 0;
		this.shareBg.scaleY = 0;
		var scaleParam = new PaScalingParam()
		scaleParam.displayObj = this.shareBg;
		scaleParam.duration = 200;
		scaleParam.targetScaleX = 1;
		scaleParam.targetScaleY = 1;
		scaleParam.interval = scaleParam.duration;
		var scaleEvent = new PlayProgramAnimationEvent()
		scaleEvent.param = scaleParam;
		GameMain.GetInstance().DispatchEvent(scaleEvent);

		//	this.CreateShareBtn()
	}
	private CreateShareBg()
	{
		this.shareBg = this.resModule.CreateBitmap("pd_res_json.ShareGetCoinBg", GameMain.GetInstance().GetStageWidth() / 2, GameMain.GetInstance().GetStageHeight() / 2,
			this, AnchorType.Center);

		this.shareBg.scaleX = 0;
		this.shareBg.scaleY = 0;
		var scaleParam = new PaScalingParam()
		scaleParam.displayObj = this.shareBg;
		scaleParam.duration = 200;
		scaleParam.targetScaleX = 1;
		scaleParam.targetScaleY = 1;
		scaleParam.interval = scaleParam.duration;
		var scaleEvent = new PlayProgramAnimationEvent()
		scaleEvent.param = scaleParam;
		GameMain.GetInstance().DispatchEvent(scaleEvent);

		this.CreateShareBtn()
		// var timer = new egret.Timer(200,1);
		// timer.addEventListener(egret.TimerEvent.TIMER, this.CreateShareBtn, this);
		// timer.start();
	}

	private OnShare(callbackObj: any)
	{
		egret.log("OnShare");
		GameMain.GetInstance().ShareAppMsg();
		callbackObj.playerDataModule.AddCoin(Share_Add_Coin_Count);
		callbackObj.playerDataModule.Save();
		Tools.DetachDisplayObjFromParent(callbackObj);
		callbackObj.callbackFun(callbackObj.callbackObj, true);
	}

	private CreateShareBtn()
	{
		this.shareBtn = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.ShareBtn", 400, 80, 261, 80, this.OnShare, this);
		this.shareBtn.x = GameMain.GetInstance().GetStageWidth() / 2;
		this.shareBtn.y = GameMain.GetInstance().GetStageHeight() / 2 + 200;
		this.addChild(this.shareBtn);

		this.shareBtn.scaleX = 0;
		this.shareBtn.scaleY = 0;
		var scaleParam = new PaScalingParam()
		scaleParam.displayObj = this.shareBtn;
		scaleParam.duration = 200;
		scaleParam.targetScaleX = 1;
		scaleParam.targetScaleY = 1;
		scaleParam.interval = scaleParam.duration;
		var scaleEvent = new PlayProgramAnimationEvent()
		scaleEvent.param = scaleParam;
		GameMain.GetInstance().DispatchEvent(scaleEvent);
	}
}