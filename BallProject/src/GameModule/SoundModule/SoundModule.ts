class SoundModule extends ModuleBase implements ISoundModule
{
	private mResModule: IResModule;
	private mFadeParamArray: SoundFadeParam[];

	private mBgmChannel:egret.SoundChannel;
	private mBgmPausePosDic:{[index:number]: number};
	private mBgmSoundRes:egret.Sound;
	private mBgmLoopTimer:egret.Timer;
	private mCurBgmStage:BgmStage;

	private soundHitBoxResReady:boolean;

	public Init(): boolean 
	{
		this.isForeground = true;
		this.mFadeParamArray = [];
		this.mBgmPausePosDic = {};
		this.mResModule = <IResModule>GameMain.GetInstance().GetModule(ModuleType.RES);
		GameMain.GetInstance().AddEventListener(PlaySoundEvent.EventName, this.OnPlaySoundEvent, this);
		GameMain.GetInstance().AddEventListener(BgmControlEvent.EventName, this.OnBgmControlEvent, this);

		this.soundHitBoxResReady = false;
		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.OnResourceLoadComplete, this);

		return true;
	}

	public Update(deltaTime: number): void 
	{
		var tobeDelete:SoundFadeParam[] = null;
		for(var i = 0; i < this.mFadeParamArray.length; ++i)
		{
			var fadeParam:SoundFadeParam = this.mFadeParamArray[i];
			if(fadeParam.fadeIn)
			{
				var newVolume = fadeParam.channel.volume + fadeParam.speed * deltaTime;
				
				if(newVolume > 1)
				{
					newVolume = 1;
					if(tobeDelete == null)
					{
						tobeDelete = [];
					}
					tobeDelete.push(fadeParam);
				}

				fadeParam.channel.volume = newVolume;
			}
			else
			{
				var newVolume = fadeParam.channel.volume - fadeParam.speed * deltaTime;
				if(newVolume < 0)
				{
					newVolume = 0;
					if(tobeDelete == null)
					{
						tobeDelete = [];
					}
					tobeDelete.push(fadeParam);
				}

				fadeParam.channel.volume = newVolume;
			}
		}

		if(tobeDelete != null)
		{
			for(var i = 0; i < tobeDelete.length; ++i)
			{
				var index = this.mFadeParamArray.indexOf(tobeDelete[i])
				this.mFadeParamArray.splice(index, 1);
			}
		}
	}

	public Release(): void 
	{
		GameMain.GetInstance().RemoveEventListener(PlaySoundEvent.EventName, this.OnPlaySoundEvent, this);
		GameMain.GetInstance().RemoveEventListener(BgmControlEvent.EventName, this.OnBgmControlEvent, this);

		RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.OnResourceLoadComplete, this);
	}

	private OnResourceLoadComplete(event: RES.ResourceEvent)
	{
		if(event.groupName == "SoundHitBox")
		{
			this.soundHitBoxResReady = true;
		}
	}

	public SwitchForeOrBack(from: GameStateType, to: GameStateType): void 
	{
		this.isForeground = true;
	} 

	public PlaySound(key: string, loops: number):egret.SoundChannel 
	{
		if (this.mResModule != null)
		{
			var sound:egret.Sound = this.mResModule.GetRes(key);
			if (sound != null)
			{
				return sound.play(0, loops);
			}
		}
		return null;
	}

	private OnPlaySoundEvent(event: PlaySoundEvent)
	{
		this.PlaySound(event.Key, event.Loops);
	}

	private OnBgmControlEvent(event:BgmControlEvent)
	{
		switch(event.controlType)
		{
			case BgmControlType.Play:
			{
				this.PlayBgm(event.bgmStage, 0);
				break;
			}
			case BgmControlType.Stop:
			{
				if(this.CheckStageValidity(event.bgmStage))
					this.StopBgm();
				break;
			}
			case BgmControlType.FadeIn:
			{
				if(this.CheckStageValidity(event.bgmStage))
					this.FadeBgm(true, <number>event.controlParam);
				break;
			}	
			case BgmControlType.FadeOut:
			{
				if(this.CheckStageValidity(event.bgmStage))
					this.FadeBgm(false, <number>event.controlParam);
				break;
			}
			case BgmControlType.Pause:
			{
				if(this.CheckStageValidity(event.bgmStage))
					this.PauseBgm();
				break;
			}
			case BgmControlType.Resume:
			{
				this.ResumeBgm(event.bgmStage);
				break;
			}
			default:
				console.error("Unknow Bgm Control Type");
		}
	}

	private LoadBgm(stage:BgmStage):egret.Sound
	{
		var bgmRes:string;
		if(stage == BgmStage.Global)
		{
			bgmRes = "bgm_mp3";
		}
		else if(stage == BgmStage.Fever)
		{
			bgmRes = "fever_bgm_mp3";
		}
		else 
		{
			console.error("Unknow Bgm Stage:" + stage);
			return;
		}

		var sound:egret.Sound = this.mResModule.GetRes(bgmRes);
		sound.type = egret.Sound.MUSIC;

		return sound;
	}

	public PlayBgm(stage:BgmStage, pos:number) 
	{
		if(this.mCurBgmStage != undefined || this.mCurBgmStage != null)
		{
			if(DEBUG)
			{
				console.error("BGM is playing, stop first then play again:" + this.mCurBgmStage);
			}
			return;
		}

		this.mBgmSoundRes = this.LoadBgm(stage);
		this.mCurBgmStage = stage;

		this.PlayBgmInternal(pos);
	}

	private PlayBgmInternal(pos:number)
	{
		//每次都只播放一遍，时间到了再播放一遍，模拟loop的效果
		this.mBgmChannel = this.mBgmSoundRes.play(pos, -1);

		this.mBgmLoopTimer = new egret.Timer((this.mBgmSoundRes.length-pos)*1000, 1);
		this.mBgmLoopTimer.addEventListener(egret.TimerEvent.TIMER, this.OnBgmLoopTimer, this);
		this.mBgmLoopTimer.start();
	}

	private OnBgmLoopTimer(event:egret.TimerEvent)
	{
		if(this.mCurBgmStage == undefined || this.mCurBgmStage == null)
		{
			if(DEBUG)
			{
				console.error("No BGM when BgmLoopTimer trigger");
			}
			return;
		}

		this.mBgmChannel.stop();
		this.PlayBgmInternal(0);
	}

	private StopBgm()
	{
		if(this.mCurBgmStage == undefined || this.mCurBgmStage == null)
		{
			if(DEBUG)
			{
				console.error("No BGM is playing:Stop");
			}
			return;
		}

		this.mBgmChannel.stop();
		this.mBgmLoopTimer.stop();
		this.mBgmChannel = null;
		var stageId = <number>this.mCurBgmStage;
		this.mBgmPausePosDic[stageId] = null;
		this.mCurBgmStage = null;
		this.mBgmSoundRes = null;
		this.mBgmLoopTimer = null;
	}

	public FadeBgm(fadeIn:boolean, fadeSpeed:number)
	{
		if(this.mCurBgmStage == undefined || this.mCurBgmStage == null)
		{
			if(DEBUG)
			{
				console.error("No BGM is playing:Fade");
			}
			return;
		}

		var fadeParam:SoundFadeParam = new SoundFadeParam();
		fadeParam.channel = this.mBgmChannel;
		fadeParam.fadeIn = fadeIn;
		fadeParam.speed = fadeSpeed;

		this.mFadeParamArray.push(fadeParam);
	}

	private PauseBgm()
	{
		if(this.mCurBgmStage == undefined || this.mCurBgmStage == null)
		{
			if(DEBUG)
			{
				console.error("No BGM is playing:Pause");
			}
			return;
		}

		var pos = this.mBgmChannel.position;
		var stageId = <number>this.mCurBgmStage;
		this.StopBgm();
		this.mBgmPausePosDic[stageId] = pos;
	}

	private ResumeBgm(stage:BgmStage)
	{
		if(this.mCurBgmStage != undefined || this.mCurBgmStage != null)
		{
			if(DEBUG)
			{
				console.error("Can not play multi bgm:Resume");
			}
			return;
		}

		var stageId = <number>stage;
		this.PlayBgm(stage, this.mBgmPausePosDic[stageId]);
		this.mBgmPausePosDic[stageId] = null;
	}

	private CheckStageValidity(stage:BgmStage):boolean
	{
		return stage == this.mCurBgmStage;
	}

	public SoundHitBoxResReady():boolean
	{
		return this.soundHitBoxResReady;
	}
}

class SoundFadeParam
{
	public channel:egret.SoundChannel;
	public fadeIn:boolean;
	public speed:number;
}

enum BgmStage
{
    Global,
    Fever,
}
