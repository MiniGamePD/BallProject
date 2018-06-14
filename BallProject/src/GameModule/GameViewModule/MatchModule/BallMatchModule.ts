class BallMatchModule extends GameViewModule
{
    private matchView: BallMatchView;

    private ballGameWorld: BallGameWorld;
    private ballEmitter: BallEmitter;
    private boxEmitter: BoxEmitter;

    private pause:boolean;

    protected CreateView(): boolean
    {
        this.matchView = new BallMatchView();
        this.matchView.CreateView();
        this.gameViewList.push(this.matchView);

        this.pause = false;

        this.InitComponents();

        return true;
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
		if(!this.pause)
		{
			this.ballGameWorld.Update(deltaTime);
			this.ballEmitter.Update(deltaTime);
			this.boxEmitter.Update(deltaTime);
		}
	}

    public ReleaseView(): void
	{
		super.ReleaseView();
		this.DeInitComponents();
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
}