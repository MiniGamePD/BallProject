/**
 * 微信开放数据域
 * 使用 Canvas2DAPI 在 SharedCanvas 渲染一个排行榜，
 * 并在主域中渲染此 SharedCanvas
 */







/**
 * 资源加载组，将所需资源地址以及引用名进行注册
 * 之后可通过assets.引用名方式进行获取
 */
var assets = {
  //icon: "openDataContext/assets/icon.png",
  box: "openDataContext/assets/panel.png",
  myPanel: "openDataContext/assets/myPanel.png",
  //buttonNext: "openDataContext/assets/nextPage.png",
  //buttonLast: "openDataContext/assets/lastPage.png",
  //title: "openDataContext/assets/rankingtitle.png",
  gold: "openDataContext/assets/gold.png",
  silver: "openDataContext/assets/silver.png",
  brozen: "openDataContext/assets/brozen.png",
};
/**
 * canvas 大小
 * 这里暂时写死
 * 需要从主域传入
 */
let canvasWidth;
let canvasHeight;

/**
 * 加载资源函数
 * 理论上只需要加载一次，且在点击时才开始加载
 * 最好与canvasWidht和canvasHeight数据的传入之后进行
 */
preloadAssets();

//获取canvas渲染上下文
var context = sharedCanvas.getContext("2d");
context.globalCompositeOperation = "source-over";


/**
 * 所有头像数据
 * 包括姓名，头像图片，得分
 * 排位序号i会根据parge*perPageNum+i+1进行计算
 */
let totalGroup = [
  // { key: 1, name: "1111111111", url: assets.icon, scroes: 10000 },
  // { key: 2, name: "2222222222", url: assets.icon, scroes: 9000 },
  // { key: 3, name: "3333333", url: assets.icon, scroes: 8000 },
  // { key: 4, name: "4444444", url: assets.icon, scroes: 7000 },
  // { key: 5, name: "55555555", url: assets.icon, scroes: 6000 },
  // { key: 6, name: "6666666", url: assets.icon, scroes: 5000 },
  // { key: 7, name: "7777777", url: assets.icon, scroes: 4000 },
  // { key: 8, name: "8888888", url: assets.icon, scroes: 3000 },
  // { key: 9, name: "9999999", url: assets.icon, scroes: 2000 },
  // { key: 10, name: "1010101010", url: assets.icon, scroes: 2000 },
  // { key: 11, name: "111111111111", url: assets.icon, scroes: 2000 },
  // { key: 12, name: "121212121212", url: assets.icon, scroes: 2000 },
  // { key: 13, name: "13131313", url: assets.icon, scroes: 2000 },
  // { key: 14, name: "1414141414", url: assets.icon, scroes: 2000 },
  // { key: 15, name: "1515151515", url: assets.icon, scroes: 2000 },
  // { key: 16, name: "1616161616", url: assets.icon, scroes: 2000 },
];

let gameOverRankGroup = [];

/**
 * 创建排行榜
 */
function drawRankPanel() {
  //绘制背景
  //context.drawImage(assets.panel, offsetX_rankToBorder, offsetY_rankToBorder, RankWidth, RankHeight);
  //绘制标题
  //let title = assets.title;
  //根据title的宽高计算一下位置;

  //let titleHeight = barHeight * 3 / 5;
  //let titleWidth = title.width * titleHeight / title.height;
  //let titleX = offsetX_rankToBorder + (RankWidth - titleWidth) / 2;
  //let titleY = offsetY_rankToBorder + barHeight * 1 / 5;
  //context.drawImage(title, titleX, titleY, titleWidth, titleHeight);
  //获取当前要渲染的数据组
  let start = perPageMaxNum * page;
  currentGroup = totalGroup.slice(start, start + perPageMaxNum);
  //创建头像Bar
  drawRankByGroup(currentGroup);
  //创建按钮
  //drawButton()
}
/**
 * 根据屏幕大小初始化所有绘制数据
 */
