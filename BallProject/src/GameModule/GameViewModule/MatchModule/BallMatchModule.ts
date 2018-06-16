class BallMatchModule extends GameViewModule
{
    private matchView: BallMatchView;

    private ballGameWorld: BallGameWorld;
    private ballEmitter: BallEmitter;
    private boxEmitter: BoxEmitter;
    private matchState: BallMatchState;

    protected CreateView(): boolean
    {
        GameMain.GetInstance().AddEventListener(PauseEvent.EventName, this.OnPause, this);

        this.matchView = new BallMatchView();
        this.matchView.CreateView();
        this.gameViewList.push(this.matchView);

        this.matchState = BallMatchState.playing;

        this.InitComponents();

        return true;
    }

    public ReleaseView(): void
	{
		super.ReleaseView();
		this.DeInitComponents();

        GameMain.GetInstance().RemoveEventListener(PauseEvent.EventName, this.OnPause, this);
	}

    private InitComponents()
    { 
        this.ballGameWorld = new BallGameWorld(); 
        this.ballGameWorld.Init();

        this.ballEmitter = new BallEmitter();
        this.ballEmitter.Init(this.ballGameWorld);

        this.boxEmitter = new BoxEmitter();
        this.boxEmitter.Init(this.ballGameWorld);
    }

    public SwitchForeOrBack(from: GameStateType, to: GameStateType): void
    {
        this.isForeground = to == GameStateType.Match;
    }

    public Update(deltaTime: number): void
	{
		super.Update(deltaTime);
		if(this.matchState == BallMatchState.playing)
		{
			this.ballGameWorld.Update(deltaTime);
			this.ballEmitter.Update(deltaTime);
			this.boxEmitter.Update(deltaTime);
		}
	}

    private DeInitComponents()
	{
		this.ballGameWorld.Release();
        this.ballGameWorld = null;
		this.ballEmitter.Release();
        this.ballEmitter = null;
        this.boxEmitter.Release();
        this.boxEmitter = null;
	}

    private OnPause(event:PauseEvent)
	{
		if(this.matchState == BallMatchState.gameover)
			return;

        var pause = this.matchState == BallMatchState.pause;

		if(pause == event.pause)
			return;

        pause = event.pause;
        this.matchState = pause ? BallMatchState.pause : BallMatchState.playing;

		GameMain.GetInstance().SetPause(pause);

		var hudEvent = new HUDEvent();
        if(!event.help)
		    hudEvent.eventType = pause ? HUDEventType.ShowPauseMenu : HUDEventType.HidePauseMenu;
        else
            hudEvent.eventType = pause ? HUDEventType.ShowHelpDetail : HUDEventType.HideHelpDetail;
		GameMain.GetInstance().DispatchEvent(hudEvent);
	}
}

enum BallMatchState
{
    playing,
    pause,
    gameover,
}