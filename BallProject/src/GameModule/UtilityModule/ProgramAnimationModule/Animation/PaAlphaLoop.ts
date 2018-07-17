class PaAlphaLoopParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.AlphaLoop;

	public displayObj: egret.DisplayObject;	// 目标
	public duration: number; 	// 总时长
	public interval: number;	// 一个周期的时间
	public startAlpha: number;	// 开始Alpha
	public endAlpha: number;    // 结束Alpha
	public offestTime: number;  // 偏移时长
	public reverse: boolean;     // Alpha计算在偶数周期翻转
	public needRemoveOnFinish: boolean; // 动画结束是否需要从场景中移除

	public constructor()
	{
		super();
		this.displayObj = null;
		this.duration = 0;
		this.interval = 0;
		this.startAlpha = 0;
		this.endAlpha = 1;
		this.offestTime = 0
		this.reverse = false;
		this.needRemoveOnFinish = false;
	}
}

class PaAlphaLoop extends ProgramAnimationBase<PaAlphaLoopParam>
{
	protected OnInit()
	{
		this.RefreshAlpha();
	}

	protected OnUpdate(deltaTime: number)
	{
		this.RefreshAlpha();
	}

	private RefreshAlpha()
	{
		if (this.runningTime < this.param.duration
			&& this.param.displayObj != null)
		{
			var runTime = this.runningTime + this.param.offestTime;
			var loopTurn = Math.floor(runTime / this.param.interval);
			var curLoopTime = runTime % this.param.interval;
			var rate = curLoopTime / this.param.interval;
			var alpha = 1;
			if (loopTurn % 2 == 1 && this.param.reverse)
			{
				alpha = Tools.Lerp(this.param.endAlpha, this.param.startAlpha, rate);
			}
			else
			{
				alpha = Tools.Lerp(this.param.startAlpha, this.param.endAlpha, rate);
			}
			this.param.displayObj.alpha = alpha;
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
		return this.runningTime >= this.param.duration
			|| this.param.displayObj == null
			|| this.param.displayObj.parent == null;
	}

}