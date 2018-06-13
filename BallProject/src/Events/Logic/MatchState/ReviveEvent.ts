class ReviveEvent extends egret.Event
{
    public static EventName:string = "ReviveEvent";
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(ReviveEvent.EventName,bubbles,cancelable);           
    }
}