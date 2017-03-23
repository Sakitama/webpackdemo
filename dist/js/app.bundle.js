/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap) {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
  var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

  return '/*# ' + data + ' */';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12).Buffer))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(9);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADTwAAAAYAAAAAAAAAAAAAAMgAAADIAAAADQAxADQAOAAyADgAMQAxADEAMAA0ADYAMAAyAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAADIAAAAyAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAABAAAAABAAAAAAAAbnVsbAAAAAIAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAAAyAAAAABSZ2h0bG9uZwAAAMgAAAAGc2xpY2VzVmxMcwAAAAFPYmpjAAAAAQAAAAAABXNsaWNlAAAAEgAAAAdzbGljZUlEbG9uZwAAAAAAAAAHZ3JvdXBJRGxvbmcAAAAAAAAABm9yaWdpbmVudW0AAAAMRVNsaWNlT3JpZ2luAAAADWF1dG9HZW5lcmF0ZWQAAAAAVHlwZWVudW0AAAAKRVNsaWNlVHlwZQAAAABJbWcgAAAABmJvdW5kc09iamMAAAABAAAAAAAAUmN0MQAAAAQAAAAAVG9wIGxvbmcAAAAAAAAAAExlZnRsb25nAAAAAAAAAABCdG9tbG9uZwAAAMgAAAAAUmdodGxvbmcAAADIAAAAA3VybFRFWFQAAAABAAAAAAAAbnVsbFRFWFQAAAABAAAAAAAATXNnZVRFWFQAAAABAAAAAAAGYWx0VGFnVEVYVAAAAAEAAAAAAA5jZWxsVGV4dElzSFRNTGJvb2wBAAAACGNlbGxUZXh0VEVYVAAAAAEAAAAAAAlob3J6QWxpZ25lbnVtAAAAD0VTbGljZUhvcnpBbGlnbgAAAAdkZWZhdWx0AAAACXZlcnRBbGlnbmVudW0AAAAPRVNsaWNlVmVydEFsaWduAAAAB2Rl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bG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJGMjFGOTBCRjJBQTM3NTVBMThEMDY1NDk3NzREMTEwQyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozRDUyRDM5OEY3Q0JFNjExOEI5RUU2MzM1Njg3MjlBMSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJGMjFGOTBCRjJBQTM3NTVBMThEMDY1NDk3NzREMTEwQyIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNi0xMi0yN1QxMTo1ODoyOCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTYtMTItMjdUMTM6NDc6MjArMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTYtMTItMjdUMTM6NDc6MjArMDg6MDAiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozRDUyRDM5OEY3Q0JFNjExOEI5RUU2MzM1Njg3MjlBMSIgc3RFdnQ6d2hlbj0iMjAxNi0xMi0yN1QxMzo0NzoyMCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/7gAhQWRvYmUAZEAAAAABAwAQAwIDBgAAAAAAAAAAAAAAAP/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQEBAQEBAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8IAEQgAyADIAwERAAIRAQMRAf/EAOIAAAEEAgMBAQAAAAAAAAAAAAUABAYHAwgBAgkKCwEAAgMBAQEBAAAAAAAAAAAAAAMBAgQFBgcIEAACAQMDAgUDBAICAwAAAAABAgMAEQQSBQYhBxAgMRMIIhQJMEBBMiMVQgozQxYRAAECBAMFBQYDBgQEBwAAAAERAgAhAwQxQQVRYXESBoGRIhMHobHBMhQI8EIjINHh8TMVEEBSFjBickOCYyR0JRcJEgABAwIEAwQIBQQDAQAAAAABABECITEQQRIDUWEiIHGxBDDwgZGhwdEyQOFiEyNCgpIzUqIkNP/aAAwDAQECEQMRAAAA2e/RHxlAgQd4D6LXNz93pv5Tv7+8fW6arm13gOQ7wd4HNbJU6Y7k+Svr+Hr51eTFtNMFhAgQIECDkCiS5Ofv9avH+i3B57grIcQowWNyx9E5g5I6FcsXfrtr0yvh57jzuvvT5QDTHUECBAgQZYJ1jd6I+Y9D6bcHVCtd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"

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js?importLoaders=1!../../node_modules/postcss-loader/index.js!./common.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js?importLoaders=1!../../node_modules/postcss-loader/index.js!./common.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layer_tpl__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layer_tpl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__layer_tpl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__layer_less__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__layer_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__layer_less__);



function Layer () {
    return {
        name: 'Layer',
        tpl: __WEBPACK_IMPORTED_MODULE_0__layer_tpl___default.a
    };
}

/* harmony default export */ __webpack_exports__["a"] = (Layer);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".flex {\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n}\n.layer {\n  width: 600px;\n  height: 200px;\n  background-color: aqua;\n}\n.layer div {\n  width: 400px;\n  height: 100px;\n  background: url(" + __webpack_require__(2) + ");\n}\n", ""]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports
exports.i(__webpack_require__(7), "");

// module
exports.push([module.i, "html, body {\r\n    padding: 0;\r\n    margin: 0;\r\n    background-color: yellow;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".flex-box {\r\n    display: -webkit-flex;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n}", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="layer">\r\n    <img src="' +
((__t = (__webpack_require__(2))) == null ? '' : __t) +
'" alt="大白">\r\n    <div>this is ' +
((__t = ( name )) == null ? '' : __t) +
' layer</div>\r\n    ';
 for (var i = 0; i < arr.length; i++) { ;
__p += '\r\n    ' +
((__t = ( arr[i] )) == null ? '' : __t) +
'\r\n    ';
 } ;
__p += '\r\n</div>';

}
return __p
}

/***/ }),
/* 9 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/less-loader/dist/index.js!./layer.less", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/less-loader/dist/index.js!./layer.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(13)
var ieee754 = __webpack_require__(14)
var isArray = __webpack_require__(15)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 14 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 15 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_common_css__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_common_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_common_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_layer_layer__ = __webpack_require__(4);



class App {
    constructor () {
        let dom = document.getElementById('app');
        let layer = new __WEBPACK_IMPORTED_MODULE_1__components_layer_layer__["a" /* default */]();
        dom.innerHTML = layer.tpl({
            name: "hash",
            arr: ["apple", "nokia", "huawei"]
        });
    }
}

new App();

/***/ })
/******/ ]);