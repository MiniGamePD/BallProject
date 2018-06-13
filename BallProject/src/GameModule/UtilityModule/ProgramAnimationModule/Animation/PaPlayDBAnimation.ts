class PaPlayDBAnimationParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.PlayDBAnimation;

	public resName: string; // 粒子贴图名字
	public animationName: string; //动画名字
	public duration: number; 	// 总时长
	public playTimes: number; //playTimes - 循环播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
	public posX: number; 		// 坐标X
	public posY: number; 		// 坐标Y
	public scaleX: number;    // 缩放
	public scaleY: number;    // 缩放

	public constructor()
	{
		super();
		this.resName = "";
		this.animationName = "";
		this.duration = 0;
		this.playTimes = -1;
		this.posX = 0;
		this.posY = 0;
		this.scaleX = 1;
		this.scaleY = 1;
	}
}

class PaPlayDBAnimation extends ProgramAnimationBase<PaPlayDBAnimationParam>
{

	// 派生类的初始化处理
	protected OnInit(){}

	// 派生类的更新处理
	protected OnUpdate(deltaTime: number){}

	// 派生类的析构处理
	protected OnRelease(){}

	// 派生类返回是否完成
	public IsFinish(){ return true;}

	// private armatureDisplay: dragonBones.EgretArmatureDisplay;
	// private animationState: dragonBones.AnimationState;
	// protected OnInit()
	// {
	// 	let egretFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
	// 	this.armatureDisplay = egretFactory.buildArmatureDisplay(this.param.animationName);
	// 	if (this.armatureDisplay != null)
	// 	{
	// 		GameMain.GetInstance().GetAdaptedStageContainer().addChild(this.armatureDisplay);
	// 		this.armatureDisplay.x = this.param.posX;
	// 		this.armatureDisplay.y = this.param.posY;
	// 		this.armatureDisplay.scaleX = this.param.scaleX; 
	// 		this.armatureDisplay.scaleY = this.param.scaleY; 
	// 		GameMain.GetInstance().AdapteDisplayObjectScale(this.armatureDisplay);
	// 		this.animationState = this.armatureDisplay.animation.play(this.param.animationName, 1);
	// 	}
	// }

	// protected OnUpdate(deltaTime: number)
	// {

	// }

	// protected OnRelease()
	// {
	// 	if (this.armatureDisplay != null
	// 	&& this.armatureDisplay.parent != null
	// 	&& this.armatureDisplay.parent != undefined)
	// 	{
	// 		this.armatureDisplay.parent.removeChild(this.armatureDisplay);
	// 		this.armatureDisplay = null;
	// 	}
	// 	this.animationState = null;
	// }

	// public IsFinish()
	// {
	// 	if (this.param.playTimes > 0
	// 	&& this.animationState != undefined
	// 	&& this.animationState != null)
	// 	{
	// 		return !this.animationState.isPlaying;
	// 	}
	// 	else
	// 	{
	// 		return this.runningTime >= this.param.duration;
	// 	}
	// }

}