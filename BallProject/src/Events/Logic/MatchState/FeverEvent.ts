class FeverEvent extends egret.Event
{
    public static EventName:string = "FeverEvent";
    public feverBegin:boolean;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(FeverEvent.EventName,bubbles,cancelable);           
    }
}