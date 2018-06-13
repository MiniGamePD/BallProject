class PaPlayFramesAnimParam extends ProgramAnimationParamBase
{
	public readonly animType = ProgramAnimationType.PlayFramesAnim;

	public pos: egret.Point; // 位置
	public textNameSeq: string[]; // 序列帧名字
	public interval: number;  // 帧间隔
	public times: number;	// 播放次数
	public anchor: AnchorType; // 锚点
	public rotation: number; // 旋转
	public scale: egret.Point; // 缩放

	public constructor()
	{
		super();
		this.pos = null;
		this.textNameSeq = [];
		this.interval = 0;
		this.times = 0;
		this.anchor = AnchorType.Center;
		this.rotation = 0;
		this.scale = new egret.Point(1, 1);
	}
}

class PaPlayFramesAnim extends ProgramAnimationBase<PaPlayFramesAnimParam>
{
	private bitmap: egret.Bitmap;
	private textureSeq: egret.Texture[];
	private interval: number;
	private oneRoundTime: number;
	private duration: number;

	protected OnInit()
	{
		this.textureSeq = [];
		this.interval = this.param.interval;
		
		for (var i = 0; i < this.param.textNameSeq.length; ++i)
		{
			var texture =  this.resModule.GetRes(this.param.textNameSeq[i]);
			if (texture != null)
			{
				this.textureSeq.push(texture);
			}
		}

		this.oneRoundTime = this.param.interval * this.textureSeq.length;
		this.duration = this.oneRoundTime * this.param.times;

		this.bitmap = new egret.Bitmap();
		GameMain.GetInstance().GetAdaptedStageContainer().addChild(this.bitmap);
		this.bitmap.x = this.param.pos.x;
		this.bitmap.y = this.param.pos.y;
		this.bitmap.scaleX = this.param.scale.x;
		this.bitmap.scaleY = this.param.scale.y;
		GameMain.GetInstance().AdapteDisplayObjectScale(this.bitmap);
		this.RefreshTexture(this.runningTime);
		Tools.SetAnchor(this.bitmap, this.param.anchor);
		this.bitmap.rotation = this.param.rotation;
	}

	protected OnUpdate(deltaTime: number)
	{
		this.RefreshTexture(this.runningTime);
	}

	private RefreshTexture(time: number)
	{
		if (this.bitmap != undefined
			&& this.bitmap != null 
			&& this.oneRoundTime > 0)
		{
        	var curRoundTime = time % this.oneRoundTime;
			var index = Math.floor(curRoundTime / this.interval);
			if (index < this.textureSeq.length
				&& this.textureSeq[index] != null)
			{
				this.bitmap.texture = this.textureSeq[index];
			}
		}
	}

	protected OnRelease()
	{
		if (this.bitmap != null
			&& this.bitmap.parent != null
			&& this.bitmap.parent != undefined)
		{
			this.bitmap.parent.removeChild(this.bitmap);
			this.bitmap = null;
		}
		this.textureSeq = [];
	}

	public IsFinish()
	{
		return this.runningTime >= this.duration;
	}

}