function init() {
  //排行榜绘制数据初始化
  RankWidth = stageWidth * 9 / 10;
  RankHeight = stageHeight * 9 / 10;
  barWidth = RankWidth * 9 / 10;
  barHeight = 660 / (perPageMaxNum);
  offsetX_rankToBorder = (stageWidth - RankWidth) / 2;
  offsetY_rankToBorder = (stageHeight - RankHeight) / 2;
  preOffsetY = barHeight;//(RankHeight - barHeight) / (perPageMaxNum + 1);

  barRenderHeight = barHeight * 9 / 10;
  startX = offsetX_rankToBorder + RankWidth * 1 / 20;
  startY = offsetY_rankToBorder + preOffsetY + 20;
  avatarSize = barRenderHeight * 19 / 20;
  crownSize = avatarSize * 3 / 5;
  intervalX = (20 * stageWidth / 640);
  
  //设置字体
  context.font = "bold " + fontSize + "px Arial";
  context.fillStyle = "#FFFFFF";
  context.lineWidth = 4;
  context.strokeStyle = 'black';
  
  textOffsetY = (barHeight + fontSize) / 2;
  
  indexWidth = context.measureText("999").width;
  scoreWidth = context.measureText("9999").width;

  textMaxSize = barWidth - indexWidth - avatarSize - 5 * intervalX;

  //按钮绘制数据初始化
  //buttonHeight = barHeight / 2;
  //buttonWidth = assets.buttonNext.width * buttonHeight / assets.buttonNext.height;
  //buttonOffset = RankWidth / 3;

  // if(buttonWidth >= buttonOffset)
  // {
  //     buttonWidth = barWidth / 3;
  //     buttonHeight = assets.buttonNext.height * buttonWidth / assets.buttonNext.width;
  // }

  // lastButtonX = offsetX_rankToBorder + buttonOffset - buttonWidth;
  // nextButtonX = offsetX_rankToBorder + 2 * buttonOffset;
  // nextButtonY = lastButtonY = offsetY_rankToBorder + RankHeight - 20 - buttonHeight;
  let data = wx.getSystemInfoSync();
  canvasWidth = data.windowWidth;
  canvasHeight = data.windowHeight;
}

/**
 * 创建两个点击按钮
 */
function drawButton() 
{
  context.drawImage(assets.buttonNext, nextButtonX, nextButtonY, buttonWidth, buttonHeight);
  context.drawImage(assets.buttonLast, lastButtonX, lastButtonY, buttonWidth, buttonHeight);
}


/**
 * 根据当前绘制组绘制排行榜
 */
function drawRankByGroup(currentGroup) {
  for (let i = 0; i < currentGroup.length; i++) {
    let data = currentGroup[i];
    drawByData(data, i);
  }
}

/**
 * 根据绘制信息以及当前i绘制元素
 */
function drawByData(data, i) 
{
  let x = startX;
  //绘制底框
  context.drawImage(assets.box, startX, startY + i * preOffsetY, barWidth, barRenderHeight);
  x += intervalX;

  //绘制王冠
  var crownX = x + (indexWidth) / 2 - crownSize / 2;
  if(data.key == 0)
  {
    context.drawImage(assets.gold, crownX, startY + i * preOffsetY + (barRenderHeight - crownSize) / 2, crownSize, crownSize);
  }
  else if(data.key == 1)
  {
    context.drawImage(assets.silver, crownX, startY + i * preOffsetY + (barRenderHeight - crownSize) / 2, crownSize, crownSize);
  }
  else if(data.key == 2)
  {
    context.drawImage(assets.brozen, crownX, startY + i * preOffsetY + (barRenderHeight - crownSize) / 2, crownSize, crownSize);
  }

  //绘制序号
  if(data.key > 2)
  {
    context.textAlign = "center";
    context.lineWidth = 6;
    context.strokeText((data.key+1) + "", x + indexWidth / 2, startY + i * preOffsetY + textOffsetY, indexWidth);
    context.lineWidth = 4;
    context.fillText((data.key+1) + "", x + indexWidth / 2, startY + i * preOffsetY + textOffsetY, indexWidth);
    context.textAlign = "left";
  }
  x += indexWidth + intervalX;
  //绘制头像
  if(data.avatar != null)
  {
      context.drawImage(data.avatar, x, startY + i * preOffsetY + (barRenderHeight - avatarSize) / 2, avatarSize, avatarSize);
  }
  else
  {
      var avatar = wx.createImage();
      avatar.src = data.url;
      avatar.width = avatar.height = avatarSize;
      avatar.onload = (res) => {
          //console.log(res);
          renderAllDirty = true;
          data.avatar = avatar;
        }
  }
  x += avatarSize + intervalX;
  //绘制名称

  var oldFont = context.font;
  var nameFontSize = 25;
  context.font = nameFontSize + "px Arial";
  var minNameFontSize = 10;
  var nameOffsetY = 10
  var nameWidth = 0;
  while(nameFontSize > minNameFontSize)
  {
      var measureText = context.measureText(data.name);
      nameWidth = measureText.width;
      if(nameWidth > textMaxSize)
      {
          nameFontSize -= 1;
          context.font = nameFontSize + "px Arial";
          nameOffsetY = (barHeight + nameFontSize) / 2;
      }
      else
      {
          break;
      }
  }
  context.lineWidth = 2;
  context.strokeText(data.name + "", x, startY + i * preOffsetY + 20 + nameFontSize / 2, textMaxSize);
  context.lineWidth = 4;
  context.fillText(data.name + "", x, startY + i * preOffsetY + 20 + nameFontSize / 2, textMaxSize);
  context.font = oldFont;
  //x += textMaxSize + intervalX;
  //绘制分数
  context.strokeText(data.scroes + "", x, startY + i * preOffsetY + textOffsetY + nameFontSize / 2, textMaxSize);
  context.fillText(data.scroes + "", x, startY + i * preOffsetY + textOffsetY + nameFontSize / 2, textMaxSize);
}

