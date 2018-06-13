class NpcControl extends GameModuleComponentBase
{
    // //当前所有的NPC，用于触发StartNewTurn的操作
    // private aliveNpcArray:NpcElement[];

    // //保存这个数组，后面这些npc需要通过NpcControl来触发技能
    // private skillNpcArray:NpcElement[];  

    private creatorWorkParam:CreatorWorkParam;
	private npcElementCreator: NpcElementCreator;

    //用于将npc一个一个添加进场景中的表现
    private tobeAddToSceneNpcArray:NpcElement[];
    private addNpcToSceneInterval:number;
    private addAllNpcInOneTime:boolean;

    //如果创建了Npc，则播放一个很贱的笑声
    private npcSmileSound:string;

    private npcControlTimer:number;
    private npcControlState:NpcControlState;

    //用于记录当前npc的skill信息
    private curNpcSkillInfo:BossSkillInfo;

    //上一回合的回合数
    private lastTurnNum:number;

    //游戏模式
    private gameMode:GameMode;

    //还需要往上移动的行数
    private remindMoveUpNum:number;
    private remindCreateEnemyTurns:number;
    private remindInitCreateEnemyLines:number;

    //当前难度系数Id
    private curDifficultyId:number;
    private curDifficultyShieldProperty:number;
    private curDifficultyCreateEnemyLineNum:number;

    public moveUpFinish:boolean;

    public constructor(gameplayElementFactory:GameplayElementFactory)
    {
        super();
        this.creatorWorkParam = new CreatorWorkParam();
        this.npcElementCreator = new NpcElementCreator(gameplayElementFactory);
    }

    public Init():void
    {
        // this.skillNpcArray = [];
        // this.aliveNpcArray = [];
        this.lastTurnNum = -1;
        this.npcControlState = NpcControlState.None;
        this.remindMoveUpNum = 0;
        this.remindCreateEnemyTurns = -1;
        this.curDifficultyId = 0;
        this.curDifficultyShieldProperty = 0;
        this.curDifficultyCreateEnemyLineNum = 0;
        this.moveUpFinish = false;
        GameMain.GetInstance().AddEventListener(SceneElementAccessAnswerEvent.EventName, this.OnReciveSceneData, this);
        GameMain.GetInstance().AddEventListener(SceneElementControlFailedEvent.EventName, this.OnAddElementToSceneFailed, this);
    }

    public Release():void
    {
        // this.skillNpcArray = [];
        // this.aliveNpcArray = [];
        this.lastTurnNum = -1;
        this.moveUpFinish = false;
        GameMain.GetInstance().RemoveEventListener(SceneElementAccessAnswerEvent.EventName, this.OnReciveSceneData, this);
        GameMain.GetInstance().RemoveEventListener(SceneElementControlFailedEvent.EventName, this.OnAddElementToSceneFailed, this);
    }

    public Work(param?:any):any
    {
        super.Work(param);

        let controlWorkParam:GameplayControlWorkParam = param;
        if(controlWorkParam.turn > this.lastTurnNum)
        {
            this.OnStartNewTurn();
            this.lastTurnNum = controlWorkParam.turn;
        }

        if(this.npcControlState == NpcControlState.DestroyObstruction)
        {
            //接上一次NpcControl的操作，直接跳转到AddNpcToScene
            this.npcControlState = NpcControlState.AddNpcToScene;
            return;
        }

        if(this.npcControlState == NpcControlState.NpcSkill)
        {
             //接上一次NpcControl的操作，直接跳转到NpcControlFinish
            this.npcControlState = NpcControlState.NpcControlFinish;
            return;
        }

        this.npcSmileSound = null;
        this.curNpcSkillInfo = null;

        if(this.npcControlState == NpcControlState.MoveAllUp)
        {
            this.CreateEnemyLine(0, this.curDifficultyShieldProperty, Scene.Rows-1);
            this.npcSmileSound = this.remindMoveUpNum > 0 ? null : "EnemySinisterSmile1_mp3";

            return;
        }

        if(this.npcControlState == NpcControlState.None)
        {
            // if(this.gameMode == GameMode.BossFight)
            // {
            //     if(controlWorkParam.turn != 0 && controlWorkParam.turn % TurnNum_CreateSkillBossTurnNum == 0 
            //         && this.skillNpcArray.length < skillBossMaxNum)
            //     {
            //         //创建boss
            //         this.creatorWorkParam.paramIndex = NpcElementCreateType.RandomSuperVirus;
            //         this.creatorWorkParam.createNum = 1;
            //         this.tobeAddToSceneNpcArray = [];
            //         this.tobeAddToSceneNpcArray.push(this.npcElementCreator.CreateElement(this.creatorWorkParam));

            //         //向scene询问已经存在的boss的格子，用来放置新生成的boss
            //         var event = new SceneElementAccessEvent();
            //         event.accessType = SceneElementType.PlaceHolder;
            //         event.answerType = SceneElementAccessAnswerType.Pos;
            //         event.startX = 0;
            //         event.startY = 2;
            //         event.accesser = this;
            //         GameMain.GetInstance().DispatchEvent(event);

            //         this.npcSmileSound = "EnemySinisterSmile2_mp3"; 
            //         return;
            //     }    

            //     if(this.skillNpcArray.length > 0 && controlWorkParam.turn % TurnNum_BossSkillTurnNum == 0)
            //     {
            //         //boss放技能
            //         let id:number = Math.floor(this.skillNpcArray.length * Math.random());
            //         let skillNpc:NpcElement = this.skillNpcArray[id];

            //         //首先向scene查询对应物体的列表
            //         var event = new SceneElementAccessEvent();
            //         event.accesser = this;
            //         event.answerType = SceneElementAccessAnswerType.Instance;
            //         if(skillNpc.SkillType() == NpcSkillType.AddShieldForVirus ||
            //             skillNpc.SkillType() == NpcSkillType.ChangeVirusColor)
            //         {
            //             event.accessType = SceneElementType.Virus;
            //         }
            //         else if(skillNpc.SkillType() == NpcSkillType.ChangePillToVirus)
            //         {
            //             event.accessType = SceneElementType.Pill;
            //         }
            //         else
            //         {
            //             console.error("Invalid Skill Type " + skillNpc.SkillType());
            //         }

            //         this.curNpcSkillInfo = new BossSkillInfo();
            //         this.curNpcSkillInfo.skillCaster = skillNpc;
            //         GameMain.GetInstance().DispatchEvent(event);
                    
            //         return;
            //     }
            // }

            if(this.remindCreateEnemyTurns >= 0 && this.remindCreateEnemyTurns <= 3)
            {
                //TODO：小怪降临的特效提示
                var enemyBornWarningEvent = new EnemyBornWarningEvent();
                enemyBornWarningEvent.enemyLine = this.curDifficultyCreateEnemyLineNum;
                enemyBornWarningEvent.bornCountDown = this.remindCreateEnemyTurns;
                GameMain.GetInstance().DispatchEvent(enemyBornWarningEvent);
            }

            if(this.remindCreateEnemyTurns <= 0)
            {
                //创建普通小怪
                if(controlWorkParam.turn == 0)
                {
                    this.remindInitCreateEnemyLines = Procedure_InitCreateEnemyLine;
                    this.npcControlState = NpcControlState.InitCreateEnemy;
                    this.addAllNpcInOneTime = true;
                    this.npcControlTimer = 0;
                    this.addNpcToSceneInterval = Time_AddNpcToSceneIntervalMax;
                }
                else
                {
                    this.npcControlState = NpcControlState.MoveAllUp;
                    this.remindMoveUpNum = this.curDifficultyCreateEnemyLineNum;
                    this.addAllNpcInOneTime = false;
                }
                return;
            }
        }
        
        //npc 啥事也不做
        this.npcControlState = NpcControlState.NpcControlFinish;
    }

    private CreateEnemyLine(maxEmptyNum:number, shieldProperty:number, line:number)
    {
        var createNum:number = Scene.Columns - Math.floor(Math.random() * maxEmptyNum);
        this.CreateRandomVirus(createNum, shieldProperty, 0, line, Scene.Columns-1, line);
    }

    private CreateRandomVirus(createNum:number, shieldProperty:number, startX:number, startY:number,
        endX?:number, endY?:number)
    {
        this.creatorWorkParam.paramIndex = NpcElementCreateType.RandomVirus;
        this.creatorWorkParam.createNum = createNum;
        this.tobeAddToSceneNpcArray = this.npcElementCreator.CreateElement(this.creatorWorkParam);

        //给新生成的小怪添加护盾
        if(shieldProperty > 0)
        {
            for(var i = 0; i < this.tobeAddToSceneNpcArray.length; ++i)
            {
                var npc:NpcElement = this.tobeAddToSceneNpcArray[i];
                if(Math.random() <= shieldProperty)
                {
                    npc.AddShield(1);
                }
            }
        }

        //向scene询问空的格子，用来放置新生成的小怪
        var event = new SceneElementAccessEvent();
        event.accesser = this;
        event.accessType = SceneElementType.Empty;
        event.answerType = SceneElementAccessAnswerType.Pos;
        event.startX = startX;
        event.startY = startY;
        if(endX != undefined && endY != undefined)
        {
            event.endX = endX
            event.endY = endY;
        }
        GameMain.GetInstance().DispatchEvent(event);
    }

    private OnReciveSceneData(event:SceneElementAccessAnswerEvent)
    {
        if(event.accesser == this)
        {
            if(this.curNpcSkillInfo != null)
            {
                this.PrepareNpcSkillInfo(event.queryAnswerArray);
            }
            else
            {
                this.ArrangePosForNewNpcElements(event.queryAnswerArray);
            }
        }
    }

    protected UpdateInternal(deltaTime:number)
    { 
        switch(this.npcControlState)
        {
            case NpcControlState.AddNpcToScene:
                this.UpdateAddNpcToScene(deltaTime);
                break;
            case NpcControlState.PlaySinisterSmileSound:
                this.UpdatePlaySinisterSmileSound(deltaTime);
                break;
            case NpcControlState.MoveAllUp:
                this.UpdateMoveAllUp(deltaTime);
                break;
            case NpcControlState.NpcControlFinish:
                this.UpdateNpcControlFinish(deltaTime);
                break;
            case NpcControlState.InitCreateEnemy:
                this.UpdateInitCreateEnemy(deltaTime);
                break;
        }
    }

    private UpdateAddNpcToScene(deltaTime:number)
    {
        if(this.tobeAddToSceneNpcArray != null && this.tobeAddToSceneNpcArray.length > 0)
        {
            if(this.addAllNpcInOneTime)
            {
                var event = new SceneElementControlEvent();
                event.controlType = SceneElementControlType.Add;
                event.sceneElements = [];
                event.playerControl = false;

                for(var i = 0; i < this.tobeAddToSceneNpcArray.length; ++i)
                {
                    var temp:SceneElementBase[] = this.tobeAddToSceneNpcArray[i].GetSceneElements();
                    for(var j = 0; j < temp.length; ++j)
                        event.sceneElements.push(temp[j]);
                }

                GameMain.GetInstance().DispatchEvent(event);
                this.tobeAddToSceneNpcArray[0].PlaySound(NpcSoundType.Born);
                this.tobeAddToSceneNpcArray = null;
            }
            else
            {
                this.npcControlTimer += deltaTime;
                if(this.npcControlTimer >= this.addNpcToSceneInterval)
                {
                    let index = this.tobeAddToSceneNpcArray.length - 1;
                    let npc = this.tobeAddToSceneNpcArray[index];
          
                    var event = new SceneElementControlEvent();
                    event.controlType = SceneElementControlType.Add;
                    event.sceneElements = npc.GetSceneElements();
                    event.playerControl = false;
                    GameMain.GetInstance().DispatchEvent(event);
                    npc.PlaySound(NpcSoundType.Born);

                    this.tobeAddToSceneNpcArray.splice(index, 1);
                    this.npcControlTimer = 0;
                    this.addNpcToSceneInterval -= Time_AddNpcToSceneIntervalStep;
                    this.addNpcToSceneInterval = Math.max(this.addNpcToSceneInterval, Time_AddNpcToSceneIntervalMin);
                }
            }
        }
        else
        {
            this.tobeAddToSceneNpcArray = null;

            if(this.npcSmileSound != null)
            {
                //this.remindCreateEnemyTurns = TurnNum_CreateEnemyTurnNum;
                this.remindCreateEnemyTurns = this.GetDifficultyCreateEnemyTurnNum();
                this.curDifficultyShieldProperty = this.GetDifficultyCreateEnemyShieldProperty();
                this.curDifficultyCreateEnemyLineNum = this.GetDifficultyCreateEnemyLineNum();
                this.AddDifficulty();

                this.npcControlState = NpcControlState.PlaySinisterSmileSound;
            }
            else if(this.remindMoveUpNum > 0)
            {
                this.npcControlState = NpcControlState.MoveAllUp;
            }
            else if(this.remindInitCreateEnemyLines > 0)
            {
                this.npcControlState = NpcControlState.InitCreateEnemy
            }
            else
            {
                //this.remindCreateEnemyTurns = TurnNum_CreateEnemyTurnNum;
                this.remindCreateEnemyTurns = this.GetDifficultyCreateEnemyTurnNum();
                this.curDifficultyShieldProperty = this.GetDifficultyCreateEnemyShieldProperty();
                this.curDifficultyCreateEnemyLineNum = this.GetDifficultyCreateEnemyLineNum();
                this.AddDifficulty();

                this.npcControlState = NpcControlState.NpcControlFinish;
            }
        }
    }

    private UpdatePlaySinisterSmileSound(deltaTime:number)
    {
        if(this.npcSmileSound != null)
        {
            this.npcControlTimer = Time_PlayEnemySinisterSmileTime;    

            let event = new PlaySoundEvent(this.npcSmileSound, 1);
            GameMain.GetInstance().DispatchEvent(event);

            this.npcSmileSound = null;
        }
        else
        {
            this.npcControlTimer -= deltaTime;
            if(this.npcControlTimer <= 0)
            {
                if(this.remindMoveUpNum > 0)
                {
                    this.npcControlState = NpcControlState.MoveAllUp;
                }
                else
                {
                    this.npcControlState = NpcControlState.NpcControlFinish;
                }
            }
        }
    }

    private UpdateNpcControlFinish(delteTime:number)
    {
        this.npcControlState = NpcControlState.None;
        let event = new NpcControlFinishEvent();
        if(this.moveUpFinish)
        {
            event.moveUpFinish = true;
            this.moveUpFinish = false;
        }
        GameMain.GetInstance().DispatchEvent(event);
    }

    private UpdateMoveAllUp(deltaTime:number)
    {
        //这个状态，只负责通知并等待scene将场景上移
        if(this.remindMoveUpNum > 0)
        {
            this.remindMoveUpNum--;

            if(this.remindMoveUpNum <= 0)
                this.moveUpFinish = true;

            let event = new NpcControlFinishEvent();
            event.specialEliminateMethod = new EliminateMethod();
            event.specialEliminateMethod.methodType = EliminateMethodType.MoveUp;
            event.specialEliminateMethod.moveUpValue = 1;
            GameMain.GetInstance().DispatchEvent(event);
        }
        else
        {
            this.npcControlState = NpcControlState.NpcControlFinish;
        }
    }

    private UpdateInitCreateEnemy(deltaTime:number)
    {
        if(this.remindInitCreateEnemyLines > 0)
        {
            this.npcControlTimer += deltaTime;
            if(this.npcControlTimer >= this.addNpcToSceneInterval)
            {
                this.npcControlState = NpcControlState.None;

                var createNum:number = Scene.Columns - 0;
                this.CreateRandomVirus(createNum, 0, 0, Scene.Rows - Procedure_InitCreateEnemyLine);
                
                this.remindInitCreateEnemyLines--;
                if(this.remindInitCreateEnemyLines <= 0)
                {
                    this.npcSmileSound = "EnemySinisterSmile1_mp3"; 
                }
              
                //时间控制
                this.npcControlTimer = 0;
                this.addNpcToSceneInterval -= Time_AddNpcToSceneIntervalStep;
                this.addNpcToSceneInterval = Math.max(this.addNpcToSceneInterval, Time_AddNpcToSceneIntervalMin);
            }
        }
        else
        {
            this.npcControlState = NpcControlState.NpcControlFinish;
        }
    }

    private PrepareNpcSkillInfo(querySceneInstances:SceneElementBase[])
    {
        var skillCaster = this.curNpcSkillInfo.skillCaster;
        var skillTargetArray:SceneElementBase[] = [];

        if(skillCaster.SkillType() == NpcSkillType.AddShieldForVirus)
        { 
            var unShieldVirus:SceneElementBase[] = [];
            for(var i = 0; i < querySceneInstances.length; ++i)
            {
                var element = querySceneInstances[i];
                if(!element.HasShield())
                {
                    unShieldVirus.push(element);
                }
            }

            var skillTargetNum = Math.min(unShieldVirus.length, TurnNum_BossSkillTargetNum);
            while(skillTargetNum > 0)
            {
                skillTargetNum--;
                let id = Math.floor(Math.random() * unShieldVirus.length);
                let sceneElement = unShieldVirus.splice(id, 1)[0];
                skillTargetArray.push(sceneElement);
            }
        }
        else
        {
            var skillTargetNum = Math.min(querySceneInstances.length, TurnNum_BossSkillTargetNum);
            while(skillTargetNum > 0)
            {
                skillTargetNum--;
                let id = Math.floor(Math.random() * querySceneInstances.length);
                let sceneElement = querySceneInstances.splice(id, 1)[0];
                skillTargetArray.push(sceneElement);
            }
        }

        if(skillTargetArray.length > 0)
        {
            //找到了一些元素来施放技能
            if(skillCaster.SkillType() == NpcSkillType.AddShieldForVirus)
            {
                this.curNpcSkillInfo.addHealthElement = skillTargetArray;
            }
            else if(skillCaster.SkillType() == NpcSkillType.ChangePillToVirus)
            {
                this.creatorWorkParam.paramIndex = NpcElementCreateType.RandomVirus;
                this.creatorWorkParam.createNum = skillTargetArray.length;
                var transToElementArray:GameplayElementBase[] = undefined;
                if(this.creatorWorkParam.createNum > 1)
                {
                    transToElementArray = this.npcElementCreator.CreateElement(this.creatorWorkParam);
                }
                else
                {
                    transToElementArray = [];
                    transToElementArray.push(this.npcElementCreator.CreateElement(this.creatorWorkParam));
                }

                this.curNpcSkillInfo.elementTransList = [];
                for(var i = 0; i < skillTargetArray.length; ++i)
                {
                    let transInfo = new ElementTransInfo();
                    transInfo.fromElement = skillTargetArray[i];

                    var newSceneElementArray = transToElementArray[i].GetSceneElements();
                    if(newSceneElementArray.length != 1)
                    {
                        console.error("Trans To Element Error");
                    }

                    transInfo.toElement = newSceneElementArray[0];
                    this.curNpcSkillInfo.elementTransList.push(transInfo);
                }
            }
            else if(skillCaster.SkillType() == NpcSkillType.ChangeVirusColor)
            {
                this.curNpcSkillInfo.elementChangeColorList = [];
                for(var i = 0; i < skillTargetArray.length; ++i)
                {
                    let changeColorInfo = new ElementChangeColorInfo();
                    changeColorInfo.element = skillTargetArray[i];
                    changeColorInfo.targetColor = GameElementColorGenerator.RandomColor(skillTargetArray[i].color); 
                    this.curNpcSkillInfo.elementChangeColorList.push(changeColorInfo);
                }
            }
        }
        else
        {
            this.curNpcSkillInfo = null;
        }

        this.npcControlState = NpcControlState.NpcSkill;

        let controlFinishEvent = new NpcControlFinishEvent();
        controlFinishEvent.specialEliminateMethod = null;
        controlFinishEvent.bossSkillInfo = this.curNpcSkillInfo;
        GameMain.GetInstance().DispatchEvent(controlFinishEvent);
    }

    private ArrangePosForNewNpcElements(querySceneBlocks:number[][])
    {
        let obstruction:number[] = [];
        for(var i = 0; i < this.tobeAddToSceneNpcArray.length; ++i)
        {
            let npc:NpcElement = this.tobeAddToSceneNpcArray[i];
            let subObstruction = this.ArrangePos(npc, querySceneBlocks);
            if(subObstruction != null)
            {
                obstruction = obstruction.concat(subObstruction);
            }
        }

        this.npcControlTimer = 0;
        this.addNpcToSceneInterval = Time_AddNpcToSceneIntervalMax;

        if(obstruction.length > 0)
        {
            this.npcControlState = NpcControlState.DestroyObstruction;

            let event = new NpcControlFinishEvent();
            event.specialEliminateMethod = new EliminateMethod();
            event.specialEliminateMethod.methodType = EliminateMethodType.SpecificRegion;
            event.specialEliminateMethod.specificRegion = obstruction;
            event.specialEliminateMethod.eliminateElementType = EliminateElementType.Normal;
            event.specialEliminateMethod.froceKill = true;
            GameMain.GetInstance().DispatchEvent(event);
        }
        else
        {
            this.npcControlState = NpcControlState.AddNpcToScene;
        }
    }

    private ArrangePos(npc:NpcElement, querySceneBlocks:number[][]):number[]
    {
		if(querySceneBlocks == undefined || querySceneBlocks == null)
		{
			console.error("Query Scene Blocks Failed");
			return null;
		}

        let result = null;
        if(npc.bornType == NpcBornType.Normal)
        {
            this.ArrangePosForNormalNpc(npc, querySceneBlocks);
        }
        else if(npc.bornType == NpcBornType.DestroyObstruction)
        {
            result = this.ArrangePosForDestroyObstructionNpc(npc, querySceneBlocks);
        }
        return result;
    }

    private ArrangePosForNormalNpc(npc:NpcElement, querySceneBlocks:number[][])
    {
        if(querySceneBlocks == undefined || querySceneBlocks.length <= 0)
		{
			console.error("Not Enough Space For Normal Born Type Npcs");
			return;
		}

        let randomIndex = Math.floor(Math.random() * querySceneBlocks.length);
        let pos:number[] = querySceneBlocks.splice(randomIndex, 1)[0];
        npc.MoveTo(pos[0], pos[1]);
    }

    private ArrangePosForDestroyObstructionNpc(npc:NpcElement, querySceneBlocks:number[][]):number[]
    {
        if(querySceneBlocks == undefined || querySceneBlocks == null)
		{
			console.error("Can't Get Placeholder Array In Scene?");
			return null;
		}

        let result:number[] = null;
        let validPos:number[][] = this.GetValidPosForDestroyNpc(npc, querySceneBlocks);
        if(validPos.length > 0)
        {
            let randomIndex = Math.floor(Math.random() * validPos.length);
            let pos:number[] = validPos.splice(randomIndex, 1)[0];
            npc.MoveTo(pos[0], pos[1]);

            result = Tools.GetRegionPosList(pos[0], pos[1], pos[0] + npc.blockWidth - 1, pos[1] + npc.blockHeight - 1);
        }
        else
        {
            console.error("Not Enough Space For Destroy Obstruction Born Type NPC");
        }
        return result;
    }

    private GetValidPosForDestroyNpc(npc:NpcElement, querySceneBlocks:number[][]):number[][]
    {
        let validPos:number[][] = [];
        for (var i = 0; i < Scene.Columns; ++i) 
        {
            validPos.push([]);
            for (var j = 0; j < Scene.Rows; ++j) 
            {
                let valid:boolean = (i <= Scene.Columns - npc.blockWidth) && 
                    (j <= Scene.Rows - npc.blockHeight) && j >= 2;
                validPos[i].push(valid ? 1 : 0);
            }
        }

        //根据现有的placeholder的位置，把不能生成的位置都排除掉
        for(var i = 0; i < querySceneBlocks.length; ++i)
        {
            let pos:number[] = querySceneBlocks[i];
            let invalidStartX = pos[0] - npc.blockWidth + 1;
            invalidStartX = Math.max(0, invalidStartX);
            let invalidStartY = pos[1] - npc.blockHeight + 1;
            invalidStartY = Math.max(0, invalidStartY);

            for(var ix = invalidStartX; ix <= pos[0]; ++ix)
            {
                for(var iy = invalidStartY; iy <= pos[1]; ++iy)
                {
                    validPos[ix][iy] = 0;
                }
            }
        }

        let result:number[][] = [];
        for (var i = 0; i < (Scene.Columns - npc.blockWidth); ++i) 
        {
            for (var j = 0; j < (Scene.Rows - npc.blockHeight); ++j) 
            {
                if(validPos[i][j] == 1)
                {
                    let block:number[] = [];
                    block.push(i);
                    block.push(j);
                    result.push(block);
                }
            }
        }

        return result;
    }

    private OnAddElementToSceneFailed(event:SceneElementControlFailedEvent)
    {
        if(!event.playerControl)
        {
            console.error("NpcControl Add Element To Scene Failed");
        }
    }

    private OnStartNewTurn()
    {
        // //将已经死掉的npc从维护列表中移除
        // this.RemoveDeadNpcFromArray(this.aliveNpcArray);

        // //将已经死掉的npc从技能列表中移除
        // this.RemoveDeadNpcFromArray(this.skillNpcArray);

        //小怪降临时间维护
        if(this.remindCreateEnemyTurns >= 0)
            this.remindCreateEnemyTurns--;
    }

    // private RemoveDeadNpcFromArray(array:NpcElement[])
    // {
    //     var tobeDelete:number[] = [];
    //     for(var i = 0; i < array.length; ++i)
    //     {
    //         var npc:NpcElement = array[i];
    //         if(!npc.IsAlive())
    //         {
    //             tobeDelete.push(i);
    //         }
    //     }

    //     for(var i = 0; i < tobeDelete.length; ++i)
    //     {
    //         array.splice(tobeDelete[i], 1);
    //     }
    // }

    public OnGameOver()
    {
        this.remindMoveUpNum = 0;
        this.npcControlState = NpcControlState.None;
        this.tobeAddToSceneNpcArray = null;
    }

    private AddDifficulty()
    {
        if(this.curDifficultyId < Difficulty_MaxDifficulty-1)
        {
            this.curDifficultyId++;
        }
    }

    private GetDifficultyCreateEnemyTurnNum():number
    {
        return Difficulty_CreateEnemyTurnNum[this.curDifficultyId];
    }

    private GetDifficultyCreateEnemyLineNum():number
    {
        return Difficulty_CreateEnmeyLineNum[this.curDifficultyId];
    }

    private GetDifficultyCreateEnemyShieldProperty():number
    {
        return Difficulty_ShieldProperty[this.curDifficultyId];
    }
}

enum NpcControlState
{
    None,
    InitCreateEnemy, //初始化生成一定排数的小怪
    DestroyObstruction,
    AddNpcToScene,
    PlaySinisterSmileSound,
    NpcSkill,
    MoveAllUp, //将整个场景中的东西上移，给新的一排小怪腾出空间
    NpcControlFinish,
}