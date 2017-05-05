(function(window,factory){
	var dmoment = factory(window,window.document);
	window.dmoment = dmoment;
	if(typeof module == 'object' && module.exports){
		module.exports = dmoment;
	}
}(window, function l(window,document){
	'use strict';
	
	function hooks(ops){
		/*
			调用的时候ops可放入以下参数
			new Date(...)
			'Tue Apr 25 2017 14:28:07 GMT+0800 (中国标准时间)'
			{
				//config配置....
				locale: 'en',
				dateformat: 'yyyy-MM-dd',
				date: '2015-5-5'
			}
		 */
		
		var dmoment = dmoment || new Dmoment();
		DmomentConfig(ops,dmoment);
		return dmoment;
	}
	function Dmoment(){

	}
	//var dmoment = null;

	var dateConf = {
		locale: 'cn', //地区语言
		dateformat: 'yyyy-MM-dd', //默认格式
		date: new Date() //日期时间
	}
	var _toString = Object.prototype.toString;
	var formatTokens = /[Hh]mm(ss)?|MM?M?M?|DD?D?D?|ddd?d?|yyyy|YYYY|YY?|hh?|HH?|mm?|ss?|S{1,9}|./g;
	var formatFunctions = {};

	function isFunction(fn){
		return typeof fn === 'function' && _toString.call(fn) === '[object Function]';
	}
	function isObject(obj){
		return typeof obj === 'object' && _toString.call(obj) === '[object Object]';
	}
	function isDate(obj){
		return _toString.call(obj) === '[object Date]';
	}
	function dateFormat(format){
		format = format || dateConf.dateformat;
		formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);
		return formatFunctions[format](this);
	}
	function DmomentConfig(ops,dmoment){
		ops = ops || dateConf.date;
		if(!isDate(ops) && isObject(ops)){
			CopyConfig(ops);
		}else{
			!isDate(ops) && ops.replace(/-/g,'/');
			dmoment._d = dateConf.date = new Date(ops);
		}
	}
	function zeroFill(number, targetLength, forceSign){
		var absNumber = '' + Math.abs(number);
		var zeroToFill = absNumber.length - targetLength;
		return (zeroToFill ? '0' : '') + number;
	}
	function makeFormatFunction(format){
		var arr = format.match(formatTokens);
		for(var i = 0,length = arr.length; i < length; i++){
			if(formatFunctions[arr[i]]){
				arr[i] = formatFunctions[arr[i]];
			}
		}

		return function(dmom){
			var output = '', i = 0;
			for(i = 0;i<length;i++){
				output += isFunction(arr[i])? arr[i].call(dmom,format) : arr[i];
			}
			return output;
		}
	}
	function addFormatToken(token, padded, ordinal, callback){
		var func = callback;
		if(typeof func === 'string'){
			func = function(){
				return this[callback]();
			}
		}
		if(token){
			formatFunctions[token] = func;
		}
		if(padded){
			formatFunctions[padded[0]] = function(){
				return zeroFill(func.apply(this,arguments), padded[1],padded[2]);
			}
		}
	}
	function makeGetSet(unit){
		return function(value){
			if(value){
				return set(this, unit, value);
			}else{
				return get(this, unit);
			}
		}
	}
	function getSetMonth(value){
		if(value){
			return set(this,'Month',value);
		}
		return get(this, 'Month') + 1;
	}
	function get(dmom, unit){
		return dmom._d['get' + unit]() || NaN;
	}
	function set(dmom,unit,value){
		return dmom._d['set' + unit](dmom._d['get' + unit]() + value) || NaN;
	}
	function CopyConfig(ops){
		for(var key in ops){
			dateConf[key] = ops[key];
		}
	}
	var add = createAddFunction(1,'add');
	var subtract = createAddFunction(-1, 'subtract');

	function createAddFunction(direction, name){
		return function(val, period){
			if(val === null || period ===null){
				console.log('错误');
			}
			var obj = { value: val, period: period};
			addSubtract(this, obj, direction);
			return this;
		}
	}
	function addSubtract(dmom, dateObj, isAdding){
		dmom[dateObj.period](dateObj.value * isAdding);

	}
	addFormatToken(0, ['yyyy', 4], 0, 'year');
	addFormatToken(0, ['YYYY', 4], 0, 'year');
	addFormatToken(0, ['dd', 2], 0, 'date');
	addFormatToken(0, ['MM', 2], 0, 'month');
	addFormatToken(0, ['hh', 2], 0 , 'hour');
	addFormatToken(0, ['mm', 2], 0 , 'minutes');
	addFormatToken(0, ['ss', 2], 0 , 'seconds');

	var proto       = Dmoment.prototype;
	proto.format    = dateFormat;
	proto.year      = proto.years   = makeGetSet('FullYear');
	proto.month     = proto.months  = getSetMonth;
	proto.date      = makeGetSet('Date');
	proto.day       = proto.days    = makeGetSet('Day');
	proto.hour      = proto.hours   = makeGetSet('Hours');
	proto.minutes   = makeGetSet('Minutes');
	proto.seconds   =makeGetSet('Seconds');
	proto.add       = add;
	proto.subtract  = subtract;


	hooks.prototype = proto;
	return hooks;
	
}))
