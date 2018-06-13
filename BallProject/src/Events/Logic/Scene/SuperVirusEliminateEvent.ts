class SuperVirusEliminateEvent extends egret.Event
{
    public static EventName:string = "SuperVirusEliminateEvent";
	public superVirus: SuperVirus;
	public hpChange: number;
    public shieldChange: number;
    public constructor(bubbles:boolean=false, cancelable:boolean=false)
    {
        super(SuperVirusEliminateEvent.EventName,bubbles,cancelable);           
    }
}