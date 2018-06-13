class PlayerControlFinishEvent extends egret.Event
{
    public static EventName:string = "PlayerControlFinishEvent";    
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(PlayerControlFinishEvent.EventName,bubbles,cancelable);           
    }
}