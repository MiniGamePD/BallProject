class ComboControl extends GameModuleComponentBase
{
    private comboNum:number;

    public Init()
    {
        GameMain.GetInstance().AddEventListener(EliminateEvent.EventName, this.OnEliminateHappen, this);
    }

    public Release()
    {
        GameMain.GetInstance().RemoveEventListener(EliminateEvent.EventName, this.OnEliminateHappen, this);
    }

    public ResetCombo()
    {
        //根据当前的连击数，显示评价
        this.ShowEvaluation();
        this.comboNum = 0;
    }

    private ShowEvaluation()
    {
        var evaluation:string;
        if(this.comboNum >= 2 && this.comboNum < 3)
        {
            evaluation = "good";
        }
        else if(this.comboNum >= 3 && this.comboNum < 5)
        {
            evaluation = "cool";
        }
        else if(this.comboNum >= 5)
        {
            evaluation = "perfect";
        }

        if(evaluation != undefined)
        {
            var hudEvent = new HUDEvent();
            hudEvent.eventType = HUDEventType.ShowComboEvaluation;
            hudEvent.param = evaluation;
            GameMain.GetInstance().DispatchEvent(hudEvent);
        }
    }

    private OnEliminateHappen(event:EliminateEvent)
    {
        this.comboNum = event.eliminateInfo.EliminateRound;
        if(this.comboNum > 1)
        {
            var hudEvent = new HUDEvent();
            hudEvent.eventType = HUDEventType.ShowCombo;
            hudEvent.param = this.comboNum;
            GameMain.GetInstance().DispatchEvent(hudEvent);
        }
    }
}