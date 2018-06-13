interface IProgramAnimation
{
	/**
	 * 初始化
	 */
	Init(resModule: IResModule, param: ProgramAnimationParamBase): boolean;

	/**
	 * 更新
	 */
	Update(deltaTime: number): void;

	/**
	 * 析构
	 */
	Release(): void;

	/**
	 * 是否完成
	 */
	IsFinish(): boolean;
}