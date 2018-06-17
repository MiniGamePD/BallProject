class PaPlayParticalParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.PlayPartical;

	public textureName: string; // 粒子贴图名字
	public jsonName: string;	// 粒子Json配置名字
	public duration: number; 	// 总时长
	public emitDuration: number; //粒子发射时长
	public posX: number; 		// GameStage下的坐标X
	public posY: number; 		// GameStage下的坐标Y

	public constructor()
	{
		super();
		this.textureName = "";
		this.jsonName = "";
		this.duration = 0;
		this.emitDuration = 0;
		this.posX = 0;
		this.posY = 0;
	}
}

class PaPlayPartical extends ProgramAnimationBase<PaPlayParticalParam>
{
	private particleSys: particle.GravityParticleSystem;
	private hasStopEmit: boolean;
	protected OnInit()
	{
		this.hasStopEmit = false;
		this.particleSys = this.resModule.CreateParticle(this.param.textureName, this.param.jsonName);
		this.particleSys.x = this.param.posX;
		this.particleSys.y = this.param.posY;
		GameMain.GetInstance().GetGameStage().addChild(this.particleSys);
		this.particleSys.start();
	}

	protected OnUpdate(deltaTime: number)
	{
		if (this.runningTime > this.param.emitDuration)
		{
			this.StopEmit();
		}
	}

	private StopEmit()
	{
		if (!this.hasStopEmit)
		{
			this.hasStopEmit = false;
			this.particleSys.stop();
		}
	}

	protected OnRelease()
	{
		if (this.particleSys != null
		&& this.particleSys.parent != null
		&& this.particleSys.parent != undefined)
		{
			this.particleSys.stop(true);
			this.particleSys.parent.removeChild(this.particleSys);
			this.particleSys = null;
		}
	}

	public IsFinish()
	{
		return this.runningTime >= this.param.duration;
	}

}