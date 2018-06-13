class PlaySoundEvent extends egret.Event 
{
	//指的是sound effect
	public static EventName: string = "PlaySoundEvent";
	public Key: string;
	public Loops: number;
	public constructor(key: string, loops: number, bubbles: boolean = false, cancelable: boolean = false) 
	{
		super(PlaySoundEvent.EventName, bubbles, cancelable);
		this.Key = key;
		this.Loops = loops;
	}
}
