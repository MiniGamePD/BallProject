class GameOverEvent extends egret.Event
{
    public static EventName:string = "GameOverEvent";
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(GameOverEvent.EventName,bubbles,cancelable);           
    }
}