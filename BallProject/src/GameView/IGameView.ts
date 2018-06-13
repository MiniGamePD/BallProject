interface IGameView
{
	/**
	 * 初始化
	 */
	CreateView():void;

	/**
	 * 更新
	 */
	UpdateView(deltaTime: number):void;

	/**
	 * 释放
	 */
	ReleaseView():void;

	/**
	 * 获取DisplayObjectContainer
	 */
	GetDisplayObjectContainer():egret.DisplayObjectContainer;
}