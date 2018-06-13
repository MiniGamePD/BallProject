class PaMovingParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.Moving;

	public displayObj: egret.DisplayObject;	// 目标
	public duration: number; 		// 时长
	public targetPosX: number;	// 目标X
	public targetPosY: number;	// 目标Y
	public needRotate: boolean; // 是否需要旋转，朝向目标点
	public needRemoveOnFinish: boolean; // 动画结束是否需要从场景中移除

	public constructor()
	{
		super();
		this.displayObj = null;
		this.duration = 0;
		this.targetPosX = 0;
		this.targetPosY = 0;
		this.needRotate = false;
		this.needRemoveOnFinish = false;
	}
}

class PaMoving extends ProgramAnimationBase<PaMovingParam>
{
	private startX: number;
	private startY: number;
	protected OnInit()
	{
		this.startX = this.param.displayObj.x;
		this.startY = this.param.displayObj.y;
		if (this.param.needRotate)
		{
			this.param.displayObj.rotation = 
				Tools.GetRotateAngle(this.startX, this.startY, this.param.targetPosX, this.param.targetPosY);
		}
	}

	protected OnUpdate(deltaTime: number)
	{
		if (this.runningTime <= this.param.duration)
		{
			var rate = this.runningTime / this.param.duration;
			this.param.displayObj.x = Tools.Lerp(this.startX, this.param.targetPosX, rate);
			this.param.displayObj.y = Tools.Lerp(this.startY, this.param.targetPosY, rate);
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