/**
 * 点击处理
 */
// function onTouchEnd(event) {
//   let x = event.clientX * sharedCanvas.width / canvasWidth;
//   let y = event.clientY * sharedCanvas.height / canvasHeight;
//   if (x > lastButtonX && x < lastButtonX + buttonWidth
//     && y > lastButtonY && y < lastButtonY + buttonHeight) {
//     //在last按钮的范围内
//     if (page > 0) {
//       buttonClick(0);

//     }
//   }
//   if (x > nextButtonX && x < nextButtonX + buttonWidth
//     && y > nextButtonY && y < nextButtonY + buttonHeight) {
//     //在next按钮的范围内
//     if ((page + 1) * perPageMaxNum < totalGroup.length) {
//       buttonClick(1);
//     }
//   }

// }
/**
 * 根据传入的buttonKey 执行点击处理
 * 0 为上一页按钮
 * 1 为下一页按钮
 */
function buttonClick(buttonKey) {
  let old_buttonY;
  if (buttonKey == 0) {
    //上一页按钮
    old_buttonY = lastButtonY;
    lastButtonY += 10;
    page--;
    renderAllDirty = true;
    //console.log('上一页');
    setTimeout(() => {
      lastButtonY = old_buttonY;
      //重新渲染必须标脏
      renderAllDirty = true;
    }, 100);
  } else if (buttonKey == 1) {
    //下一页按钮
    old_buttonY = nextButtonY;
    nextButtonY += 10;
    page++;
    renderAllDirty = true;
    //console.log('下一页');
    setTimeout(() => {
      nextButtonY = old_buttonY;
      //重新渲染必须标脏
      renderAllDirty = true;
    }, 100);
  }

}

/////////////////////////////////////////////////////////////////// 相关缓存数据

/**********************数据相关***************************/

/**
 * 渲染标脏量
 * 会在被标脏（true）后重新渲染
 */
let renderAllDirty = true;
let renderGameOverRankDirty = false;

/**
 * 当前绘制组
 */
let currentGroup = [];
/**
 * 每页最多显示个数
 * 建议大于等于4个
 */
let perPageMaxNum = 6;
/**
 * 当前页数,默认0为第一页
 */
let page = 0;
/***********************绘制相关*************************/
/**
 * 舞台大小
 */
let stageWidth;
let stageHeight;
/**
 * 排行榜大小
 */
let RankWidth;
let RankHeight;

/**
 * 每个头像条目的大小
 */
let barWidth;
let barHeight;
let barRenderHeight;
/**
 * 条目与排行榜边界的水平距离
 */
let offsetX_barToRank
/**
 * 绘制排行榜起始点X
 */
let startX;
/**
 * 绘制排行榜起始点Y
 */
let startY;
/**
 * 每行Y轴间隔offsetY
 */
let preOffsetY;
/**
 * 按钮大小
 */
let buttonWidth;
let buttonHeight;
/**
 * 上一页按钮X坐标
 */
let lastButtonX;
/**
 * 下一页按钮x坐标
 */
let nextButtonX;
/**
 * 上一页按钮y坐标
 */
let lastButtonY;
/**
 * 下一页按钮y坐标
 */
let nextButtonY;
/**
 * 两个按钮的间距
 */
let buttonOffset;

/**
 * 字体大小
 */
let fontSize = 40;
/**
 * 文本文字Y轴偏移量
 * 可以使文本相对于图片大小居中
 */
let textOffsetY;
/**
 * 头像大小
 */
let avatarSize;
/**
 * 皇冠大小
 */
let crownSize;
/**
 * 名字文本最大宽度，名称会根据
 */
