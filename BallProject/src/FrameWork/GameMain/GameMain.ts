class GameMain implements IGameMain {
	//单例
	private static msInstance: GameMain;

	//场景主舞台
	private GameStage: egret.Stage;
	//适配过的，用来显示非背景的主要游戏元素的显示范围
	private adaptedStageRect:egret.Rectangle;
	//适配过的stage的container
	private adaptedStageContainer:egret.DisplayObjectContainer;

	//状态机管理器
	private mStateMgr: IStateMgr;

	//模块管理器
	private mModuleMgr: IModuleMgr;

	//白鹭Main
	private mEgretMain: Main;

	//为了避免单局内对药丸的操作影响和对UI的操作互相影响，添加一个点击排除列表
	private mInGameTouchableUIArray:egret.DisplayObject[]; 

	private pause:boolean; //只允许MatchModule写入，其他地方只能获取

	//创建单例
	public static CreatInstance(egretMain:Main): boolean 
	{
		if (!GameMain.HasInstance()) 
		{
			GameMain.msInstance = new GameMain();
			GameMain.msInstance.mEgretMain = egretMain;
			return true;
		}
		else 
		{
			return false;
		}
	}

	//是否存在单例
	public static HasInstance(): boolean {
		return GameMain.msInstance != null;
	}

	//获取单例
	public static GetInstance(): GameMain {
		return GameMain.msInstance;
	}

	//初始化
	public Init(stage: egret.Stage): void 
	{
		this.GameStage = stage;

		this.mStateMgr = new StateMgr();
		this.mStateMgr.Init();

		this.mModuleMgr = new ModuleMgr();
		this.mModuleMgr.Init();

		this.SwitchGameState(GameStateType.Init);
	}

	//更新
	public Update(deltaTime: number): void 
	{
		if (this.mStateMgr != null) 
		{
			this.mStateMgr.Update(deltaTime);
		}

		if (this.mModuleMgr != null) 
		{
			this.mModuleMgr.Update(deltaTime);
		}
	}

	//释放
	public Release(): void 
	{
		if (this.mStateMgr != null) 
		{
			this.mStateMgr.Release();
		}

		if (this.mModuleMgr != null) 
		{
			this.mModuleMgr.Release();
		}
	}

	public GetGameStage(): egret.Stage 
	{
		return this.GameStage;
	}

	public GetCureGameState(): GameStateType 
	{
		if (this.mStateMgr != null) 
		{
			return this.mStateMgr.CurGameState();
		}
		return GameStateType.Init;
	}

	public SwitchGameState(toState: GameStateType): boolean 
	{
		let hasSwitch: boolean = false;
		if (this.mStateMgr != null) 
		{
			let fromState: GameStateType = this.mStateMgr.CurGameState();
			if (fromState != toState) 
			{
				hasSwitch = this.mStateMgr.SwitchGameState(toState);
				if (hasSwitch && this.mModuleMgr != null) 
				{
					this.mModuleMgr.OnGameStateChange(fromState, toState);
				}
			}
		}
		return hasSwitch;
	}

	public GetModule(moduleType: ModuleType): IModule 
	{
		if (this.mModuleMgr != null) 
		{
			return this.mModuleMgr.GetModule(moduleType);
		}
		return null;
	}

	public GetEgretMain():Main
	{
		return this.mEgretMain;
	}	

	public DispatchEvent(event:egret.Event): void
	{
		if(this.mEgretMain.hasEventListener(event.$type))
		{
			//if(DEBUG)
			//	console.log(event.$type + " dispatch event " + this.mEgretMain.willTrigger(event.$type));
			this.mEgretMain.dispatchEvent(event);
		}
		else
		{
			if(DEBUG)
				console.log(event.$type + " has no lisenter");
		}		
	}

	public AddEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void
	{
		this.mEgretMain.addEventListener(type, listener, thisObject, useCapture, priority);
	}

	public RemoveEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void
	{
		this.mEgretMain.removeEventListener(type, listener, thisObject, useCapture);
	}

	public GetStageWidth(): number
	{
		return this.GameStage.stageWidth
	}

	public GetStageHeight(): number
	{
		return this.GameStage.stageHeight;
	}

	public GetScreenRatio(): number
	{
		return this.GameStage.stageHeight / this.GameStage.stageWidth;
	}

	public GetAdaptedStageWidth():number
	{
		if(this.adaptedStageRect == undefined)
			this.AdaptStageRect();

		return this.adaptedStageRect.width;
	}

	public GetAdaptedStageHeight():number
	{
		if(this.adaptedStageRect == undefined)
			this.AdaptStageRect();

		return this.adaptedStageRect.height;
	}

	public GetAdaptedDisplayRect(): egret.Rectangle
	{
		if(this.adaptedStageRect == undefined)
			this.AdaptStageRect();

		return this.adaptedStageRect;
	}

	public AdapteDisplayObject(item:egret.DisplayObject)
	{
		var xFactor = this.GetAdaptedStageWidth() / Screen_StanderScreenWidth;
		var yFactor = this.GetAdaptedStageHeight() / Screen_StanderScreenHeight;
		item.x = item.x * xFactor
		item.y = item.y * yFactor;
		item.width = item.width * xFactor
		item.height = item.height * yFactor
		item.anchorOffsetX = item.anchorOffsetX * xFactor;
		item.anchorOffsetY = item.anchorOffsetY * yFactor;
	}

	public AdapteDisplayObjectScale(item:egret.DisplayObject)
	{
		var xFactor = this.GetAdaptedStageWidth() / Screen_StanderScreenWidth;
		var yFactor = this.GetAdaptedStageHeight() / Screen_StanderScreenHeight;
		item.scaleX = item.scaleX * xFactor;
		item.scaleY = item.scaleY * yFactor;
	}

	public AdaptTextField(item:egret.TextField)
	{
		this.AdapteDisplayObject(item);
		item.size = item.size * this.GetAdaptedStageWidth() / Screen_StanderScreenWidth;
	}
	
	public AdaptPoint(point:egret.Point):egret.Point
	{
		var result = new egret.Point();
		result.x = point.x * this.GetAdaptedStageWidth() / Screen_StanderScreenWidth;
		result.y = point.y * this.GetAdaptedStageHeight() / Screen_StanderScreenHeight;
		return result;
	}

	public GetAdaptedStageContainer():egret.DisplayObjectContainer
	{
		if(this.adaptedStageRect == undefined)
			this.AdaptStageRect();

		return this.adaptedStageContainer;
	}

	public ClearAdaptedStageContainer()
	{
		if(this.adaptedStageContainer != undefined)
		{
			this.adaptedStageContainer.removeChildren();
		}
	}

	private AdaptStageRect()
	{
		this.adaptedStageRect = new egret.Rectangle();

		var screenWidth = egret.Capabilities.boundingClientWidth;
		var screenHeight = egret.Capabilities.boundingClientHeight;

		var screenAspect = screenWidth / screenHeight;
		var standerAspect = Screen_StanderScreenWidth / Screen_StanderScreenHeight; //640:1136
		if(screenAspect <= standerAspect)
		{
			//屏幕很长，iphonex
			//有富余的高度，因此以宽度为准进行适配
			this.adaptedStageRect.width = Math.floor(this.GameStage.stageHeight * screenAspect);
			this.adaptedStageRect.height = Math.floor(this.adaptedStageRect.width / standerAspect);
			//将这块显示区域，放在屏幕的中间
			this.adaptedStageRect.x = Math.floor((this.GameStage.stageWidth - this.adaptedStageRect.width) / 2);
			this.adaptedStageRect.y = Math.floor((this.GameStage.stageHeight - this.adaptedStageRect.height) / 2);
		}
		else
		{
			//屏幕更短，ipad
			//有富余的宽度，因此以高度为准进行适配
			this.adaptedStageRect.height = Math.floor(this.GameStage.stageWidth / screenAspect);
			this.adaptedStageRect.width = Math.floor(this.adaptedStageRect.height * standerAspect);
			//将这块显示区域，放在屏幕中间
			this.adaptedStageRect.x = Math.floor((this.GameStage.stageWidth - this.adaptedStageRect.width) / 2);
			this.adaptedStageRect.y = Math.floor((this.GameStage.stageHeight - this.adaptedStageRect.height) / 2);
		}

		if(this.adaptedStageContainer == undefined)
		{
			this.adaptedStageContainer = new egret.Sprite();
			this.adaptedStageContainer.x = this.adaptedStageRect.x;
			this.adaptedStageContainer.y = this.adaptedStageRect.y;
			this.adaptedStageContainer.width = this.adaptedStageRect.width;
			this.adaptedStageContainer.height = this.adaptedStageRect.height; 
		}
	}

	public RegisterInGameTouchableUI(ui:egret.DisplayObject)
	{
		if(this.mInGameTouchableUIArray == undefined)
			this.mInGameTouchableUIArray = [];

		this.mInGameTouchableUIArray.push(ui);
	}

	public UnregisterInGameTouchableUI(ui:egret.DisplayObject)
	{
		if(this.mInGameTouchableUIArray != undefined)
		{
			var index = this.mInGameTouchableUIArray.indexOf(ui);
			if(index >= 0)
			{
				this.mInGameTouchableUIArray.splice(index,1);
			}
		}
	}

	public IsTapTargetInInGameTouchableUIArray(tapTarget:any):boolean
	{
		var result:boolean = false;
		if(this.mInGameTouchableUIArray != undefined)
		{
			for(var i = 0; i < this.mInGameTouchableUIArray.length; ++i)
			{
				if(tapTarget == this.mInGameTouchableUIArray[i])
				{
					result = true;
					break;
				}
			}
		}
		return result;
	}

	public SetPause(pause:boolean)
	{
		this.pause = pause;
	}

	public GetPause():boolean
	{
		return this.pause;
	}

	public PlayerLogin()
	{
		console.log("GameMain.PlayerLogin");

		this.mEgretMain.PlayerLogin().catch(e => {
            console.log(e);
        })
	}

	public ShareAppMsg()
	{
		this.mEgretMain.ShareAppMsg();
	}

	public ShareAppMsgRank(score:number)
	{
		this.mEgretMain.ShareAppMsgRank(score);
	}

	public ShareAppMsgRevive()
	{
		this.mEgretMain.ShareAppMsgRevive();
	}

	public SaveUserData(userData:string)
	{
		this.mEgretMain.SaveUserData(userData);
	}

	public LoadUserData():string
	{
		if(this.mEgretMain.hasUserData())
			return this.mEgretMain.loadUserData();
		else
			return null;
	}

	public HasUserData():boolean
	{
		return this.mEgretMain.hasUserData();
	}

	public hasRevive:boolean;
}