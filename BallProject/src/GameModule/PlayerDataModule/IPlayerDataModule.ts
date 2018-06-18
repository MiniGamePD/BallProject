interface IPlayerDataModule extends IModule 
{
	GetBall(): string;
    SetHistoryHighScore(score:number);
    GetHistoryHighScore():number;
    SetCoin(coin:number);
    GetCoin():number;
    SetCurMatchScore(score:number);
    GetCurMatchScore();
    Save();
    Load();
    InitUserData();
}