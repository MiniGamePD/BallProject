class PaScalingParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.Scaling;

	public displayObj: egret.DisplayObject;	// 闪烁的目标
	public duration: number; 		// 缩放时长
	public targetScaleX: number;	// 缩放目标ScaleX
	public targetScaleY: number;	// 缩放目标ScaleY

	public constructor()
	{
		super();
		this.displayObj = null;
		this.duration = 0;
		this.targetScaleX = 0;
		this.targetScaleY = 0;
	}
}

class PaScaling extends ProgramAnimationBase<PaScalingParam>
{
	private startScaleX: number;
	private startScaleY: number;
	protected OnInit()
	{
		this.startScaleX = this.param.displayObj.scaleX;
		this.startScaleY = this.param.displayObj.scaleY;
	}

	protected OnUpdate(deltaTime: number)
	{
		if (this.runningTime < this.param.duration)
		{
			var rate = this.runningTime / this.param.duration;
			this.param.displayObj.scaleX = Tools.Lerp(this.startScaleX, this.param.targetScaleX, rate);
			this.param.displayObj.scaleY = Tools.Lerp(this.startScaleY, this.param.targetScaleY, rate);
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