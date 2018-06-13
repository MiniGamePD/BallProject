class MatchView extends GameView
{
    private mResModule: IResModule;
    private mSoundModule: ISoundModule
    private mScene: Scene;
    private matchScore: MatchScore;
    private mBattleGround: egret.Sprite;
    private mBattleGroundBlocks: egret.DisplayObjectContainer;
    private mBattleGroundCoverEff: egret.DisplayObjectContainer;
    private eliminatingAnim: EliminatingAnimation;
    private bossSkillAnim: BossSkillAnimation;
    private enemyBornWarningItemArray: egret.Bitmap[];
    private enemyBornWarningCountDown: egret.Bitmap;
    private feverRibbonsArray: particle.GravityParticleSystem[];

    private hud:MatchHUD;
    private dynamicBg: MatchViewDynamicBg;

    public CreateView(): void
    {
        this.mResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
        this.mSoundModule = <ISoundModule>GameMain.GetInstance().GetModule(ModuleType.SOUND);

        this.LoadBackGround();
        this.CreateHUD();
        this.CreateFeverRibbonsParticleArray();

        // this.PlayBgm();
        this.bossSkillAnim = new BossSkillAnimation();
        this.bossSkillAnim.Init(this);

        this.eliminatingAnim = new EliminatingAnimation();
        this.eliminatingAnim.Init(this);

        this.dynamicBg = new MatchViewDynamicBg();
        this.dynamicBg.Init(this.mResModule, this);
        
        GameMain.GetInstance().AddEventListener(SceneElementControlSuccessEvent.EventName, this.ProcessControlSuccess, this);
        GameMain.GetInstance().AddEventListener(ReplayGameEvent.EventName, this.OnReplayGame, this);
        GameMain.GetInstance().AddEventListener(ReviveEvent.EventName, this.OnRevive, this);
        GameMain.GetInstance().AddEventListener(EnemyBornWarningEvent.EventName, this.OnEnemyBornWarningEvent, this);
        GameMain.GetInstance().AddEventListener(SceneElementMoveUpEvent.EventName, this.OnSceneElementMoveUpEvent, this);
        GameMain.GetInstance().AddEventListener(FeverEvent.EventName, this.OnFeverEvent, this);
    }

    public ReleaseView(): void 
    {
        this.DeleteHUD();

        if (this.dynamicBg != null)
        {
            this.dynamicBg.Release();
        }
        
        this.removeChild(this.mAdaptedStage);
        GameMain.GetInstance().ClearAdaptedStageContainer();

        GameMain.GetInstance().RemoveEventListener(SceneElementControlSuccessEvent.EventName, this.ProcessControlSuccess, this);
        GameMain.GetInstance().RemoveEventListener(ReplayGameEvent.EventName, this.OnReplayGame, this);
        GameMain.GetInstance().RemoveEventListener(ReviveEvent.EventName, this.OnRevive, this);
        GameMain.GetInstance().RemoveEventListener(EnemyBornWarningEvent.EventName, this.OnEnemyBornWarningEvent, this);
        GameMain.GetInstance().RemoveEventListener(SceneElementMoveUpEvent.EventName, this.OnSceneElementMoveUpEvent, this);
        GameMain.GetInstance().RemoveEventListener(FeverEvent.EventName, this.OnFeverEvent, this);
    }

    private ResetView()
    {
        this.mBattleGround.removeChildren();
        this.mBattleGround.addChild(this.mBattleGroundBlocks);

        this.ReleaseEnemyBornWarningElements();
        this.mBattleGroundCoverEff.removeChildren(); 

        if(this.feverRibbonsArray != null && this.feverRibbonsArray != undefined)
        {
            for(var i = 0; i < this.feverRibbonsArray.length; ++i)
            {
                this.feverRibbonsArray[i].stop();
            }
        }

        this.hud.Reset();   
    }

    public SetScene(scene: Scene)
    {
        this.mScene = scene;
    }

    public SetMatchScore(matchScore: MatchScore)
    {
        this.matchScore = matchScore;
    }

    public UpdateView(deltaTime: number): void
    {
        if (this.mScene.bossSkillInfo.hasInfo)
        {
            this.UpdateBossSkill(deltaTime);
        }
        else if (this.mScene.eliminateInfo.HasInfo)
        {
            this.UpdateEliminating(deltaTime);
        }
        else
        {
            this.RefreshScene();
        }

        this.hud.Update(deltaTime);

        if (this.dynamicBg != null)
        {
            this.dynamicBg.Update(deltaTime);
        }
    }

    private ProcessControlSuccess(event: SceneElementControlSuccessEvent)
    {
        this.RefreshScene();
    }

    private UpdateBossSkill(deltaTime: number)
    {
        if (this.bossSkillAnim != null)
        {
            if (!this.bossSkillAnim.IsPlaying())
            {
                this.bossSkillAnim.Start(this.mScene.bossSkillInfo);
            }
            this.bossSkillAnim.Update(deltaTime);
        }
    }

    private UpdateEliminating(deltaTime: number)
    {
        if (this.eliminatingAnim != null)
        {
            if (!this.eliminatingAnim.IsPlaying())
            {
                this.eliminatingAnim.Start(this.mScene.eliminateInfo, this.matchScore);
            }
            this.eliminatingAnim.Update(deltaTime);

            //移除已经不用的DisplayObject
            var deadElementArray:SceneElementBase[] = this.eliminatingAnim.GetDeadElementArray();
            var count = deadElementArray.length;
            if(count > 0)
            {
                for(var i = 0; i < count; ++i)
                {
                    if (deadElementArray[i] != null)
                    {
                        deadElementArray[i].Release();
                    }
                }
                this.eliminatingAnim.ClearGetDeadElementRenderArray();
            }
        }
    }

    private EliminatLightning(deltaTime: number)
    {

    }

    private RefreshScene()
    {
        for (var i = 0; i < Scene.Columns; ++i)
        {
            for (var j = 0; j < Scene.Rows; ++j)
            {
                let element = this.mScene.sceneData[i][j];
                if (element != null)
                {
                    if (!element.hasAddToDisplayList)
                    {
                        //renderer == null，应该是一个placeholder
                        if(element.renderer != null)
                        {
                            //bg accessory
                            if(element.accessoryBg != undefined)
                                this.mBattleGround.addChild(element.accessoryBg);

                            //本体
                            element.Adapte(Tools.MatchViewElementWidth * element.BlockWidth(), 
                                         Tools.MatchViewElementHeight * element.BlockHeight());
                            this.mBattleGround.addChild(element.renderer);

                            //accessory
                            if(element.accessory != undefined)
                                this.mBattleGround.addChild(element.accessory);                        
                        }
                        element.hasAddToDisplayList = true;
                        //console.log(element + " add to dis " + element.renderer.width + "," + element.renderer.height);
                    }

                    if (element.dirty)
                    {
                        //renderer == null，应该是一个placeholder
                        if(element.renderer != null)
                        {
                            var x = Tools.GetMatchViewRenderPosX(element.posx);
                            var y = Tools.GetMatchViewRenderPosY(element.posy);
                            element.renderer.x = x;
                            element.renderer.y = y;
                            if(element.accessory != undefined)
                            {
                                element.accessory.x = x;
                                element.accessory.y = y;
                            }
                            if(element.accessoryBg != undefined)
                            {
                                element.accessoryBg.x = x;
                                element.accessoryBg.y = y;
                            }
                        }
                        element.dirty = false;
                        //console.log(element + " refresh " + element.renderer.x + "," + element.renderer.y);
                    }
                }
            }
        }
    }

    public BattleGroundAddChild(child: egret.DisplayObject)
    {
        this.mBattleGround.addChild(child);
    }

    public BattleGroundRemoveChild(child: egret.DisplayObject)
    {
        if (child != null && child != undefined && child.parent == this.mBattleGround)
        {
            this.mBattleGround.removeChild(child);
        }
    }

    public RefreshTextrue(): void
    {
        for (var i = 0; i < Scene.Columns; ++i)
        {
            for (var j = 0; j < Scene.Rows; ++j)
            {
                let element = this.mScene.sceneData[i][j];
                if (element != null && element.dirty)
                {
                    element.RefreshTexture();
                }
            }
        }
    }

    private LoadBackGround()
    {
        if (this.mResModule != null)
        {
            let bg = this.mResModule.CreateBitmapByName("pd_res_json.NewBackGround");
            this.addChild(bg);
            //bg.width = GameMain.GetInstance().GetStageWidth();
            //bg.height = GameMain.GetInstance().GetStageHeight();

            var adaptedStageRect:egret.Rectangle = GameMain.GetInstance().GetAdaptedDisplayRect();
            this.mAdaptedStage = GameMain.GetInstance().GetAdaptedStageContainer();
            this.addChild(this.mAdaptedStage);
            // if(DEBUG)
            // {
            //     var adaptedStage = <egret.Sprite>this.mAdaptedStage;
            //     adaptedStage.graphics.beginFill(0x00FF00, 0.5);
            //     adaptedStage.graphics.drawRect(0,0,
            //         adaptedStage.width, adaptedStage.height);
            //     adaptedStage.graphics.endFill();
            // }

            var battleGroundBg = this.mResModule.CreateBitmapByName("pd_res_json.zhanqu");
            battleGroundBg.x = 0;
            battleGroundBg.y = 186;
            battleGroundBg.width = 640;
            battleGroundBg.height = 966;
            GameMain.GetInstance().AdapteDisplayObject(battleGroundBg);
            this.mAdaptedStage.addChild(battleGroundBg);

            this.mBattleGround = new egret.Sprite();
            //battle rect in stander resolution
            let battleRect = new egret.Rectangle(30, 280, 580, 812);
            battleRect.x = battleRect.x * adaptedStageRect.width / Screen_StanderScreenWidth;
            battleRect.y = battleRect.y * adaptedStageRect.height / Screen_StanderScreenHeight;
            battleRect.width = battleRect.width * adaptedStageRect.width / Screen_StanderScreenWidth;
            battleRect.height = battleRect.height * adaptedStageRect.height / Screen_StanderScreenHeight;
            // battleRect.x = battleRect.x * this.mStageWidth / Screen_StanderScreenWidth;
            // battleRect.y = battleRect.y * this.mStageHeight / Screen_StanderScreenHeight;
            // battleRect.width = battleRect.width * this.mStageWidth / Screen_StanderScreenWidth;
            // battleRect.height = battleRect.height * this.mStageHeight / Screen_StanderScreenHeight;

            Tools.MatchBattleGroundPosX = battleRect.x;
            Tools.MatchBattleGroundPosY = battleRect.y;
            this.mBattleGround.x = Tools.MatchBattleGroundPosX;
            this.mBattleGround.y = Tools.MatchBattleGroundPosY;

            // if(DEBUG)
            // {
            //     this.mBattleGround.graphics.beginFill(0xFF0000, 0.3);
            //     this.mBattleGround.graphics.drawRect(0, 0, battleRect.width, battleRect.height);
            //     this.mBattleGround.graphics.endFill();
            // }

            this.mAdaptedStage.addChild(this.mBattleGround);

            this.mBattleGroundCoverEff = new egret.DisplayObjectContainer();
            this.mBattleGroundCoverEff.x = battleRect.x;
            this.mBattleGroundCoverEff.y = battleRect.y;
            this.mBattleGroundCoverEff.width = battleRect.width;
            this.mBattleGroundCoverEff.height = battleRect.height;
            this.mAdaptedStage.addChild(this.mBattleGroundCoverEff);

            if(DEBUG)
                console.log("BattleRect is :" + battleRect);

            Tools.MatchViewElementWidth = battleRect.width / Scene.Columns;
            Tools.MatchViewElementHeight = battleRect.height / Scene.Rows;
            Tools.MatchViewBattleGroundStartXCenter = Tools.MatchViewElementWidth / 2;
            Tools.MatchViewBattleGroundStartYCenter = Tools.MatchViewElementHeight / 2;

            this.mBattleGroundBlocks = new egret.DisplayObjectContainer();
            this.mBattleGround.addChild(this.mBattleGroundBlocks);  
            // for(var y = 0; y < Scene.Rows; ++y)
            // {
            //     for(var x = 0; x < Scene.Columns; ++x)
            //     {
            //         var block = this.mResModule.CreateBitmapByName("pd_res_json.gezi");
            //         block.fillMode = egret.BitmapFillMode.SCALE;
            //         block.x = Tools.GetMatchViewRenderPosX(x);
            //         block.y = Tools.GetMatchViewRenderPosY(y);
            //         block.anchorOffsetX = Tools.MatchViewElementWidth / 2;
            //         block.anchorOffsetY = Tools.MatchViewElementHeight / 2;
            //         block.width = Tools.MatchViewElementWidth
            //         block.height = Tools.MatchViewElementHeight
            //         this.mBattleGroundBlocks.addChild(block);
            //     }
            // }
        }
    }

    private CreateHUD()
    {
        this.hud = new MatchHUD();
        this.hud.width = this.mAdaptedStage.width;
        this.hud.height = this.mAdaptedStage.height;
        this.hud.x = this.hud.y = 0;
        this.hud.Init();
        this.mAdaptedStage.addChild(this.hud);
    }

    private DeleteHUD()
    {
        this.hud.Release();
        this.hud = null;
    }

    private OnReplayGame(event:ReplayGameEvent)
    {
        this.ResetView();
    }

    private OnRevive(event:ReviveEvent)
    {
        this.ReleaseEnemyBornWarningElements();
    }

    private ReleaseEnemyBornWarningElements()
    {
        if(this.enemyBornWarningItemArray != null && this.enemyBornWarningItemArray != undefined)
        {
            for(var i = 0; i < this.enemyBornWarningItemArray.length; ++i)
            {
                this.mBattleGroundCoverEff.removeChild(this.enemyBornWarningItemArray[i]);
            }
            this.enemyBornWarningItemArray = null;
        }

        if(this.enemyBornWarningCountDown != null && this.enemyBornWarningCountDown != undefined)
        {
            this.mBattleGroundCoverEff.removeChild(this.enemyBornWarningCountDown);
            this.enemyBornWarningCountDown = null;   
        }
    }

    private ShowEnemyBornWarningCountDown(countDown:number)
    {
        if(countDown > 0)
        {
            if(this.enemyBornWarningCountDown == null || this.enemyBornWarningCountDown == undefined)
            {
                this.enemyBornWarningCountDown = this.mResModule.CreateBitmapByName("pd_res_json.NO" + countDown);
                this.enemyBornWarningCountDown.x = 4.3 * Tools.MatchViewElementWidth;
                this.enemyBornWarningCountDown.y = Tools.MatchViewElementHeight;
                this.enemyBornWarningCountDown.width = 1.5 * Tools.MatchViewElementWidth;
                this.enemyBornWarningCountDown.height = 1.5 * Tools.MatchViewElementHeight;
                this.mBattleGroundCoverEff.addChild(this.enemyBornWarningCountDown);

                //让他动起来
                var param = new PaAlphaLoopParam;
                param.displayObj = this.enemyBornWarningCountDown;
                param.interval = 800;
                param.duration = 10 * 60 * 1000;
                param.startAlpha = 0.1;
                param.endAlpha = 0.8;
                param.reverse = true;
                var event = new PlayProgramAnimationEvent();
                event.param = param;
                GameMain.GetInstance().DispatchEvent(event);
            }    
            else
            {
                var tex = this.mResModule.GetRes("pd_res_json.NO" + countDown);
                this.enemyBornWarningCountDown.texture = tex;
            }
        }
        else
        {
            if(this.enemyBornWarningCountDown != null && this.enemyBornWarningCountDown != undefined)
            {
                this.mBattleGroundCoverEff.removeChild(this.enemyBornWarningCountDown);
                this.enemyBornWarningCountDown = null;
            }
        }
    }

    private ShowEnemyBornWarningItem(line:number)
    {
        this.enemyBornWarningItemArray = [];
        for(var i = 0; i < line; ++i)
        {
            var warningItem = this.mResModule.CreateBitmapByName("pd_res_json.Warning");
            warningItem.x = 0;
            warningItem.y = i * Tools.MatchViewElementHeight;
            warningItem.width = Scene.Columns * Tools.MatchViewElementWidth;
            warningItem.height = Tools.MatchViewElementHeight;
            warningItem.alpha = 0.1;

            //让他动起来
            var param = new PaAlphaLoopParam;
            param.displayObj = warningItem;
            param.interval = 800;
            param.duration = 10 * 60 * 1000;
            param.startAlpha = 0.1;
            param.endAlpha = 0.8;
            param.reverse = true;
            var event = new PlayProgramAnimationEvent();
            event.param = param;
            GameMain.GetInstance().DispatchEvent(event);

            this.enemyBornWarningItemArray.push(warningItem);
            this.mBattleGroundCoverEff.addChild(warningItem);
        }
    }

    private OnEnemyBornWarningEvent(event:EnemyBornWarningEvent)
    {
        if(this.enemyBornWarningItemArray == null || this.enemyBornWarningItemArray == undefined ||
            this.enemyBornWarningItemArray.length <= 0)
        {
            this.ShowEnemyBornWarningItem(event.enemyLine);
        }
    
        //倒计时
        this.ShowEnemyBornWarningCountDown(event.bornCountDown);
    }

    private OnSceneElementMoveUpEvent(event:SceneElementMoveUpEvent)
    {
        if(event.isMoveSuccess)
        {
            //上移成功，消除一排enemey born warning
            var index = this.enemyBornWarningItemArray.length - 1;
            if(index < 0)
            {
                if(DEBUG)
                {
                    console.error("还在move up， enemy born warning却没有了？？");
                }
                return;
            }

            var warningItem = this.enemyBornWarningItemArray.splice(index, 1)[0];
            this.mBattleGroundCoverEff.removeChild(warningItem);
        }
    }

    private CreateFeverRibbonsParticleArray()
    {
        this.feverRibbonsArray = [];
        this.feverRibbonsArray.push(this.CreateFeverParticle("Caidai_Blue","Caidai"));
        this.feverRibbonsArray.push(this.CreateFeverParticle("Caidai__zise","Caidai"));
        this.feverRibbonsArray.push(this.CreateFeverParticle("Caidai_Red","Caidai"));
        this.feverRibbonsArray.push(this.CreateFeverParticle("Caidai_Green","Caidai"));
        this.feverRibbonsArray.push(this.CreateFeverParticle("Caidai_Yellow","Caidai"));
        this.feverRibbonsArray.push(this.CreateFeverParticle("caihong_shinning1","Caidai"));
        this.feverRibbonsArray.push(this.CreateFeverParticle("caihong_shinning2","Caidai"));
        this.feverRibbonsArray.push(this.CreateFeverParticle("caihong_shinning3","Caidai"));
    }

    private CreateFeverParticle(texName:string, jsonName:string):particle.GravityParticleSystem
    {
        var particleSys = this.mResModule.CreateParticle(texName, jsonName);
		particleSys.x = GameMain.GetInstance().GetStageWidth() / 2;
        particleSys.y = 0;

        var screenWidth = egret.Capabilities.boundingClientWidth;
		var screenHeight = egret.Capabilities.boundingClientHeight;
        var screenAspect = screenWidth / screenHeight;
		var standerAspect = Screen_StanderScreenWidth / Screen_StanderScreenHeight; //640:1136
		if(screenAspect <= standerAspect)
		{
			//屏幕很长，iphonex
			//有富余的高度，因此放在屏幕的顶端
            //层级1，跳过back ground
			this.addChildAt(particleSys, 1);
		}
		else
		{
			//屏幕更短，ipad
			//有富余的宽度，因此放在adaptStage顶端
            //层级0， 放在最底层
            this.mAdaptedStage.addChildAt(particleSys, 0);
		}
		
		return particleSys;
    }

    private OnFeverEvent(feverEvent:FeverEvent)
    {
        if(feverEvent.feverBegin)
        {
            for(var i = 0; i < this.feverRibbonsArray.length; ++i)
            {
                this.feverRibbonsArray[i].start();
            }       
        }
        else
        {
            for(var i = 0; i < this.feverRibbonsArray.length; ++i)
            {
                this.feverRibbonsArray[i].stop();
            }
        }
    }
}