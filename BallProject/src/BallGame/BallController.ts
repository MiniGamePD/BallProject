class BallController
{
	private matchModule: BallMatchModule;
	private resModule: IResModule;

	private ballGameWorld: BallGameWorld;
	private ballEmitter: BallEmitter;
	private battleGround: egret.DisplayObjectContainer;
	private emitDir: egret.Point;

	public controllerType: BallControllerType;

	private curTouchPointId = -1;
	private beginTouchPoint: egret.Point;
	private movePoint: egret.Point;
	private tempPoint: egret.Point;

	private UIMoveMaxDis = 60;
	private UIMoveMinis = 10;
	private moveUiBgBitmap: egret.Bitmap;
	private movePointBitmap: egret.Bitmap;
	private curAlpha = 0;  // 控制UI的当前Alpha
	private MaxAlpha = 1;  // 控制UI的最大Alpha
	private MinAlpha = 0.2;  // 控制UI的最低Alpha
	private LerpAlphaDownSpeed = 0.5;  // 控制UI的Alpha降低的时长
	private LerpAlphaUpSpeed = 0.1; // 控制UI的Alpha增加的时长

	public constructor()
	{
	}


	public Init(matchModule: BallMatchModule, ballGameWorld: BallGameWorld, ballEmitter: BallEmitter, battleGround: egret.DisplayObjectContainer)
	{
		this.matchModule = matchModule;
		this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);

		this.emitDir = new egret.Point();
		this.beginTouchPoint = new egret.Point(GameMain.GetInstance().GetStageWidth() / 2, GameMain.GetInstance().GetStageHeight() * (4 / 5));
		this.movePoint = new egret.Point();
		this.tempPoint = new egret.Point();
		this.ballGameWorld = ballGameWorld;
		this.ballEmitter = ballEmitter;
		this.battleGround = battleGround;

		var playerData = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
		this.controllerType = playerData.GetControlType();
		//For Debug
		//this.controllerType = BallControllerType.TouchMove;

		if (this.controllerType == BallControllerType.TouchMove)
		{
			this.InitTouchMoveUI()
		}

		this.RegisterTouchEvent();
	}

	private InitTouchMoveUI()
	{
		Tools.DetachDisplayObjFromParent(this.movePointBitmap);
		Tools.DetachDisplayObjFromParent(this.moveUiBgBitmap);
		this.curAlpha = 1;
		var uiInitX = GameMain.GetInstance().GetStageWidth() / 2;
		var uiInitY = GameMain.GetInstance().GetStageHeight() / 4 * 3;
		this.moveUiBgBitmap = this.resModule.CreateBitmap("ControllerBg", uiInitX, uiInitY, this.battleGround);
		this.moveUiBgBitmap.width = 150;
		this.moveUiBgBitmap.height = 150;
		Tools.SetAnchor(this.moveUiBgBitmap, AnchorType.Center);

		this.movePointBitmap = this.resModule.CreateBitmap("Lobby_Light_Red", uiInitX, uiInitY, this.battleGround);
		this.movePointBitmap.width = 80;
		this.movePointBitmap.height = 80;
		Tools.SetAnchor(this.movePointBitmap, AnchorType.Center);

		this.movePointBitmap.alpha = this.curAlpha;
		this.moveUiBgBitmap.alpha = this.curAlpha;
	}

	public SwitchControllerType(controllerType: BallControllerType)
	{
		this.controllerType = controllerType;
		if (this.controllerType == BallControllerType.TouchMove)
		{
			this.InitTouchMoveUI();
		}
		else
		{
			Tools.DetachDisplayObjFromParent(this.movePointBitmap);
			Tools.DetachDisplayObjFromParent(this.moveUiBgBitmap);
		}
	}


	// 输入相关 begin
	private RegisterTouchEvent(): void
	{
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OnTouchBegin, this);
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_MOVE, this.OnTouchMove, this);
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTouchTap, this);
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_END, this.OnTouchEnd, this);
		GameMain.GetInstance().AddEventListener(SwitchControlTypeEvent.EventName, this.OnSwitchControlTypeEvent, this);
	}


	private UnRegisterTouchEvent(): void
	{
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OnTouchBegin, this);
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_MOVE, this.OnTouchMove, this);
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTouchTap, this);
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_END, this.OnTouchEnd, this);
		GameMain.GetInstance().RemoveEventListener(SwitchControlTypeEvent.EventName, this.OnSwitchControlTypeEvent, this);
	}

	private OnSwitchControlTypeEvent(event: SwitchControlTypeEvent)
	{
		this.SwitchControllerType(event.newControlType);
	}

	private OnTouchBegin(evt: egret.TouchEvent): void
	{
		if (evt != null
			&& evt.stageX != undefined
			&& evt.stageY != undefined)
		{
			if (this.controllerType == BallControllerType.TouchPoint)
			{
				this.OnTouchPosition(evt.stageX, evt.stageY);
			}
			else
			{
				if (this.curTouchPointId < 0)
				{
					this.curTouchPointId = evt.touchPointID;
					this.movePoint.x = evt.stageX;
					this.movePoint.y = evt.stageY;
					this.OnCtrlTouchMove();
				}
			}
		}
	}

	private OnCtrlTouchMove()
	{
		if (this.matchModule.GetMatchState() == BallMatchState.playing)
		{
			this.emitDir.x = this.movePoint.x - this.beginTouchPoint.x;
			this.emitDir.y = this.movePoint.y - this.beginTouchPoint.y;
			if (this.emitDir.length > this.UIMoveMinis)
			{
				this.ballEmitter.SetEmitDir(this.emitDir);
			}
			this.RefreshUIMove();
		}
	}

	private OnTouchMove(evt: egret.TouchEvent): void
	{
		if (evt != null
			&& evt.stageX != undefined
			&& evt.stageY != undefined)
		{
			if (this.controllerType == BallControllerType.TouchPoint)
			{
				this.OnTouchPosition(evt.stageX, evt.stageY);
			}
			else
			{
				if (this.curTouchPointId == evt.touchPointID)
				{
					this.movePoint.x = evt.stageX;
					this.movePoint.y = evt.stageY;
					this.OnCtrlTouchMove();
				}
			}
		}
	}

	private RefreshUIMove()
	{
		this.tempPoint.x = this.movePoint.x - this.beginTouchPoint.x;
		this.tempPoint.y = this.movePoint.y - this.beginTouchPoint.y;
		if (this.tempPoint.length > this.UIMoveMaxDis)
		{
			this.tempPoint.normalize(this.UIMoveMaxDis);
			this.movePoint.x = this.beginTouchPoint.x + this.tempPoint.x;
			this.movePoint.y = this.beginTouchPoint.y + this.tempPoint.y;
		}

		this.movePointBitmap.x = this.movePoint.x;
		this.movePointBitmap.y = this.movePoint.y;
		this.moveUiBgBitmap.x = this.beginTouchPoint.x;
		this.moveUiBgBitmap.y = this.beginTouchPoint.y;
	}

	private OnTouchEnd(evt: egret.TouchEvent): void
	{
		if (evt != null
			&& evt.stageX != undefined
			&& evt.stageY != undefined)
		{
			if (this.controllerType == BallControllerType.TouchPoint)
			{
				this.OnTouchPosition(evt.stageX, evt.stageY);
			}
			else
			{
				if (this.curTouchPointId == evt.touchPointID)
				{
					this.movePoint.x = evt.stageX;
					this.movePoint.y = evt.stageY;
					this.OnCtrlTouchMove();
					this.curTouchPointId = -1;
				}
			}
		}
	}

	private OnTouchTap(evt: egret.TouchEvent): void
	{
		if (evt != null
			&& evt.stageX != undefined
			&& evt.stageY != undefined)
		{
			if (this.controllerType == BallControllerType.TouchPoint)
			{
				this.OnTouchPosition(evt.stageX, evt.stageY);
			}
		}
	}

	public OnTouchPosition(posX: number, posY: number)
	{
		if (this.matchModule.GetMatchState() == BallMatchState.playing)
		{
			this.emitDir.x = posX - this.ballEmitter.emitPos.x;
			this.emitDir.y = posY - this.ballEmitter.emitPos.y;
			this.ballEmitter.SetEmitDir(this.emitDir);
		}
	}

	public Update(deltaTime: number)
	{
		this.UpdateUiAlpha(deltaTime);
	}

	private UpdateUiAlpha(deltaTime: number)
	{
		if (this.controllerType == BallControllerType.TouchMove
			&& this.movePointBitmap
			&& this.moveUiBgBitmap)
		{
			if (this.curTouchPointId < 0)
			{
				if (this.curAlpha > this.MinAlpha)
				{
					this.curAlpha -= deltaTime * 0.001 / this.LerpAlphaDownSpeed;
					if (this.curAlpha < this.MinAlpha)
					{
						this.curAlpha = this.MinAlpha;
					}
					this.movePointBitmap.alpha = this.curAlpha;
					this.moveUiBgBitmap.alpha = this.curAlpha;
				}
			}
			else
			{
				if (this.curAlpha < this.MaxAlpha)
				{
					this.curAlpha += deltaTime * 0.001 / this.LerpAlphaUpSpeed;
					if (this.curAlpha > this.MaxAlpha)
					{
						this.curAlpha = this.MaxAlpha;
					}
					this.movePointBitmap.alpha = this.curAlpha;
					this.moveUiBgBitmap.alpha = this.curAlpha;
				}
			}
		}
	}

	public Release()
	{
		this.UnRegisterTouchEvent();
	}
}

enum BallControllerType
{
	TouchPoint,
	TouchMove,
}