abstract class ProgramAnimationParamBase
{
	public abstract animType: ProgramAnimationType;
	public callBack: Function;
	public callBackObject: any
	public delayTime: number;

	constructor()
	{
		this.callBack = null;
		this.callBackObject = null;
		this.delayTime = 0;
	}
}