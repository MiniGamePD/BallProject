class PlayerDataModule extends ModuleBase implements IPlayerDataModule
{
	GetBall(): string
    {
        return "Ball_White";
    }

    GetHistoryHighScore():number
    {
        return 0;
    }

    public GetCoin():number
    {
        return 0;
    }

    public SwitchForeOrBack(from: GameStateType, to: GameStateType): void
    {
		this.isForeground = true;
	}
}