class EliminateInfo {
	public constructor() {
		this.HasInfo = false;
		this.methodType = EliminateMethodType.Normal;
		this.isInFeverTime = false;
		this.EliminateRound = 1;
		this.CalculatedEliminateElement = [];
		this.EliminatedElements = [];
		this.ShieldBreakElements = [];
		this.MoveElements = [];
		this.SpecialEliminatedElement = [];
		this.EliminatedSuperVirus = [];
	}

	// 是否有消除数据
	public HasInfo: boolean;

	//消除方案
	public methodType: EliminateMethodType; 

	//是否在FeverTime期间消除
	public isInFeverTime: boolean;

	// 连续消除次数（从1开始）	
	public EliminateRound: number;

	// 计算过消除的元素
	public CalculatedEliminateElement: SceneElementBase[];

	// 要被移除的元素列表（包括炸弹和十字消，不包括Boss和PlaceHolder）
	public EliminatedElements: SceneElementBase[];

	// 护盾破碎元素列表
	public ShieldBreakElements: SceneElementBase[];

	// 特殊消除的元素（只是炸弹和十字消）
	public SpecialEliminatedElement: SceneElementBase[];

	// 消除后，需要移动的元素列表
	public MoveElements: EliminateMoveInfo[];

	// 有被消除的Boss
	public EliminatedSuperVirus: SuperVirus[];

	// 重置
	public Reset() {
		this.HasInfo = false;
		this.methodType = EliminateMethodType.Normal;
		this.isInFeverTime = false;
		this.EliminateRound = 1;
		this.CalculatedEliminateElement = [];
		this.EliminatedElements = [];
		this.ShieldBreakElements = [];
		this.MoveElements = [];
		this.SpecialEliminatedElement = [];
		this.EliminatedSuperVirus = [];
	}
}

// 消除后，需要移动的元素信息
class EliminateMoveInfo {
	public MoveElement: SceneElementBase;
	public StartPosX: number;
	public StartPosY: number;
	public EndPosX: number;
	public EndPosY: number;

	public constructor(element: SceneElementBase, startPosX: number, startPosY: number, endPosX: number, endPosY: number) {
		this.MoveElement = element;
		this.StartPosX = startPosX;
		this.StartPosY = startPosY;
		this.EndPosX = endPosX;
		this.EndPosY = endPosY
	}
}

// 消除方案
enum EliminateMethodType
{
	Normal = 0, //普通的三消方案
	SpecificColor, //特定颜色
	SpecificRegion, //特定区域
	SpecificRegionAndColor, //特定区域的特定颜色
	MoveUp,  //整体上移
}

// 要消除的元素类型
enum EliminateElementType
{
	Normal,	  		//普通的三消方案	
	PillOnly,		//只是药丸
	VirusOnly,		//只是病毒
	PillAndVirus,	//药丸和病毒
}

class EliminateMethod
{
	public methodType: EliminateMethodType; //消除方案

	public froceKill: boolean; //强制消除

	public eliminateElementType: EliminateElementType; //要消除的元素类型

	public specificColor: GameElementColor; //特定颜色

	public specificRegion: number[]; //特定区域列表
	
	public moveUpValue: number; //上移的距离

	public constructor()
	{
		this.methodType = EliminateMethodType.Normal;
		this.froceKill = false;
		this.eliminateElementType = EliminateElementType.Normal;
		this.specificColor = GameElementColor.blue;
		this.specificRegion = [];
		this.moveUpValue = 0;
	}

	public Reset()
	{
		this.methodType = EliminateMethodType.Normal;
		this.froceKill = false;
		this.eliminateElementType = EliminateElementType.Normal;
		this.moveUpValue = 0;
	}


}