interface IPlayerDataModule extends IModule 
{
	GetMyBall(): string;
    SaveMyBall(ballListString: string);
    SetHistoryHighScore(score:number);
    GetHistoryHighScore():number;
    UploadHistoryHighScore();
    AddCoin(coin:number);
    CostCoin(coin:number):boolean;
    GetCoin():number;
    GetCoinCurGame():number;
    SetCurMatchScore(score:number);
    GetCurMatchScore();
    Save();
    Load();
    InitUserData();
    OnMatchBegin();
    SetControlType(type:BallControllerType);
    GetControlType():BallControllerType;
    SetBattleTimes(times:number);
    GetBattleTimes():number;
    SetExpedBallList(list:string);
    GetExpedBallList():string;

    IncreaseLotteryShowTipCnt() : void

    CanShowLotteryTips() : boolean

    GetTodayLeftLotteryShowTipCnt():number
}