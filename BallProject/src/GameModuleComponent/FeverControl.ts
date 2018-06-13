class FeverControl extends GameModuleComponentBase
{
    private feverEnerge:number;
    private basicFeverStep:number = 6;
    private isInFeverState:boolean;
    private feverTimer:egret.Timer;
    private feverBgmFadeOutTimer:egret.Timer;

    public Init()
    {
        this.feverEnerge = 0;
        this.isInFeverState = false;
        GameMain.GetInstance().AddEventListener(EliminateEvent.EventName, this.OnEliminateHappen, this);
    }

    public Release()
    {
        GameMain.GetInstance().RemoveEventListener(EliminateEvent.EventName, this.OnEliminateHappen, this);
    }

    private OnEliminateHappen(event:EliminateEvent)
    {
        if(event.eliminateInfo.EliminateRound <= 0 && event.eliminateInfo.EliminatedElements.length <= 0)
            return;

        if(this.isInFeverState)
            return;

        this.feverEnerge += this.basicFeverStep * event.eliminateInfo.EliminateRound;
        if(this.feverEnerge >= 100)
        {
            this.feverEnerge = 100;
            
            var feverEvent = new FeverEvent();
            feverEvent.feverBegin = true; 
            GameMain.GetInstance().DispatchEvent(feverEvent);

            this.isInFeverState = true;

            this.feverTimer = new egret.Timer(Time_FeverTime, 1);
            this.feverTimer.addEventListener(egret.TimerEvent.TIMER, this.FeverEnd, this);
            this.feverTimer.start();
            this.feverBgmFadeOutTimer = new egret.Timer(Time_FeverTime-500, 1);
            this.feverBgmFadeOutTimer.addEventListener(egret.TimerEvent.TIMER, this.FadeOutFeverBgm, this);
            this.feverBgmFadeOutTimer.start();

            //pause global bgm
            var bgmControlEvent = new BgmControlEvent();
            bgmControlEvent.bgmStage = BgmStage.Global;
            bgmControlEvent.controlType = BgmControlType.Stop;
            GameMain.GetInstance().DispatchEvent(bgmControlEvent);
            //play fever bgm
            bgmControlEvent.bgmStage = BgmStage.Fever;
            bgmControlEvent.controlType = BgmControlType.Play;
            GameMain.GetInstance().DispatchEvent(bgmControlEvent);
           
            //show fever sprite
            var hudEvent = new HUDEvent();
            hudEvent.eventType = HUDEventType.ShowFeverSprite;
            GameMain.GetInstance().DispatchEvent(hudEvent);
        }
    }

    private FeverEnd()
    {
        this.feverTimer = null;
        this.isInFeverState = false;
        this.feverEnerge = 0;

        var feverEvent = new FeverEvent();
        feverEvent.feverBegin = false; 
        GameMain.GetInstance().DispatchEvent(feverEvent);

        // //fade in bgm
        // var soundControlEvent = new SoundControlEvent();
        // var soundModule:ISoundModule = <ISoundModule>GameMain.GetInstance().GetModule(ModuleType.SOUND);
        // soundControlEvent.channel = soundModule.GetCurrentBgmChannel();
        // soundControlEvent.controlType = SoundControlType.FadeIn;
        // soundControlEvent.controlParam = 1 / 1000;
        // GameMain.GetInstance().DispatchEvent(soundControlEvent);

        var bgmControlEvent = new BgmControlEvent();
        bgmControlEvent.bgmStage = BgmStage.Fever;
        bgmControlEvent.controlType = BgmControlType.Stop;
        GameMain.GetInstance().DispatchEvent(bgmControlEvent);

        bgmControlEvent.bgmStage = BgmStage.Global;
        bgmControlEvent.controlType = BgmControlType.Play;
        GameMain.GetInstance().DispatchEvent(bgmControlEvent);
    }

    public FadeOutFeverBgm()
    {
        this.feverBgmFadeOutTimer = null;
        var bgmControlEvent = new BgmControlEvent();
        bgmControlEvent.bgmStage = BgmStage.Fever;
        bgmControlEvent.controlType = BgmControlType.FadeOut;
        bgmControlEvent.controlParam = 1 / 450;
        GameMain.GetInstance().DispatchEvent(bgmControlEvent);
    }

    public Update(deltaTime:number)
    {
        if(this.isInFeverState)
        {
            this.feverEnerge -= deltaTime / Time_FeverTime * 100;
        }
    }

    public GetFeverEnerge():number
    {
        return this.feverEnerge;
    }

    public AttachToHUD()
    {
        var event = new HUDEvent();
        event.eventType = HUDEventType.SetFeverControl;
        event.param = this;
        GameMain.GetInstance().DispatchEvent(event);
    }

    public IsInFeverState():boolean
    {
        return this.isInFeverState;
    }
}