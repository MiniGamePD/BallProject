class PaDynamicMovingParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.DynamicMoving;

	public displayObj: egret.DisplayObject;	// 目标
	public startSpeed: number; 		// 开始速度
	public startSpeedAngle: number; // 开始速度的角度
	public acceleration: number;	// 加速度
	public targetPos: egret.Point; 	// 目标位置
	public needRotate: boolean; // 是否需要旋转，朝向目标点
	public needRemoveOnFinish: boolean; // 动画结束是否需要从场景中移除

	public constructor()
	{
		super();
		this.displayObj = null;
		this.startSpeed = 0;
		this.startSpeedAngle = 0;
		this.acceleration = 0;
		this.targetPos = new egret.Point(0, 0);
		this.needRotate = false;
		this.needRemoveOnFinish = false;
	}
}

class PaDynamicMoving extends ProgramAnimationBase<PaDynamicMovingParam>
{
	private velocity: egret.Point;
	private finish: boolean = false;
	protected OnInit()
	{
		var curPos = new egret.Point(this.param.displayObj.x, this.param.displayObj.y);
		this.velocity = this.param.targetPos.subtract(curPos);
		this.velocity.normalize(this.param.startSpeed);
		this.velocity.x = this.velocity.x + 100;
		this.RotateToTarget(curPos);
	}

	private RotateToTarget(curPos: egret.Point)
	{
		if (this.param.needRotate)
		{
			this.param.displayObj.rotation =
				Tools.GetRotateAngleByPoint(curPos, this.param.targetPos);
		}
	}

	protected OnUpdate(deltaTime: number)
	{
		if (!this.finish)
		{
			var curPos = new egret.Point(this.param.displayObj.x, this.param.displayObj.y);
			var delta = this.param.targetPos.subtract(curPos);
			var dis = delta.length;
			if (Tools.IsZero(dis))
			{
				this.param.displayObj.x = this.param.targetPos.x;
				this.param.displayObj.y = this.param.targetPos.y;
				this.finish = true;
			}
			else
			{
				this.RotateToTarget(curPos);
				var deltaTimeSecond = deltaTime * MathTools.MilliSecond2Second;
				var deltaVel = delta;
				deltaVel.normalize(this.param.acceleration * deltaTimeSecond);
				this.velocity = this.velocity.add(deltaVel);
				var deltaMove = new egret.Point(this.velocity.x * deltaTimeSecond, this.velocity.y * deltaTimeSecond);
				var movedPos = curPos.add(deltaMove);
				this.param.displayObj.x = movedPos.x;
				this.param.displayObj.y = movedPos.y;
			}
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
		return this.finish;
	}

}