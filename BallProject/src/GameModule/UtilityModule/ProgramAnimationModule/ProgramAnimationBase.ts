abstract class ProgramAnimationBase<T extends ProgramAnimationParamBase> implements IProgramAnimation
{
	protected resModule: IResModule;

	public animType: ProgramAnimationType;
	public runningTime = 0;
	public param: T;
	public delayReduceTime = 0;

	// 派生类的初始化处理
	protected abstract OnInit();

	// 派生类的更新处理
	protected abstract OnUpdate(deltaTime: number);

	// 派生类的析构处理
	protected abstract OnRelease();

	// 派生类返回是否完成
	public abstract IsFinish();

	public Init(resModule: IResModule, param: ProgramAnimationParamBase): boolean
	{
		this.resModule = resModule;
		this.runningTime = 0;
		this.animType = param.animType;
		this.param = <T>param;
		if (this.param != null)
		{
			if (this.param.delayTime == undefined
				|| this.param.delayTime <= 0)
			{
				this.OnInit();
			}
			else
			{
				this.delayReduceTime = this.param.delayTime != undefined ? this.param.delayTime : 0;
			}
			return true;
		}
		else
		{
			return false;
		}
	}

	public Update(deltaTime: number): void
	{
		if (this.delayReduceTime > 0)
		{
			this.delayReduceTime -= deltaTime;
			if (this.delayReduceTime <= 0)
			{
				this.OnInit();
			}
		}
		else
		{
			this.runningTime += deltaTime;
			this.OnUpdate(deltaTime);
		}
	}

	public Release(): void 
	{
		this.OnRelease();
		if (this.param.callBack != undefined
			&& this.param.callBack != null)
		{
			this.param.callBack(this.runningTime);
		}
		this.runningTime = 0;
		this.delayReduceTime = 0;
		this.animType = ProgramAnimationType.None;
		this.param = null;
	}
}