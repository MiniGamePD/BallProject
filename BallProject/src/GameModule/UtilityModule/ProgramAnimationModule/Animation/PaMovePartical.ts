class PaMoveParticalParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.MovePartical;

	public textureName: string; // 粒子贴图名字
	public jsonName: string;	// 粒子Json配置名字
	public duration: number;        // 总时长
	public flyDuration: number; 	// 飞行时长
	public stayDuration: number; 	// 到达后停留时长
	public stratPosX: number; 		// 开始坐标X
	public stratPosY: number; 		// 开始坐标Y
	public endPosX: number; 		// 结束坐标X
	public endPosY: number; 		// 结束坐标Y
	public isMoveEmitter: boolean;   // 是否移动发射器

	public constructor()
	{
		super();
		this.textureName = "";
		this.jsonName = "";
		this.duration = 0;
		this.flyDuration = 0;
		this.stayDuration = 0;
		this.stratPosX = 0;
		this.stratPosY = 0;
		this.endPosX = 0;
		this.endPosY = 0;
		this.isMoveEmitter = false;
	}
}

class PaMovePartical extends ProgramAnimationBase<PaMoveParticalParam>
{
	private particleSys: particle.GravityParticleSystem;
	private distance: number;
	private hasStop: boolean;
	protected OnInit()
	{
		this.hasStop = false;
		this.particleSys = this.resModule.CreateParticle(this.param.textureName, this.param.jsonName);
		this.particleSys.x = this.param.stratPosX;
		this.particleSys.y = this.param.stratPosY;
		this.particleSys.rotation = Tools.GetRotateAngle(this.param.stratPosX, this.param.stratPosY,
											this.param.endPosX, this.param.endPosY);
		// GameMain.GetInstance().AdapteDisplayObjectScale(this.particleSys);
		GameMain.GetInstance().GetAdaptedStageContainer().addChild(this.particleSys);
		this.particleSys.start();

		this.distance = Tools.PointDistance(this.param.stratPosX, this.param.stratPosY,
											this.param.endPosX, this.param.endPosY);
	}

	protected OnUpdate(deltaTime: number)
	{
		if (this.runningTime <= this.param.duration)
		{
			
			if (this.runningTime <= this.param.flyDuration + this.param.stayDuration)
			{
				var rate = this.runningTime / this.param.flyDuration;
				if (rate > 1) rate = 1;
				
				if (this.param.isMoveEmitter)
				{
					this.particleSys.emitterX = rate * this.distance;
				}
				else
				{
					this.particleSys.x = Tools.Lerp(this.param.stratPosX, this.param.endPosX, rate);
					this.particleSys.y = Tools.Lerp(this.param.stratPosY, this.param.endPosY, rate);
				}
			}
			else
			{
				this.StopPartical();
			}
		}
	}

	private StopPartical()
	{
		if (!this.hasStop)
		{
			this.hasStop = true;
			this.particleSys.stop();
		}
	}

	protected OnRelease()
	{
		if (this.particleSys != null
		&& this.particleSys.parent != null
		&& this.particleSys.parent != undefined)
		{
			this.StopPartical();
			this.particleSys.parent.removeChild(this.particleSys);
			this.particleSys = null;
		}
	}

	public IsFinish()
	{
		return this.runningTime >= this.param.duration;
	}

}