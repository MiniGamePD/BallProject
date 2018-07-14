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

	public constructor()
	{
		super();
		this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		this.playerDataModule = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
		this.adaptFactor = GameMain.GetInstance().GetStageWidth() / Screen_StanderScreenWidth;

		this.CreateBgCover();
		this.CreateCoinInfo();
		this.CreateShareBtn();
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
		this.callbackFun(this.callbackObj);
	}

	private CreateCoinInfo()
	{
		this.coinBitmap = this.resModule.CreateBitmapByName("shopCoin");
		this.coinBitmap.x = 320 * this.adaptFactor;
		this.coinBitmap.y = 85;
		Tools.SetAnchor(this.coinBitmap, AnchorType.Center);
		this.addChild(this.coinBitmap);

		this.coinText = new egret.TextField();
		this.coinText.size = 40;
		this.coinText.textColor = 0xFFFFFF;
		this.coinText.textAlign = "center";
		this.coinText.width = 400;
		this.coinText.height = 100;
		this.coinText.x = 340 * this.adaptFactor;
		this.coinText.y = 115;
		this.coinText.text = this.playerDataModule.GetCoin().toString();
		Tools.SetAnchor(this.coinText, AnchorType.Center);
		this.addChild(this.coinText);
	}

	private CreateShareBtn()
	{
		this.shareBg = this.resModule.CreateBitmap("pd_res_json.ShareGetCoinBg", GameMain.GetInstance().GetStageWidth() / 2, GameMain.GetInstance().GetStageHeight() / 2,
			this, AnchorType.Center);

		this.shareBtn = new ShapeBgButton(ShapeBgType.Rect, 0x00000000, 0, 0, "pd_res_json.ShareBtn", 400, 80, 261, 80, this.OnShare, this);
		this.shareBtn.x = GameMain.GetInstance().GetStageWidth() / 2;
		this.shareBtn.y = GameMain.GetInstance().GetStageHeight() / 2 + 200;
		this.addChild(this.shareBtn);
	}

	private OnShare(callbackObj: any)
	{
		egret.log("OnShare");
		GameMain.GetInstance().ShareAppMsg();
		callbackObj.playerDataModule.AddCoin(Share_Add_Coin_Count);
		callbackObj.playerDataModule.Save();
		Tools.DetachDisplayObjFromParent(callbackObj);
		callbackObj.callbackFun(callbackObj.callbackObj);
	}
}