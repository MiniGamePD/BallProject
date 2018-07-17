class BallMatchModule extends GameViewModule
{
    private matchView: BallMatchView;

    private ballDataMgr: BallDataMgr;
    private ballGameWorld: BallGameWorld;
    private ballEmitter: BallEmitter;
    private boxEmitter: BoxEmitter;
    private matchState: BallMatchState;
    private ballController: BallController;

    protected CreateView(): boolean
    {
        GameMain.GetInstance().AddEventListener(PauseEvent.EventName, this.OnPause, this);
        GameMain.GetInstance().AddEventListener(GameOverEvent.EventName, this.OnGameOver, this);
        GameMain.GetInstance().AddEventListener(ReviveEvent.EventName, this.OnReviveEvent, this);
        GameMain.GetInstance().AddEventListener(ChangeBallEvent.EventName, this.OnChangeBallEvent, this);

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
        GameMain.GetInstance().RemoveEventListener(GameOverEvent.EventName, this.OnGameOver, this);
        GameMain.GetInstance().RemoveEventListener(ReviveEvent.EventName, this.OnReviveEvent, this);
        GameMain.GetInstance().RemoveEventListener(ChangeBallEvent.EventName, this.OnChangeBallEvent, this);
    }

    private InitComponents()
    {
        this.ballDataMgr = new BallDataMgr()
        this.ballDataMgr.Init();
        this.matchView.SetBallDataMgr(this.ballDataMgr);

        this.ballGameWorld = new BallGameWorld();
        this.ballGameWorld.Init();

        this.ballEmitter = new BallEmitter();
        this.ballEmitter.Init(this.ballGameWorld, this.matchView.GetBattleGround(), this.ballDataMgr);

        this.boxEmitter = new BoxEmitter();
        this.boxEmitter.Init(this.ballGameWorld, this.matchView.GetBattleGround(), this.ballDataMgr, this.matchView);

        this.ballController = new BallController();
        this.ballController.Init(this, this.ballGameWorld, this.ballEmitter, this.matchView.GetBattleGround());

        var playerData = <IPlayerDataModule>GameMain.GetInstance().GetModule(ModuleType.PLAYER_DATA);
        playerData.OnMatchBegin();
        var battleTimes = playerData.GetBattleTimes();
        playerData.SetBattleTimes(battleTimes + 1);
        playerData.Save();

        var event = new PauseEvent();
        event.pause = true;
        event.help = true;
        GameMain.GetInstance().DispatchEvent(event);
    }

    public SwitchForeOrBack(from: GameStateType, to: GameStateType): void
    {
        this.isForeground = to == GameStateType.Match;
    }

    public Update(deltaTime: number): void
    {
        super.Update(deltaTime);
        if (this.matchState == BallMatchState.playing)
        {
            this.ballGameWorld.Update(deltaTime);
            this.ballEmitter.Update(deltaTime);
            this.boxEmitter.Update(deltaTime);
            this.ballController.Update(deltaTime);
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
        this.ballController.Release();
        this.ballController = null;
    }

    private OnReviveEvent(event: ReviveEvent)
    {
        this.matchState = BallMatchState.playing;
    }

    private OnPause(event: PauseEvent)
    {
        if (this.matchState == BallMatchState.gameover)
            return;

        var pause = this.matchState == BallMatchState.pause;

        if (pause == event.pause)
            return;

        pause = event.pause;
        this.matchState = pause ? BallMatchState.pause : BallMatchState.playing;

        GameMain.GetInstance().SetPause(pause);

        var hudEvent = new HUDEvent();
        if (!event.help)
            hudEvent.eventType = pause ? HUDEventType.ShowPauseMenu : HUDEventType.HidePauseMenu;
        else
            hudEvent.eventType = pause ? HUDEventType.ShowHelpDetail : HUDEventType.HideHelpDetail;
        GameMain.GetInstance().DispatchEvent(hudEvent);
    }

    private OnGameOver()
    {
        this.matchState = BallMatchState.gameover;
    }

    private OnChangeBallEvent(event:ChangeBallEvent)
    {
        this.ballDataMgr.ChangeBall(event.ballId, event.ballLevel);
    }

    public GetMatchState(): BallMatchState
    {
        return this.matchState;
    }
}

enum BallMatchState
{
    playing,
    pause,
    gameover,
}