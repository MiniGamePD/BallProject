interface ISoundModule extends IModule 
{
	/**
	 * 播放声音
	 */
	PlaySound(key: string, loops: number):egret.SoundChannel;

	SoundHitBoxResReady():boolean;
}