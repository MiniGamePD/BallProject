class MatchHUD extends egret.DisplayObjectContainer
{
    private readyGo:ReadyGoItem;
    public score:MatchScoreItem;
    private gameover:GameOverItem;
    private pause:PauseItem;

    public Init()
    {
        this.readyGo = new ReadyGoItem(0,0,this.width,this.height);
        this.addChild(this.readyGo);

        this.score = new MatchScoreItem();
        this.score.Init();
        this.addChild(this.score);

        this.pause = new PauseItem(0, 0, this.width, this.height);
        this.pause.Init();
        this.addChild(this.pause);

        this.gameover = new GameOverItem(this.width, this.height);
        this.gameover.Init();
        this.addChild(this.gameover);

        GameMain.GetInstance().AddEventListener(HUDEvent.EventName, this.OnHUDEvent, this);
    }

    public Release()
    {
        this.readyGo = null;

        this.pause.Release();
        this.gameover.Release();
        this.score.Release();

        GameMain.GetInstance().RemoveEventListener(HUDEvent.EventName, this.OnHUDEvent, this);
    }

    public Reset()
    {
        this.score.Reset();
        this.gameover.Hide();
    }

    public Update(deltaTime:number)
    {
        this.score.Update(deltaTime);
    }

    private OnHUDEvent(event:HUDEvent)
    {
        switch(event.eventType)
        {
            case HUDEventType.ShowReadyGo:
                this.ShowReadyGo();
                break;
            case HUDEventType.ChangeScore:
                this.ChangeScore(event.param);
                break;
            //Add More..
        }
    }

    private ShowReadyGo()
    {
        this.readyGo.Play();
    }

    private ChangeScore(param:any)
    {
        let score:number = <number>param;
        this.score.SetScore(score);
    }

    public RefreshCoin()
    {
        this.score.RefreshCoin();
    }
}