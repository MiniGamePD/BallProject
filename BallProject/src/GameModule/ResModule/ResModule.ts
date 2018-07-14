class ResModule extends ModuleBase implements IResModule
{
	public Init(): boolean
	{
		this.isForeground = true;
		// this.LoadResource();
		return true;
	}

	public Update(deltaTime: number): void
	{

	}

	public Release(): void
	{

	}

	public SwitchForeOrBack(from: GameStateType, to: GameStateType): void
	{
		this.isForeground = true;
	}

	public StartLoadResource(): void
	{
		this.LoadResource();
	}

	public async LoadResource()
	{
		try
		{
			await RES.loadConfig("resource/default.res.json", "resource/");
			RES.loadGroup("preload", 1, null);
			RES.loadGroup("SoundTitle", 2, null);
			RES.loadGroup("Particle", 1, null);
			RES.loadGroup("BallConfig", 1, null);
			RES.loadGroup("Sound", 0, null);
			RES.loadGroup("SoundHitBox", 0, null);
			return true;
		}
		catch (e)
		{
			console.log(e);
			return false;
		}
	}

	public GetRes(key: string): any
	{
		return RES.getRes(key);
	}
	

	// <<DragonBones 组件>> -- 先关闭DragonBones组件
	// private readonly DragonBonesRes: string[] = ["DB_Boom_Bomb", "Pill_Boom", "Virus"]
	// public InitDragonBonesData()
	// {
	// 	for (var i = 0; i < this.DragonBonesRes.length; ++i)
	// 	{
	// 		this.LoadDragonBonesData(this.DragonBonesRes[i]);
	// 	}
	// }

	// private LoadDragonBonesData(resName: string)
	// {
	// 	var dragonbonesData = RES.getRes(resName + "_ske_json");
	// 	var textureData = RES.getRes(resName + "_tex_json");
	// 	var texture = RES.getRes(resName + "_tex_png");
	// 	if (dragonbonesData != null
	// 		&& textureData != null
	// 		&& texture != null)
	// 	{
	// 		let egretFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
	// 		egretFactory.parseDragonBonesData(dragonbonesData);
	// 		egretFactory.parseTextureAtlasData(textureData, texture);
	// 	}
	// }

	public CreateBitmapByName(key: string): egret.Bitmap
	{
		let result = new egret.Bitmap();
		let texture: egret.Texture = this.GetRes(key);
		result.texture = texture;
		return result;
	}

	public CreateBitmap(key: string, posx: number, posy: number, parent?: egret.DisplayObjectContainer, anchor?: AnchorType): egret.Bitmap
	{
		var bitmap = this.CreateBitmapByName(key);
		if (bitmap != null || bitmap != undefined)
		{
			bitmap.x = posx;
			bitmap.y = posy;
			if (anchor != undefined)
			{
				Tools.SetAnchor(bitmap, anchor);
			}
			
			if (parent != null && parent != undefined)
			{
				parent.addChild(bitmap);
			}
		}
		return bitmap;
	}

	public CreateParticleByKey(key: string): particle.GravityParticleSystem
	{
		var textureName = key + "_png";
        var jsonName = key;
        return this.CreateParticle(textureName, jsonName);
	}

	public CreateParticle(textureName: string, jsonName: string): particle.GravityParticleSystem
	{
		var texture = RES.getRes(textureName);
        var config = RES.getRes(jsonName + "_json");
		if (texture != null	&& config != null)
		{
			var particleSys = new particle.GravityParticleSystem(texture, config);
			if (particleSys != null)
			{
				particleSys.emitterX = 0;
				particleSys.emitterY = 0;
			}
			return particleSys;
		}
		else if (DEBUG)
		{
			console.assert(false, "Can not add elements to scene after query rotate!");
		}
		return null;
	}

	public CreateBitmapText(fontName: string): egret.BitmapText
	{
		var font = this.GetRes(fontName);
		var scoreText = new egret.BitmapText();
		if (font != null)
		{
			scoreText.font = font;
		}
		else if (DEBUG)
		{
			console.assert(false, "Can not get font by name : " + fontName);
		}
		return scoreText;
	}

}