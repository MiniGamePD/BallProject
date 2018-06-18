class BallMatchView extends GameView
{
    private hud: MatchHUD;
    private playerLv: egret.TextField;
    private battleGround: egret.DisplayObjectContainer;

    public CreateView(): void
    {
        var bg = new FullScreenCover(0x000000, 1);
        bg.touchEnabled = true;
        this.addChild(bg);

        this.CreateBattleGround();
        this.CreatePlayerLv();
        this.CreateHUD();
        this.RegisterEvent();
    }

    private RegisterEvent(): void
    {
        GameMain.GetInstance().AddEventListener(BallEmitterLevelUpEvent.EventName, this.OnBallEmitterLevelUpEvent, this);
        GameMain.GetInstance().AddEventListener(SpecialBoxEliminateEvent.EventName, this.OnSpecialBoxEliminateEvent, this);
    }

    private UnRegisterEvent(): void
    {
        GameMain.GetInstance().RemoveEventListener(BallEmitterLevelUpEvent.EventName, this.OnBallEmitterLevelUpEvent, this);
        GameMain.GetInstance().RemoveEventListener(SpecialBoxEliminateEvent.EventName, this.OnSpecialBoxEliminateEvent, this);
    }

    public UpdateView(deltaTime: number): void 
    {
        this.hud.Update(deltaTime);
    }

    public ReleaseView(): void 
    {
        this.DeletePlayerLv();
        this.DeleteHUD();
        this.UnRegisterEvent();
    }

    private CreatePlayerLv()
    {
        this.playerLv = new egret.TextField();
        this.playerLv.text = "Lv. 1";
        this.playerLv.size = 30;
        this.playerLv.width = 200;
        this.playerLv.height = 60;
        this.playerLv.anchorOffsetX = this.playerLv.width / 2;
        this.playerLv.anchorOffsetY = this.playerLv.height / 2;
        this.playerLv.textAlign = "center";
        this.playerLv.x = GameMain.GetInstance().GetStageWidth() / 2;
        this.playerLv.y = GameMain.GetInstance().GetStageHeight() / 2 + 100;
        this.addChild(this.playerLv);

        // this.playerLv.touchEnabled = true;
        // this.playerLv.addEventListener(egret.TouchEvent.TOUCH_TAP, this.GameOver, this);
    }

    private OnBallEmitterLevelUpEvent(event: BallEmitterLevelUpEvent)
    {
        this.playerLv.text = "Lv. " + event.curLevel;
    }

    private CreateBattleGround()
    {
        this.battleGround = new egret.DisplayObjectContainer();
        this.battleGround.width = this.width;
        this.battleGround.height = this.height;
        this.addChild(this.battleGround);
    }

    public GetBattleGround(): egret.DisplayObjectContainer
    {
        return this.battleGround;
    }

    private GameOver()
    {
        let event = new GameOverEvent();
        GameMain.GetInstance().DispatchEvent(event);
    }

    private DeletePlayerLv()
    {
        this.removeChild(this.playerLv);
        this.playerLv = null;
    }

    private CreateHUD()
    {
        this.hud = new MatchHUD();
        this.hud.width = GameMain.GetInstance().GetStageWidth();
        this.hud.height = GameMain.GetInstance().GetStageHeight();
        this.hud.x = this.hud.y = 0;
        this.hud.Init();
        this.addChild(this.hud);
    }

    private DeleteHUD()
    {
        this.hud.Release();
        this.hud = null;
    }

    public SetLevel(level: number)
    {
        this.playerLv.text = "Lv. " + level;
    }

    private OnSpecialBoxEliminateEvent(evt: SpecialBoxEliminateEvent): void
	{
		if (evt != null)
		{
			if (evt.boxType == BoxType.SixMulDir)
			{
				this.ShowTips("变身 5秒", 0x3562ec);
			}
			else if (evt.boxType == BoxType.FireUp)
			{
				this.ShowTips("射速翻倍 5秒", 0xd6340a);
			}
			else if (evt.boxType == BoxType.LevelUp)
			{
				this.ShowTips("炮台升级", 0x59d61b);
			}
            else if (evt.boxType == BoxType.Pause)
			{
				this.ShowTips("定时 5秒", 0x6726a5);
			}
		}
	}


    public ShowTips(tipString: string, color: number)
    {
        var tips: egret.TextField;
        tips = new egret.TextField();
        tips.text = tipString;
        tips.size = 20;
        tips.width = 200;
        tips.height = 60;
        tips.anchorOffsetX = tips.width / 2;
        tips.anchorOffsetY = tips.height / 2;
        tips.textAlign = "center";
        tips.bold = true;
        tips.x = GameMain.GetInstance().GetStageWidth() / 2;
        tips.y = GameMain.GetInstance().GetStageHeight() / 2 - 50;
        tips.textColor = color;
        this.addChild(tips);

        var moveParam = new PaMovingParam()
        moveParam.displayObj = tips;
        moveParam.duration = 1000;
        moveParam.targetPosX = tips.x;
        moveParam.targetPosY = tips.y - 40;
        moveParam.needRemoveOnFinish = true;
        var moveEvent = new PlayProgramAnimationEvent();
        moveEvent.param = moveParam;
        GameMain.GetInstance().DispatchEvent(moveEvent);


        var alphaParam = new PaAlphaLoopParam();
        alphaParam.displayObj = tips;
        alphaParam.duration = 1000;
        alphaParam.interval = 500;
        alphaParam.startAlpha = 0.5
        alphaParam.endAlpha = 1
        alphaParam.reverse = true;
        var alphaEvent = new PlayProgramAnimationEvent();
        alphaEvent.param = alphaParam;
        GameMain.GetInstance().DispatchEvent(alphaEvent);
    }
} 