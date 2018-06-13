class BallMatchModule extends GameViewModule
{
    private matchView:BallMatchView;

    protected CreateView(): boolean
	{
        this.matchView = new BallMatchView();
        this.gameViewList.push(this.matchView);
        return true;
    }

    public SwitchForeOrBack(from: GameStateType, to: GameStateType): void
	{
		this.isForeground = to == GameStateType.Match;
	}
}