let textMaxSize;
/**
 * 绘制元素之间的间隔量
 */
let intervalX;
/**
 * 排行榜与舞台边界的水平距离
 */
let offsetX_rankToBorder;
/**
 * 排行榜与舞台边界的竖直距离
 */
let offsetY_rankToBorder;
/**
 * 绘制排名的最大宽度
 */
let indexWidth;
/**
 * 绘制得分的最大宽度
 */
let scoreWidth;

//////////////////////////////////////////////////////////
/**
 * 监听点击
 */
// wx.onTouchEnd((event) => {
//   var l = event.changedTouches.length;
//   for (var i = 0; i < l; i++) {
//     onTouchEnd(event.changedTouches[i]);
//   }
// });


/**
 * 资源加载
 */
function preloadAssets() {
  var preloaded = 0;
  var count = 0;
  for (var asset in assets) {
    count++;
    var img = wx.createImage();
    img.onload = function () {
      preloaded++;
      if (preloaded == count) {
        setTimeout(function () {
          createScene();
          requestAnimationFrame(loop);
        }, 500);
      }
    }
    img.src = assets[asset];
    assets[asset] = img;
  }
}
/**
 * 绘制屏幕
 * 这个函数会在加载完所有资源之后被调用
 */
function createScene() {
  if (sharedCanvas.width && sharedCanvas.height) {
    //console.log('初始化完成')
    stageWidth = sharedCanvas.width;
    stageHeight = sharedCanvas.height;
  } else {
    console.log(`sharedCanvas.width:${sharedCanvas.width}    sharedCanvas.height：${sharedCanvas.height}`)
  }
  init();
  //requestAnimationFrame(loop);
}
/**
 * 循环函数
 * 每帧判断一下是否需要渲染
 * 如果被标脏，则重新渲染
 */
function loop() 
{
  if (renderAllDirty) 
  {
    if(stageWidth != sharedCanvas.width || stageHeight != sharedCanvas.height)
    {
      createScene();
    }
    //console.log(`stageWidth :${sharedCanvas.width}   stageHeight:${sharedCanvas.height}`)
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
    drawRankPanel();
    renderAllDirty = false;
  }
  else if(renderGameOverRankDirty)
  {
    stageWidth = sharedCanvas.width;
    stageHeight = sharedCanvas.height;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, stageWidth, stageHeight);
    
    var boxX = 0;
    var boxWidth = stageWidth / 3;
    var avatarWidth = boxWidth * 0.7;
    context.font = "bold " + fontSize + "px Arial";
    context.fillStyle = "#FFFFFF";
    context.lineWidth = 4;
    context.strokeStyle = 'black';

    if(gameOverRankGroup.length == 0)
    {
      //预先画一个底出来占位
      for(var i = 0; i < 3; ++i)
      {
        //绘制底框
        context.drawImage(assets.myPanel, boxX + i * boxWidth, 0, boxWidth, stageHeight);
      }
    }
    
    for(var i = 0; i < gameOverRankGroup.length; ++i)
    {
      var data = gameOverRankGroup[i];

      //绘制底框
      if(data.isMe)
      {
        context.drawImage(assets.box, boxX, 0, boxWidth, stageHeight);
      }
      else
      {
        context.drawImage(assets.myPanel, boxX, 0, boxWidth, stageHeight);
      }

      //绘制排名
      context.textAlign = "center";
      context.lineWidth = 6;
      context.strokeText((data.key+1) + "", boxX + boxWidth / 2, 60, boxWidth);
      context.lineWidth = 4;
      context.fillText((data.key+1) + "", boxX + boxWidth / 2, 60, boxWidth);

      //绘制头像
      if(data.avatar != null)
      {
          context.drawImage(data.avatar, boxX+(boxWidth-avatarWidth)/2, 80, avatarWidth, avatarWidth);
      }
      else
      {
          var avatar = wx.createImage();
          avatar.src = data.url;
          avatar.width = avatar.height = avatarWidth;
          data.avatar = avatar;
          avatar.onload = (res) => {
              console.log("refresh avatar:" + data.name);
              renderGameOverRankDirty = true;
            }
      }

      //绘制名称
      var oldFont = context.font;
      var nameFontSize = 25;
      context.font = nameFontSize + "px Arial";
      var minNameFontSize = 10;
      var nameOffsetY = 10
      var nameWidth = 0;
      while(nameFontSize > minNameFontSize)
      {
          var measureText = context.measureText(data.name);
          nameWidth = measureText.width;
          if(nameWidth > boxWidth)
          {
              nameFontSize -= 1;
              context.font = nameFontSize + "px Arial";
              nameOffsetY = (barHeight + nameFontSize) / 2;
          }
          else
          {
              break;
          }
      }
      context.lineWidth = 2;
      context.strokeText(data.name + "", boxX + boxWidth / 2, 240, textMaxSize);
      context.lineWidth = 4;
      context.fillText(data.name + "", boxX + boxWidth / 2, 240, textMaxSize);
      context.font = oldFont;

      //绘制分数
      var oldFont = context.font;
      context.font = "bold " + 26 + "px Arial";
      context.strokeText(data.scroes + "", boxX + boxWidth / 2, 300, boxWidth);
      context.fillText(data.scroes + "", boxX + boxWidth / 2, 300, boxWidth);
      context.font = oldFont;

      boxX += boxWidth;
    }

    renderGameOverRankDirty = false;
  }
  requestAnimationFrame(loop);
}

