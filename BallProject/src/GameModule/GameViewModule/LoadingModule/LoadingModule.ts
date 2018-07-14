class LoadingModule extends GameViewModule
{
	private resModule: IResModule;
	private loadingView: LoadingView

	private preloadReady:boolean;
	private ballconfigReady:boolean;
	private particlyReady:boolean;
	//private soundReady:boolean; sound不是关键路径，不要卡住主流程
	

	protected CreateView(): boolean
	{
		this.loadingView = new LoadingView();
		this.loadingView .CreateView();
		this.gameViewList.push(this.loadingView);

		this.RegisterLoadingEvent();
		this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		this.resModule.StartLoadResource();

		//Load User Data
		var playerDataModule = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
		playerDataModule.InitUserData();

		super.Init();
		return true;
	}

	public SwitchForeOrBack(from: GameStateType, to: GameStateType): void
	{
		this.isForeground = to == GameStateType.Init;
	}

	private RegisterLoadingEvent()
	{
		RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.OnConfigComplete, this);
		RES.addEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, this.OnConfigLoadErr, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.OnResourceLoadComplete, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.OnResourceProgress, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.OnResourceLoadErr, this);
	}

	private UnRegisterLoadingEvent()
	{
		RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.OnConfigComplete, this);
		RES.removeEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, this.OnConfigLoadErr, this);
		RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.OnResourceLoadComplete, this);
		RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.OnResourceProgress, this);
		RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.OnResourceLoadErr, this);
	}

	private OnConfigComplete(event: RES.ResourceEvent)
	{
		if(DEBUG)
		{
			console.log("OnConfigComplete");
			this.loadingView.SetError("OnConfigComplete");
		}
	}

	private OnConfigLoadErr(event: RES.ResourceEvent)
	{
		if(DEBUG)
		{
			console.log("OnConfigLoadErr");
			this.loadingView.SetError("OnConfigLoadErr");
		}
	}

	private OnResourceLoadComplete(event: RES.ResourceEvent)
	{
		if(DEBUG)
		{
			console.log("OnResourceLoadComplete");
			this.loadingView.SetError("OnResourceLoadComplete " + event.groupName);
		}	
		
		if(event.groupName == "preload")
		{
			this.preloadReady = true;
		}
		else if(event.groupName == "Particle")
		{
			this.particlyReady = true;
		}
		else if(event.groupName == "BallConfig")
		{
			this.ballconfigReady = true;
		}

		if(this.preloadReady && this.particlyReady && this.ballconfigReady)
		{
			var ballConfigModule = <IBallConfigModule>GameMain.GetInstance().GetModule(ModuleType.BALL_CONFIG);
			ballConfigModule.LoadBallConfig();
			GameMain.GetInstance().SwitchGameState(GameStateType.Lobby);
		}

		//this.OnLoadingComplete();
	}

	private OnResourceProgress(event: RES.ResourceEvent)
	{
		
		if(DEBUG)
		{
			var rate = event.itemsLoaded / event.itemsTotal;
			console.log(event.groupName + " OnResourceProgress, rate = " + rate);
		}
			
		//this.loadingView.SetProgress(rate * 100);
	}

	private OnResourceLoadErr(event: RES.ResourceEvent)
	{
		if(DEBUG)
		{
			this.loadingView.SetError("OnResourceLoadErr");
			console.log("OnResourceLoadErr");
		}
	}

	// private OnLoadingComplete()
	// {
	// 	egret.log("OnLoadingComplete");
						

	// }

	public Release():void
	{
		this.UnRegisterLoadingEvent();
		super.Release();
	}
}