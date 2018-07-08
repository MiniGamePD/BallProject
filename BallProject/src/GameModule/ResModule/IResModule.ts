interface IResModule extends IModule
{
	/**
	 * 开始加载资源
	 */
	StartLoadResource(): void;

	/**
	 * 获取资源
	 */
	GetRes(key: string): any;

	/**
     * 根据name关键字创建一个Bitmap对象。
     */
	CreateBitmapByName(key: string): egret.Bitmap;

	/**
     * 根据name关键字创建一个Bitmap对象。
     */
	CreateBitmap(key: string, posx: number, posy: number, parent?: egret.DisplayObjectContainer, anchor?: AnchorType): egret.Bitmap;

	/**
     * 根据name关键字创建一个ParticleSystem对象。
     */
	CreateParticleByKey(key: string): particle.GravityParticleSystem

	/**
     * 根据贴图名字和json配置名创建一个ParticleSystem对象。
     */
	CreateParticle(textureName: string, jsonName: string): particle.GravityParticleSystem

	/**
	 * 根据字体名字，创建BitmapText
	 */
	CreateBitmapText(font: string): egret.BitmapText;
}