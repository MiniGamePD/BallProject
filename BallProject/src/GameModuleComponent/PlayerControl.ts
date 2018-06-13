class PlayerControl extends GameModuleComponentBase
{
    public dropdownInterval:number;//每隔多久药丸下落一格
    private dropdownTimer:number;
    public target:ControlableElement;
	private playSoundEvent: PlaySoundEvent;
    private controlableElementCreator: ControlableElementCreator;
    private creatorWorkParam:CreatorWorkParam;

    private startWorkTimer:egret.Timer;

    private nextControlableElementArray:ControlableElement[];

    private nextCentainEliminateToolCountDown:number; //隔几回合就必然生成一个特殊消除道具

    private targetBeforeGameOver:ControlableElement;

    public constructor(gameplayElementFactory:GameplayElementFactory)
    {
        super();
        this.creatorWorkParam = new CreatorWorkParam();
        this.controlableElementCreator = new ControlableElementCreator(gameplayElementFactory);
    }

    public Init():void
    {
        this.targetBeforeGameOver = null;
        this.nextControlableElementArray = [];
        this.nextCentainEliminateToolCountDown = Eliminate_NextCentainEliminateToolTurn;

        this.dropdownInterval = Difficulty_DropDownMaxInterval;

        GameMain.GetInstance().AddEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().AddEventListener(SceneElementControlFailedEvent.EventName, this.OnPlayerControlFailed, this);
        GameMain.GetInstance().AddEventListener(SceneElementControlSuccessEvent.EventName, this.OnPlayerControlSuccess, this);
    }

    public Release():void
    {
        this.nextControlableElementArray = null;
        if(this.startWorkTimer != null)
        {
            this.startWorkTimer.stop();
            this.startWorkTimer = null;
        }

        GameMain.GetInstance().RemoveEventListener(InputEvent.EventName, this.OnInputEvent, this);
        GameMain.GetInstance().RemoveEventListener(SceneElementControlFailedEvent.EventName, this.OnPlayerControlFailed, this);
        GameMain.GetInstance().RemoveEventListener(SceneElementControlSuccessEvent.EventName, this.OnPlayerControlSuccess, this);
    }

    public Work(param?:any):any
    {
        let controlWorkParam:GameplayControlWorkParam = param;

        //speed up 
        if(controlWorkParam.turn == Difficulty_DropDownSpeedUpTurn1 || controlWorkParam.turn == Difficulty_DropDownSpeedUpTurn2 
            || controlWorkParam.turn == Difficulty_DropDownSpeedUpTurn3 || controlWorkParam.turn == Difficulty_DropDownSpeedUpTurn4)
        {
            this.dropdownInterval -= Difficulty_DropDownSpeedUpStep;
            if(this.dropdownInterval < Difficulty_DropDownMinInterval)
                this.dropdownInterval = Difficulty_DropDownMinInterval;
        }
        
        if(this.targetBeforeGameOver != null && this.targetBeforeGameOver != undefined)
        {
            this.PreviewDropDown();
            return;
        }

        if(controlWorkParam.turn == 1)
        {
            this.creatorWorkParam.paramIndex = ControlableElementCreateType.AllRandomPill;
            this.creatorWorkParam.createNum = 3;
            this.nextControlableElementArray = this.controlableElementCreator.CreateElement(this.creatorWorkParam);

            var hudEvent = new HUDEvent();
            hudEvent.eventType = HUDEventType.RefreshControlablePreview;
            hudEvent.param = this.nextControlableElementArray;
            GameMain.GetInstance().DispatchEvent(hudEvent);

            //等待ready go结束
            this.startWorkTimer = new egret.Timer(1500, 1);
            this.startWorkTimer.addEventListener(egret.TimerEvent.TIMER, this.PreviewDropDown, this);
            this.startWorkTimer.start();

            let event = new HUDEvent();
            event.eventType = HUDEventType.ShowReadyGo;
            GameMain.GetInstance().DispatchEvent(event);
        }
        else
        {
            if(this.nextCentainEliminateToolCountDown <= 0)
            {
                //必然出特殊消除道具的倒计时已经到了，这次必须刷出一个消除道具
                this.creatorWorkParam.paramIndex = ControlableElementCreateType.RandomEliminateTool;
                //重置倒计时
                this.nextCentainEliminateToolCountDown = Eliminate_NextCentainEliminateToolTurn;
            }
            else
            {
                //根据概率，随机生成药丸或特殊消除道具
                this.creatorWorkParam.paramIndex = ControlableElementCreateType.Normal;
            }

            this.creatorWorkParam.createNum = 1;
            var newElement = this.controlableElementCreator.CreateElement(this.creatorWorkParam);
            if(DEBUG)
            {
                if(newElement == undefined || newElement == null)
                {
                    console.error("Create Controlable Element Failed");
                }
            }
            this.nextControlableElementArray.push(newElement);

            this.PreviewDropDown();
        }
    }

    private PreviewDropDown()
    {
        var previewDropDownTimeInMS = 750;

        var event = new HUDEvent();
        event.param = previewDropDownTimeInMS;
        event.eventType = HUDEventType.PlayPreviewDropDownAnim;
        GameMain.GetInstance().DispatchEvent(event);

        //等待preview dropdown anim结束
        this.startWorkTimer = new egret.Timer(previewDropDownTimeInMS, 1);
        this.startWorkTimer.addEventListener(egret.TimerEvent.TIMER, this.ReallyStartWork, this);
        this.startWorkTimer.start();
    }

    private ReallyStartWork()
    {
        if(this.nextControlableElementArray == undefined || this.nextControlableElementArray == null)
            return;

        if(this.targetBeforeGameOver != null && this.targetBeforeGameOver != undefined)
        {
            this.target = this.targetBeforeGameOver;
            this.targetBeforeGameOver = null;
        }
        else
        {
            this.target = this.nextControlableElementArray.splice(0,1)[0];
        }

        this.startWorkTimer = null;
        this.dropdownTimer = 0;
        this.DispatchControlEvent(SceneElementControlType.Add);
        super.Work();
    }

    public Sleep()
    {
        super.Sleep();
        this.target = null;
    } 

    private OnInputEvent(event: InputEvent): void
	 {
		if(this.target != null)
		{
			var key = event.Key;
			if (key == InputKey.Left)
			{
                this.DispatchControlEvent(SceneElementControlType.Move, Direction.Left, 1);
			}
			else if (key == InputKey.Right)
			{
                this.DispatchControlEvent(SceneElementControlType.Move, Direction.Right, 1);
			}
			else if (key == InputKey.Down)
			{
                this.DispatchControlEvent(SceneElementControlType.Move, Direction.Down, 1);
			}
			else if (key == InputKey.Rotate)
			{
                this.DispatchControlEvent(SceneElementControlType.Rotation);
			}
		}
    }

    protected UpdateInternal(deltaTime:number)
    {
        if(this.target != null)
		{
            this.TryDropdown(deltaTime);
        }
    }

    private TryDropdown(deltaTime:number): void
    {
        this.dropdownTimer += deltaTime;
        if(this.dropdownTimer >= this.dropdownInterval)
        {
            //即使时间很长，超过两个MatchModule.PillDropdownInterval，也还是移动一格，否则卡了，就忽然间下降很多，体验不好
            this.dropdownTimer = 0;
            this.DispatchControlEvent(SceneElementControlType.Move, Direction.Down, 1);    
        }
    }

    protected OnPlayerControlSuccess(event:SceneElementControlSuccessEvent)
    {
        if (event != null)
        {
            if(event.controlType == SceneElementControlType.Rotation
                && this.target != null)
            {
                this.target.OnRotateACW();
                var playSoundEvent = new PlaySoundEvent("PillRotation_mp3", 1);
        	    GameMain.GetInstance().DispatchEvent(playSoundEvent);            
            }
            else if(event.controlType == SceneElementControlType.Add
                && event.playerControl)
            {
                var hudEvent = new HUDEvent();
                hudEvent.eventType = HUDEventType.RefreshControlablePreview;
                hudEvent.param = this.nextControlableElementArray;
                GameMain.GetInstance().DispatchEvent(hudEvent); 
            }
            else if(event.controlType == SceneElementControlType.Move)
            {
                var playSoundEvent = new PlaySoundEvent("PillMove_mp3", 1);
                GameMain.GetInstance().DispatchEvent(playSoundEvent);
            }
        }
    }

    protected OnPlayerControlFailed(event:SceneElementControlFailedEvent)
    {
        if(this.isWorking && this.target == null)
        {
             if(DEBUG)
            {
                console.error("Control Failed While Player Control Is Not Working");
            }
            return;
        }        

        if(event.controlType == SceneElementControlType.Move && event.moveDir == Direction.Down)
        {
            this.PlaySound("OnDown_mp3");
            //下落到不能再下落了，就进入消除状态        
            let event = new PlayerControlFinishEvent();            
            GameMain.GetInstance().DispatchEvent(event);
        }
        else if(event.controlType == SceneElementControlType.Add && event.playerControl)
        {
            //已经无法创建新的元素了，就进入死亡状态
            let event = new GameOverEvent();            
            GameMain.GetInstance().DispatchEvent(event);
        }
    }

    private DispatchControlEvent(controlType:SceneElementControlType, moveDir?:Direction, moveStep?:number)
    {
        let event = new SceneElementControlEvent();
        event.sceneElements = this.target.GetSceneElements();
        event.controlType = controlType;
        event.moveDir = moveDir;
        event.moveStep = moveStep;
        event.playerControl = true;
        if (controlType == SceneElementControlType.Rotation)
        {
            event.rotateTargetPosList = this.target.GetRotateACWPosList();
        }
        GameMain.GetInstance().DispatchEvent(event);        
    }

    private PlaySound(sound: string)
	{
		if (this.playSoundEvent == null)
		{
			this.playSoundEvent = new PlaySoundEvent(sound, 1);
		}
		this.playSoundEvent.Key = sound;
        GameMain.GetInstance().DispatchEvent(this.playSoundEvent);
	}

    public AddTurn()
    {
        this.nextCentainEliminateToolCountDown--;
        var inputModule = <IInputModule>GameMain.GetInstance().GetModule(ModuleType.INPUT);
        inputModule.OnStartNewTurn();
    }

    public OnGameOver()
    {
        this.targetBeforeGameOver = this.target;
    }
}

