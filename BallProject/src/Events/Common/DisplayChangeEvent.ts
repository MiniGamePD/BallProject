class DisplayChangeEvent extends egret.Event
{
    public static EventName:string = "DisplayChangeEvent";
    public gameViewArray:IGameView[];
    public constructor(gameViewToShow:IGameView[], bubbles:boolean=false, cancelable:boolean=false)
    {
        super(DisplayChangeEvent.EventName,bubbles,cancelable);
        this.gameViewArray = gameViewToShow;        
    }
}
