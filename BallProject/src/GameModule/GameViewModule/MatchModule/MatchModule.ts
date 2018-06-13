class MatchModule extends GameViewModule
{
	private matchState: MatchState = MatchState.None;
	private scene: Scene;
	private playerControl: PlayerControl;
	private npcControl: NpcControl;
	private matchScore: MatchScore;
	private feverControl: FeverControl;
	private comboControl: ComboControl;
	private gameplayElementFactory:GameplayElementFactory;
	private controlWorkParam: GameplayControlWorkParam;

	private difficulty:number; //游戏的难度系数，随着时间增长
	private turn:number; //回合数

	private pause:boolean;

	private matchView:MatchView;

	protected CreateView(): boolean
	{
		GameMain.GetInstance().AddEventListener(PlayerControlFinishEvent.EventName, this.StartSceneEliminate, this);
		GameMain.GetInstance().AddEventListener(SceneEliminateFinishEvent.EventName, this.OnSceneEliminateFinish, this);
		GameMain.GetInstance().AddEventListener(NpcControlFinishEvent.EventName, this.OnNpcControlFinish, this);
		GameMain.GetInstance().AddEventListener(GameOverEvent.EventName, this.OnGameOver, this);
		GameMain.GetInstance().AddEventListener(ReplayGameEvent.EventName, this.OnReplayGame, this);
		GameMain.GetInstance().AddEventListener(ReviveEvent.EventName, this.OnRevive, this);
		GameMain.GetInstance().AddEventListener(SceneElementMoveUpEvent.EventName, this.OnSceneElementMoveUpFinish, this);
		GameMain.GetInstance().AddEventListener(PauseEvent.EventName, this.OnPause, this);

		this.pause = false;

		this.InitComponents();

		this.matchView = new MatchView();
		this.matchView.SetScene(this.scene);
		this.matchView.SetMatchScore(this.matchScore);
		this.matchView.CreateView();
		this.gameViewList.push(this.matchView);

		this.feverControl.AttachToHUD();

		this.InitMatch();

		return true;
	}

	public ReleaseView(): void
	{
		super.ReleaseView();
		
		this.DeInitComponents();

		GameMain.GetInstance().RemoveEventListener(PlayerControlFinishEvent.EventName, this.StartSceneEliminate, this);
		GameMain.GetInstance().RemoveEventListener(SceneEliminateFinishEvent.EventName, this.OnSceneEliminateFinish, this);
		GameMain.GetInstance().RemoveEventListener(NpcControlFinishEvent.EventName, this.OnNpcControlFinish, this);
		GameMain.GetInstance().RemoveEventListener(GameOverEvent.EventName, this.OnGameOver, this);
		GameMain.GetInstance().RemoveEventListener(ReplayGameEvent.EventName, this.OnReplayGame, this);
		GameMain.GetInstance().RemoveEventListener(ReviveEvent.EventName, this.OnRevive, this);
		GameMain.GetInstance().RemoveEventListener(SceneElementMoveUpEvent.EventName, this.OnSceneElementMoveUpFinish, this);
		GameMain.GetInstance().RemoveEventListener(PauseEvent.EventName, this.OnPause, this);
	}

	private InitComponents()
	{
		this.scene = new Scene();
		this.scene.Init();

		this.gameplayElementFactory = new GameplayElementFactory();

		this.playerControl = new PlayerControl(this.gameplayElementFactory);
		this.playerControl.Init();

		this.npcControl = new NpcControl(this.gameplayElementFactory);
		this.npcControl.Init();

		this.matchScore = new MatchScore();
		this.matchScore.Init();

		this.feverControl = new FeverControl();
		this.feverControl.Init();

		this.comboControl = new ComboControl();
		this.comboControl.Init();
		
		this.controlWorkParam = new GameplayControlWorkParam();

		this.difficulty = 0;
		this.turn = 0;
	}

	private DeInitComponents()
	{
		this.scene.Release();
		this.scene = null;
		this.playerControl.Release();
		this.playerControl = null;
		this.npcControl.Release();
		this.npcControl = null;
		this.matchScore.Release();
		this.matchScore = null;
		this.feverControl.Release();
		this.feverControl = null;
		this.comboControl.Release();
		this.comboControl = null;
	}

	public SwitchForeOrBack(from: GameStateType, to: GameStateType): void
	{
		this.isForeground = to == GameStateType.Match;
	}

	public Update(deltaTime: number): void
	{
		super.Update(deltaTime);
		if(!this.pause)
		{
			this.scene.Update(deltaTime);
			this.playerControl.Update(deltaTime);
			this.npcControl.Update(deltaTime);
			this.feverControl.Update(deltaTime);
		}
	}

	private InitMatch()
	{
		this.difficulty = 0;
		this.turn = 0;
		this.matchState = MatchState.Init;
		this.StartNpcControl();
	}

	private StartSceneEliminate(event: PlayerControlFinishEvent)
	{
		if(this.matchState == MatchState.GameOver)
			return;
			
		this.matchState = MatchState.Eliminate;

		this.playerControl.Sleep();

		this.scene.Work();
	}

	private OnSceneEliminateFinish(event: SceneEliminateFinishEvent)
	{
		if(this.matchState == MatchState.GameOver)
			return;

		this.comboControl.ResetCombo();	
		this.StartNpcControl();
	}

	private StartNpcControl()
	{
		if(this.matchState == MatchState.GameOver)
			return;

		this.matchState = MatchState.NpcControl;

		this.scene.Sleep();

		this.controlWorkParam.difficulty = this.difficulty;
		this.controlWorkParam.turn = this.turn;
		this.npcControl.Work(this.controlWorkParam);
	}

	private OnNpcControlFinish(event: NpcControlFinishEvent)
	{
		if(this.matchState == MatchState.GameOver)
			return;

		if(event.specialEliminateMethod != null)
		{
			this.npcControl.Sleep();
			this.StartSpecialSceneEliminate(event.specialEliminateMethod);	
		}
		else if(event.bossSkillInfo != null)
		{
			this.StartNpcSkill(event);
		}
		else if(event.moveUpFinish)
		{
			this.StartSceneEliminate(null);
		}
		else
		{
			this.StartPlayerControl();
		}
	}

	private StartPlayerControl()
	{
		if(this.matchState == MatchState.GameOver)
			return;

		this.matchState = MatchState.PlayerControl;
		this.AddTurn();

		this.npcControl.Sleep();

		this.controlWorkParam.difficulty = this.difficulty;
		this.controlWorkParam.turn = this.turn;
		this.playerControl.Work(this.controlWorkParam);
	}

	private StartSpecialSceneEliminate(specialEliminateMethod:EliminateMethod)
	{
		if(this.matchState == MatchState.GameOver)
			return;

		this.matchState = MatchState.SpecialEliminate;
		this.scene.SetEliminateMethodNext(specialEliminateMethod);
		this.scene.SetNextEliminateUnMove();			
		this.scene.Work();
	}

	private StartNpcSkill(event: NpcControlFinishEvent)
	{
		if(this.matchState == MatchState.GameOver)
			return;

		this.matchState = MatchState.NpcSkill;
		this.npcControl.Sleep();
		this.scene.TriggerBossSkill(event.bossSkillInfo);		
		this.scene.Work();
	}

	private OnGameOver(event: GameOverEvent)
	{
		this.matchState = MatchState.GameOver;

		this.playerControl.OnGameOver();
		this.npcControl.OnGameOver();

		this.playerControl.Sleep();
		this.npcControl.Sleep();
		this.scene.Sleep();
	}

	private OnSceneElementMoveUpFinish(event:SceneElementMoveUpEvent)
	{
		if(this.matchState == MatchState.GameOver)
			return;

		if(!event.isMoveSuccess)
		{
			//上移失败，gameover
			var gameOverEvent = new GameOverEvent();            
			GameMain.GetInstance().DispatchEvent(gameOverEvent);
		}
	}

	private OnReplayGame(event: ReplayGameEvent)
	{
		if(this.matchState == MatchState.GameOver)
		{
			this.DeInitComponents();
			this.InitComponents();
			this.matchView.SetScene(this.scene);
			this.feverControl.AttachToHUD();
			this.InitMatch();
		}
	}

	private OnRevive(event: ReviveEvent)
	{
		if(this.matchState == MatchState.GameOver)
		{
			var method:EliminateMethod = new EliminateMethod();
			method.froceKill = true;
			method.methodType = EliminateMethodType.SpecificRegion
			method.eliminateElementType = EliminateElementType.PillAndVirus;
			method.specificRegion = Tools.GetRegionPosList(0,0,Scene.Columns-1,Procedure_ReviveEliminateLine-1);
			this.matchState = MatchState.SpecialEliminate;
			this.StartSpecialSceneEliminate(method);
		}
	}

	private OnPause(event:PauseEvent)
	{
		if(this.matchState == MatchState.GameOver)
			return;

		if(this.pause == event.pause)
			return;

		this.pause = event.pause;
		GameMain.GetInstance().SetPause(this.pause);

		var hudEvent = new HUDEvent();
		hudEvent.eventType = this.pause ? HUDEventType.ShowPauseMenu : HUDEventType.HidePauseMenu;
		GameMain.GetInstance().DispatchEvent(hudEvent);

		//play pause sound
		if(this.pause)
        {
			var playSoundEvent = new PlaySoundEvent("Pause_mp3", 1);
        	GameMain.GetInstance().DispatchEvent(playSoundEvent);

			var bgmControlEvent = new BgmControlEvent();
			bgmControlEvent.bgmStage = this.feverControl.IsInFeverState() ? BgmStage.Fever : BgmStage.Global;
			bgmControlEvent.controlType = BgmControlType.Pause;
			GameMain.GetInstance().DispatchEvent(bgmControlEvent);
		}
		else
		{
			var bgmControlEvent = new BgmControlEvent();
			bgmControlEvent.bgmStage = this.feverControl.IsInFeverState() ? BgmStage.Fever : BgmStage.Global;
			bgmControlEvent.controlType = BgmControlType.Resume;
			GameMain.GetInstance().DispatchEvent(bgmControlEvent);
		}
	}

	private AddTurn()
	{
		this.turn++;

		this.playerControl.AddTurn();

		let event = new HUDEvent();
		event.eventType = HUDEventType.ChangeStep;
		event.param = this.turn;
		GameMain.GetInstance().DispatchEvent(event);
	}
}

enum MatchState
{
	None,
	Init, //游戏开始
	NpcControl, //处理Npc的AI，是否要生成新的Npc
	PlayerControl, //该状态下玩家可控制药丸旋转、下落
	SpecialEliminate, //特殊消除阶段，用来做一些特殊事件的（比如boss出场）的消除
	Eliminate, //消除阶段，计算刚才玩家的操作是否产生消除，以及处理消除的各种效果
	NpcSkill, //Npc施放技能
	GameOver //拜拜了
}

enum GameMode
{
	Classic,
	BossFight,
}