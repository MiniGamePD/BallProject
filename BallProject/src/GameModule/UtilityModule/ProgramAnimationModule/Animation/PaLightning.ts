class PaLightningParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.Lightning;

	public displayObj: egret.DisplayObject;	// 闪烁的目标
	public duration: number; 	// 闪烁总时长
	public interval: number;	// 闪烁一个周期的时间
	public hideRate: number;	// 闪烁一个周期中，隐藏显示的时间占比

	public constructor()
	{
		super();
		this.displayObj = null;
		this.duration = 0;
		this.interval = 0;
		this.hideRate = 0;
	}
}

class PaLightning extends ProgramAnimationBase<PaLightningParam>
{
	private isHide: boolean;
	protected OnInit()
	{
		this.isHide = false;
	}

	protected OnUpdate(deltaTime: number)
	{
		var needHide = false;
		if (this.runningTime < this.param.duration)
		{
			var cycle = this.runningTime / this.param.interval;
			var rate = cycle - Math.floor(cycle);
			needHide = rate < this.param.hideRate;
		}

		if (needHide != this.isHide)
		{
			this.isHide = needHide;
			this.param.displayObj.visible = !needHide;
		}
	}

	protected OnRelease()
	{

	}

	public IsFinish()
	{
		return this.runningTime >= this.param.duration;
	}

}