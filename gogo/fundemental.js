// 执行逻辑，检测是否被击中
// 更新视觉位置和碰撞位置
// 如果适当的话，改变现有对象

// 全局静态变量，方便控制
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
			// 防止冒泡
			return false;
		}
	});

	// 返回kInfo对象，并将在游戏变量SYS_keys对象中引用
	return kInfo;
});

// process 处理器 用来处理被打中的物体，还有物体的移动
var processor = (function () {
	var processList = [],
		addedItems = [];

	return {
		// 添加一个新的物体
		add: function (item) {
			addedItems.push(item);
		},
		// 处理移动和新函数添加
		process: function () {
			var newProcessList = [],
				item;

			for (var i = 0, len = processList.length; i < len; i++) {
				item = processList[i];

				if (!item.removed) {
					item.move();
					newProcessList.push( item );
				}
			};

			processList = newProcessList.concat( addedItems )
			addedItems = [];
		}
	};
})();

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

