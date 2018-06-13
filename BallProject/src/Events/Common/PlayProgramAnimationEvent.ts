class PlayProgramAnimationEvent extends egret.Event {
	public static EventName: string = "PlayProgramAnimationEvent";
	
	public param: ProgramAnimationParamBase;

	public constructor(bubbles: boolean = false, cancelable: boolean = false) {
		super(PlayProgramAnimationEvent.EventName, bubbles, cancelable);
	}
}
