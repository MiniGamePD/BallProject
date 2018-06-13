class BgmControlEvent extends egret.Event 
{
	public static EventName: string = "BgmControlEvent";
	public bgmStage:BgmStage;
    public controlType:BgmControlType;
    public controlParam:any;
	public constructor(bubbles: boolean = false, cancelable: boolean = false) 
    {
		super(BgmControlEvent.EventName, bubbles, cancelable);
	}
}

enum BgmControlType
{
    Play,
    Stop,
    FadeIn,
    FadeOut,
    Pause,
    Resume,
}
