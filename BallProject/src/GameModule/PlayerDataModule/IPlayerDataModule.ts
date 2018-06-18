interface IPlayerDataModule extends IModule 
{
	GetBall(): string;
    SetHistoryHighScore(score:number);
    GetHistoryHighScore():number;
    SetCoin(coin:number);
    GetCoin():number;
    Save();
    Load();
    InitUserData();
}