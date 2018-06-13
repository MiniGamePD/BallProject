class LoadingModule extends GameViewModule
{
	private resModule: IResModule;
	private loadingView: LoadingView

	protected CreateView(): boolean
	{
		this.loadingView = new LoadingView();
		this.loadingView .CreateView();
		this.gameViewList.push(this.loadingView);

		this.RegisterLoadingEvent();
		this.resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		this.resModule.StartLoadResource(this.OnFinishCallBack);

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
		egret.log("OnConfigComplete");
	}

	private OnConfigLoadErr(event: RES.ResourceEvent)
	{
		egret.log("OnConfigLoadErr");
	}

	private OnResourceLoadComplete(event: RES.ResourceEvent)
	{
		egret.log("OnResourceLoadComplete");
		this.OnLoadingComplete();
	}

	private OnResourceProgress(event: RES.ResourceEvent)
	{
		var rate = event.itemsLoaded / event.itemsTotal;
		// egret.log("OnResourceProgress, rate = " + rate);
		this.loadingView.SetProgress(rate * 100);
	}

	private OnResourceLoadErr(event: RES.ResourceEvent)
	{
		egret.log("OnResourceLoadErr");
	}

	private OnLoadingComplete()
	{
		egret.log("OnLoadingComplete");
	}

	private OnFinishCallBack()
	{
		egret.log("OnFinishCallBack");
		GameMain.GetInstance().SwitchGameState(GameStateType.Lobby);
	}

	public Release():void
	{
		this.UnRegisterLoadingEvent();
		super.Release();
	}
}