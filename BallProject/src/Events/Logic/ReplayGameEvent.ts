class ReplayGameEvent extends egret.Event
{
    public static EventName:string = "ReplayGameEvent";
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(ReplayGameEvent.EventName,bubbles,cancelable);           
    }
}