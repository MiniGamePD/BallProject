class BossSkillAnimation
{
	private static readonly BossAnimDuration: number = 300;
	private static readonly LinkElementDuration: number = 1000;
	private static readonly PreElementAnimDuration: number = 200;
	private static readonly NewElementAnimDuration: number = 200;

	private bossSkillInfo: BossSkillInfo;
	private state: BossSkillAnimState;
	private matchView: MatchView;
	private runningTime: number;
	private stateRunningTime: number;

	private skillMoveEffects: SkillMoveEffect[];

	public Init(view: MatchView)
	{
		this.state = BossSkillAnimState.Init;
		this.matchView = view;
		this.runningTime = 0;
		this.stateRunningTime = 0;
		this.skillMoveEffects = [];
	}

	public IsPlaying(): boolean
	{
		return this.state != BossSkillAnimState.Init;
	}

	public Start(bossSkillInfo: BossSkillInfo)
	{
		this.runningTime = 0;
		this.stateRunningTime = 0;
		this.bossSkillInfo = bossSkillInfo;
		if (bossSkillInfo != null
			&& bossSkillInfo.hasInfo
			&& bossSkillInfo.skillCaster != null)
		{
			this.EnterState(BossSkillAnimState.BossAnim);
		}
	}

	public Update(deltaTime: number)
	{
		this.runningTime += deltaTime;
		this.stateRunningTime += deltaTime;
		switch (this.state)
		{
			case BossSkillAnimState.BossAnim:
				{
					if (this.stateRunningTime > BossSkillAnimation.BossAnimDuration)
						this.EnterState(BossSkillAnimState.LinkElement);
					break;
				}
			case BossSkillAnimState.LinkElement:
				{
					if (this.stateRunningTime > BossSkillAnimation.LinkElementDuration)
						this.EnterState(BossSkillAnimState.PreElementAnim);
					break;
				}
			case BossSkillAnimState.PreElementAnim:
				{
					if (this.stateRunningTime > BossSkillAnimation.PreElementAnimDuration)
						this.EnterState(BossSkillAnimState.NewElementAnim);
					break;
				}
			case BossSkillAnimState.NewElementAnim:
				{
					if (this.stateRunningTime > BossSkillAnimation.NewElementAnimDuration)
						this.EnterState(BossSkillAnimState.Init);
					break;
				}
		}

		this.UpdateMoveEffect(deltaTime);
	}

	private EnterState(toState: BossSkillAnimState)
	{
		this.stateRunningTime = 0;
		if (this.state != toState)
		{
			if (toState == BossSkillAnimState.Init)
			{
				this.bossSkillInfo.Reset();
			}
			else if (toState == BossSkillAnimState.BossAnim)
			{
				this.bossSkillInfo.skillCaster.PlayAnim(NpcAnimType.UseSkill);
			}
			else if (toState == BossSkillAnimState.LinkElement)
			{
				this.CreateMoveEffectList();
			}
			else if (toState == BossSkillAnimState.PreElementAnim)
			{
				this.OnEnterPreElementAnim();
			}
			else if (toState == BossSkillAnimState.NewElementAnim)
			{
				this.OnEnterNewElementAnim();
			}
			this.state = toState;
		}
	}

	private CreateMoveEffectList()
	{
		var fromX = Tools.GetMatchViewRenderPosX(this.bossSkillInfo.skillCaster.posx);
		var fromY = Tools.GetMatchViewRenderPosY(this.bossSkillInfo.skillCaster.posy);
		if (this.bossSkillInfo.addHealthElement != null)
		{
			for (var i = 0; i < this.bossSkillInfo.addHealthElement.length; ++i)
			{
				var toX = Tools.GetMatchViewRenderPosX(this.bossSkillInfo.addHealthElement[i].posx);
				var toY = Tools.GetMatchViewRenderPosY(this.bossSkillInfo.addHealthElement[i].posy);
				// this.CreateMoveEffect(fromX, fromY, toX, toY);
				this.AddMovePartical(this.bossSkillInfo.skillCaster.posx, 
								this.bossSkillInfo.skillCaster.posy, 
								this.bossSkillInfo.addHealthElement[i].posx,
							    this.bossSkillInfo.addHealthElement[i].posy)
			}
		}

		if (this.bossSkillInfo.elementChangeColorList != null)
		{
			for (var i = 0; i < this.bossSkillInfo.elementChangeColorList.length; ++i)
			{
				var toX = Tools.GetMatchViewRenderPosX(this.bossSkillInfo.elementChangeColorList[i].element.posx);
				var toY = Tools.GetMatchViewRenderPosY(this.bossSkillInfo.elementChangeColorList[i].element.posy);
				// this.CreateMoveEffect(fromX, fromY, toX, toY);
				this.AddMovePartical(this.bossSkillInfo.skillCaster.posx, 
								this.bossSkillInfo.skillCaster.posy, 
								this.bossSkillInfo.elementChangeColorList[i].element.posx,
							    this.bossSkillInfo.elementChangeColorList[i].element.posy)
			}
		}

		if (this.bossSkillInfo.elementTransList != null)
		{
			for (var i = 0; i < this.bossSkillInfo.elementTransList.length; ++i)
			{
				var toX = Tools.GetMatchViewRenderPosX(this.bossSkillInfo.elementTransList[i].fromElement.posx);
				var toY = Tools.GetMatchViewRenderPosY(this.bossSkillInfo.elementTransList[i].fromElement.posy);
				// this.CreateMoveEffect(fromX, fromY, toX, toY);
				this.AddMovePartical(this.bossSkillInfo.skillCaster.posx, 
								this.bossSkillInfo.skillCaster.posy, 
								this.bossSkillInfo.elementTransList[i].fromElement.posx,
							    this.bossSkillInfo.elementTransList[i].fromElement.posy)
			}
		}
	}

	private CreateMoveEffect(fromX: number, fromY: number, toX: number, toY: number)
	{
		var effect = new SkillMoveEffect();
		effect.Init(fromX, fromY, toX, toY, BossSkillAnimation.LinkElementDuration, this.matchView);
		this.skillMoveEffects.push(effect);
	}

	private AddMovePartical(fromX: number, fromY: number, toX: number, toY: number)
	{
		var param = new PaMoveParticalParam;
	    param.textureName = "Pill_Single_Blue";
        param.jsonName = "Particle_Boss_Skill_Fly";
		param.duration = 2000;
		param.flyDuration = 1000;
		param.stayDuration = 0;
		param.stratPosX = Tools.ElementPosToGameStagePosX(fromX);
		param.stratPosY = Tools.ElementPosToGameStagePosY(fromY);
		param.endPosX = Tools.ElementPosToGameStagePosX(toX);
		param.endPosY = Tools.ElementPosToGameStagePosY(toY);
		param.isMoveEmitter = true;
		var event = new PlayProgramAnimationEvent();
        event.param = param;
        GameMain.GetInstance().DispatchEvent(event);
	}

	private UpdateMoveEffect(deltaTime: number)
	{
		for (var i = 0; i < this.skillMoveEffects.length; ++i)
		{
			this.skillMoveEffects[i].Update(deltaTime);
			if (this.skillMoveEffects[i].IsFinish())
			{
				this.skillMoveEffects[i].Release();
				this.skillMoveEffects.splice(i, 1);
				--i;
			}
		}
	}

	private OnEnterPreElementAnim()
	{
		if (this.bossSkillInfo.elementTransList != null)
		{
			for (var i = 0; i < this.bossSkillInfo.elementTransList.length; ++i)
			{
				this.bossSkillInfo.elementTransList[i].fromElement.renderer.alpha = 0; // 改成播放消除动画
			}
		}

		if (this.bossSkillInfo.addHealthElement != null)
		{
			for (var i = 0; i < this.bossSkillInfo.addHealthElement.length; ++i)
			{
				this.bossSkillInfo.addHealthElement[i].PlayShieldCreateAnim(); // 播放生成护盾效果
			}
		}
	}

	private OnEnterNewElementAnim()
	{
		this.matchView.RefreshTextrue();
	}
}

enum BossSkillAnimState
{
	Init, 			 //初始化
	BossAnim,		 //Boss动画
	LinkElement,	 //Boss飞出粒子到各个元素
	PreElementAnim,	 //前面的元素动画
	NewElementAnim,	 //最后新元素的出现动画
}