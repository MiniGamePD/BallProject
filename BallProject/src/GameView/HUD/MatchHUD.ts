class MatchHUD extends egret.DisplayObjectContainer
{
    private readyGo:ReadyGoItem;
    private score:MatchScoreItem;
    private gameover:GameOverItem;
    private pause:PauseItem;
    private help:HelpItem;

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

        this.help = new HelpItem(0, 0, this.width, this.height);
        this.help.Init();
        this.addChild(this.help);

        this.gameover = new GameOverItem(this.width, this.height);
        this.addChild(this.gameover);

        GameMain.GetInstance().AddEventListener(HUDEvent.EventName, this.OnHUDEvent, this);
        GameMain.GetInstance().AddEventListener(GameOverEvent.EventName, this.OnGameOver, this);
        GameMain.GetInstance().AddEventListener(ReviveEvent.EventName, this.OnRevive, this);
    }

    public Release()
    {
        this.readyGo = null;

        this.pause.Release();
        this.help.Release();

        GameMain.GetInstance().RemoveEventListener(HUDEvent.EventName, this.OnHUDEvent, this);
        GameMain.GetInstance().RemoveEventListener(GameOverEvent.EventName, this.OnGameOver, this);
        GameMain.GetInstance().RemoveEventListener(ReviveEvent.EventName, this.OnRevive, this);
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

    private OnGameOver(event:GameOverEvent)
    {
        this.gameover.Show();
    }

    private OnRevive(event:ReviveEvent)
    {
        this.gameover.Hide();
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
            case HUDEventType.ShowPauseMenu:
                this.pause.ShowPauseMenu();
                break;
            case HUDEventType.HidePauseMenu:
                this.pause.HidePauseMenu();
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
}