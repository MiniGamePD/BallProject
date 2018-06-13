class Tools
{
	public static MatchViewBattleGroundStartXCenter: number = 0; //00号元素的中心点坐标x
	public static MatchViewBattleGroundStartYCenter: number = 0; //00号元素的中心点坐标y
	public static MatchViewElementHeight: number = 0;
	public static MatchViewElementWidth: number = 0;
	public static MatchBattleGroundPosX: number = 0;
	public static MatchBattleGroundPosY: number = 0;
	public static FeverPowerTargetPos: egret.Point = new egret.Point(160, 150); // Fever能力目标点

	public static GetMatchViewRenderPosX(posx: number): number
    {
        return Tools.MatchViewBattleGroundStartXCenter + Tools.MatchViewElementWidth * posx;
    }

	public static GetMatchViewRenderPosY(posy: number): number
    {
        return Tools.MatchViewBattleGroundStartYCenter + Tools.MatchViewElementHeight * posy;
    }

	public static ElementPosToGameStagePosX(posx: number): number
    {
        return Tools.MatchBattleGroundPosX + this.GetMatchViewRenderPosX(posx);
    }

	public static ElementPosToGameStagePosY(posy: number): number
    {
        return  Tools.MatchBattleGroundPosY + this.GetMatchViewRenderPosY(posy);
    }

	public static MoveScenePosX(posX: number, dir: Direction, step: number): number
	{
		var targetPosX = posX;
		switch (dir)
		{
			case Direction.Left:
				targetPosX -= step;
				break;
			case Direction.Right:
				targetPosX += step;
				break;
			default:
				break;
		}
		return targetPosX;
	}

	public static MoveScenePosY(posY: number, dir: Direction, step: number): number
	{
		var targetPosY = posY;
		switch (dir)
		{
			case Direction.Up:
				targetPosY -= step;
				break;
			case Direction.Down:
				targetPosY += step;
				break;
			default:
				break;
		}
		return targetPosY;
	}

	public static ZeroValue = 0.00001;
	public static IsZero(value: number)
	{
		return Math.abs(value) < Tools.ZeroValue;
	}

	public static MoveNumber(from: number, to: number, moveValue: number): number
	{
		if (Tools.IsZero(from - to))
		{
			return to;
		}
		else
		{
			var value = from;
			if (from < to)
			{
				value += moveValue;
			}
			else
			{
				value -= moveValue;
			}
			value = Tools.Clamp(value, from, to);
			return value
		}
	}

	public static Clamp(value: number, p1: number, p2: number): number
	{
		var result = value;
		if (p1 < p2)
		{
			result = value < p1 ? p1 : value;
			result = value > p2 ? p2 : value;
		}
		else if (p1 > p2)
		{
			result = value > p1 ? p1 : value;
			result = value < p2 ? p2 : value;
		}
		return result;
	}

	// 顺时针旋转
	public static RotateCW(center: number[], pos: number[]): number[]
	{
		if (center.length != 2 && pos.length != 2)
		{
			if (DEBUG)
			{
				console.assert(false, "Can not move element while elements not in scene!");
			}
		}
		var target: number[] = [];
		target.push(center[0] - (pos[1] - center[1]));
		target.push(center[1] + (pos[0] - center[0]));

		return target;
	}

	// 逆时针旋转
	public static RotateACW(center: number[], pos: number[]): number[]
	{
		if (center.length != 2 && pos.length != 2)
		{
			if (DEBUG)
			{
				console.assert(false, "Can not move element while elements not in scene!");
			}
		}
		var target: number[] = [];
		target.push(center[0] + (pos[1] - center[1]));
		target.push(center[1] - (pos[0] - center[0]));

		return target;
	}

	// 计算以某个点为中心，range为外围圈数的一个正方形的列表
	public static GetSquareRangePosList(centerX: number, centerY: number, range: number): number[]
	{
		var target: number[] = [];
		for (var x = -range; x <= range; ++x)
		{
			for (var y = -range; y<= range; ++y)
			{
				target.push(centerX + x, centerY + y);
			}
		}
		return target;
	}

	// 计算以某个点为中心炸弹爆炸范围
	public static GetBoomRangePosList(centerX: number, centerY: number): number[]
	{
		var target: number[] = [];
		target = this.GetSquareRangePosList(centerX, centerY, 1);
		target.push(centerX - 2, centerY);
		target.push(centerX + 2, centerY);
		target.push(centerX, centerY - 2);
		target.push(centerX, centerY + 2);
		return target;
	}

	// 计算以某个点为中心，range为单边扩充数量的一列坐标
	public static GetColunmPosList(centerX: number, centerY: number, range: number): number[]
	{
		var target: number[] = [];
		for (var y = -range; y <= range; ++y)
		{
			target.push(centerX , centerY + y);
		}
		return target;
	}

	// 计算以某个点为中心，range为单边扩充数量的一行坐标
	public static GetRowPosList(centerX: number, centerY: number, range: number): number[]
	{
		var target: number[] = [];
		for (var x = -range; x <= range; ++x)
		{
			target.push(centerX + x , centerY);
		}
		return target;
	}

	// 计算以某个点为中心，range为单边扩充数量的一行和一列坐标
	public static GetCrossPosList(centerX: number, centerY: number, range: number): number[]
	{
		var target: number[] = [];
		for (var y = -range; y <= range; ++y)
		{
			target.push(centerX , centerY + y);
		}

		for (var x = -range; x <= range; ++x)
		{
			if (x != 0)
			{
				target.push(centerX + x, centerY);
			}
		}
		return target;
	}

	// 计算某两个左边的构成的区域的坐标点
	public static GetRegionPosList(startX: number, startY: number, endX: number, endY: number): number[]
	{
		var target: number[] = [];
		var minX = Math.min(startX, endX);
		var maxX = Math.max(startX, endX);
		var minY = Math.min(startY, endY);
		var maxY = Math.max(startY, endY);
		for (var x = minX; x <= maxX; ++x)
		{
			for (var y = minY; y <= maxY; ++y)
			{
				target.push(x, y);
			}
		}
		return target;
	}

	// 判断一个boss是否在列表内
	public static IsInSuperVirusList(superVirus: SuperVirus, list: SuperVirus[]): boolean
	{
		var result = false;
		if (list != null)
		{
			for (var i = 0; i < list.length; ++i)
			{
				if (list[i] == superVirus)
				{
					result = true;
					break;
				}
			}
		}
		return result;
	}

	// 判读一个元素是否在列表里面
	public static IsInList<T>(t: T, list: T[])
	{
		var result = false;
		if (list != null)
		{
			for (var i = 0; i < list.length; ++i)
			{
				if (list[i] == t)
				{
					result = true;
					break;
				}
			}
		}
		return result;		
	}

	// 计算两个值的差值
	public static Lerp(from: number, to: number, rate: number): number
	{
		return from + (to - from) * rate;
	}
	
	public static GetRotateAngle(fromX: number, fromY: number, toX: number, toY: number): number
	{
		var angle = Tools.Radians2Angle(Math.atan2(toY - fromY, toX - fromX));
		return angle;
	}

	public static GetRotateAngleByPoint(from: egret.Point, to: egret.Point): number
	{
		var angle = Tools.Radians2Angle(Math.atan2(to.y - from.y, to.x - from.x));
		return angle;
	}

	public static Radians2Angle(radians: number)
	{
		return radians * 180 / Math.PI;
	}

	public static PointDistance(fromX: number, fromY: number, toX: number, toY: number): number
	{
		return Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
	}

	public static GetDirectionRotateAngle(direction: Direction): number
	{
		var angle = 0;
		switch (direction)
		{
			case Direction.Right:
				angle = 0;
				break;
			case Direction.Up:
				angle = 270;
				break;
			case Direction.Left:
				angle = 180;
				break;
			case Direction.Down:
				angle = 90;
				break;

		}
		return angle;
	}

	public static SetAnchor(disPlayObj: egret.DisplayObject, anchorType: AnchorType)
	{
		if (disPlayObj != null)
		{
			switch (anchorType)
			{
				case AnchorType.Center:
					disPlayObj.anchorOffsetX = disPlayObj.width / 2;
					disPlayObj.anchorOffsetY = disPlayObj.height / 2;
					break;
				case AnchorType.Left:
					disPlayObj.anchorOffsetX = 0;
					disPlayObj.anchorOffsetY = disPlayObj.height / 2;
					break;
				case AnchorType.Right:
					disPlayObj.anchorOffsetX = disPlayObj.width;
					disPlayObj.anchorOffsetY = disPlayObj.height / 2;
					break;
				case AnchorType.Up:
					disPlayObj.anchorOffsetX = disPlayObj.width / 2;
					disPlayObj.anchorOffsetY = 0;
					break;
				case AnchorType.Down:
					disPlayObj.anchorOffsetX = disPlayObj.width / 2;
					disPlayObj.anchorOffsetY = disPlayObj.height;
					break;
			}
		}
	}

	// 播放药丸落地特效（坐标是转换过的位置坐标）
	public static PlayPillLandEffect(pos: egret.Point)
	{
		var particalParam = new PaPlayParticalParam();
		particalParam.textureName = "xingxing1";
		particalParam.jsonName = "LandEffect";
		particalParam.duration = 2000;
		particalParam.emitDuration = 40;
		particalParam.posX = pos.x;
		particalParam.posY = pos.y;
		var event = new PlayProgramAnimationEvent();
		event.param = particalParam;
		GameMain.GetInstance().DispatchEvent(event);
	}

	public static GetBackGroundDynamicLayer(): number
	{
		var screenWidth = egret.Capabilities.boundingClientWidth;
		var screenHeight = egret.Capabilities.boundingClientHeight;
        var screenAspect = screenWidth / screenHeight;
		var standerAspect = Screen_StanderScreenWidth / Screen_StanderScreenHeight; //640:1136
		if(screenAspect <= standerAspect)
		{
			//屏幕很长，iphonex
			//有富余的高度，因此放在屏幕的顶端
            //层级1，跳过back ground
			return 1;
		}
		else
		{
			//屏幕更短，ipad
			//有富余的宽度，因此放在adaptStage顶端
            //层级0， 放在最底层
            return 0;
		}
	}
}