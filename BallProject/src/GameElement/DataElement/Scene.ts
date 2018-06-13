//MVC中的M
class Scene extends GameModuleComponentBase 
{
    public static readonly Columns: number = 10;
    public static readonly Rows: number = 14;
    public static readonly EliminateMinCount = 4; //触发消除的最小数量
    public sceneData: SceneElementBase[][] = []; //左上角是00    
    public eliminateInfo: EliminateInfo;
    public eliminateRound: number = EliminateRoundStartIndex; // 连续消除次数（从1开始）	
    public bossSkillInfo: BossSkillInfo;

    private controlSuccessEvent: SceneElementControlSuccessEvent;
    private controlFailedEvent: SceneElementControlFailedEvent;
    private elementMoveUpEvent: SceneElementMoveUpEvent;
    private eliminateEvent: EliminateEvent;

    private eliminateMethod: EliminateMethod;
    private eliminateUnMove: boolean;
    private canEliminateElementList: SceneElementBase[];    
    private isInFeverTime = false;

    public Init(): void 
    {
        this.isInFeverTime = false;
        this.eliminateInfo = new EliminateInfo();
        this.eliminateRound = EliminateRoundStartIndex;
        this.bossSkillInfo = new BossSkillInfo();
        for (var i = 0; i < Scene.Columns; ++i) 
        {
            this.sceneData.push([]);
            for (var j = 0; j < Scene.Rows; ++j) 
            {
                this.sceneData[i].push(null);
            }
        }

        this.eliminateMethod = new EliminateMethod();
        this.eliminateMethod.Reset();

        this.eliminateUnMove = false;

        this.canEliminateElementList = [];

        this.controlSuccessEvent = new SceneElementControlSuccessEvent();
        this.controlFailedEvent = new SceneElementControlFailedEvent();
        this.elementMoveUpEvent = new SceneElementMoveUpEvent();
        this.eliminateEvent = new EliminateEvent();

        GameMain.GetInstance().AddEventListener(SceneElementControlEvent.EventName, this.ProcessControlCmd, this);
        GameMain.GetInstance().AddEventListener(SpecialEliminateRequestEvent.EventName, this.ProcessSpecialEliminateRequest, this);
        GameMain.GetInstance().AddEventListener(SceneElementAccessEvent.EventName, this.OnAccessSceneElements, this);
        GameMain.GetInstance().AddEventListener(SuperVirusEliminateEvent.EventName, this.OnSuperVirusEliminateEvent, this);
        GameMain.GetInstance().AddEventListener(FeverEvent.EventName, this.OnFeverEvent, this);
    }

    public Release() 
    {
        GameMain.GetInstance().RemoveEventListener(SceneElementControlEvent.EventName, this.ProcessControlCmd, this);
        GameMain.GetInstance().RemoveEventListener(SpecialEliminateRequestEvent.EventName, this.ProcessSpecialEliminateRequest, this);
        GameMain.GetInstance().RemoveEventListener(SceneElementAccessEvent.EventName, this.OnAccessSceneElements, this);
        GameMain.GetInstance().RemoveEventListener(SuperVirusEliminateEvent.EventName, this.OnSuperVirusEliminateEvent, this);
        GameMain.GetInstance().RemoveEventListener(FeverEvent.EventName, this.OnFeverEvent, this);
    }

    private ProcessControlCmd(event: SceneElementControlEvent) 
    {
        let operationSuccess: boolean = true;

        var elementList = event.sceneElements;
        switch (event.controlType) 
        {
            case SceneElementControlType.Add:
                {
                    operationSuccess = this.AddElementGroup(elementList);
                    break;
                }
            case SceneElementControlType.Move:
                {
                    this.AddGroupCanEliminateElementList(elementList);
                    operationSuccess = this.GetElementGroupMoveSpace(elementList, event.moveDir) >= event.moveStep;
                    if (operationSuccess)
                        this.MoveElementGroup(elementList, event.moveDir, event.moveStep);
                    else if (event.moveDir == Direction.Down)
                    {
                        var pos = new egret.Point(0, 0);
                        var count = 0;
                        for (count = 0; count < elementList.length; ++count)
                        {
                            pos.x += Tools.ElementPosToGameStagePosX(elementList[count].posx);
                            pos.y += Tools.ElementPosToGameStagePosY(elementList[count].posy);
                        }
                        pos.x /= count;
                        pos.y /= count;
                        Tools.PlayPillLandEffect(pos);
                    }
                    break;
                }
            case SceneElementControlType.Rotation:
                {
                    this.AddGroupCanEliminateElementList(elementList);
                    // operationSuccess = this.IsCanRotateAcwTarget(elementList, event.rotateTargetPosList);
                    // if (operationSuccess)
                    //     this.RotateAcwTarget(elementList, event.rotateTargetPosList);
                    operationSuccess = this.RotatePill(elementList);
                    break;
                }
            default:
                operationSuccess = false;
                break;
        }

        if (operationSuccess) 
        {
            this.controlSuccessEvent = new SceneElementControlSuccessEvent();
            this.controlSuccessEvent.controlType = event.controlType;
            this.controlSuccessEvent.moveDir = event.moveDir;
            this.controlSuccessEvent.moveStep = event.moveStep;
            this.controlSuccessEvent.playerControl = event.playerControl;
            GameMain.GetInstance().DispatchEvent(this.controlSuccessEvent);
        }
        else 
        {
            this.controlFailedEvent = new SceneElementControlFailedEvent();
            this.controlFailedEvent.controlType = event.controlType;
            this.controlFailedEvent.moveDir = event.moveDir;
            this.controlFailedEvent.moveStep = event.moveStep;
            this.controlFailedEvent.playerControl = event.playerControl;
            GameMain.GetInstance().DispatchEvent(this.controlFailedEvent);
        }
    }

