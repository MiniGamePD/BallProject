interface IPlayerDataModule extends IModule 
{
	GetMyBall(): string;
    SetHistoryHighScore(score:number);
    GetHistoryHighScore():number;
    UploadHistoryHighScore();
    SetCoin(coin:number);
    GetCoin():number;
    SetCurMatchScore(score:number);
    GetCurMatchScore();
    Save();
    Load();
    InitUserData();
}