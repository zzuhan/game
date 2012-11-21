// 执行逻辑，检测是否被击中
// 更新视觉位置和碰撞位置
// 如果适当的话，改变现有对象

// 全局静态变量，方便控制 相当于config.js
var PLAYER = 1,
	LASER = 2,
	SCREEN_WIDTH = 480,
	SCREEN_HEIGHT =  384,
	SYS_process,
	SYS_collisionManager,
	SYS_timeInfo,
	SYS_spriteParams = {
		width: 32,
		height: 32,
		imageWidth: 256,
		images: 'invaders.png',
		// 即将要绘制的目标地
		$drawTarget: $('#draw-target')
	};


// keys 函数
var keys = (function () {
	var keyMap = {
		90: 'left',
		88: 'right',
		77: 'fire'		
	},
	kInfo = {
		'left': 0,
		'right': 0,
		'fire': 0
	},
	key;

	$(document).bind('keydown keyup', function (event) {
		key = '' + event.which;
		if (keyMap[key] !== undefined) {
			kInfo[keyMap[key]] = ( event.type === 'keydown' ? 1 : 0 );
			return false;
		}
	});

	// 返回kInfo对象，并将在游戏变量SYS_keys对象中引用
	return kInfo;
})();

var processor = function () {
	var processList = [],
		addedItems = [];

	return {
		add: function (item) {
			addedItes.push(item)
		},

		process: function () {
			var newProcessList = [],
				item;

			for (var i=0; i<processList.length; i++) {
				item = processList[i];

				if (!item.removed) {
					item.move();
					newProcessList.push(item);
				}
			}

			processList = newProcessList.concat(addedItems);
			addedItems = [];
		}
	};
});
SYS_process = processor(); 

var DHTMLSprite = function (params) {
	var width = params.width,
		height = params.height,
		imageWidth = params.imagesWidth,
		$element = params.$drawTarget.append('<div/>').find(':last'), // find(':last ') 定位到element身上
		elemStyle = $element[0].style,
		mathFloor = Math.floor;

	$element.css({
		position: 'absolute', left: -9999,
		width: width,
		height: height,
		background: 'url(' + params.images + ')'
	});

	var that = {
		draw: function (x, y) {
			elemStyle.left = x + 'px';
			elemStyle.top = y + 'px';
		},
		changeImage: function (index) {
			index *= width;
			var vOffset = -mathFloor(index / imageWidth) * height;
			var hOffset =  -index % imageWidth;
			elemStyle.backgroundPosition = hOffset + 'px' + vOffset + 'px';
		},
		show: function () {
			elemStyle.display = 'block';
		},
		hide: function () {
			elemStyle.display = 'none';
		},
		destroy: function () {
			$element.remove();
		},
	};
	return that;
}



function Enemy() {
	this.init.apply(this, arguments);
}
Enemy.prototype = {
	constructor: Enemy,

	init: function () {
		this.active = true;	
	},

	move: function () {
		
	},

	remove: function () {
		
	}
}

var collisionManager = function () {
	var listIndex = 0, // 网格中每个碰撞对象唯一标识
		checkListIndex = 0, // 碰撞对象唯一标识
		grid = [], // 网格
		checkList = {}, // 需要测试的碰撞对象名单
		gridWidth = 15,
		gridHeight = 12;
	for (var i=0; i<gridWidth*gridHeight; i++) { 15*12 // 为整个屏幕所分成的网格
		grid.push({});
	}
	// 返回某一个网格列表
	var getGridList = function (x, y) { // x, y 为其在整个页面的坐标
		var idx = Math.floor(y/32) * gridWidth + Math.floor(x/32); // ?
		if (grid[idx] === undefined) {
			return;
		}
		return grid[idx];
	}
	return { // 返回的是碰撞对象，应该是一个子弹
		newCollider: function (colliderFlag, collideeFlags, width, height, cb){ // 由需要和其他对象发生碰撞的游戏对象调用
			var list, // 网格中对象
				indexStr = '' + listIndex++,
				checkIndex;
			var colliderObj = { // colliderObj 为游戏对象
				halfWidth: width/2,
				halfHeight: height/2,
				centerX: 0,
				centerY: 0,
				colliderFlag: colliderFlag,
				collideeFlags: collideeFlags,
				update: function (x, y) { // 更新其碰撞对象的位置
					colliderObj.centerX = x + 16;
					colliderObj.centerY = y + 32 - colliderObj.halfHeight;
					if (list) { // 从旧方格类表中删除
						delete list(indexStr);
					}
					list = getGridList(colliderObj.centerX, colliderObj.centerY);
					if (list) { // 放到新的表格中
						list[indexStr] = colliderObj;
					}
				},

				remove: function () {
					if (collideeFlags) {
						delete checkList[checkIndex];
					}
					if (list) {
						delete list[listIndex];
					}
				},

				callback: function () {
					cb();
				},

				checkCollisions: function (offsetX, offsetY) {
					var list = getGridList(colliderObj.centerX + offsetX,
											colliderObj.centerY + offsetY);
					if (!list) {
						return;
					}
					var idx, collideeObj;
					for(idx in list) {
						if (list.hasOwnProperty(idx) && idx !== indexStr && colliderObj.collideeObj & list[idx].colliderObj) { // 既要判断非自身 
							collideeObj = list[idx];
							if (Math.abs(colliderObj.centerX - collideeObj.centerX > colliderObj.halfWidth + collideeObj.halfWidth)) {
								continue; // 进入下一次循环
							}
							if (Math.abs(colliderObj.centerY - collideeObj.centerY) > colliderObj.halfHeight + collideeObj.halfHeight)) {
								continue;
							}
							collideeObj.callback(colliderObj.colliderFlag); // ? why
							callback(collideeObj.colliderFlag);
							return true; // 即碰撞了
						}
					}
					return false; // 即未碰撞
				}
			};
			if(collideeFlags) {
				checkIndex = '' + checkListIndex++;
				checkList[checkIndex] = colliderObj;
			}
			return colliderObj;
		},
		checkCollisions: function () { // 暂时先不写了	
			var idx, colliderObj;
			for (idx in checkList) {
				if (checkList.hasOwnProperty(idx)) {
					colliderObj = checkList[idx];

					for (var y=-32; y<=32; y+=32) {
						for (var x=-32; x<=32; x+=32) {
							if (colliderObj.checkCollisions(x, y)) {
								break;
							}
						}
					}
				}
			}
		}
	};
};

// Animation effect
var animEffect = function (x, y, imgList, timeout) {
	var imageIndex  = 0,
		that = DHTMLSprite(SYS_spriteParams);

	setTimeout(function () {
		that.removed = true;
		this.destroy();
	}, timeout);

	that.move = function () {
		that.changeImage(imgList[imageIndex]);
		imageIndex++;
		if (imageIndex === imgList.length) {
			imageIndex = 0;
		}
		that.draw(x, y);
	}

	SYS_process.add(that);
};