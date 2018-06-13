interface IInputModule extends IModule 
{
	GetKey(key: InputKey): boolean;
	OnStartNewTurn();
}

enum InputKey{
	Left = 0,
	Right = 1,
	Up = 2,
	Down = 3,
	Rotate = 4,
	Max = 5,
}

const INPUT_MOVE_EVENT_DIS_RATE_HOR: number = 0.08; //手指左右移动没有上下移动范围大
const INPUT_MOVE_EVENT_DIS_RATE_VER: number = 0.1;