class MatchHUD extends egret.DisplayObjectContainer
{
    private readyGo:ReadyGoItem;
    private score:MatchScoreItem;
    private gameover:GameOverItem;
    private controlablePreview:ControlablePreviewItem;
    private fever:FeverItem;
    private combo:ComboItem;
    private pause:PauseItem;

    public Init()
    {
        this.readyGo = new ReadyGoItem(0,0,this.width,this.height);
        this.addChild(this.readyGo);

        this.score = new MatchScoreItem();
        this.score.Init();
        this.addChild(this.score);

        this.controlablePreview = new ControlablePreviewItem(0, 0, this.width, this.height);
        this.controlablePreview.Init();
        this.addChild(this.controlablePreview);

        this.combo = new ComboItem();
        this.combo.Init();
        this.addChild(this.combo);

        this.fever = new FeverItem(0, 0, this.width, this.height);
        this.fever.Init();
        this.addChild(this.fever);

        this.pause = new PauseItem(0, 0, this.width, this.height);
        this.pause.Init();
        this.addChild(this.pause);

        this.gameover = new GameOverItem(this.width, this.height);
        this.addChild(this.gameover);

        GameMain.GetInstance().AddEventListener(HUDEvent.EventName, this.OnHUDEvent, this);
        GameMain.GetInstance().AddEventListener(GameOverEvent.EventName, this.OnGameOver, this);
        GameMain.GetInstance().AddEventListener(ReviveEvent.EventName, this.OnRevive, this);
    }

    public Release()
    {
        this.readyGo = null;

        this.controlablePreview.Release();
        this.fever.Release();
        this.combo.Release();
        this.pause.Release();

        GameMain.GetInstance().RemoveEventListener(HUDEvent.EventName, this.OnHUDEvent, this);
        GameMain.GetInstance().RemoveEventListener(GameOverEvent.EventName, this.OnGameOver, this);
        GameMain.GetInstance().RemoveEventListener(ReviveEvent.EventName, this.OnRevive, this);
    }

    public Reset()
    {
        this.score.Reset();
        this.gameover.Hide();
        this.controlablePreview.Reset();
    }

    public Update(deltaTime:number)
    {
        this.score.Update(deltaTime);
        this.fever.Update(deltaTime);
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
            case HUDEventType.ChangeStep:
                this.ChangeStep(event.param);
                break;
            case HUDEventType.RefreshControlablePreview:
                this.RefreshControlablePreview(event.param);
                break;
            case HUDEventType.PlayPreviewDropDownAnim:
                this.PlayPreviewDropDownAnim(event.param);
                break;
            case HUDEventType.SetFeverControl:
                this.SetFeverControl(event.param);
                break;
            case HUDEventType.ShowFeverSprite:
                this.ShowFeverSprite(event.param);
                break;
            case HUDEventType.ShowCombo:
                this.ShowCombo(event.param);
                break;
            case HUDEventType.ShowComboEvaluation:
                this.ShowComboEvaluation(event.param);
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

    private ChangeStep(param:any)
    {
        let step:number = <number>param;
        this.score.SetStep(step);
    }

    private RefreshControlablePreview(param:any)
    {
        var nextControlableElementArray:ControlableElement[] = <ControlableElement[]>param;
        this.controlablePreview.RefreshControlablePreview(nextControlableElementArray);
    }

    private PlayPreviewDropDownAnim(param:any)
    {
        var durationInMS:number = <number>param;
        this.controlablePreview.PlayDropAnim(durationInMS);
    }

    private SetFeverControl(param:any)
    {
        var feverControl:FeverControl = <FeverControl>param;
        this.fever.SetFeverControl(feverControl);
    }

    private ShowFeverSprite(param:any)
    {
        this.fever.ShowFeverSprite();
    }

    private ShowCombo(param:any)
    {
        var comboNum:number = <number>param;
        this.combo.ShowCombo(comboNum);
    }

    private ShowComboEvaluation(param:any)
    {
        var comboEvaluation:string = <string>param;
        this.combo.ShowEvaluation(comboEvaluation);
    }
}