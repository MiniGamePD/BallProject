class SkillMoveEffect {
	private startX: number;
	private startY: number;
	private endX: number;
	private endY: number;
	private duration: number;
	private runningTime: number;

	private matchView: MatchView;
	private particleSys: particle.GravityParticleSystem;

	public Init(fromX: number, fromY: number, toX: number, toY: number, duration: number, matchView: MatchView)
	{	
		this.matchView = matchView;
		this.startX = fromX;
		this.startY = fromY;
		this.endX = toX;
		this.endY = toY;
		this.duration = duration;
		this.runningTime = 0;
		this.InitShape();
	}

	private InitShape()
	{
		var resModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		this.particleSys = resModule.CreateParticle("Particle_Boss_Skill_Fly", "Particle_Boss_Skill_Fly");
		this.particleSys.x = this.startX;
		this.particleSys.y = this.startY;
		this.particleSys.emitterX = 0;
		this.particleSys.emitterY = 0;
		this.particleSys.start();
		this.matchView.BattleGroundAddChild(this.particleSys);
	}

	public Update(deltaTime: number)
	{
		this.runningTime += deltaTime;
		var rate = this.runningTime / this.duration;
		if (rate > 1) 
			rate = 1;
		this.particleSys.emitterX = (this.endX - this.startX) * rate;
		this.particleSys.emitterY = (this.endY - this.startY) * rate;
	}

	public IsFinish()
	{
		return this.runningTime >= this.duration;
	}

	public Release()
	{
		this.matchView.BattleGroundRemoveChild(this.particleSys);
	}

}