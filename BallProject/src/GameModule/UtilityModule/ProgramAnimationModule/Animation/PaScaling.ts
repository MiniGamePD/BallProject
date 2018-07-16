class PaScalingParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.Scaling;

	public displayObj: egret.DisplayObject;	// 闪烁的目标
	public duration: number; 		// 缩放时长
	public targetScaleX: number;	// 缩放目标ScaleX
	public targetScaleY: number;	// 缩放目标ScaleY
	public interval: number;	// 一个周期的时间
	public reverse: boolean;     // 偶数周期翻转
	public needRemoveOnFinish: boolean; // 动画结束是否需要从场景中移除


	public constructor()
	{
		super();
		this.displayObj = null;
		this.duration = 0;
		this.targetScaleX = 0;
		this.targetScaleY = 0;
		this.interval = 0;
		this.reverse = false;
		this.needRemoveOnFinish = false;
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

		if (this.param.interval == 0)
		{
			this.param.interval = this.param.duration;
		}
	}

	protected OnUpdate(deltaTime: number)
	{
		if (this.runningTime < this.param.duration
			&& this.param.displayObj != null)
		{
			var runTime = this.runningTime
			var loopTurn = Math.floor(runTime / this.param.interval);
			var curLoopTime = runTime % this.param.interval;
			var rate = curLoopTime / this.param.interval;
			var scaleX = 1;
			var scaleY = 1;
			if (loopTurn % 2 == 1 && this.param.reverse)
			{
				scaleX = Tools.Lerp(this.param.targetScaleX, this.startScaleX, rate);
				scaleY = Tools.Lerp(this.param.targetScaleY, this.startScaleY, rate);
			}
			else
			{
				scaleX = Tools.Lerp(this.startScaleX, this.param.targetScaleX, rate);
				scaleY = Tools.Lerp(this.startScaleY, this.param.targetScaleY, rate);
			}

			this.param.displayObj.scaleX = scaleX;
			this.param.displayObj.scaleY = scaleY;
		}
	}

	protected OnRelease()
	{
		if (this.param.needRemoveOnFinish)
		{
			if (this.param.displayObj.parent != undefined 
				&& this.param.displayObj.parent != null)
			{
				this.param.displayObj.parent.removeChild(this.param.displayObj);
			}
		}
	}

	public IsFinish()
	{
		return this.runningTime >= this.param.duration;
	}

}