    // 判读一个元素是否在可消除列表
    private InCanEliminateElementList(element: SceneElementBase): boolean
    {
        var result = false;
        if (this.canEliminateElementList != null)
        {
            for (var i = 0; i < this.canEliminateElementList.length; ++i)
            {
                if (this.canEliminateElementList[i] == element)
                {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    // 把一个元素加到可消除列表
    public AddCanEliminateElementList(element: SceneElementBase)
    {
        if (element != null
            && !Tools.IsInList<SceneElementBase>(element, this.canEliminateElementList))
        {
            this.canEliminateElementList.push(element);
        }
    }

    // 把一组元素加到可消除列表
    public AddGroupCanEliminateElementList(elements: SceneElementBase[])
    {
        for (var i = 0; i < elements.length; ++i)
        {
            this.AddCanEliminateElementList(elements[i]);
        }
    }

    //把Element移动到newPos，并把老位置制成null
    private MoveElement(element: SceneElementBase, newPosx: number, newPosy: number): boolean
    {
        var result = false;
        if (this.IsPosLegal(newPosx, newPosy)
            && this.sceneData[newPosx][newPosy] == null)
        {

            // 清空现在的位置
            if (this.IsPosLegal(element.posx, element.posy)
                && this.sceneData[element.posx][element.posy] == element)
            {
                this.sceneData[element.posx][element.posy] = null;
            }

            // 移动到目标位置            
            this.sceneData[newPosx][newPosy] = element;
            element.MoveTo(newPosx, newPosy);
            result = true;
        }
        return result;
    }

    public Update(deltaTime:number)
    {
        this.UpdateElement(deltaTime);
        super.Update(deltaTime);
    }

    public UpdateInternal(deltaTime: number)
    {
        if (this.bossSkillInfo != null
            && this.bossSkillInfo.hasInfo)
        {
            // 等待Boss的技能表现，表现完了之后，再进行消除流程
        }
        else
        {
            this.CheckEliminating();
        }
    }

    private UpdateElement(deltaTime: number)
    {
        for (var iColumn = 0; iColumn < this.sceneData.length; ++iColumn)
        {
            var cloumnList = this.sceneData[iColumn];
            for (var iRow = 0; iRow < cloumnList.length; ++iRow)
            {
                var element = cloumnList[iRow];
                if (element != null)
                {
                    if (element.IsInFeverState() != this.isInFeverTime)
                    {
                        element.SetFeverState(this.isInFeverTime);
                    }
                    element.Update(deltaTime);
                }
            }
        }
    }

    private OnFeverEvent(event: FeverEvent)
    {
       this.isInFeverTime = event.feverBegin;
    }

    // 设置下一次消除方法
    public SetEliminateMethodNext(eliminateMethod: EliminateMethod)
    {
        this.eliminateMethod.methodType = eliminateMethod.methodType;
        if (eliminateMethod.froceKill != undefined)
        {
            this.eliminateMethod.froceKill = eliminateMethod.froceKill;
        }
        else
        {
            this.eliminateMethod.froceKill = false;
        }

        if (eliminateMethod.eliminateElementType != null)
            this.eliminateMethod.eliminateElementType = eliminateMethod.eliminateElementType;

        var hasSetParam = false;

        switch (eliminateMethod.methodType)
        {
            case EliminateMethodType.SpecificColor:
                {
                    if (eliminateMethod.specificColor != null && eliminateMethod.specificColor != undefined)
                    {
                        this.eliminateMethod.specificColor = eliminateMethod.specificColor;
                        hasSetParam = true;
                    }
                    break;
                }
            case EliminateMethodType.SpecificRegion:
                {
                    if (eliminateMethod.specificRegion != null && eliminateMethod.specificRegion != undefined)
                    {
                        this.eliminateMethod.specificRegion = eliminateMethod.specificRegion;
                        hasSetParam = true;
                    }
                    break;
                }
            case EliminateMethodType.SpecificRegionAndColor:
                {
                    if (eliminateMethod.specificColor != null && eliminateMethod.specificColor != undefined
                        && eliminateMethod.specificRegion != null && eliminateMethod.specificRegion != undefined)
                    {
                        this.eliminateMethod.specificColor = eliminateMethod.specificColor;
                        this.eliminateMethod.specificRegion = eliminateMethod.specificRegion;
                        hasSetParam = true;
                    }
                    break;
                }
            case EliminateMethodType.MoveUp:
                {
                    this.eliminateMethod.moveUpValue = eliminateMethod.moveUpValue;
                    hasSetParam = true;
                    break;
                }
        }

        if (DEBUG)
        {
            console.assert(hasSetParam, "Scene SetEliminateMethodNext() param error!");
        }
    }

    // 设置下一次消除后，不进行下落
    public SetNextEliminateUnMove()
    {
        this.eliminateUnMove = true;
    }

    //#####消除相关######
    public TryEliminate(): boolean
    {
        this.ClearEliminateInfo();
        this.eliminateInfo.methodType = this.eliminateMethod.methodType;
        this.eliminateInfo.isInFeverTime = this.isInFeverTime;
        if (this.eliminateMethod.methodType == EliminateMethodType.MoveUp)
        {
            this.eliminateInfo.EliminateRound = EliminateRoundInMoveUp;
            this.CalculateMoveUpElement();
            this.eliminateRound = EliminateRoundStartIndex;
        }
        else
        {
            this.eliminateInfo.EliminateRound = this.eliminateRound;
            this.CalculateEliminateElement();
            if (!this.eliminateUnMove)
            {
                do
                {
                    var hasMove = this.MoveAfterEliminate();
                    if (hasMove)
                    {
                        this.eliminateInfo.HasInfo = true;
                    }
                } while (hasMove)
            }
            this.eliminateRound++;
        }

        var result = this.eliminateInfo.HasInfo;
        return result;
    }

    private FinishEliminate()
    {
        this.eliminateRound = EliminateRoundStartIndex;
        this.eliminateUnMove = false;
        this.canEliminateElementList = [];
        let newEvent = new SceneEliminateFinishEvent();
        GameMain.GetInstance().DispatchEvent(newEvent);
    }

    public CheckEliminating()
    {
        if (this.isWorking && !this.eliminateInfo.HasInfo)
        {
            var result = this.TryEliminate();
            this.eliminateMethod.Reset();
            if (!result)
            {
                this.FinishEliminate();
            }
            else
            {
                this.DispatchEliminateEvent();
            }
        }
    }

    private DispatchEliminateEvent()
    {
        if (this.eliminateInfo != null
            && this.eliminateInfo.HasInfo)
        {
            this.eliminateEvent.eliminateInfo = this.eliminateInfo;
            GameMain.GetInstance().DispatchEvent(this.eliminateEvent);
        }
    }

    // 重置eliminateInfo
    public ClearEliminateInfo()
    {
        if (this.eliminateInfo.HasInfo)
        {
            this.eliminateInfo.Reset();
        }
    }

    // 判断某个元素是否在消除列表里面
    private IsElementInEliminateList(element: SceneElementBase): boolean
    {
        var inList = false;
        for (var count = 0; count < this.eliminateInfo.EliminatedElements.length; ++count)
        {
            if (element == this.eliminateInfo.EliminatedElements[count])
            {
                inList = true;
                break;
            }
        }
        return inList;
    }

    // 整体往上移动元素
    private CalculateMoveUpElement()
    { 
        var canMoveUp = this.CanSceneMoveUp(this.eliminateMethod.moveUpValue);

        if (canMoveUp)
        {
            for (var row = 0; row < Scene.Rows; ++row)
            {
                for (var column = 0; column < Scene.Columns; ++column)
                {
                    var element = this.GetElement(column, row);
                    if (element != null)
                    {
                        var moveInfo: EliminateMoveInfo = new EliminateMoveInfo(element , element.posx, element.posy, element.posx, element.posy - this.eliminateMethod.moveUpValue);
                        this.MoveElement(element, element.posx, element.posy - this.eliminateMethod.moveUpValue);
                        this.eliminateInfo.MoveElements.push(moveInfo);
                        this.eliminateInfo.HasInfo = true;
                    }   
                }
            }
            this.elementMoveUpEvent.isMoveSuccess = true;
            this.elementMoveUpEvent.moveUpValue = this.eliminateMethod.moveUpValue;
        }
        else
        {
            this.elementMoveUpEvent.isMoveSuccess = false;
            this.elementMoveUpEvent.moveUpValue = this.eliminateMethod.moveUpValue;
        }
        GameMain.GetInstance().DispatchEvent(this.elementMoveUpEvent);
    }

    private CanSceneMoveUp(moveUpCount: number): boolean
    {
        var canMoveUp = true;
        for (var row = 0; row < moveUpCount; ++row)
        {
            for (var column = 0; column < Scene.Columns; ++column)
            {
                var element = this.GetElement(column, row);
                if (element != null)
                {
                    canMoveUp = false;
                    break;
                }   
            }
        }
        return canMoveUp;
    }

    // 计算消除元素，把消除的元素放到this.eliminateInfo.EliminatedElements列表
    private CalculateEliminateElement()
    {
        for (var iColumn = 0; iColumn < this.sceneData.length; ++iColumn)
        {
            var cloumnList = this.sceneData[iColumn];
            for (var iRow = 0; iRow < cloumnList.length; ++iRow)
            {
                var element = cloumnList[iRow];
                if (element != null
                    && this.NeedEliminate(element))
                {
                    this.EliminateElement(element);
                }
            }
        }

        // 把元素从Scene中移除
        if (this.eliminateInfo.HasInfo)
        {
            for (var count = 0; count < this.eliminateInfo.EliminatedElements.length; ++count)
            {
                var eliminatedElement = this.eliminateInfo.EliminatedElements[count];
                if (this.IsNeedRemoveAfterEliminate(eliminatedElement))
                {
                    this.RemoveElement(eliminatedElement);
                }
            }
        }
    }

    private EliminateElement(element: SceneElementBase)
    {
        if (element != null
            && !Tools.IsInList(element, this.eliminateInfo.CalculatedEliminateElement))
        {
            this.eliminateInfo.HasInfo = true;

            this.eliminateInfo.CalculatedEliminateElement.push(element);

            var hasShield = element.HasShield();

            element.OnEliminate();

            if (hasShield
                && !element.HasShield()
                && !Tools.IsInList(element, this.eliminateInfo.ShieldBreakElements))
            {
                this.eliminateInfo.ShieldBreakElements.push(element);
            }

            var isPlaceHolder = this.IsSpecifiedTypeElement(element, SceneElementType.PlaceHolder);

            if (!isPlaceHolder
                && (!element.IsOwnerAlive() || this.eliminateMethod.froceKill))
            {
                element.UnbindAllElement();
                this.eliminateInfo.EliminatedElements.push(element);
            }
        }
    }

    // 把元素触发消除后，是否需要从Scene中移除
    private IsNeedRemoveAfterEliminate(element: SceneElementBase)
    {
        if (element != null
            && element.ElementType() != SceneElementType.None
            && element.ElementType() != SceneElementType.PlaceHolder)
        {
            return true;
        }
        return false;
    }

    // 处理特殊消除要求
    private ProcessSpecialEliminateRequest(event: SpecialEliminateRequestEvent)
    {
        if (event != null
            && event.targetPosList != null
            && !Tools.IsInList(event.triggerElement, this.eliminateInfo.SpecialEliminatedElement))
        {
            this.eliminateInfo.SpecialEliminatedElement.push(event.triggerElement);
            
            var eliminateDelay = Eliminate_Delay_One_Step_CrossEliminater;
            if (event.triggerElement.ElementType() == SceneElementType.Boom)
            {
                 eliminateDelay = Eliminate_Delay_One_Step_Boom;
            }

            for (var i = 1; i < event.targetPosList.length; i += 2)
            {
                var posx = event.targetPosList[i - 1];
                var posy = event.targetPosList[i];
                var element = this.GetElement(posx, posy);
                if (element != null)
                {
                    var dis = Tools.PointDistance(event.triggerElement.posx, event.triggerElement.posy, element.posx, element.posy);
                    element.eliminateDelay = dis * eliminateDelay;
                    this.EliminateElement(element);
                }
            }
        }
    }

    private mGroupElementTemp: SceneElementBase[] = [];
    //根据消除的元素列表，把上面元素往下移
    private MoveAfterEliminate(): boolean
    {
        var hasMove = false;
        for (var y = Scene.Rows - 1; y >= 0; --y)
        {
            for (var x = Scene.Columns - 1; x >= 0; --x)
            {
                var upElement = this.GetElement(x, y);
                if (upElement != null
                    && upElement.canDrop
                    && !upElement.HasShield())
                {
                    this.mGroupElementTemp = [];
                    this.mGroupElementTemp.push(upElement);
                    var bindElements = upElement.GetBindElements();
                    for (var i = 0; i < bindElements.length; ++i)
                    {
                        this.mGroupElementTemp.push(bindElements[i]);
                    }
                    var moveDownValue = this.GetElementGroupMoveSpace(this.mGroupElementTemp, Direction.Down);
                    if (moveDownValue > 0)
                    {
                        var result = this.MoveElementGroup(this.mGroupElementTemp, Direction.Down, moveDownValue);
                        hasMove = true;
                        for (var moveCount = 0; moveCount < this.mGroupElementTemp.length; ++moveCount)
                        {
                            var e = this.mGroupElementTemp[moveCount];
                            var moveInfo: EliminateMoveInfo = new EliminateMoveInfo(e, e.posx, e.posy - moveDownValue, e.posx, e.posy); // TODO：改成池子
                            this.eliminateInfo.MoveElements.push(moveInfo);
                            this.AddCanEliminateElementList(e);
                        }
                    }
                }
            }
        }
        return hasMove;
    }

    // 计算某个位置下面的空槽数量(包括这个位置本身)
    private GetNullElementCountInDown(posX: number, posY: number): number
    {
        var count = 0;
        for (var downIdx = posY; downIdx < Scene.Rows; ++downIdx)
        {
            if (this.GetElement(posX, downIdx) == null)
            {
                ++count;
            }
            else
            {
                break;
            }
        }

        return count;
    }

    // 获取某个坐标的元素
    private GetElement(posX: number, posY: number): SceneElementBase
    {
        if (this.IsPosLegal(posX, posY))
        {
            return this.sceneData[posX][posY];
        }
        return null;
    }

    // 一个坐标是否合法
    private IsPosLegal(posX: number, posY: number): boolean
    {
        if (posX >= 0 && posX < Scene.Columns
            && posY >= 0 && posY < Scene.Rows)
        {
            return true;
        }
    }

    // 把一个元素，从Data中移除
    private RemoveElement(element: SceneElementBase): boolean
    {
        if (element != null)
        {
            var posX = element.posx;
            var posY = element.posy;
            if (this.IsPosLegal(posX, posY)
                && this.sceneData[posX][posY] == element)
            {
                this.sceneData[posX][posY] = null;
                return true;
            }
        }
        return false;
    }

    // 把一个组元素，从Data中移除
    private RemoveElementGroup(elements: SceneElementBase[]): boolean
    {
        var result = true;
        for (var i = 0; i < elements.length; ++i)
        {
            result = result && this.RemoveElement(elements[i])
        }
        return result;
    }

    // 把一个组元素，根据自带坐标，加到scene中
    private AddElementGroup(elements: SceneElementBase[]): boolean
    {
        var result = true;
        for (var i = 0; i < elements.length; ++i)
        {
            result = result && this.AddElement(elements[i])
        }
        return result;
    }

    // 把一个元素，根据自带坐标，加到scene中
    private AddElement(element: SceneElementBase): boolean
    {
        if (element != null)
        {
            var posX = element.posx;
            var posY = element.posy;
            if (this.IsPosLegal(posX, posY)
                && this.sceneData[posX][posY] == null)
            {
                this.sceneData[posX][posY] = element;
                //如果元素有护盾，给他显示出来
                if(element.HasShield())
                    element.PlayShieldCreateAnim();
                return true;
            }
        }
        return false;
    }

    // 判断一个元素是否需要被消除(横竖方向满足相邻的3个相同颜色的块)
    private NeedEliminateByBorder(element: SceneElementBase): boolean
    {
        var needEliminate: boolean = false;
        var cloumnCount: number = 1;
        var rowCount: number = 1;
        var cloumnPlaceHolderCount = this.IsSpecifiedTypeElement(element, SceneElementType.PlaceHolder) ? 1 : 0;
        var rowPlaceHolderCount = this.IsSpecifiedTypeElement(element, SceneElementType.PlaceHolder) ? 1 : 0;
        var cloumnCanEliminateElementCount = this.InCanEliminateElementList(element) ? 1 : 0; // 有能被消除的元素数量
        var rowCanEliminateElementCount = this.InCanEliminateElementList(element) ? 1 : 0; // 有能被消除的元素数量
        var cloumnDownDis = 0; // 触发消除时，离当列最下面元素的距离
        var rowLeftDis = 0; // 触发消除时，离当排最左边元素的距离

        for (var up = element.posy - 1; up >= 0; --up)
        {
            var e = this.GetElement(element.posx, up);
            if (e != null
                && e.color == element.color)
            {
                ++cloumnCount;
                cloumnPlaceHolderCount += this.IsSpecifiedTypeElement(e, SceneElementType.PlaceHolder) ? 1 : 0;
                cloumnCanEliminateElementCount += this.InCanEliminateElementList(e) ? 1 : 0;
            }
            else
            {
                break;
            }
        }

        for (var down = element.posy + 1; down < Scene.Rows; ++down)
        {
            var e = this.GetElement(element.posx, down);
            if (e != null
                && e.color == element.color)
            {
                ++cloumnCount;
                ++cloumnDownDis;
                cloumnPlaceHolderCount += this.IsSpecifiedTypeElement(e, SceneElementType.PlaceHolder) ? 1 : 0;
                cloumnCanEliminateElementCount += this.InCanEliminateElementList(e) ? 1 : 0;
            }
            else
            {
                break;
            }
        }

        for (var left = element.posx - 1; left >= 0; --left)
        {
            var e = this.GetElement(left, element.posy);
            if (e != null
                && e.color == element.color)
            {
                ++rowCount;
                ++rowLeftDis;
                rowPlaceHolderCount += this.IsSpecifiedTypeElement(e, SceneElementType.PlaceHolder) ? 1 : 0;
                rowCanEliminateElementCount += this.InCanEliminateElementList(e) ? 1 : 0;
            }
            else
            {
                break;
            }
        }

        for (var right = element.posx + 1; right < Scene.Columns; ++right)
        {
            var e = this.GetElement(right, element.posy);
            if (e != null
                && e.color == element.color)
            {
                ++rowCount;
                rowPlaceHolderCount += this.IsSpecifiedTypeElement(e, SceneElementType.PlaceHolder) ? 1 : 0;
                rowCanEliminateElementCount += this.InCanEliminateElementList(e) ? 1 : 0;
            }
            else
            {
                break;
            }
        }
        if (cloumnPlaceHolderCount > 0)
        {
            cloumnCount = cloumnCount - cloumnPlaceHolderCount + 1;  //一个方向的placeholder只算一个
        }

        if (rowPlaceHolderCount > 0)
        {
            rowCount = rowCount - rowPlaceHolderCount + 1; //一个方向的placeholder只算一个
        }

        if (cloumnCount >= element.eliminateMinCount && cloumnCanEliminateElementCount > 0)  // 竖排相邻数量足够，并且竖排相邻有能被消除的元素
        {
            needEliminate = true;
            element.eliminateDelay = cloumnDownDis * Eliminate_Delay_One_Step;
        }
        else if (rowCount >= element.eliminateMinCount && rowCanEliminateElementCount > 0)// 横排相邻数量足够，并且横排相邻有能被消除的元素
        {
            needEliminate = true;
            element.eliminateDelay = rowLeftDis * Eliminate_Delay_One_Step;
        }

        return needEliminate;
    }

    // 判断一个元素是否需要被消除(按指定颜色)
    private NeedEliminateByColor(element: SceneElementBase, color: GameElementColor): boolean
    {
        if (element != null
            && element.color == color)
        {
            return true;
        }
        return false;
    }

    // 判断一个元素是否需要被消除(按指定区域)
    private NeedEliminateByRegion(element: SceneElementBase, region: number[]): boolean
    {
        if (element != null && region != null)
        {
            for (var i = 1; i < region.length; i += 2)
            {
                if (element.posx == region[i - 1]
                    && element.posy == region[i])
                {
                    return true;
                }
            }
        }
        return false;
    }

    // 判断一个element是否属于对应的消除类型
    private IsEliminateType(element: SceneElementBase, type: EliminateElementType): boolean
    {
        var result = false;
        if (element != null)
        {
            switch (type)
            {
                case EliminateElementType.Normal:
                    {
                        result = true;
                        break;
                    }
                case EliminateElementType.PillOnly:
                    {
                        result = element.ElementType() == SceneElementType.Pill
                        break;
                    }
                case EliminateElementType.VirusOnly:
                    {
                        result = element.ElementType() == SceneElementType.Virus
                        break;
                    }
                case EliminateElementType.PillAndVirus:
                    {
                        result = element.ElementType() == SceneElementType.Pill
                            || element.ElementType() == SceneElementType.Virus;
                        break;
                    }
            }
        }
        return result;
    }

    // 判断一个元素是否需要被消除
    private NeedEliminate(element: SceneElementBase): boolean
    {
        var needEliminate: boolean = false;
        if (this.IsEliminateType(element, this.eliminateMethod.eliminateElementType))
        {
            if (this.eliminateMethod.methodType == EliminateMethodType.Normal)
            {
                needEliminate = this.NeedEliminateByBorder(element);
            }
            else if (this.eliminateMethod.methodType == EliminateMethodType.SpecificColor)
            {
                needEliminate = this.NeedEliminateByColor(element, this.eliminateMethod.specificColor);
            }
            else if (this.eliminateMethod.methodType == EliminateMethodType.SpecificRegion)
            {
                needEliminate = this.NeedEliminateByRegion(element, this.eliminateMethod.specificRegion);
            }
            else if (this.eliminateMethod.methodType == EliminateMethodType.SpecificRegionAndColor)
            {
                needEliminate = this.NeedEliminateByColor(element, this.eliminateMethod.specificColor)
                    && this.NeedEliminateByRegion(element, this.eliminateMethod.specificRegion);
            }
        }
        return needEliminate;
    }
    //#####消除相关######

    public GetElementGroupMoveSpace(elements: SceneElementBase[], dir: Direction): number
    {
        var space = 0;
        var result = this.RemoveElementGroup(elements);
        if (DEBUG)
        {
            console.assert(result, "Can not calac move space while elements not in scene!");
        }

        var minSpace = -1;
        for (var i = 0; i < elements.length; ++i)
        {
            var moveSpace = this.GetElementMoveSpace(elements[i], dir);
            if (minSpace < 0
                || minSpace > moveSpace)
            {
                minSpace = moveSpace;
            }
        }

        if (minSpace >= 0)
        {
            space = minSpace;
        }

        result = this.AddElementGroup(elements);
        if (DEBUG)
        {
            console.assert(result, "Can not add elements to scene after calac move space!");
        }
        return space;
    }

    public GetElementMoveSpace(element: SceneElementBase, dir: Direction): number
    {
        var space = 0;
        if (element != null)
        {
            var posX = Tools.MoveScenePosX(element.posx, dir, 1);
            var posY = Tools.MoveScenePosY(element.posy, dir, 1);
            while (this.IsPosLegal(posX, posY)
                && this.GetElement(posX, posY) == null)
            {
                ++space;
                posX = Tools.MoveScenePosX(posX, dir, 1);
                posY = Tools.MoveScenePosY(posY, dir, 1);
            }
        }
        return space;
    }

    // 把一组元素，往某个方向移动
    public MoveElementGroup(elements: SceneElementBase[], dir: Direction, step: number): boolean
    {
        var result = this.RemoveElementGroup(elements);
        if (DEBUG)
        {
            console.assert(result, "Can not move element while elements not in scene!");
        }

        for (var i = 0; i < elements.length; ++i)
        {
            elements[i].posx = Tools.MoveScenePosX(elements[i].posx, dir, step);
            elements[i].posy = Tools.MoveScenePosY(elements[i].posy, dir, step);
            elements[i].dirty = true;
        }

        result = this.AddElementGroup(elements);
        if (DEBUG)
        {
            console.assert(result, "Can not add elements to scene move!");
        }
        return result;
    }

    private RotatePill(elements: SceneElementBase[]): boolean
    {
        var hasRotate = false;
        if (elements != null 
            && elements.length == 2
            && elements[0].ElementType() == SceneElementType.Pill
            && elements[1].ElementType() == SceneElementType.Pill)
        {
            var result = this.RemoveElementGroup(elements);
            if (DEBUG)
            {
                console.assert(result, "Can not query rotate while elements not in scene!");
            }

            if (elements[0].posx != elements[1].posx)
            {
                var leftElement;
                var rightElement;
                if (elements[0].posx <  elements[1].posx)
                {
                    leftElement = elements[0];
                    rightElement = elements[1];
                }
                else
                {
                    leftElement = elements[1];
                    rightElement = elements[0];
                }

                if (this.CanMoveTo(leftElement.posx, leftElement.posy)
                    && this.CanMoveTo(leftElement.posx, leftElement.posy - 1))  // 右边的往上移
                {
                    rightElement.posx = leftElement.posx;
                    rightElement.posy = leftElement.posy - 1;
                }
                else if (this.CanMoveTo(leftElement.posx, leftElement.posy)
                    && this.CanMoveTo(leftElement.posx, leftElement.posy + 1)) // 右边的往上移，整体下移一格
                {
                    rightElement.posx = leftElement.posx;
                    rightElement.posy = leftElement.posy;
                    leftElement.posx = leftElement.posx;
                    leftElement.posy = leftElement.posy + 1;
                }
                else // 相互调换
                {
                    var rx = rightElement.posx;
                    var ry = rightElement.posy;
                    rightElement.posx = leftElement.posx;
                    rightElement.posy = leftElement.posy;
                    leftElement.posx = rx;
                    leftElement.posy = ry;
                }
            }
            else if (elements[0].posy != elements[1].posy)
            {
                var upElement;
                var downElement;
                if (elements[0].posy <  elements[1].posy)
                {
                    upElement = elements[0];
                    downElement = elements[1];
                }
                else
                {
                    upElement = elements[1];
                    downElement = elements[0];
                }

                if (this.CanMoveTo(downElement.posx, downElement.posy)
                    && this.CanMoveTo(downElement.posx + 1, downElement.posy))  // 下边的往右移，上面的往下移
                {
                    upElement.posx = downElement.posx;
                    upElement.posy = downElement.posy;
                    downElement.posx = downElement.posx + 1;
                    downElement.posy = downElement.posy;
                }
                else if (this.CanMoveTo(downElement.posx, downElement.posy)
                    && this.CanMoveTo(downElement.posx - 1, downElement.posy)) // 下边的往右移，上面的往下移, 整体往左移动一格
                {
                    upElement.posx = downElement.posx - 1;
                    upElement.posy = downElement.posy;
                }
                else // 相互调换
                {
                    var ux = upElement.posx;
                    var uy = upElement.posy;
                    upElement.posx = downElement.posx;
                    upElement.posy = downElement.posy;
                    downElement.posx = ux;
                    downElement.posy = uy;
                }
            }

            result = this.AddElementGroup(elements);
            if (DEBUG)
            {
                console.assert(result, "Can not add elements to scene after query rotate!");
            }
            hasRotate = true;

            if(hasRotate)
            {
                //通知逻辑层
                var scenePill = <ScenePill>elements[0];
                scenePill.OnRotated();
                scenePill = <ScenePill>elements[1];
                scenePill.OnRotated();
            }
        }
        return hasRotate;
    }

    public CanMoveTo(posX:number, posY:number): boolean
    {
        return this.IsPosLegal(posX, posY) && this.GetElement(posX, posY) == null;
    }

    // 是否可以逆时针旋转目标
    public IsCanRotateAcwTarget(elements: SceneElementBase[], targetPosList: number[]): boolean
    {
        var canRotate = false;
        if (elements != null
            && targetPosList != null
            && elements.length * 2 == targetPosList.length)
        {
            var result = this.RemoveElementGroup(elements);
            if (DEBUG)
            {
                console.assert(result, "Can not query rotate while elements not in scene!");
            }

            canRotate = true;
            for (var i = 1; i < targetPosList.length; i += 2)
            {
                var posX = targetPosList[i - 1];
                var posY = targetPosList[i];
                canRotate = canRotate && this.IsPosLegal(posX, posY) && this.GetElement(posX, posY) == null
            }

            result = this.AddElementGroup(elements);
            if (DEBUG)
            {
                console.assert(result, "Can not add elements to scene after query rotate!");
            }
        }
        return canRotate;
    }

    // 是否可以逆时针旋转目标
    public RotateAcwTarget(elements: SceneElementBase[], targetPosList: number[]): boolean
    {
        var result = false;

        if (elements != null
            && targetPosList != null
            && elements.length * 2 == targetPosList.length)
        {
            result = this.RemoveElementGroup(elements);
            if (DEBUG)
            {
                console.assert(result, "Can not rotate while elements not in scene!");
            }

            var elementIndex = 0;
            for (var i = 1; i < targetPosList.length; i += 2)
            {
                elements[elementIndex].posx = targetPosList[i - 1];
                elements[elementIndex].posy = targetPosList[i];
                elements[elementIndex].dirty = true;
                ++elementIndex;
            }

            result = this.AddElementGroup(elements);
            if (DEBUG)
            {
                console.assert(result, "Can not add elements to scene after rotate!");
            }
        }
        return result;
    }

    private OnAccessSceneElements(event: SceneElementAccessEvent)
    {
        let queryAnswerArray: any = null;

        if (event.answerType == SceneElementAccessAnswerType.Pos)
        {
            queryAnswerArray = this.GetSpecifiedBlocks(event.accessType, event.startX, event.startY, event.endX, event.endY);
        }
        else if (event.answerType == SceneElementAccessAnswerType.Instance)
        {
            queryAnswerArray = this.GetSpecifiedElements(event.accessType, event.startX, event.startY, event.endX, event.endY);
        }
        else
        {
            console.error("Invalid AnswerType " + event.answerType);
            return;
        }

        if (queryAnswerArray != null)
        {
            let answerEvent = new SceneElementAccessAnswerEvent();
            answerEvent.accessType = event.accessType;
            answerEvent.answerType = event.answerType;
            answerEvent.queryAnswerArray = queryAnswerArray;
            answerEvent.accesser = event.accesser;
            GameMain.GetInstance().DispatchEvent(answerEvent);
        }
    }

    private OnSuperVirusEliminateEvent(event: SuperVirusEliminateEvent)
    {
        if (event != null
            && event.superVirus != null)
        {
            if (!Tools.IsInSuperVirusList(event.superVirus, this.eliminateInfo.EliminatedSuperVirus))
            {
                this.eliminateInfo.EliminatedSuperVirus.push(event.superVirus);
            }

            if (!event.superVirus.IsAlive())
            {
                var elements = event.superVirus.GetSceneElements()
                for (var i = 0; i < elements.length; ++i)
                {
                    elements[i].UnbindAllElement();
                }
                this.RemoveElementGroup(elements);
            }
        }
    }

    private IsSpecifiedTypeElement(element: SceneElementBase, type: SceneElementType): boolean
    {
        if (type == SceneElementType.Empty)
        {
            return element == null;
        }
        else
        {
            return element != null && element != undefined && element.ElementType() == type;
        }
    }

    private GetSpecifiedBlocks(type: SceneElementType, startX: number, startY: number, endX?: number, endY?: number): number[][]
    {
        let result: number[][] = undefined;

        if (endX == undefined)
            endX = Scene.Columns - 1;
        if (endY == undefined)
            endY = Scene.Rows - 1;

        if (startX <= endX || startY <= endY)
        {
            result = [];
            //X is Column
            for (var i = startX; i <= endX; ++i)
            {
                //Y is Row
                for (var j = startY; j <= endY; ++j)
                {
                    if (this.IsSpecifiedTypeElement(this.sceneData[i][j], type))
                    {
                        let block: number[] = [];
                        block.push(i);
                        block.push(j);
                        result.push(block);
                    }
                }
            }
        }
        else
        {
            console.error("GetSpecifiedBlocks With Invalid Range:" + startX + "," + startY + "," + endX + "," + endY);
        }

        return result;
    }

    private GetSpecifiedElements(type: SceneElementType, startX: number, startY: number, endX?: number, endY?: number): SceneElementBase[]
    {
        let result: SceneElementBase[] = undefined;

        if (endX == undefined)
            endX = Scene.Columns - 1;
        if (endY == undefined)
            endY = Scene.Rows - 1;

        if (startX <= endX || startY <= endY)
        {
            result = [];
            //X is Column
            for (var i = startX; i <= endX; ++i)
            {
                //Y is Row
                for (var j = startY; j <= endY; ++j)
                {
                    let element = this.sceneData[i][j];
                    if (this.IsSpecifiedTypeElement(element, type))
                    {
                        result.push(element);
                    }
                }
            }
        }
        else
        {
            console.error("GetSpecifiedInstances With Invalid Range:" + startX + "," + startY + "," + endX + "," + endY);
        }

        return result;
    }

    //#####Boss技能相关###### Begin
    public TriggerBossSkill(skillInfo: BossSkillInfo)
    {
        this.bossSkillInfo.hasInfo = true;
        this.bossSkillInfo.skillCaster = skillInfo.skillCaster;
        this.bossSkillInfo.addHealthElement = skillInfo.addHealthElement;
        this.AddShield(this.bossSkillInfo.addHealthElement);
        this.bossSkillInfo.elementTransList = skillInfo.elementTransList;
        this.ChangeElements(this.bossSkillInfo.elementTransList);
        this.bossSkillInfo.elementChangeColorList = skillInfo.elementChangeColorList;
        this.ChangElementsColor(this.bossSkillInfo.elementChangeColorList);
    }

    // 添加护盾
    private AddShield(elementList: SceneElementBase[])
    {
        if (elementList != null)
        {
            for (var i = 0; i < elementList.length; ++i)
            {
                elementList[i].AddShield(1);
            }
        }
    }

    // 替换场景中的元素
    private ChangeElements(elementTransList: ElementTransInfo[])
    {
        if (elementTransList != null)
        {
            for (var i = 0; i < elementTransList.length; ++i)
            {
                var transInfo = elementTransList[i];
                if (transInfo != null
                    && transInfo.fromElement != null
                    && transInfo.toElement != null)
                {
                    transInfo.toElement.posx = transInfo.fromElement.posx;
                    transInfo.toElement.posy = transInfo.fromElement.posy;
                    transInfo.toElement.dirty = true;
                    transInfo.fromElement.UnbindAllElement();
                    this.RemoveElement(transInfo.fromElement);
                    this.AddElement(transInfo.toElement);
                }
            }
        }
    }

    // 替换元素颜色
    private ChangElementsColor(elementChangeColorList: ElementChangeColorInfo[])
    {
        if (elementChangeColorList != null)
        {
            for (var i = 0; i < elementChangeColorList.length; ++i)
            {
                var changeColorElement = elementChangeColorList[i];
                if (changeColorElement != null
                    && changeColorElement.element != null)
                {
                    changeColorElement.element.color = changeColorElement.targetColor;
                    changeColorElement.element.dirty = true;
                }
            }
        }
    }
    //#####Boss技能相关###### end
}

enum SceneElementControlType
{
    Add,
    Move,
    Rotation,
}

enum Direction 
{
    Right,
    Up,
    Left,
    Down,
}

enum AnchorType
{
    Center,
    Right,
    Up,
    Left,
    Down,
}