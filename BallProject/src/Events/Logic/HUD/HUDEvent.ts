class HUDEvent extends egret.Event
{
    public static EventName:string = "HUDEvent";
    public eventType:HUDEventType;
    public param:any;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(HUDEvent.EventName,bubbles,cancelable);           
    }
}

enum HUDEventType
{
    ShowReadyGo,
    ChangeScore,
    ChangeStep,
    RefreshControlablePreview,
    PlayPreviewDropDownAnim,
    SetFeverControl,
    ShowFeverSprite,
    ShowCombo,
    ShowComboEvaluation,
    ShowPauseMenu,
    HidePauseMenu,
    ShowHelpDetail,
    HideHelpDetail,
}