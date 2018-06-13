class PaRotationParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.Rotation;

	public displayObj: egret.DisplayObject;	// 目标
	public duration: number; 	// 旋转时长
	public targetRot: number;	// 旋转的目标Rotation
	public loop: boolean; 		// 是否循环

	public constructor()
	{
		super();
		this.displayObj = null;
		this.duration = 0;
		this.targetRot = 0;
		this.loop = false;
	}
}

class PaRotation extends ProgramAnimationBase<PaRotationParam>
{
	private startRot: number;
	protected OnInit()
	{
		this.startRot = this.param.displayObj.rotation;
	}

	protected OnUpdate(deltaTime: number)
	{
		if(this.runningTime >= this.param.duration)
			this.runningTime -= this.param.duration;

		if (this.runningTime < this.param.duration)
		{
			var rate = this.runningTime / this.param.duration;
			this.param.displayObj.rotation = Tools.Lerp(this.startRot, this.param.targetRot, rate);
		}
	}

	protected OnRelease()
	{

	}

	public IsFinish()
	{
		return (!this.param.loop && this.runningTime >= this.param.duration) 
			|| (this.param.displayObj == null || this.param.displayObj == undefined);
	}

}