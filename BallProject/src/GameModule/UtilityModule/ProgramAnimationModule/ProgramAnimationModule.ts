class ProgrameAnimationModule extends ModuleBase implements IProgramAnimationModule
{
    private resModule: IResModule;    
    private animationList: IProgramAnimation[];

    public Init(): boolean
    {
        this.resModule = <IResModule> GameMain.GetInstance().GetModule(ModuleType.RES);
        this.isForeground = true;
        this.animationList = [];
        GameMain.GetInstance().AddEventListener(PlayProgramAnimationEvent.EventName, this.OnPlayProgramAnimationEvent, this);
        return true;
    }

    public SwitchForeOrBack(from: GameStateType, to: GameStateType): void
    {
        this.isForeground = true;
    }

    public Update(deltaTime: number): void
    {
        for (var i = 0; i < this.animationList.length; ++i)
        {
            if (this.animationList[i] != null)
            {
                this.animationList[i].Update(deltaTime);
                if (this.animationList[i].IsFinish())
                {
                    this.animationList[i].Release();
                    this.animationList.splice(i, 1);
                    --i;
                }
            }
        }
    }

    public Release(): void
    {
        GameMain.GetInstance().RemoveEventListener(PlayProgramAnimationEvent.EventName, this.OnPlayProgramAnimationEvent, this);
    }

    private CreateAnimation(param: ProgramAnimationParamBase)
    {
        var animation: IProgramAnimation = null;
        if (param != null)
        {
            switch (param.animType)
            {
                case ProgramAnimationType.Lightning:
                    animation = new PaLightning();
                    break;
                case ProgramAnimationType.PlayPartical:
                    animation = new PaPlayPartical();
                    break;
                case ProgramAnimationType.Scaling:
                    animation = new PaScaling();
                    break;
                case ProgramAnimationType.Rotation:
                    animation = new PaRotation();
                    break;
                case ProgramAnimationType.Moving:
                    animation = new PaMoving();
                    break;
                case ProgramAnimationType.AccMoving:
                    animation = new PaAccMoving();
                    break;
                case ProgramAnimationType.DynamicMoving:
                    animation = new PaDynamicMoving()
                    break;
                case ProgramAnimationType.MovePartical:
                    animation = new PaMovePartical();
                    break;
                case ProgramAnimationType.PlayDBAnimation:
                    animation = new PaPlayDBAnimation();
                    break;
                case ProgramAnimationType.AddScole:
                    animation = new PaAddScore();
                    break;
                case ProgramAnimationType.PlayFramesAnim:
                    animation = new PaPlayFramesAnim();
                    break;
                case ProgramAnimationType.AlphaLoop:
                    animation = new PaAlphaLoop();
                    break;
                case ProgramAnimationType.PlayCrossEliminaterEffect:
                    animation = new PaPlayCrossEliminaterEffect();
                    break;
                case ProgramAnimationType.AddFeverPowerEffect:
                    animation = new PaAddFeverPowerEffect();
                    break;
            }
        }

        if (animation != null)
        {
            var result = animation.Init(this.resModule, param);
            if (result)
            {
                this.animationList.push(animation);
            }
        }
    }

    private OnPlayProgramAnimationEvent(event: PlayProgramAnimationEvent)
    {
        if (event != null)
        {
            this.CreateAnimation(event.param);
        }
    }
}