wx.onMessage(data => {
  //console.log(data);
  if (data.command === 'getFriendCloudStorage') 
  {
      onGetFriendCloudStorage(data);
  }
  else if (data.command == "renderGameOverRank")
  {
      onGetFriendCloudStorage(data);
      renderGameOverRankDirty = true;
      renderAllDirty = false;
      gameOverRankGroup = [];
  }
  else if(data.command == 'rankTurnPage')
  {
      onRankTurnPage(data.data);
  }
});

function onGetFriendCloudStorage(data)
{
    var storageKey = "HighScore";
    wx.getFriendCloudStorage({ 
        keyList: [storageKey], 
        success:  function   (res) 
        { 
            //console.log("--success res:", res); 
            //console.log('获取CloudStorage:' + storageKey + "成功");

            totalGroup = [];
            for(var i = 0; i < res.data.length; ++i)
            {
                var userGameData = res.data[i];
                var kvDataList = userGameData.KVDataList;
                var storageValue = 0;
                for(var j = 0; j < kvDataList.length; ++j)
                {
                    if(kvDataList[j].key == storageKey)
                    {
                        var kvData = JSON.parse(kvDataList[j].value); 
                        storageValue = kvData.wxgame.score;
                    }
                }
                totalGroup.push({ key: i, name: userGameData.nickname, url: userGameData.avatarUrl, scroes: storageValue, avatar:null, isMe: false });
            }
            totalGroup.sort(sortScore);
            for(var i = 0; i < totalGroup.length; ++i)
            {
                totalGroup[i].key = i;
            }

            if (data.command === 'getFriendCloudStorage')
            {
              renderAllDirty = true;
              renderGameOverRankDirty = false;
            } 
            else if(data.command == 'renderGameOverRank')
            {
              renderGameOverRankDirty = true;
              renderAllDirty = false;

              if(totalGroup.length <= 3)
              {
                gameOverRankGroup = totalGroup;
              }
              else
              {
                gameOverRankGroup = [];
                //找到我在哪里
                var me = data.data;
                var myIndex = 0;
                for(var i = 0; i < totalGroup.length; ++i)
                {
                    if(totalGroup[i].name == me)
                    {
                      myIndex = i;
                      break;
                    }
                }

                console.log(me + " " + myIndex);
                var startIndex = 0;
                //找到我附近的3个人
                if(myIndex == totalGroup.length - 1)
                {
                  //我是最后一个
                  startIndex = myIndex - 2;
                }
                else if(myIndex == 0)
                {
                  //我是第一个
                  startIndex = myIndex;
                }
                else
                {
                  //我前面有一个，我后面还有一个
                  startIndex = myIndex - 1;
                }

                for(var j = 0; j < 3; ++j)
                {
                  var temp = totalGroup[startIndex + j];
                  temp.isMe = (startIndex + j) == myIndex;
                  gameOverRankGroup.push(temp);
                }
              }
            }
        }, 
        fail:  function   (res) 
        { 
            console.log( '--fail res:' , res); 
        }, 
        complete:  function   (res) 
        { 
            //console.log( '--complete res:' , res); 
        }, 
    }); 
}

function sortScore(a,b)
{
  return b.scroes - a.scroes;
}

function onRankTurnPage(dir)
{
  if (dir == -1)
  {
    //在last按钮的范围内
    if (page > 0) 
    {
      buttonClick(0);
    }
  }
  else if (dir == 1) 
  {
    //在next按钮的范围内
    if ((page + 1) * perPageMaxNum < totalGroup.length) 
    {
      buttonClick(1);
    }
  }
}