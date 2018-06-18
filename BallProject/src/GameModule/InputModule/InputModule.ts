class InputModule extends ModuleBase implements IInputModule {

	private mLastTouchEvent: string;
	private mTouchBeginX: number;
	private mTouchBeginY: number;

	private mKeyState: boolean[];

	private mMoveEventMinDisX: number;
	private mMoveEventMinDisY: number;

	private mInputEvent: InputEvent;

	private continueDown:boolean;

	public Init(): boolean {
		this.isForeground = true;
		this.continueDown = false;
		this.mInputEvent = new InputEvent(InputKey.Max, 0, 0);
		let stageWidth = GameMain.GetInstance().GetAdaptedStageWidth();
		let stageHeight = GameMain.GetInstance().GetAdaptedStageHeight();
		this.mMoveEventMinDisX = stageWidth * INPUT_MOVE_EVENT_DIS_RATE_HOR;
		this.mMoveEventMinDisY = stageHeight * INPUT_MOVE_EVENT_DIS_RATE_VER;
		this.RegisterTouchEvent();
		this.InitKey();
		return true;
	}

	private InitKey(): void {
		this.mKeyState = [];
		for (var i = 0; i < InputKey.Max; ++i) {
			this.mKeyState.push(false);
		}
	}

	private ClearKey(): void {
		for (var i = 0; i < InputKey.Max; ++i) {
			this.mKeyState[i] = false;
		}
	}

	private InputKey(key: InputKey, stageX: number, stageY: number): void {
		if (!this.mKeyState[key]) {
			this.mKeyState[key] = true;
			// egret.log("InputKey " + key + " (" + stageX + "," + stageY + ")");
			//Event
			if (this.mInputEvent != null) {
				this.mInputEvent.Key = key;
				this.mInputEvent.StageX = stageX;
				this.mInputEvent.StageY = stageY;
				GameMain.GetInstance().DispatchEvent(this.mInputEvent);
			}
		}
	}

	private RegisterTouchEvent(): void {
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OnTouchBegin, this);
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_MOVE, this.OnTouchMove, this);
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTouchTap, this);
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_END, this.OnTouchEnd, this);
		GameMain.GetInstance().AddEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.OnTouchReleaseOutSide, this);
	}

	private UnRegisterTouchEvent(): void {
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_BEGIN, this.OnTouchBegin, this);
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_MOVE, this.OnTouchMove, this);
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_TAP, this.OnTouchTap, this);
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_END, this.OnTouchEnd, this);
		GameMain.GetInstance().RemoveEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.OnTouchReleaseOutSide, this);
	}

	private OnTouchBegin(evt: egret.TouchEvent): void {
		if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
			this.mTouchBeginX = evt.stageX;
			this.mTouchBeginY = evt.stageY;
			this.continueDown = false;
			// egret.log("OnTouchBegin(" + evt.stageX + "," + evt.stageY + ")");
			this.mLastTouchEvent = egret.TouchEvent.TOUCH_BEGIN;
		}
	}

	private OnTouchEnd(evt: egret.TouchEvent): void {
		if (evt.type == egret.TouchEvent.TOUCH_END) {
			this.continueDown = false;
			// egret.log("OnTouchBegin(" + evt.stageX + "," + evt.stageY + ")");
		}
	}

	private OnTouchMove(evt: egret.TouchEvent): void {
		if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
			// egret.log("OnTouchMove(" + evt.stageX + "," + evt.stageY + ")");
			var hasInput = false;
			var deltaX = evt.stageX - this.mTouchBeginX;
			var deltaY = evt.stageY - this.mTouchBeginY;

			if (deltaX >= this.mMoveEventMinDisX) {
				this.InputKey(InputKey.Right, evt.stageX, evt.stageY);
				this.continueDown = false;
				hasInput = true;
			}

			if (deltaX <= -this.mMoveEventMinDisX) {
				this.InputKey(InputKey.Left, evt.stageX, evt.stageY);
				this.continueDown = false;
				hasInput = true;
			}

			if (deltaY >= this.mMoveEventMinDisY) {
				this.continueDown = true;
				hasInput = true;
			}

			if (deltaY <= -this.mMoveEventMinDisY) {
				this.InputKey(InputKey.Up, evt.stageX, evt.stageY);
				hasInput = true;
			}

			if (hasInput) {
				this.mTouchBeginX = evt.stageX;
				this.mTouchBeginY = evt.stageY;
			}
			this.mLastTouchEvent = egret.TouchEvent.TOUCH_MOVE;
		}
	}

	private OnTouchTap(evt: egret.TouchEvent): void 
	{
		if (evt.type == egret.TouchEvent.TOUCH_TAP) 
		{
			if(!GameMain.GetInstance().GetPause() && !GameMain.GetInstance().IsTapTargetInInGameTouchableUIArray(evt.target))
			{
				//没有点击在UI按钮上，才算对于药丸的操作
				// egret.log("OnTouchTap(" + evt.stageX + "," + evt.stageY + ")");
				if (this.mLastTouchEvent == egret.TouchEvent.TOUCH_BEGIN) {
					this.InputKey(InputKey.Rotate, evt.stageX, evt.stageY);
				}
				this.mLastTouchEvent = egret.TouchEvent.TOUCH_TAP;
			}
		}
	}

	private OnTouchReleaseOutSide(evt: egret.TouchEvent): void
	{
		if (evt.type == egret.TouchEvent.TOUCH_RELEASE_OUTSIDE) 
		{
			this.continueDown = false;
		}
	}	

	public Update(deltaTime: number): void {
		this.ClearKey();
		if(this.continueDown)
		{
			this.InputKey(InputKey.Down, 0, 0);
		}
	}

	public Release(): void {
		this.UnRegisterTouchEvent();
	}

	public SwitchForeOrBack(from: GameStateType, to: GameStateType): void {
		this.isForeground = false;
	}

	public GetKey(key: InputKey): boolean {
		return this.mKeyState[key];
	}

	public OnStartNewTurn()
	{
		this.continueDown = false;
	}
}