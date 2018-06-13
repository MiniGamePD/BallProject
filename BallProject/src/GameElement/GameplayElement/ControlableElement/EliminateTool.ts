//消除道具类元素的积累（维生素-炸弹、十字消）
abstract class EliminateTool extends ControlableElement
{
    protected eliminateType:EliminateType;
}

enum EliminateType
{
    Range,
    Row,
    Cloumn,
    Cross,
}