/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "ae22caf86c5a83e135b4"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
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
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(63)(__webpack_require__.s = 63);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = vendor_4adf5b975b06d7f766a2;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(3);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(39);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(41);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Config; });
var Config = (function () {
    function Config() {
    }
    Config.url = "http://localhost:51285/api/";
    Config.google = "https://www.googleapis.com/calendar/v3/calendars/calendarId/events/";
    return Config;
}());



/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(28);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app',
            template: __webpack_require__(34),
            styles: [__webpack_require__(5)]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustformConstructor; });
var CustformConstructor = (function () {
    function CustformConstructor(id, userId, custFName, custLName, street, city, state, zip, email, phone, appoint, appointDate, appointTime, modifiedBy, compName, compEmail) {
        this.id = id;
        this.userId = userId;
        this.custFName = custFName;
        this.custLName = custLName;
        this.street = street;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.email = email;
        this.phone = phone;
        this.appoint = appoint;
        this.appointDate = appointDate;
        this.appointTime = appointTime;
        this.modifiedBy = modifiedBy;
        this.compName = compName;
        this.compEmail = compEmail;
    }
    return CustformConstructor;
}());



/***/ }),
/* 8 */
/***/ (function(module, exports) {

/*
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

	if (useSourceMap && typeof btoa === 'function') {
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
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 9 */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbgAAAE4CAIAAACmGHE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAIItJREFUeNrsnXtz22Z2h88LXkHdSMq2rJub7W7b7aTbnbYznc50pv16/QT9ZNvETrJJ7Ei2ZUskJQAkAV7QP3h7AQIgIImUSD7PaBKZF1mGgEe/FzgHR8n//o88N3x/8on2P19E/PFT0899EX/6oB/9MQz9cRj3VPVffm+evhAAgCDGs/7u1PwjKvy0UrMH1fSPk/+OPlHay0afTF+jfdjvLv2hzz4BAOsgSqUifKl0M4rISH9zftQNO1Hl+MUBS4qosIj77W771yv2CQBYq0QZCpURn6uZQEOhUgVDpaiATONC5Q+XQ6/PbgEA6yBKFXTfTIVKe1az5HyoFD1CSnT8VNM/jl8+7Pedv35ktwCAtUqUEQEzan09ezAUEiWwCA+EStHEOnuL8/PnQddjzwCAdRBlbKiUQKiUYKgML9LVolAZfIGI7/vWdx/YMwBgTROlShsqJay/sBll/nrO7NnOp0bvzmHnAIB1EGU4VErmUBkoFUobKoVQCQBrmyizh0rRioTmzag/GwyV7vWde9Vi/wCAdRDlA0OlXiSkh8rY4vPZ32K9/W3WIwQAiHJtXBkbKlV0qNSSYriEKDpXzqTZs9qdi2t2EQBYx/KgBI2mb2qMamScqz+33l74/QF7CQCiXAs/PnpTY3z9ucbA9RyaGgEQ5fp9y8tqapTopsYfP9LUCIAo18WPq2lqVLOmxlH9+WBgvfuNHQUAUa4zj9zUGPwqo/rzD1/7Tpd9BQBRrnWolECoFHn8psbvqT8HQJTrnCfv09SosjU1dj83vYbF7gKAKNcxVErmUBlZf74oVIoIoRIAUa6nK2NDpbpnU2MgcgZCpde0u58b7DEAiHItV97xGk3T1JhmqM74K1vf/cZQHQBEuRGhMlx/roKLbgmGyjRDdcaP9Nvdzocv7DQAiHL9Q2Xg8ak050LlvYbqWO8uaWoEQJRrGCpVVKjULSkJ9efazJyEoToThr2e/RNDdQAQ5doHzLnayXBTY+i+GLKgqTH4FueXK4bqACDKdQ6V4WcjQ2XQrFnrzwcD+90Fuw4AolzjPJmxqVFSNDVqL1BKlGpfXPfv2uw9AIhyHUOlRIdKkcVDdbKESvH9u7fUnwMgyo0PlQ8cqvPl1ru+YwcCQJTbFCqzD9W5+7/37EAAiHINXRkbKjM2NUq6oTqXDNUBQJTrufKO1+g9hupI0lCd72lqBECUmxEqHzRUJ7Kpccyg67V/+cRuBIAo1zlUPuZQHRUzVOcTQ3UAEOUahsoVDtUZ9vv2j5fsSQCIct0D5nKH6rR/vRq0XXYmAES51qFSAqFS5PGH6rxlUiMAolznPLmCoTqdjze9W4f9CQBRrmOolMyh8r5Ddag/B0CU6+nKe4RKSd3UGBqq07Dcqxa7FACiXMuVd7ZQGTFUJ6qpMXARfBIqv/8gPvXnAIhyc0Jl+qE6EbfvDWbS8YN9u9P+8JW9CgBRbkyonDwdN1Qntqkxsf78B4bqACDKzQiVelNjXP15bFPj3FAdjYHrOT/T1AiAKNc6VN5nqI5aMFQnFCr/+nno9ti3ABDluoXK5Q7VkdBQHesHhuoAIMq1D5iPO1Rnrqnx/de+3WH3AkCUGxQqRR55qI74d99Rfw6AKNc5T65oqE7DYg8D2AhRbnyBNEN1AIBEmc2VsaFyCUN1bh2G6gBsiii3qututUN17HeXDNUBIFFuRKhc2lCdfrvb/vUz+xnARohya0PlCobq/PCRoToAm5Iot+6qzvKH6ojIaKjOTx/Z1QBYeq97wFzOUJ3JW9q/fGaoDsCmiHJ7Q6UEQqUIQ3UAQBPltl+SXeFQnTuG6gBsxtKb+vOFofLeQ3X+Qv05wPqKklApDNUBgCRR+oTKbKEy5VAdYagOwNoz6HqdT838RI5RythsVwaEpUR8USK+Gv/mGH2ufBH9QSW+zF6gv330eEDBk6/vTxOr9O1O+/2XyjdH7H8Az1mOXsN2G5bXdAauJyL5aE36/lwry0avvP0EjaqZAX0/sEj3tffqW0uX5tymtX/8aJ69UPkcuyPAM5Jjx/Oatntz57XaIzmOD2ylpqKMsuXGuzI5VCol4muhMujHWerUNpqvPzK15OTt05+H6zk/f9r9+zN2TYAnl6PbsLxRcvR6ITlqJ9xUPnCUb9sCPDJURnyuRPmzBbjMdY77EvbmOFRK5Fa1//rZfPMqVy6ypwKsmH7b9Zp2GjnOlopK8kly3KpQqZ+gnC63fT9gyVlUDEZRpftyPlQGV+m++IOB/ePlwZ9+x14LsCI53lhey3YbzrCXVo76U3kJrb23NlSGA6aKWF/rV3VCedKXcHXRLFRO3zj7AbTff9355nV+z2QnBliKHB3Xa1hu0/Ka7VRyVBJeL6rZAZufnIkLZCFCZfBZNYuE49W07lD9t0tCqAxZ1b/7/n393//IDg3wiHJ0b+68lu01nWGv/0A56skmqjxo20NlZKlQVKgcy9MP9iyGNqYf2LDapne/3Ho3d8XDffZvgPvL0e66Dctr2l5rKkdNiw+Qo/ZilV+sya0LlZHPpgiV0w043cr6pgulTl9E5O4v71/895/Y1wEyyrHj3lhey/Ga9rA/WJIc9Wfzk4NZX4BTf56l/jwuVOr154FcOfup9Kx25/LaPH3Brg+QTM/qeNPkuBI56remzUd9S9SfJ2j0HvXnkblyjPX2onx8qAyuoAHMyfGu7TVsr2W7TccfrFqO+oN57UgmVC6p/nwuV+r15x23/cunnd+fcFQAiEjvtu01bbdpea32TI7q4XKMsWS8HPWvFldHSahM+Hy+/jyYIWPrz+OaGj+Z56+MYp6DBLaT0dnG0dVqfzh8JnIMijLgwcRQSf15bP25hIuK9NyYUH/ui4yG6vx4uf/t33DAwDbJ0faaIz9mkeOcwh5Hjipy2MHsLfmwHEOhkvpzyVp/LhMDpqg/n7yk/etV5Zuj/E6Z4wc2WY5Ne2RGr+n4/lLlGDbdPeQYlSjjQmVYntSfLyoVCvweS1t/7vu+/e6i+q9/4FiCjcL3tWV1e73kqP9xUkdJqEzMkxnqz3U/hswYCJXhH2Hn483O748LBzscXLD2cmzaXtPxbm2v6fi+v6Zy1B2QD5w1iwiV1J9HPpu9/nxxU6Pc/eXXw//8lgMN1s+NQ7/Xsr2m47bsXuux5RgYgLo6Oer/y8+O2lnt9HwfHqFyOU2NEqg/95q2e9UqHVU58GAt5DheU7ccr+nMrnzOxqXIWstRfySvFUjHqZFQmTFUzi6FT98y2cqhTTeL85NQ+d37l68OtqgSC9ZMjkOv6Xit0TWZdkCOsmQ5hsLH8uWoPxzs9Q6ESurPszQ1Kl9bdKcbquPrF8EnQ3WcLkN14NnJsWF7rZEfnfApwpXJUS2y3mPLMbT0lphQGdhW1J/Ha3RSWakeZ6iO9cMlQ3XgieU4GE7qeGyvpcnRUNEG3EQ56g/mteJnpa0mCZVZmhp9mVt0ZxyqI7O/a+j17J8+7v3xnMMVVi3Hhj1eVt+2kaP+1fLjY1W/zJ1QKkSolOUM1Qmuyp1frirfHDFUB5Yux/5gdM7RbVq92w5yjPjiEio4D+dHmhpXOVRHe8FoqM4PFwf//LccybAMObqjDpmm3bt7ZnIMK+8p5aj/Pz9bAI4vTSjqz9MFzMcdqhP+ubY/XO988zq/X+HAhocz7A3Ga+qG1bO6z1SOEb57Sjnq5Euv9twvVmBJmBQqKRVa4VCdtx8YqgMPkmPT8lqOe2P17XvJMVJhz0eOkQVDsY9klqP+RN48qXnXtj/0tfstLuz4pv58VUN1ru+KLxiqA6nl6PVHFeDu9V3fcR8sx2T9bbgcA0tvlTfKxwedi+b4nxcqFSJUypMO1fm/9y/+65+oP4cFcmzaXst2b+76jre5cowU3BLlGFh6i0jp6MD9cjfsDUMFLDQ1RrsyNlQuZ6jOxxuG6kBYjm5vVOToNhLlOPPFpssxIkw8VI5hUSpDmad155ev0aEyQo2UCiVo9LGH6nz/G0N1YCTH8dXqht1vu5sixzSr7MeSo0r4U3Q80kUpIsXD3e7V7aDTSwyV1J8/xVCdruf8/Gn3DwzV2UYGbs9Djk8kx3CiHL3fPK3ZP14lhspAhiRUxn/+yEN1nJ8+Vd4wVGeb5NiwvablNuxBZ0nL6uTBCSuUo4ry2vOQY5QoRQrVSn7f7FtdmhpThcrVDNUREX80VOdi/9tvkMjGyrHreU3Hbdx5TQc5PhM5RotSRCrn9bvvLif9yzQ1ZgqYyxmqM3m2/euXyjevGaqzaXJs2G7D8prOwPVmO9OayjFDBfh6yDFWlLlKsVjf9RqOdjzT1JgyVOrPLmeoztvfqv/2d/hlveXY8bym7d7cea12QI4KOT47OcaKUkTMs5rXcGhqzJonVzFU51Oj0rSKtT10s3ZydBuWN0qOXm+RHKPuSjvfO4gcly/HJFEaxXz5aL97dUdTY+pQGfnsUobqWN99YKjOWtBvu6PGauS4vnJMEqWIlI+r7rXlD2hqXFqofMBQne7nZvl1DRM9UzneWF7LdhvOsPdIcgzrDzmuTo4LRKnyRvm42vmtQVPjskJlxFAdbTNGDNWR8fUfpazvPpSPqjQ1Phc5Oq7XsNym5TXbqeQ4bzHkmN6Mq5XjAlGKSPlo3726G/YGNDWmcmVsqEw/VCfqEnmg/nw8aqLfZqjO08vRvbkbDZAZ9vrLkmPSs8jxeYhSlDLPas7PNDVmWHnHazR+qM5040mWoTrvGKqzcjnaXbdhjQbITOSoaXEVcgwaCjk+C1GKFOu73c80NT4gVAaG6iTXn0/eGz1UR8L1572e/ePl3j++wV9LlmPHvbFG954Y9gerkqOK1RZyfIaiFCWV87r17nNEqKT+PDlUzl/VkbmiSzW3rUTFDNWJqD933n+p/O41Q3UenZ7V8abJETlutxzTiVIkv28WqpXebSfc1BjwIKEyRf35ow/V6Q/sdxcHf2aozmPI8a49mj7oNh1/8JzlqJL8ghyfSpQiYp7WerdtmhrvFTCzD9VRGUqF2hfXld8dFfZ3MN195Hjb9pq227S8VnsmR/VwOWa5bI0cN0aUuUqxeLjr3Tizk2U0Nd4vVKYZqqMvt0P3P4/asNbbi/q//wPWS8nobOPoarU/HCJH5PhoohQR87Teazi+L+nqz2lqlMepP5d5S+p3ZxPxxf3Scr/ell4eIMF4Odpec+THLHJMM3rwHnJc6dBq5LhaURrFXOnooPv5lqbG1KEy8tkU9ecqoVRIxr+Bgld1rO8/lF4wVCcox9GdbluO13R8f6lynDPdE8sx5VxW5LgEUYpI+fjA/Xq3uKmR+vMFoTJmqE7k/c8Dm1HFbdKe1elc3phn2z1Ux/e1ZXUbOSLHpxGlyhnmSa394WZBUyP15wtCpe7QqKE6swgZtcsqP+rvUNa7i/JxXeWMrZNj0/aajndre03H933kiByfWJQiUnq11726G3p96s/vGSrTDNUJnPCavxWbPoBsuqn9Qddzfr3a/f3x5rtx6Pdattd03Jbdaz22HJMHyGynHDmlk1WU46bGv35hqE7mUJlqqI6ay5NKc2Lw2DNEhoETmvZPHytvXhqFDRyq4w/98Zq65XhNZ/ZvHskxzdDqzZfjQvchx5WJUqRY33E/l/ptj6E6qUJltqE6ftStKpNPXGoPDIb2D5f73/7Npshx6DUdrzW6JtMOyFGWLMdQ+QFyhKyiFBHzTd36/lO42Y7681QB836lQnMBU+ZqiUREpP3b18o3R+s7VMcfDr2G7bVGfnTCpwhXJke1yHrIEVEufvVu+aFNjdSfpykVCm2ryAX4bJ2uRMT3fevdRe1f/7BOchwMJ3U8ttdyYkcPIkfkuF6iFBHzrN67vcjW1Ej9efr689BVHT9+AT6X3LtXLa9pF2u7z12ODXu8rL5tI0fkuJmizJmF0os999rO0NQYPlaoP08IlZFXdfzow2L2ZcY/DOvdxeF//PHZybE/GJ1zdJtW77aDHJPkqBJ+3SLH9RGliJRPat7NqDiDpsYUrowNlcH7n89f1YldgE+yp6FkKGJMC4yU13K6V83yUe05yNEddcg07d7dM5NjWHnIEZYgSqOYK73e736iqTHDyjteo8FSIf2qTuQC3BAZjkKoIf5w7EptW1rvLksvq8p4gs077A3Ga+qG1bO6z1SO6W/miBzhIaKUUVPjF8sfDKNDJUN15L73Pw9f1Znr/Q4MB5+40p891+96ncvryvnL1cmxaXktx72x+va95BipsOcjx8iCodhHkCOi1H9YhmGeVtvvbxiqc89QqT+uX9XRV9kSOl85f01n4srgfYasnz6ZJ4fLa2ocev1RcnRvrL7jPliOyfpDjshxbUUpIqWX+93PNDU+LFSGr+pol3RmN8tQEZNzAtvUCE3gGfYH9s+f9/7u5JHl2LS9lu3e3PUdb3PlGCk45IgoH5CSKud1+6crmhozh8rYUiGJuALuT9waKvLXD8vpacrJV3V+u668eZkrFR4kR7fntZzR9MGk5Dj7IW66HDM3ViNHRClSqFXyu+W+49LUmCpULqw/n52v1BQ5lWicK31/dppy8rvH933rp0/Vb9/cQ47jq9UNu99xZ4f4essxzSpbHv9Ot8gRUY4wz2uTpkaG6mQNmHOlQn7UAlz54Qs7IVcG3Dv7Q+fL7c6bTmHPXPi9DNye13S8huW17H7b1ZSBHJEjPIYo87vlQq3Sa3VmKqSp8R6hMm4BHnalRNSl6i+Y3p1IfBGxfv5c//Pv4uVoew3bbdqDjheQVHTJ4T3kmDw4YYVyXPaMBOSIKBdSOa/ftmhqzJwno6/qBG5bqbkyMLtR34b+7IZDoYpLEbfhuA2rVN8by7Hb824d98bybp1Bx5t9O0aiGZEjckSUD/8SRqlQernvfrVoakwdKuMX4PrJyqkrRb+wo4JfR81uODTa/sGvb/18NewN3IbttZxBtzdbwgc2+JwdFg4IfCo5Pu10LeSIKB9C+aTqXds0NaZ1ZdiX+gJcb9QJXdgJVlDOb9vRm6a6FBFfem2v9fYymBxV2kM94tQeckSOiPLeobKQKx8fdD625k60BYfq0NSYECrDJyun6+6QK0OnI/3oe/3q21i/FJT8XUVLBDkiR0T5SJRe77tf74a9UFNjqFSIpsa4qzrzJyujXCnapZvITTp/qPvpv71I6aiox5EjIMr7ScAwyie19q/XNDVmzpZqbvLirPt7Oh9CM2Zoy0X3R4Zaxf3Uv5OCsRE5Ikd4RFGKSOnFnnt1O+jS1Jg+VCYswOdPUPpzGTNmXHCEOpPjpcoSLddcjsxlhacVpSgxz+r2jzQ1Zg+VSa6crMFFLV50BxTpz+zmJ4XPVJXYyBEQ5WNRqNLUeI9QGXOyMuTK8MnfuWip/6ZRWc5ORhong/KQIyDKjJhv6tZ3H2lqzBoow96cd2WgpD8mWs4uefsRN4PwY34pxW1w5AiwJFHmd0rF+o7XbM9USFNjQqiMWIAvdKXMluH65vK1tfZ8okzeqir+NCVyBES5jC9qntW8Znsy44X684wL8EhXytwNMvRoGfKgbszxFpbQzX1jFZbsF+QIiPKxMEqF0qs994vFUJ2MC/B4V4pEREuRsC4jN52f5JwFZrnnABnkCIgyTag8qXnXtj9M2dQYbcstCpULXSnaHXxlWnMuc7oMGsX3M+tj4RocOQKifDQJ5I3y8UHnohldKkSozOpK0frBJVQ5pOlS9FtVSubfPCpGUQ8dPYgcAVHGUDo6cL9Mmhpj68+3u6kxzRp8asD5O5+Pe70lcNc1mX6F+Y2ZchGeYroWcoRtwljiIW8o87Quvj+7R4M/f7j6SYex72/+TyDigkniale0e+uq0dvVOLaryVPjDwl/hP4c8Ro19xF8o/4WCb5+9r1GvTL0rAT/6oSNE/76AJuVKEWkeLjbvboddHo0NWZYgEtUIXooWkpw9NjsKdHauhde5k7e1CRHgOUnytGBYZ7WFoVK2fZQuSBXqnAg0x8MpMtgxgy8LOYjIujNBdJlJ8dQhgXYtkQpo6bGfbNvdWlqvE+uFO2E48J0Of29otKGxiyxbmEwZC4rkCgfQOW8LuKPrzzot2zwCZUp9JFwJTpw2jEqnakUNzOP/EgbDO+bHAEQZYhcpVis7wZU6M970E+6roMrVUhMc6aKE1WcCiOElXipBzkColw25lltoj9/NlMwOVT62/ozidNKxFnFOMup+LOSUR+RV8kFOQKsVpRGMV8+2g/ob0Go3OIFeEK0DGfKeGNlUuXC9yNHQJSroXxcVTmlCTE5VMpWh8rkaJlkzIWliemEmuaLIUdAlI9/1OeN8nE1tlSIUHk/XUqKip+kRXf6jIkcAVGuJlQe7RvFvCZBP6BE349alfMzChrqvhkxmxCRI8BTiVKUMs9qNDU+jjGXpy0qwAGeUpQixfpurlJcFCp9QuV9jJZeahlqhgBg5aIUJeZ5zJ0yqD9fhjpRIcD6iVKksG8WqpVAqMxafw4AsNmiFBHztEZTIwAgyiRylWLxcFdzIE2NAIAoI0JlXSndkjQ1AgCiDP3FxVzp6CCgP5oaAQBRhigfH6RqauSqDgBsrShVzjBPaoubGoVQCQDbKkoRKb3aM0oFTYLUnwMAogynSmWeVhmqAwCIMoni4W5+pxQIlT6hEgAQZRDzTbCpcapD6s8BAFGOyO+WH9rUiCsBYLNFKSLmWfZJjbgRALZKlDmzUHqxp+kvRahkAQ4AWyVKESmf1JRKP1SHUAkA2ydKo5grvWZSIwAgyuRQeXygckZsqGSoDgAgSmUYKerPaWoEgC0WpYiUXu7T1AgAiDI5VUolbqhONIRKANg2UYoUapX8bjkQKmlqBABEGcI8n95+jaE6AIAoo8jvlgu1SkCFNDUCAKIMUTmnqREAEGXyd1YqlF7q9ec0NQIAopyjfFKlqREAEGXiN1fIlY8jJzX6MaGSqzoAsGWiFJHS632jMN/UKDQ1AgCiHKMMo5wwqTGNJgmVALDZohSR0ou9nElTIwAgyqRUKeYZTY0AgCgTKVRpagQARLkIbVIjTY0AgCijyO+UivWdgAppagQARBkOlWe1if6oPwcARBn5vZYKpVd7Af0xVAcAEGU4VJ7UlJG+qVEIlQCwdaJUeaN8fBBbKkSoBABEKSKlowOjmNMkSFMjACDKUKg0lHlap6kRABBlEsXD3VyluChUUn8OAFssSlFintZoagQARJlEoVrJ75uBUElTIwAgyhDa+G+aGgEAUUaRqxSLh7sBFdLUCACIMgRNjQCAKBd998V8+Wg/oD+aGgEAUYYoH1dVjqZGAECU8ai8UT6u0tQIAIgyMVQe7RvFvCZBmhoBAFGGU6Uyz5jUCACIMpFinaZGAECUC0KlmOcxd8qg/hwAEOWIwr5ZqFYCoTJr/TkAwGaLUkTM09qsSIimRgBAlPPMmhoj1900NQIAohQR87SulG5JmhoBAFGG/j3FXOnoIKA/mhoBAFGGKB8fpGpq5KoOAGytKFXOME9qi5sahVAJANsqShEpvdozSgVNgtSfAwCiDKdKZZ5WGaoDAIgyieLhbn6nFAiVDNUBAEQZwnwTbGqc6pD6cwBAlCPyu+WHNjXiSgDYbFGKiHlWz9zUiBsBYKtEmTMLpRd7mv5ShEoW4ACwVaIUkfJJTan0Q3UIlQCwfaI0irnSayY1AgCiTA6VxwcqZ8SGSobqAACiVIaRov6cpkYA2GJRikjp5T5NjQCAKJNTpVTihupEQ6gEgG0TpUihVsnvlgOhkqZGAECUIczz6e3XGKoDAIgyivxuuVCrBFRIUyMAIMoQlXOaGgEAUSb/g0uF0ku9/pymRgBAlHOUT6o0NQIAokz8Nxdy5ePISY1+TKjkqg4Aotw+Sq/3jcJ8U6PQ1AgAiHKMMoxywqTGNJokVAIgys0PlS/2ciZNjQCAKJNSpZhnNDUCAKJMpFClqREAEOUitEmNNDUCAKKMIr9TKtZ3AiqkqREAEGU4VJ7VJvqj/hwAEGXkJigVSi/3AvpjqA4AIMpwqDytKSN9U6MQKgEQ5dah8kb5+CC2VIhQCYAoQURKRwdGMadJkKZGAECUoVBpKPO0TlMjACDKJIqHu7lKcVGopP4cAFFudaoU87RGUyMAIMokCtVKft8MhEqaGgEQJZsghDb+m6ZGAECUUeQqxeLhbkCFNDUCIEoIQVMjACDKRRulmC8f7Qf0R1MjAKKEEOXjqsrR1AgAiDIelTfKx1WaGgEAUSaGyqN9o5jXJEhTIwCihHCqVOYZkxoBAFEmUqzT1AgAiHJBqBTzPOZOGdSfAyBKGFHYNwvVSiBUZq0/BwBEufGYp7VZkRBNjQCIEuaZNTVGrrtpagRAlCAi5mldKd2SNDUCIEoIbaZirnR0ENAfTY0AiBJClI8PUjU1clUHAFFuLSpnmCe1xU2NQqgEQJRbTOnVnlEqaBKk/hwAUUI4VSrztMpQHQBECUkUD3dzO6VAqGSoDgCihBCVN8GmxqkOqT8HQJQwIr9bfmhTI64EQJQbj3lWz9zUiBsBEOVWkTMLpRd7mv5ShEoW4ACIctson9SUSj9Uh1AJgCi3cMMVc6XXTGoEQJSQHCqPD1TOiA2VDNUBQJSgDCNF/TlNjQCIcrspvaSpEQBRwoJUqSpxQ3WiIVQCIMrto1Cr5HfLgVBJUyMAooQQ5vn09msM1QFAlBBFfrdcqFUCKqSpEQBRQojKOU2NAIgSkrdjqVB6qdef09QIgChhjvJJlaZGAEQJiZuykCsfR05q9GNCJVd1ABDl9lF6vW8U5psahaZGAEQJY5RhlBMmNabRJKESAFFufqh8sZczaWoEQJSQlCrFPKOpEQBRQiKFKk2NAIgSFmHOJjXS1AiAKCGK/E6pWN8JqJCmRgBECeFQeVab6I/6cwBECZFbtlQovdwL6I+hOgCIEsKh8rSmjPRNjUKoBECUW4fKG+Xjg9hSIUIlAKIEESkdHRjFnCZBmhoBECWEQqWhzNM6TY0AiBKSKB7u5irFRaGS+nMARLnVqVLM0xpNjQCIEpIoVCv5fTMQKmlqBECUEEIb/01TIwCihChylWLxcDegQpoaARAlhDBPaWoEQJSQvK1L+fLRfkB/NDUCrAP/PwBHvvRZvCMd4gAAAABJRU5ErkJggg=="

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "85efa900c0fc12fee15a5398deba06e8.png";

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "bf471ec3d4085883e061ca35006e86e8.png";

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_reflect_metadata__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_reflect_metadata___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_reflect_metadata__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_zone_js__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_zone_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_zone_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bootstrap__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_bootstrap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_dynamic__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_app_browser_module__ = __webpack_require__(18);






if (true) {
    module.hot.accept();
    module.hot.dispose(function () {
        // Before restarting the app, we create a new root element and dispose the old one
        var oldRootElem = document.querySelector('app');
        var newRootElem = document.createElement('app');
        oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
        modulePromise.then(function (appModule) { return appModule.destroy(); });
    });
}
else {
    enableProdMode();
}
// Note: @ng-tools/webpack looks for the following expression when performing production
// builds. Don't change how this line looks, otherwise you may break tree-shaking.
var modulePromise = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_dynamic__["platformBrowserDynamic"])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_5__app_app_browser_module__["a" /* AppModule */]);


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: ''
};
if (true) {
  var querystring = __webpack_require__(42);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }
  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  connect();
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(44);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(52);
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(53);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
      } else {
        if (reporter) {
          if (obj.warnings.length > 0) {
            reporter.problems('warnings', obj);
          } else {
            reporter.cleanProblemsCache();
          }
          reporter.success();
        }
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    }
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?path=__webpack_hmr&dynamicPublicPath=true", __webpack_require__(54)(module)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(45);

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* unused harmony export getBaseUrl */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_shared_module__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_app_app_component__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            bootstrap: [__WEBPACK_IMPORTED_MODULE_3__components_app_app_component__["a" /* AppComponent */]],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["BrowserModule"],
                __WEBPACK_IMPORTED_MODULE_2__app_shared_module__["a" /* AppModuleShared */]
            ],
            providers: [
                { provide: 'BASE_URL', useFactory: getBaseUrl }
            ]
        })
    ], AppModule);
    return AppModule;
}());

function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModuleShared; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_app_app_component__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_navmenu_navmenu_component__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_home_home_component__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_custform_custform_component__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_profile_profile_component__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_excuse_excuse_component__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_Awesome_awe_component__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};












var AppModuleShared = (function () {
    function AppModuleShared() {
    }
    AppModuleShared = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__components_app_app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_6__components_navmenu_navmenu_component__["a" /* NavMenuComponent */],
                __WEBPACK_IMPORTED_MODULE_7__components_home_home_component__["a" /* HomeComponent */],
                __WEBPACK_IMPORTED_MODULE_8__components_custform_custform_component__["a" /* CustformComponent */],
                __WEBPACK_IMPORTED_MODULE_9__components_profile_profile_component__["a" /* ProfileComponent */],
                __WEBPACK_IMPORTED_MODULE_11__components_Awesome_awe_component__["a" /* AwesomeComponent */],
                __WEBPACK_IMPORTED_MODULE_10__components_excuse_excuse_component__["a" /* ExcuseComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["HttpModule"],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_4__angular_router__["RouterModule"].forRoot([
                    { path: '', redirectTo: 'home', pathMatch: 'full' },
                    { path: 'home', component: __WEBPACK_IMPORTED_MODULE_7__components_home_home_component__["a" /* HomeComponent */] },
                    { path: 'custform', component: __WEBPACK_IMPORTED_MODULE_8__components_custform_custform_component__["a" /* CustformComponent */] },
                    { path: 'custform/:id', component: __WEBPACK_IMPORTED_MODULE_8__components_custform_custform_component__["a" /* CustformComponent */] },
                    { path: 'profile', component: __WEBPACK_IMPORTED_MODULE_9__components_profile_profile_component__["a" /* ProfileComponent */] },
                    { path: 'excuse', component: __WEBPACK_IMPORTED_MODULE_10__components_excuse_excuse_component__["a" /* ExcuseComponent */] },
                    { path: 'awesome', component: __WEBPACK_IMPORTED_MODULE_11__components_Awesome_awe_component__["a" /* AwesomeComponent */] },
                    { path: '**', redirectTo: 'home' }
                ])
            ],
        })
    ], AppModuleShared);
    return AppModuleShared;
}());



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AwesomeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(3);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AwesomeComponent = (function () {
    function AwesomeComponent(http, router) {
        this.http = http;
        this.router = router;
    }
    AwesomeComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'awesome',
            template: __webpack_require__(33),
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"], __WEBPACK_IMPORTED_MODULE_2__angular_router__["Router"]])
    ], AwesomeComponent);
    return AwesomeComponent;
}());



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustformComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__custform_custFormConst__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_config_service__ = __webpack_require__(4);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CustformComponent = (function () {
    function CustformComponent(http, router, activeRoute) {
        this.http = http;
        this.router = router;
        this.activeRoute = activeRoute;
        this.model = new __WEBPACK_IMPORTED_MODULE_2__custform_custFormConst__["a" /* CustformConstructor */](0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
    }
    CustformComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.id = this.activeRoute.snapshot.params['id'];
        if (this.id > 0) {
            this.http.get(__WEBPACK_IMPORTED_MODULE_4__app_config_service__["a" /* Config */].url + "appoint/byid/" + this.id).subscribe(function (res) {
                console.log(res.json());
                _this.isEdit = true;
                _this.model = res.json().data;
                var result = _this.model.appoint.split("T");
                _this.model.appointDate = result[0];
                _this.model.appointTime = result[1];
            });
        }
        else {
            this.http.get(__WEBPACK_IMPORTED_MODULE_4__app_config_service__["a" /* Config */].url + "profile/").subscribe(function (res) {
                console.log(res.json());
                var comp = res.json().dataList[0];
                if (res.json().dataList.length > 0) {
                    _this.model.compName = comp.compName;
                    _this.model.compEmail = comp.email;
                }
                else {
                    _this.showGuide = true;
                }
            });
        }
    };
    CustformComponent.prototype.onSubmit = function () {
        var _this = this;
        this.model.state = this.model.state.toUpperCase();
        this.model.appoint = this.model.appointDate + "T" + this.model.appointTime;
        this.http.post(__WEBPACK_IMPORTED_MODULE_4__app_config_service__["a" /* Config */].url + "appoint/", this.model).subscribe(function (res) {
            _this.router.navigate(['/home']);
        });
    };
    CustformComponent.prototype.onEdit = function () {
        var _this = this;
        this.model.state = this.model.state.toUpperCase();
        this.model.appoint = this.model.appointDate + "T" + this.model.appointTime;
        this.http.put(__WEBPACK_IMPORTED_MODULE_4__app_config_service__["a" /* Config */].url + "appoint/" + this.model.id, this.model).subscribe(function (res) {
            _this.router.navigate(['/home']);
        });
    };
    CustformComponent.prototype.onDelete = function () {
        var _this = this;
        this.http.delete(__WEBPACK_IMPORTED_MODULE_4__app_config_service__["a" /* Config */].url + "appoint/" + this.model.id).subscribe(function (res) {
            _this.router.navigate(['/home']);
        });
    };
    CustformComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'custform',
            template: __webpack_require__(35),
            styles: [__webpack_require__(5)]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"], __WEBPACK_IMPORTED_MODULE_3__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_3__angular_router__["ActivatedRoute"]])
    ], CustformComponent);
    return CustformComponent;
}());



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExcuseComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__excuseConst__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_config_service__ = __webpack_require__(4);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ExcuseComponent = (function () {
    function ExcuseComponent(http, router) {
        this.http = http;
        this.router = router;
        this.model = new __WEBPACK_IMPORTED_MODULE_2__excuseConst__["a" /* ExcuseConst */]('', '');
    }
    ExcuseComponent.prototype.onExcuse = function () {
        var _this = this;
        this.http.get(__WEBPACK_IMPORTED_MODULE_4__app_config_service__["a" /* Config */].url + "excuse/").subscribe(function (res) {
            _this.model = res.json();
        });
    };
    ExcuseComponent.prototype.onSend = function () {
        this.isDone = true;
    };
    ExcuseComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'excuse',
            template: __webpack_require__(36),
            styles: [__webpack_require__(5)]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"], __WEBPACK_IMPORTED_MODULE_3__angular_router__["Router"]])
    ], ExcuseComponent);
    return ExcuseComponent;
}());



/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExcuseConst; });
var ExcuseConst = (function () {
    function ExcuseConst(excuse, image) {
        this.excuse = excuse;
        this.image = image;
    }
    return ExcuseConst;
}());



/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__custform_custFormConst__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_config_service__ = __webpack_require__(4);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var HomeComponent = (function () {
    function HomeComponent(http, router) {
        var _this = this;
        this.http = http;
        this.router = router;
        this.model = new __WEBPACK_IMPORTED_MODULE_2__custform_custFormConst__["a" /* CustformConstructor */](0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
        this.http.get(__WEBPACK_IMPORTED_MODULE_4__app_config_service__["a" /* Config */].url + 'appoint/').subscribe(function (res) {
            console.log(res.json());
            _this.appoint = res.json().dataList;
        }, function (error) { return console.error(error); });
    }
    HomeComponent.prototype.edit = function (data) {
        this.router.navigate(['/custform', data.id]);
    };
    HomeComponent.prototype.pastAppoint = function () {
        var _this = this;
        this.http.get(__WEBPACK_IMPORTED_MODULE_4__app_config_service__["a" /* Config */].url + 'appoint/past').subscribe(function (res) {
            console.log(res.json());
            _this.appoint = res.json().dataList;
        });
    };
    HomeComponent.prototype.upcomAppoint = function () {
        var _this = this;
        this.http.get(__WEBPACK_IMPORTED_MODULE_4__app_config_service__["a" /* Config */].url + 'appoint/').subscribe(function (res) {
            console.log(res.json());
            _this.appoint = res.json().dataList;
        });
    };
    HomeComponent.prototype.onFileSelected = function (event) {
        console.log(event);
        this.fileSelected = event.target.files[0];
        var fd = new FormData();
        fd.append('image', this.fileSelected, this.fileSelected.name);
        this.http.post('', fd).subscribe(function (res) {
            console.log(res.json());
        });
    };
    HomeComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'home',
            template: __webpack_require__(37),
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"], __WEBPACK_IMPORTED_MODULE_3__angular_router__["Router"]])
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavMenuComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var NavMenuComponent = (function () {
    function NavMenuComponent() {
    }
    NavMenuComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'nav-menu',
            template: __webpack_require__(38),
            styles: [__webpack_require__(45)]
        })
    ], NavMenuComponent);
    return NavMenuComponent;
}());



/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__profile_profileConst__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_config_service__ = __webpack_require__(4);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ProfileComponent = (function () {
    function ProfileComponent(http, router) {
        var _this = this;
        this.http = http;
        this.router = router;
        this.model = new __WEBPACK_IMPORTED_MODULE_2__profile_profileConst__["a" /* ProfileConst */](0, '', '', '', '', '', '', '', '', '', '', '');
        this.http.get(__WEBPACK_IMPORTED_MODULE_4__app_config_service__["a" /* Config */].url + "profile/").subscribe(function (res) {
            console.log(res.json());
            res.json().dataList.length > 0 ? _this.isUpt = true : _this.isUpt = false;
            if (res.json().dataList.length > 0) {
                _this.model = res.json().dataList[0];
            }
        });
    }
    ProfileComponent.prototype.editProf = function () {
        this.isEdit = !this.isEdit;
    };
    ProfileComponent.prototype.onSubmit = function () {
        var _this = this;
        this.http.post(__WEBPACK_IMPORTED_MODULE_4__app_config_service__["a" /* Config */].url + "profile/", this.model).subscribe(function (res) {
            console.log(res);
            _this.isEdit = false;
            _this.isUpt = true;
        });
    };
    ProfileComponent.prototype.onEdit = function () {
        var _this = this;
        this.http.put(__WEBPACK_IMPORTED_MODULE_4__app_config_service__["a" /* Config */].url + "profile/" + this.model.id, this.model).subscribe(function (res) {
            console.log(res);
            _this.isEdit = false;
        });
    };
    ProfileComponent.prototype.onDelete = function () {
        var _this = this;
        this.http.delete(__WEBPACK_IMPORTED_MODULE_4__app_config_service__["a" /* Config */].url + "profile/" + this.model.id).subscribe(function (res) {
            console.log(res);
            _this.isEdit = false;
            _this.isUpt = false;
            _this.model = new __WEBPACK_IMPORTED_MODULE_2__profile_profileConst__["a" /* ProfileConst */](0, '', '', '', '', '', '', '', '', '', '', '');
        });
    };
    ProfileComponent.prototype.onCoffee = function () {
        this.coffee = !this.coffee;
    };
    ProfileComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'profile',
            template: __webpack_require__(39),
            styles: [__webpack_require__(5)]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["Http"], __WEBPACK_IMPORTED_MODULE_3__angular_router__["Router"]])
    ], ProfileComponent);
    return ProfileComponent;
}());



/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileConst; });
var ProfileConst = (function () {
    function ProfileConst(id, userId, compName, fName, lName, street, city, state, zip, email, phone, modifiedBy) {
        this.id = id;
        this.userId = userId;
        this.compName = compName;
        this.fName = fName;
        this.lName = lName;
        this.street = street;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.email = email;
        this.phone = phone;
        this.modifiedBy = modifiedBy;
    }
    return ProfileConst;
}());



/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)(undefined);
// imports


// module
exports.push([module.i, "\r\n    \r\n    h1,\r\n    h2,\r\n    h3,\r\n    h4,\r\n    h5,\r\n    h6 {\r\n      font-weight: 100;\r\n    }\r\n    h1 {\r\n      font-size: 30px;\r\n    }\r\n    h2 {\r\n      font-size: 24px;\r\n    }\r\n    h3 {\r\n      font-size: 16px;\r\n    }\r\n    h4 {\r\n      font-size: 14px;\r\n    }\r\n    h5 {\r\n      font-size: 12px;\r\n    }\r\n    h6 {\r\n      font-size: 10px;\r\n    }\r\n    h3,\r\n    h4,\r\n    h5 {\r\n      margin-top: 5px;\r\n      font-weight: 600;\r\n    }\r\n    .nav > li > a {\r\n      color: #a7b1c2;\r\n      font-weight: 600;\r\n      padding: 14px 20px 14px 25px;\r\n    }\r\n    .nav.navbar-right > li > a {\r\n      color: #999c9e;\r\n    }\r\n    .nav > li.active > a {\r\n      color: #ffffff;\r\n    }\r\n    .navbar-default .nav > li > a:hover,\r\n    .navbar-default .nav > li > a:focus {\r\n      background-color: #293846;\r\n      color: white;\r\n    }\r\n    .nav .open > a,\r\n    .nav .open > a:hover,\r\n    .nav .open > a:focus {\r\n      background: #fff;\r\n    }\r\n    .nav.navbar-top-links > li > a:hover,\r\n    .nav.navbar-top-links > li > a:focus {\r\n      background-color: transparent;\r\n    }\r\n    .nav > li > a i {\r\n      margin-right: 6px;\r\n    }\r\n    .navbar {\r\n      border: 0;\r\n    }\r\n    .navbar-default {\r\n      background-color: transparent;\r\n      border-color: #2f4050;\r\n    }\r\n    .navbar-top-links li {\r\n      display: inline-block;\r\n    }\r\n    .navbar-top-links li:last-child {\r\n      margin-right: 40px;\r\n    }\r\n    .body-small .navbar-top-links li:last-child {\r\n      margin-right: 0;\r\n    }\r\n    .navbar-top-links li a {\r\n      padding: 20px 10px;\r\n      min-height: 50px;\r\n    }\r\n    .dropdown-menu {\r\n      border: medium none;\r\n      border-radius: 3px;\r\n      box-shadow: 0 0 3px rgba(86, 96, 117, 0.7);\r\n      display: none;\r\n      float: left;\r\n      font-size: 12px;\r\n      left: 0;\r\n      list-style: none outside none;\r\n      padding: 0;\r\n      position: absolute;\r\n      text-shadow: none;\r\n      top: 100%;\r\n      z-index: 1000;\r\n    }\r\n    .dropdown-menu > li > a {\r\n      border-radius: 3px;\r\n      color: inherit;\r\n      line-height: 25px;\r\n      margin: 4px;\r\n      text-align: left;\r\n      font-weight: normal;\r\n    }\r\n    .dropdown-menu > .active > a,\r\n    .dropdown-menu > .active > a:focus,\r\n    .dropdown-menu > .active > a:hover {\r\n      color: #fff;\r\n      text-decoration: none;\r\n      background-color: #1ab394;\r\n      outline: 0;\r\n    }\r\n    .dropdown-menu > li > a.font-bold {\r\n      font-weight: 600;\r\n    }\r\n    .navbar-top-links .dropdown-menu li {\r\n      display: block;\r\n    }\r\n    .navbar-top-links .dropdown-menu li:last-child {\r\n      margin-right: 0;\r\n    }\r\n    .navbar-top-links .dropdown-menu li a {\r\n      padding: 3px 20px;\r\n      min-height: 0;\r\n    }\r\n    .navbar-top-links .dropdown-menu li a div {\r\n      white-space: normal;\r\n    }\r\n    .navbar-top-links .dropdown-messages,\r\n    .navbar-top-links .dropdown-tasks,\r\n    .navbar-top-links .dropdown-alerts {\r\n      width: 310px;\r\n      min-width: 0;\r\n    }\r\n    .navbar-top-links .dropdown-messages {\r\n      margin-left: 5px;\r\n    }\r\n    .navbar-top-links .dropdown-tasks {\r\n      margin-left: -59px;\r\n    }\r\n    .navbar-top-links .dropdown-alerts {\r\n      margin-left: -123px;\r\n    }\r\n    .navbar-top-links .dropdown-user {\r\n      right: 0;\r\n      left: auto;\r\n    }\r\n    .dropdown-messages,\r\n    .dropdown-alerts {\r\n      padding: 10px 10px 10px 10px;\r\n    }\r\n    .dropdown-messages li a,\r\n    .dropdown-alerts li a {\r\n      font-size: 12px;\r\n    }\r\n    .dropdown-messages li em,\r\n    .dropdown-alerts li em {\r\n      font-size: 10px;\r\n    }\r\n    .nav.navbar-top-links .dropdown-alerts a {\r\n      font-size: 12px;\r\n    }\r\n    .nav-header {\r\n      padding: 33px 25px;\r\n      background-color: #2f4050;\r\n      background-image: url(" + __webpack_require__(50) + ");\r\n    }\r\n    .pace-done .nav-header {\r\n      transition: all 0.4s;\r\n    }\r\n    ul.nav-second-level {\r\n      background: #293846;\r\n    }\r\n    .nav > li.active {\r\n      border-left: 4px solid #f77032;\r\n      background: #293846;\r\n    }\r\n    .nav.nav-second-level > li.active {\r\n      border: none;\r\n    }\r\n    .nav.nav-second-level.collapse[style] {\r\n      height: auto !important;\r\n    }\r\n    .nav-header a {\r\n      color: #DFE4ED;\r\n    }\r\n    .nav-header .text-muted {\r\n      color: #8095a8;\r\n    }\r\n    .minimalize-styl-2 {\r\n      padding: 4px 12px;\r\n      margin: 14px 5px 5px 20px;\r\n      font-size: 14px;\r\n      float: left;\r\n    }\r\n    .navbar-form-custom {\r\n      float: left;\r\n      height: 50px;\r\n      padding: 0;\r\n      width: 200px;\r\n      display: block;\r\n    }\r\n    .navbar-form-custom .form-group {\r\n      margin-bottom: 0;\r\n    }\r\n    .nav.navbar-top-links a {\r\n      font-size: 14px;\r\n    }\r\n    .navbar-form-custom .form-control {\r\n      background: none repeat scroll 0 0 rgba(0, 0, 0, 0);\r\n      border: medium none;\r\n      font-size: 14px;\r\n      height: 60px;\r\n      margin: 0;\r\n      z-index: 2000;\r\n    }\r\n    .count-info .label {\r\n      line-height: 12px;\r\n      padding: 2px 5px;\r\n      position: absolute;\r\n      right: 6px;\r\n      top: 12px;\r\n    }\r\n    .arrow {\r\n      float: right;\r\n    }\r\n    .fa.arrow:before {\r\n      content: \"\\F104\";\r\n    }\r\n    .active > a > .fa.arrow:before {\r\n      content: \"\\F107\";\r\n    }\r\n    .nav-second-level li,\r\n    .nav-third-level li {\r\n      border-bottom: none !important;\r\n    }\r\n    .nav-second-level li a {\r\n      padding: 7px 10px 7px 10px;\r\n      padding-left: 52px;\r\n    }\r\n    .nav-third-level li a {\r\n      padding-left: 62px;\r\n    }\r\n    .nav-second-level li:last-child {\r\n      margin-bottom: 10px;\r\n    }\r\n    body:not(.fixed-sidebar):not(.canvas-menu).mini-navbar .nav li:hover > .nav-second-level,\r\n    .mini-navbar .nav li:focus > .nav-second-level {\r\n      display: block;\r\n      border-radius: 0 2px 2px 0;\r\n      min-width: 140px;\r\n      height: auto;\r\n    }\r\n    body.mini-navbar .navbar-default .nav > li > .nav-second-level li a {\r\n      font-size: 12px;\r\n      border-radius: 3px;\r\n    }\r\n    .fixed-nav .slimScrollDiv #side-menu {\r\n      padding-bottom: 60px;\r\n    }\r\n    .mini-navbar .nav-second-level li a {\r\n      padding: 10px 10px 10px 15px;\r\n    }\r\n    .mini-navbar .nav .nav-second-level {\r\n      position: absolute;\r\n      left: 70px;\r\n      top: 0;\r\n      background-color: #2f4050;\r\n      padding: 10px 10px 10px 10px;\r\n      font-size: 12px;\r\n    }\r\n    .canvas-menu.mini-navbar .nav-second-level {\r\n      background: #293846;\r\n    }\r\n    .mini-navbar li.active .nav-second-level {\r\n      left: 65px;\r\n    }\r\n    .navbar-default .special_link a {\r\n      background: #1ab394;\r\n      color: white;\r\n    }\r\n    .navbar-default .special_link a:hover {\r\n      background: #17987e !important;\r\n      color: white;\r\n    }\r\n    .navbar-default .special_link a span.label {\r\n      background: #fff;\r\n      color: #1ab394;\r\n    }\r\n    .navbar-default .landing_link a {\r\n      background: #1cc09f;\r\n      color: white;\r\n    }\r\n    .navbar-default .landing_link a:hover {\r\n      background: #1ab394 !important;\r\n      color: white;\r\n    }\r\n    .navbar-default .landing_link a span.label {\r\n      background: #fff;\r\n      color: #1cc09f;\r\n    }\r\n    .logo-element {\r\n      text-align: center;\r\n      font-size: 18px;\r\n      font-weight: 600;\r\n      color: white;\r\n      display: none;\r\n      padding: 18px 0;\r\n    }\r\n    .pace-done .navbar-static-side,\r\n    .pace-done .nav-header,\r\n    .pace-done li.active,\r\n    .pace-done #page-wrapper,\r\n    .pace-done .footer {\r\n      -webkit-transition: all 0.4s;\r\n      -moz-transition: all 0.4s;\r\n      -o-transition: all 0.4s;\r\n      transition: all 0.4s;\r\n    }\r\n    .navbar-fixed-top {\r\n      background: #fff;\r\n      transition-duration: 0.4s;\r\n      border-bottom: 1px solid #e7eaec !important;\r\n      z-index: 2030;\r\n    }\r\n    .navbar-fixed-top,\r\n    .navbar-static-top {\r\n      background: #f3f3f4;\r\n    }\r\n    .fixed-nav #wrapper {\r\n      margin-top: 0;\r\n    }\r\n    .nav-tabs > li.active > a,\r\n    .nav-tabs > li.active > a:hover,\r\n    .nav-tabs > li.active > a:focus {\r\n      -moz-border-bottom-colors: none;\r\n      -moz-border-left-colors: none;\r\n      -moz-border-right-colors: none;\r\n      -moz-border-top-colors: none;\r\n      background: none;\r\n      border-color: #dddddd #dddddd rgba(0, 0, 0, 0);\r\n      border-bottom: #f3f3f4;\r\n      border-image: none;\r\n      border-style: solid;\r\n      border-width: 1px;\r\n      color: #555555;\r\n      cursor: default;\r\n    }\r\n    .nav.nav-tabs li {\r\n      background: none;\r\n      border: none;\r\n    }\r\n    body.fixed-nav #wrapper .navbar-static-side,\r\n    body.fixed-nav #wrapper #page-wrapper {\r\n      margin-top: 60px;\r\n    }\r\n    body.top-navigation.fixed-nav #wrapper #page-wrapper {\r\n      margin-top: 0;\r\n    }\r\n    body.fixed-nav.fixed-nav-basic .navbar-fixed-top {\r\n      left: 220px;\r\n    }\r\n    body.fixed-nav.fixed-nav-basic.mini-navbar .navbar-fixed-top {\r\n      left: 70px;\r\n    }\r\n    body.fixed-nav.fixed-nav-basic.fixed-sidebar.mini-navbar .navbar-fixed-top {\r\n      left: 0;\r\n    }\r\n    body.fixed-nav.fixed-nav-basic #wrapper .navbar-static-side {\r\n      margin-top: 0;\r\n    }\r\n    body.fixed-nav.fixed-nav-basic.body-small .navbar-fixed-top {\r\n      left: 0;\r\n    }\r\n    body.fixed-nav.fixed-nav-basic.fixed-sidebar.mini-navbar.body-small .navbar-fixed-top {\r\n      left: 220px;\r\n    }\r\n    .fixed-nav .minimalize-styl-2 {\r\n      margin: 14px 5px 5px 15px;\r\n    }\r\n    .body-small .navbar-fixed-top {\r\n      margin-left: 0;\r\n    }\r\n    body.mini-navbar .navbar-static-side {\r\n      width: 70px;\r\n    }\r\n    body.mini-navbar .profile-element,\r\n    body.mini-navbar .nav-label,\r\n    body.mini-navbar .navbar-default .nav li a span {\r\n      display: none;\r\n    }\r\n    body.canvas-menu .profile-element {\r\n      display: block;\r\n    }\r\n    body:not(.fixed-sidebar):not(.canvas-menu).mini-navbar .nav-second-level {\r\n      display: none;\r\n    }\r\n    body.mini-navbar .navbar-default .nav > li > a {\r\n      font-size: 16px;\r\n    }\r\n    body.mini-navbar .logo-element {\r\n      display: block;\r\n    }\r\n    body.canvas-menu .logo-element {\r\n      display: none;\r\n    }\r\n    body.mini-navbar .nav-header {\r\n      padding: 0;\r\n      background-color: #1ab394;\r\n    }\r\n    body.canvas-menu .nav-header {\r\n      padding: 33px 25px;\r\n    }\r\n    body.mini-navbar #page-wrapper {\r\n      margin: 0 0 0 70px;\r\n    }\r\n    body.fixed-sidebar.mini-navbar .footer,\r\n    body.canvas-menu.mini-navbar .footer {\r\n      margin: 0 0 0 0 !important;\r\n    }\r\n    body.canvas-menu.mini-navbar #page-wrapper,\r\n    body.canvas-menu.mini-navbar .footer {\r\n      margin: 0 0 0 0;\r\n    }\r\n    body.fixed-sidebar .navbar-static-side,\r\n    body.canvas-menu .navbar-static-side {\r\n      position: fixed;\r\n      width: 220px;\r\n      z-index: 2001;\r\n      height: 100%;\r\n    }\r\n    body.fixed-sidebar.mini-navbar .navbar-static-side {\r\n      width: 0;\r\n    }\r\n    body.fixed-sidebar.mini-navbar #page-wrapper {\r\n      margin: 0 0 0 0;\r\n    }\r\n    body.body-small.fixed-sidebar.mini-navbar #page-wrapper {\r\n      margin: 0 0 0 220px;\r\n    }\r\n    body.body-small.fixed-sidebar.mini-navbar .navbar-static-side {\r\n      width: 220px;\r\n    }\r\n    .fixed-sidebar.mini-navbar .nav li:focus > .nav-second-level,\r\n    .canvas-menu.mini-navbar .nav li:focus > .nav-second-level {\r\n      display: block;\r\n      height: auto;\r\n    }\r\n    body.fixed-sidebar.mini-navbar .navbar-default .nav > li > .nav-second-level li a {\r\n      font-size: 12px;\r\n      border-radius: 3px;\r\n    }\r\n    body.canvas-menu.mini-navbar .navbar-default .nav > li > .nav-second-level li a {\r\n      font-size: 13px;\r\n      border-radius: 3px;\r\n    }\r\n    .fixed-sidebar.mini-navbar .nav-second-level li a,\r\n    .canvas-menu.mini-navbar .nav-second-level li a {\r\n      padding: 10px 10px 10px 15px;\r\n    }\r\n    .fixed-sidebar.mini-navbar .nav-second-level,\r\n    .canvas-menu.mini-navbar .nav-second-level {\r\n      position: relative;\r\n      padding: 0;\r\n      font-size: 13px;\r\n    }\r\n    .fixed-sidebar.mini-navbar li.active .nav-second-level,\r\n    .canvas-menu.mini-navbar li.active .nav-second-level {\r\n      left: 0;\r\n    }\r\n    body.fixed-sidebar.mini-navbar .navbar-default .nav > li > a,\r\n    body.canvas-menu.mini-navbar .navbar-default .nav > li > a {\r\n      font-size: 13px;\r\n    }\r\n    body.fixed-sidebar.mini-navbar .nav-label,\r\n    body.fixed-sidebar.mini-navbar .navbar-default .nav li a span,\r\n    body.canvas-menu.mini-navbar .nav-label,\r\n    body.canvas-menu.mini-navbar .navbar-default .nav li a span {\r\n      display: inline;\r\n    }\r\n    body.canvas-menu.mini-navbar .navbar-default .nav li .profile-element a span {\r\n      display: block;\r\n    }\r\n    .canvas-menu.mini-navbar .nav-second-level li a,\r\n    .fixed-sidebar.mini-navbar .nav-second-level li a {\r\n      padding: 7px 10px 7px 52px;\r\n    }\r\n    .fixed-sidebar.mini-navbar .nav-second-level,\r\n    .canvas-menu.mini-navbar .nav-second-level {\r\n      left: 0;\r\n    }\r\n    body.canvas-menu nav.navbar-static-side {\r\n      z-index: 2001;\r\n      background: #2f4050;\r\n      height: 100%;\r\n      position: fixed;\r\n      display: none;\r\n    }\r\n    body.canvas-menu.mini-navbar nav.navbar-static-side {\r\n      display: block;\r\n      width: 220px;\r\n    }\r\n    .top-navigation #page-wrapper {\r\n      margin-left: 0;\r\n    }\r\n    .top-navigation .navbar-nav .dropdown-menu > .active > a {\r\n      background: white;\r\n      color: #1ab394;\r\n      font-weight: bold;\r\n    }\r\n    .white-bg .navbar-fixed-top,\r\n    .white-bg .navbar-static-top {\r\n      background: #fff;\r\n    }\r\n    .top-navigation .navbar {\r\n      margin-bottom: 0;\r\n    }\r\n    .top-navigation .nav > li > a {\r\n      padding: 15px 20px;\r\n      color: #676a6c;\r\n    }\r\n    .top-navigation .nav > li a:hover,\r\n    .top-navigation .nav > li a:focus {\r\n      background: #fff;\r\n      color: #1ab394;\r\n    }\r\n    .top-navigation .navbar .nav > li.active {\r\n      background: #fff;\r\n      border: none;\r\n    }\r\n    .top-navigation .nav > li.active > a {\r\n      color: #1ab394;\r\n    }\r\n    .top-navigation .navbar-right {\r\n      margin-right: 10px;\r\n    }\r\n    .top-navigation .navbar-nav .dropdown-menu {\r\n      box-shadow: none;\r\n      border: 1px solid #e7eaec;\r\n    }\r\n    .top-navigation .dropdown-menu > li > a {\r\n      margin: 0;\r\n      padding: 7px 20px;\r\n    }\r\n    .navbar .dropdown-menu {\r\n      margin-top: 0;\r\n    }\r\n    .top-navigation .navbar-brand {\r\n      background: #1ab394;\r\n      color: #fff;\r\n      padding: 15px 25px;\r\n    }\r\n    .top-navigation .navbar-top-links li:last-child {\r\n      margin-right: 0;\r\n    }\r\n    .top-navigation.mini-navbar #page-wrapper,\r\n    .top-navigation.body-small.fixed-sidebar.mini-navbar #page-wrapper,\r\n    .mini-navbar .top-navigation #page-wrapper,\r\n    .body-small.fixed-sidebar.mini-navbar .top-navigation #page-wrapper,\r\n    .canvas-menu #page-wrapper {\r\n      margin: 0;\r\n    }\r\n    .top-navigation.fixed-nav #wrapper,\r\n    .fixed-nav #wrapper.top-navigation {\r\n      margin-top: 50px;\r\n    }\r\n    .top-navigation .footer.fixed {\r\n      margin-left: 0 !important;\r\n    }\r\n    .top-navigation .wrapper.wrapper-content {\r\n      padding: 40px;\r\n    }\r\n    .top-navigation.body-small .wrapper.wrapper-content,\r\n    .body-small .top-navigation .wrapper.wrapper-content {\r\n      padding: 40px 0 40px 0;\r\n    }\r\n    .navbar-toggle {\r\n      background-color: #f45003;\r\n      color: #fff;\r\n      padding: 6px 12px;\r\n      font-size: 14px;\r\n    }\r\n    .top-navigation .navbar-nav .open .dropdown-menu > li > a,\r\n    .top-navigation .navbar-nav .open .dropdown-menu .dropdown-header {\r\n      padding: 10px 15px 10px 20px;\r\n    }\r\n    @media (max-width: 768px) {\r\n      .top-navigation .navbar-header {\r\n        display: block;\r\n        float: none;\r\n      }\r\n    }\r\n    .menu-visible-lg,\r\n    .menu-visible-md {\r\n      display: none !important;\r\n    }\r\n    @media (min-width: 1200px) {\r\n      .menu-visible-lg {\r\n        display: block !important;\r\n      }\r\n    }\r\n    @media (min-width: 992px) {\r\n      .menu-visible-md {\r\n        display: block !important;\r\n      }\r\n    }\r\n    @media (max-width: 767px) {\r\n      .menu-visible-md {\r\n        display: block !important;\r\n      }\r\n      .menu-visible-lg {\r\n        display: block !important;\r\n      }\r\n    }\r\n    .btn {\r\n      border-radius: 3px;\r\n    }\r\n    .float-e-margins .btn {\r\n      margin-bottom: 5px;\r\n    }\r\n    .btn-w-m {\r\n      min-width: 120px;\r\n    }\r\n    .btn-primary.btn-outline {\r\n      color: #f77032;\r\n    }\r\n    .btn-success.btn-outline {\r\n      color: #1c84c6;\r\n    }\r\n    .btn-info.btn-outline {\r\n      color: #23c6c8;\r\n    }\r\n    .btn-warning.btn-outline {\r\n      color: #f8ac59;\r\n    }\r\n    .btn-danger.btn-outline {\r\n      color: #ed5565;\r\n    }\r\n    .btn-primary.btn-outline:hover,\r\n    .btn-success.btn-outline:hover,\r\n    .btn-info.btn-outline:hover,\r\n    .btn-warning.btn-outline:hover,\r\n    .btn-danger.btn-outline:hover {\r\n      color: #fff;\r\n    }\r\n    .btn-primary {\r\n      background-color: #f77032;\r\n      border-color: #f77032;\r\n      color: #FFFFFF;\r\n    }\r\n    .btn-primary:hover,\r\n    .btn-primary:focus,\r\n    .btn-primary:active,\r\n    .btn-primary.active,\r\n    .open .dropdown-toggle.btn-primary,\r\n    .btn-primary:active:focus,\r\n    .btn-primary:active:hover,\r\n    .btn-primary.active:hover,\r\n    .btn-primary.active:focus {\r\n      background-color: #fd580b;\r\n      border-color: #fd580b;\r\n      color: #FFFFFF;\r\n    }\r\n    .btn-primary:active,\r\n    .btn-primary.active,\r\n    .open .dropdown-toggle.btn-primary {\r\n      background-image: none;\r\n    }\r\n    .btn-primary.disabled,\r\n    .btn-primary.disabled:hover,\r\n    .btn-primary.disabled:focus,\r\n    .btn-primary.disabled:active,\r\n    .btn-primary.disabled.active,\r\n    .btn-primary[disabled],\r\n    .btn-primary[disabled]:hover,\r\n    .btn-primary[disabled]:focus,\r\n    .btn-primary[disabled]:active,\r\n    .btn-primary.active[disabled],\r\n    fieldset[disabled] .btn-primary,\r\n    fieldset[disabled] .btn-primary:hover,\r\n    fieldset[disabled] .btn-primary:focus,\r\n    fieldset[disabled] .btn-primary:active,\r\n    fieldset[disabled] .btn-primary.active {\r\n      background-color: #f77032;\r\n      border-color: #f77032;\r\n    }\r\n    .btn-success {\r\n      background-color: #1c84c6;\r\n      border-color: #1c84c6;\r\n      color: #FFFFFF;\r\n    }\r\n    .btn-success:hover,\r\n    .btn-success:focus,\r\n    .btn-success:active,\r\n    .btn-success.active,\r\n    .open .dropdown-toggle.btn-success,\r\n    .btn-success:active:focus,\r\n    .btn-success:active:hover,\r\n    .btn-success.active:hover,\r\n    .btn-success.active:focus {\r\n      background-color: #1a7bb9;\r\n      border-color: #1a7bb9;\r\n      color: #FFFFFF;\r\n    }\r\n    .btn-success:active,\r\n    .btn-success.active,\r\n    .open .dropdown-toggle.btn-success {\r\n      background-image: none;\r\n    }\r\n    .btn-success.disabled,\r\n    .btn-success.disabled:hover,\r\n    .btn-success.disabled:focus,\r\n    .btn-success.disabled:active,\r\n    .btn-success.disabled.active,\r\n    .btn-success[disabled],\r\n    .btn-success[disabled]:hover,\r\n    .btn-success[disabled]:focus,\r\n    .btn-success[disabled]:active,\r\n    .btn-success.active[disabled],\r\n    fieldset[disabled] .btn-success,\r\n    fieldset[disabled] .btn-success:hover,\r\n    fieldset[disabled] .btn-success:focus,\r\n    fieldset[disabled] .btn-success:active,\r\n    fieldset[disabled] .btn-success.active {\r\n      background-color: #1f90d8;\r\n      border-color: #1f90d8;\r\n    }\r\n    .btn-info {\r\n      background-color: #23c6c8;\r\n      border-color: #23c6c8;\r\n      color: #FFFFFF;\r\n    }\r\n    .btn-info:hover,\r\n    .btn-info:focus,\r\n    .btn-info:active,\r\n    .btn-info.active,\r\n    .open .dropdown-toggle.btn-info,\r\n    .btn-info:active:focus,\r\n    .btn-info:active:hover,\r\n    .btn-info.active:hover,\r\n    .btn-info.active:focus {\r\n      background-color: #21b9bb;\r\n      border-color: #21b9bb;\r\n      color: #FFFFFF;\r\n    }\r\n    .btn-info:active,\r\n    .btn-info.active,\r\n    .open .dropdown-toggle.btn-info {\r\n      background-image: none;\r\n    }\r\n    .btn-info.disabled,\r\n    .btn-info.disabled:hover,\r\n    .btn-info.disabled:focus,\r\n    .btn-info.disabled:active,\r\n    .btn-info.disabled.active,\r\n    .btn-info[disabled],\r\n    .btn-info[disabled]:hover,\r\n    .btn-info[disabled]:focus,\r\n    .btn-info[disabled]:active,\r\n    .btn-info.active[disabled],\r\n    fieldset[disabled] .btn-info,\r\n    fieldset[disabled] .btn-info:hover,\r\n    fieldset[disabled] .btn-info:focus,\r\n    fieldset[disabled] .btn-info:active,\r\n    fieldset[disabled] .btn-info.active {\r\n      background-color: #26d7d9;\r\n      border-color: #26d7d9;\r\n    }\r\n    .btn-default {\r\n      color: inherit;\r\n      background: white;\r\n      border: 1px solid #e7eaec;\r\n    }\r\n    .btn-default:hover,\r\n    .btn-default:focus,\r\n    .btn-default:active,\r\n    .btn-default.active,\r\n    .open .dropdown-toggle.btn-default,\r\n    .btn-default:active:focus,\r\n    .btn-default:active:hover,\r\n    .btn-default.active:hover,\r\n    .btn-default.active:focus {\r\n      color: inherit;\r\n      border: 1px solid #d2d2d2;\r\n    }\r\n    .btn-default:active,\r\n    .btn-default.active,\r\n    .open .dropdown-toggle.btn-default {\r\n      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15) inset;\r\n    }\r\n    .btn-default.disabled,\r\n    .btn-default.disabled:hover,\r\n    .btn-default.disabled:focus,\r\n    .btn-default.disabled:active,\r\n    .btn-default.disabled.active,\r\n    .btn-default[disabled],\r\n    .btn-default[disabled]:hover,\r\n    .btn-default[disabled]:focus,\r\n    .btn-default[disabled]:active,\r\n    .btn-default.active[disabled],\r\n    fieldset[disabled] .btn-default,\r\n    fieldset[disabled] .btn-default:hover,\r\n    fieldset[disabled] .btn-default:focus,\r\n    fieldset[disabled] .btn-default:active,\r\n    fieldset[disabled] .btn-default.active {\r\n      color: #cacaca;\r\n    }\r\n    .btn-warning {\r\n      background-color: #f8ac59;\r\n      border-color: #f8ac59;\r\n      color: #FFFFFF;\r\n    }\r\n    .btn-warning:hover,\r\n    .btn-warning:focus,\r\n    .btn-warning:active,\r\n    .btn-warning.active,\r\n    .open .dropdown-toggle.btn-warning,\r\n    .btn-warning:active:focus,\r\n    .btn-warning:active:hover,\r\n    .btn-warning.active:hover,\r\n    .btn-warning.active:focus {\r\n      background-color: #f7a54a;\r\n      border-color: #f7a54a;\r\n      color: #FFFFFF;\r\n    }\r\n    .btn-warning:active,\r\n    .btn-warning.active,\r\n    .open .dropdown-toggle.btn-warning {\r\n      background-image: none;\r\n    }\r\n    .btn-warning.disabled,\r\n    .btn-warning.disabled:hover,\r\n    .btn-warning.disabled:focus,\r\n    .btn-warning.disabled:active,\r\n    .btn-warning.disabled.active,\r\n    .btn-warning[disabled],\r\n    .btn-warning[disabled]:hover,\r\n    .btn-warning[disabled]:focus,\r\n    .btn-warning[disabled]:active,\r\n    .btn-warning.active[disabled],\r\n    fieldset[disabled] .btn-warning,\r\n    fieldset[disabled] .btn-warning:hover,\r\n    fieldset[disabled] .btn-warning:focus,\r\n    fieldset[disabled] .btn-warning:active,\r\n    fieldset[disabled] .btn-warning.active {\r\n      background-color: #f9b66d;\r\n      border-color: #f9b66d;\r\n    }\r\n    .btn-danger {\r\n      background-color: #ed5565;\r\n      border-color: #ed5565;\r\n      color: #FFFFFF;\r\n    }\r\n    .btn-danger:hover,\r\n    .btn-danger:focus,\r\n    .btn-danger:active,\r\n    .btn-danger.active,\r\n    .open .dropdown-toggle.btn-danger,\r\n    .btn-danger:active:focus,\r\n    .btn-danger:active:hover,\r\n    .btn-danger.active:hover,\r\n    .btn-danger.active:focus {\r\n      background-color: #ec4758;\r\n      border-color: #ec4758;\r\n      color: #FFFFFF;\r\n    }\r\n    .btn-danger:active,\r\n    .btn-danger.active,\r\n    .open .dropdown-toggle.btn-danger {\r\n      background-image: none;\r\n    }\r\n    .btn-danger.disabled,\r\n    .btn-danger.disabled:hover,\r\n    .btn-danger.disabled:focus,\r\n    .btn-danger.disabled:active,\r\n    .btn-danger.disabled.active,\r\n    .btn-danger[disabled],\r\n    .btn-danger[disabled]:hover,\r\n    .btn-danger[disabled]:focus,\r\n    .btn-danger[disabled]:active,\r\n    .btn-danger.active[disabled],\r\n    fieldset[disabled] .btn-danger,\r\n    fieldset[disabled] .btn-danger:hover,\r\n    fieldset[disabled] .btn-danger:focus,\r\n    fieldset[disabled] .btn-danger:active,\r\n    fieldset[disabled] .btn-danger.active {\r\n      background-color: #ef6776;\r\n      border-color: #ef6776;\r\n    }\r\n    .btn-link {\r\n      color: inherit;\r\n    }\r\n    .btn-link:hover,\r\n    .btn-link:focus,\r\n    .btn-link:active,\r\n    .btn-link.active,\r\n    .open .dropdown-toggle.btn-link {\r\n      color: #1ab394;\r\n      text-decoration: none;\r\n    }\r\n    .btn-link:active,\r\n    .btn-link.active,\r\n    .open .dropdown-toggle.btn-link {\r\n      background-image: none;\r\n    }\r\n    .btn-link.disabled,\r\n    .btn-link.disabled:hover,\r\n    .btn-link.disabled:focus,\r\n    .btn-link.disabled:active,\r\n    .btn-link.disabled.active,\r\n    .btn-link[disabled],\r\n    .btn-link[disabled]:hover,\r\n    .btn-link[disabled]:focus,\r\n    .btn-link[disabled]:active,\r\n    .btn-link.active[disabled],\r\n    fieldset[disabled] .btn-link,\r\n    fieldset[disabled] .btn-link:hover,\r\n    fieldset[disabled] .btn-link:focus,\r\n    fieldset[disabled] .btn-link:active,\r\n    fieldset[disabled] .btn-link.active {\r\n      color: #cacaca;\r\n    }\r\n    .btn-white {\r\n      color: inherit;\r\n      background: white;\r\n      border: 1px solid #e7eaec;\r\n    }\r\n    .btn-white:hover,\r\n    .btn-white:focus,\r\n    .btn-white:active,\r\n    .btn-white.active,\r\n    .open .dropdown-toggle.btn-white,\r\n    .btn-white:active:focus,\r\n    .btn-white:active:hover,\r\n    .btn-white.active:hover,\r\n    .btn-white.active:focus {\r\n      color: inherit;\r\n      border: 1px solid #d2d2d2;\r\n    }\r\n    .btn-white:active,\r\n    .btn-white.active {\r\n      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15) inset;\r\n    }\r\n    .btn-white:active,\r\n    .btn-white.active,\r\n    .open .dropdown-toggle.btn-white {\r\n      background-image: none;\r\n    }\r\n    .btn-white.disabled,\r\n    .btn-white.disabled:hover,\r\n    .btn-white.disabled:focus,\r\n    .btn-white.disabled:active,\r\n    .btn-white.disabled.active,\r\n    .btn-white[disabled],\r\n    .btn-white[disabled]:hover,\r\n    .btn-white[disabled]:focus,\r\n    .btn-white[disabled]:active,\r\n    .btn-white.active[disabled],\r\n    fieldset[disabled] .btn-white,\r\n    fieldset[disabled] .btn-white:hover,\r\n    fieldset[disabled] .btn-white:focus,\r\n    fieldset[disabled] .btn-white:active,\r\n    fieldset[disabled] .btn-white.active {\r\n      color: #cacaca;\r\n    }\r\n    .form-control,\r\n    .form-control:focus,\r\n    .has-error .form-control:focus,\r\n    .has-success .form-control:focus,\r\n    .has-warning .form-control:focus,\r\n    .navbar-collapse,\r\n    .navbar-form,\r\n    .navbar-form-custom .form-control:focus,\r\n    .navbar-form-custom .form-control:hover,\r\n    .open .btn.dropdown-toggle,\r\n    .panel,\r\n    .popover,\r\n    .progress,\r\n    .progress-bar {\r\n      box-shadow: none;\r\n    }\r\n    .btn-outline {\r\n      color: inherit;\r\n      background-color: transparent;\r\n      transition: all .5s;\r\n    }\r\n    .btn-rounded {\r\n      border-radius: 50px;\r\n    }\r\n    .btn-large-dim {\r\n      width: 90px;\r\n      height: 90px;\r\n      font-size: 42px;\r\n    }\r\n    button.dim {\r\n      display: inline-block;\r\n      text-decoration: none;\r\n      text-transform: uppercase;\r\n      text-align: center;\r\n      padding-top: 6px;\r\n      margin-right: 10px;\r\n      position: relative;\r\n      cursor: pointer;\r\n      border-radius: 5px;\r\n      font-weight: 600;\r\n      margin-bottom: 20px !important;\r\n    }\r\n    button.dim:active {\r\n      top: 3px;\r\n    }\r\n    button.btn-primary.dim {\r\n      box-shadow: inset 0 0 0 #16987e, 0 5px 0 0 #16987e, 0 10px 5px #999999;\r\n    }\r\n    button.btn-primary.dim:active {\r\n      box-shadow: inset 0 0 0 #16987e, 0 2px 0 0 #16987e, 0 5px 3px #999999;\r\n    }\r\n    button.btn-default.dim {\r\n      box-shadow: inset 0 0 0 #b3b3b3, 0 5px 0 0 #b3b3b3, 0 10px 5px #999999;\r\n    }\r\n    button.btn-default.dim:active {\r\n      box-shadow: inset 0 0 0 #b3b3b3, 0 2px 0 0 #b3b3b3, 0 5px 3px #999999;\r\n    }\r\n    button.btn-warning.dim {\r\n      box-shadow: inset 0 0 0 #f79d3c, 0 5px 0 0 #f79d3c, 0 10px 5px #999999;\r\n    }\r\n    button.btn-warning.dim:active {\r\n      box-shadow: inset 0 0 0 #f79d3c, 0 2px 0 0 #f79d3c, 0 5px 3px #999999;\r\n    }\r\n    button.btn-info.dim {\r\n      box-shadow: inset 0 0 0 #1eacae, 0 5px 0 0 #1eacae, 0 10px 5px #999999;\r\n    }\r\n    button.btn-info.dim:active {\r\n      box-shadow: inset 0 0 0 #1eacae, 0 2px 0 0 #1eacae, 0 5px 3px #999999;\r\n    }\r\n    button.btn-success.dim {\r\n      box-shadow: inset 0 0 0 #1872ab, 0 5px 0 0 #1872ab, 0 10px 5px #999999;\r\n    }\r\n    button.btn-success.dim:active {\r\n      box-shadow: inset 0 0 0 #1872ab, 0 2px 0 0 #1872ab, 0 5px 3px #999999;\r\n    }\r\n    button.btn-danger.dim {\r\n      box-shadow: inset 0 0 0 #ea394c, 0 5px 0 0 #ea394c, 0 10px 5px #999999;\r\n    }\r\n    button.btn-danger.dim:active {\r\n      box-shadow: inset 0 0 0 #ea394c, 0 2px 0 0 #ea394c, 0 5px 3px #999999;\r\n    }\r\n    button.dim:before {\r\n      font-size: 50px;\r\n      line-height: 1em;\r\n      font-weight: normal;\r\n      color: #fff;\r\n      display: block;\r\n      padding-top: 10px;\r\n    }\r\n    button.dim:active:before {\r\n      top: 7px;\r\n      font-size: 50px;\r\n    }\r\n    .btn:focus {\r\n      outline: none !important;\r\n    }\r\n    .label {\r\n      background-color: #d1dade;\r\n      color: #5e5e5e;\r\n      font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;\r\n      font-weight: 600;\r\n      padding: 3px 8px;\r\n      text-shadow: none;\r\n    }\r\n    .nav .label,\r\n    .ibox .label {\r\n      font-size: 10px;\r\n    }\r\n    .badge {\r\n      background-color: #d1dade;\r\n      color: #5e5e5e;\r\n      font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;\r\n      font-size: 11px;\r\n      font-weight: 600;\r\n      padding-bottom: 4px;\r\n      padding-left: 6px;\r\n      padding-right: 6px;\r\n      text-shadow: none;\r\n    }\r\n    .label-primary,\r\n    .badge-primary {\r\n      background-color: #1ab394;\r\n      color: #FFFFFF;\r\n    }\r\n    .label-success,\r\n    .badge-success {\r\n      background-color: #1c84c6;\r\n      color: #FFFFFF;\r\n    }\r\n    .label-warning,\r\n    .badge-warning {\r\n      background-color: #f8ac59;\r\n      color: #FFFFFF;\r\n    }\r\n    .label-warning-light,\r\n    .badge-warning-light {\r\n      background-color: #f8ac59;\r\n      color: #ffffff;\r\n    }\r\n    .label-danger,\r\n    .badge-danger {\r\n      background-color: #ed5565;\r\n      color: #FFFFFF;\r\n    }\r\n    .label-info,\r\n    .badge-info {\r\n      background-color: #23c6c8;\r\n      color: #FFFFFF;\r\n    }\r\n    .label-inverse,\r\n    .badge-inverse {\r\n      background-color: #262626;\r\n      color: #FFFFFF;\r\n    }\r\n    .label-white,\r\n    .badge-white {\r\n      background-color: #FFFFFF;\r\n      color: #5E5E5E;\r\n    }\r\n    .label-white,\r\n    .badge-disable {\r\n      background-color: #2A2E36;\r\n      color: #8B91A0;\r\n    }\r\n    /* TOOGLE SWICH */\r\n    .onoffswitch {\r\n      position: relative;\r\n      width: 64px;\r\n      -webkit-user-select: none;\r\n      -moz-user-select: none;\r\n      -ms-user-select: none;\r\n    }\r\n    .onoffswitch-checkbox {\r\n      display: none;\r\n    }\r\n    .onoffswitch-label {\r\n      display: block;\r\n      overflow: hidden;\r\n      cursor: pointer;\r\n      border: 2px solid #1ab394;\r\n      border-radius: 2px;\r\n    }\r\n    .onoffswitch-inner {\r\n      width: 200%;\r\n      margin-left: -100%;\r\n      -moz-transition: margin 0.3s ease-in 0s;\r\n      -webkit-transition: margin 0.3s ease-in 0s;\r\n      -o-transition: margin 0.3s ease-in 0s;\r\n      transition: margin 0.3s ease-in 0s;\r\n    }\r\n    .onoffswitch-inner:before,\r\n    .onoffswitch-inner:after {\r\n      float: left;\r\n      width: 50%;\r\n      height: 20px;\r\n      padding: 0;\r\n      line-height: 20px;\r\n      font-size: 12px;\r\n      color: white;\r\n      font-family: Trebuchet, Arial, sans-serif;\r\n      font-weight: bold;\r\n      -moz-box-sizing: border-box;\r\n      -webkit-box-sizing: border-box;\r\n      box-sizing: border-box;\r\n    }\r\n    .onoffswitch-inner:before {\r\n      content: \"ON\";\r\n      padding-left: 10px;\r\n      background-color: #1ab394;\r\n      color: #FFFFFF;\r\n    }\r\n    .onoffswitch-inner:after {\r\n      content: \"OFF\";\r\n      padding-right: 10px;\r\n      background-color: #FFFFFF;\r\n      color: #999999;\r\n      text-align: right;\r\n    }\r\n    .onoffswitch-switch {\r\n      width: 20px;\r\n      margin: 0;\r\n      background: #FFFFFF;\r\n      border: 2px solid #1ab394;\r\n      border-radius: 2px;\r\n      position: absolute;\r\n      top: 0;\r\n      bottom: 0;\r\n      right: 44px;\r\n      -moz-transition: all 0.3s ease-in 0s;\r\n      -webkit-transition: all 0.3s ease-in 0s;\r\n      -o-transition: all 0.3s ease-in 0s;\r\n      transition: all 0.3s ease-in 0s;\r\n    }\r\n    .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {\r\n      margin-left: 0;\r\n    }\r\n    .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {\r\n      right: 0;\r\n    }\r\n    .onoffswitch-checkbox:disabled + .onoffswitch-label .onoffswitch-inner:before {\r\n      background-color: #919191;\r\n    }\r\n    .onoffswitch-checkbox:disabled + .onoffswitch-label,\r\n    .onoffswitch-checkbox:disabled + .onoffswitch-label .onoffswitch-switch {\r\n      border-color: #919191;\r\n    }\r\n    /* CHOSEN PLUGIN */\r\n    .chosen-container-single .chosen-single {\r\n      background: #ffffff;\r\n      box-shadow: none;\r\n      -moz-box-sizing: border-box;\r\n      border-radius: 2px;\r\n      cursor: text;\r\n      height: auto !important;\r\n      margin: 0;\r\n      min-height: 30px;\r\n      overflow: hidden;\r\n      padding: 4px 12px;\r\n      position: relative;\r\n      width: 100%;\r\n    }\r\n    .chosen-container-multi .chosen-choices li.search-choice {\r\n      background: #f1f1f1;\r\n      border: 1px solid #e5e6e7;\r\n      border-radius: 2px;\r\n      box-shadow: none;\r\n      color: #333333;\r\n      cursor: default;\r\n      line-height: 13px;\r\n      margin: 3px 0 3px 5px;\r\n      padding: 3px 20px 3px 5px;\r\n      position: relative;\r\n    }\r\n    /* Tags Input Plugin */\r\n    .bootstrap-tagsinput {\r\n      border: 1px solid #e5e6e7;\r\n      box-shadow: none;\r\n    }\r\n    /* PAGINATIN */\r\n    .pagination > .active > a,\r\n    .pagination > .active > span,\r\n    .pagination > .active > a:hover,\r\n    .pagination > .active > span:hover,\r\n    .pagination > .active > a:focus,\r\n    .pagination > .active > span:focus {\r\n      background-color: #f4f4f4;\r\n      border-color: #DDDDDD;\r\n      color: inherit;\r\n      cursor: default;\r\n      z-index: 2;\r\n    }\r\n    .pagination > li > a,\r\n    .pagination > li > span {\r\n      background-color: #FFFFFF;\r\n      border: 1px solid #DDDDDD;\r\n      color: inherit;\r\n      float: left;\r\n      line-height: 1.42857;\r\n      margin-left: -1px;\r\n      padding: 4px 10px;\r\n      position: relative;\r\n      text-decoration: none;\r\n    }\r\n    /* TOOLTIPS */\r\n    .tooltip-inner {\r\n      background-color: #2F4050;\r\n    }\r\n    .tooltip.top .tooltip-arrow {\r\n      border-top-color: #2F4050;\r\n    }\r\n    .tooltip.right .tooltip-arrow {\r\n      border-right-color: #2F4050;\r\n    }\r\n    .tooltip.bottom .tooltip-arrow {\r\n      border-bottom-color: #2F4050;\r\n    }\r\n    .tooltip.left .tooltip-arrow {\r\n      border-left-color: #2F4050;\r\n    }\r\n    /* EASY PIE CHART*/\r\n    .easypiechart {\r\n      position: relative;\r\n      text-align: center;\r\n    }\r\n    .easypiechart .h2 {\r\n      margin-left: 10px;\r\n      margin-top: 10px;\r\n      display: inline-block;\r\n    }\r\n    .easypiechart canvas {\r\n      top: 0;\r\n      left: 0;\r\n    }\r\n    .easypiechart .easypie-text {\r\n      line-height: 1;\r\n      position: absolute;\r\n      top: 33px;\r\n      width: 100%;\r\n      z-index: 1;\r\n    }\r\n    .easypiechart img {\r\n      margin-top: -4px;\r\n    }\r\n    .jqstooltip {\r\n      -webkit-box-sizing: content-box;\r\n      -moz-box-sizing: content-box;\r\n      box-sizing: content-box;\r\n    }\r\n    /* FULLCALENDAR */\r\n    .fc-state-default {\r\n      background-color: #ffffff;\r\n      background-image: none;\r\n      background-repeat: repeat-x;\r\n      box-shadow: none;\r\n      color: #333333;\r\n      text-shadow: none;\r\n    }\r\n    .fc-state-default {\r\n      border: 1px solid;\r\n    }\r\n    .fc-button {\r\n      color: inherit;\r\n      border: 1px solid #e7eaec;\r\n      cursor: pointer;\r\n      display: inline-block;\r\n      height: 1.9em;\r\n      line-height: 1.9em;\r\n      overflow: hidden;\r\n      padding: 0 0.6em;\r\n      position: relative;\r\n      white-space: nowrap;\r\n    }\r\n    .fc-state-active {\r\n      background-color: #1ab394;\r\n      border-color: #1ab394;\r\n      color: #ffffff;\r\n    }\r\n    .fc-header-title h2 {\r\n      font-size: 16px;\r\n      font-weight: 600;\r\n      color: inherit;\r\n    }\r\n    .fc-content .fc-widget-header,\r\n    .fc-content .fc-widget-content {\r\n      border-color: #e7eaec;\r\n      font-weight: normal;\r\n    }\r\n    .fc-border-separate tbody {\r\n      background-color: #F8F8F8;\r\n    }\r\n    .fc-state-highlight {\r\n      background: none repeat scroll 0 0 #FCF8E3;\r\n    }\r\n    .external-event {\r\n      padding: 5px 10px;\r\n      border-radius: 2px;\r\n      cursor: pointer;\r\n      margin-bottom: 5px;\r\n    }\r\n    .fc-ltr .fc-event-hori.fc-event-end,\r\n    .fc-rtl .fc-event-hori.fc-event-start {\r\n      border-radius: 2px;\r\n    }\r\n    .fc-event,\r\n    .fc-agenda .fc-event-time,\r\n    .fc-event a {\r\n      padding: 4px 6px;\r\n      background-color: #1ab394;\r\n      /* background color */\r\n      border-color: #1ab394;\r\n      /* border color */\r\n    }\r\n    .fc-event-time,\r\n    .fc-event-title {\r\n      color: #717171;\r\n      padding: 0 1px;\r\n    }\r\n    .ui-calendar .fc-event-time,\r\n    .ui-calendar .fc-event-title {\r\n      color: #fff;\r\n    }\r\n    /* Chat */\r\n    .chat-activity-list .chat-element {\r\n      border-bottom: 1px solid #e7eaec;\r\n    }\r\n    .chat-element:first-child {\r\n      margin-top: 0;\r\n    }\r\n    .chat-element {\r\n      padding-bottom: 15px;\r\n    }\r\n    .chat-element,\r\n    .chat-element .media {\r\n      margin-top: 15px;\r\n    }\r\n    .chat-element,\r\n    .media-body {\r\n      overflow: hidden;\r\n    }\r\n    .chat-element .media-body {\r\n      display: block;\r\n      width: auto;\r\n    }\r\n    .chat-element > .pull-left {\r\n      margin-right: 10px;\r\n    }\r\n    .chat-element img.img-circle,\r\n    .dropdown-messages-box img.img-circle {\r\n      width: 38px;\r\n      height: 38px;\r\n    }\r\n    .chat-element .well {\r\n      border: 1px solid #e7eaec;\r\n      box-shadow: none;\r\n      margin-top: 10px;\r\n      margin-bottom: 5px;\r\n      padding: 10px 20px;\r\n      font-size: 11px;\r\n      line-height: 16px;\r\n    }\r\n    .chat-element .actions {\r\n      margin-top: 10px;\r\n    }\r\n    .chat-element .photos {\r\n      margin: 10px 0;\r\n    }\r\n    .right.chat-element > .pull-right {\r\n      margin-left: 10px;\r\n    }\r\n    .chat-photo {\r\n      max-height: 180px;\r\n      border-radius: 4px;\r\n      overflow: hidden;\r\n      margin-right: 10px;\r\n      margin-bottom: 10px;\r\n    }\r\n    .chat {\r\n      margin: 0;\r\n      padding: 0;\r\n      list-style: none;\r\n    }\r\n    .chat li {\r\n      margin-bottom: 10px;\r\n      padding-bottom: 5px;\r\n      border-bottom: 1px dotted #B3A9A9;\r\n    }\r\n    .chat li.left .chat-body {\r\n      margin-left: 60px;\r\n    }\r\n    .chat li.right .chat-body {\r\n      margin-right: 60px;\r\n    }\r\n    .chat li .chat-body p {\r\n      margin: 0;\r\n      color: #777777;\r\n    }\r\n    .panel .slidedown .glyphicon,\r\n    .chat .glyphicon {\r\n      margin-right: 5px;\r\n    }\r\n    .chat-panel .panel-body {\r\n      height: 350px;\r\n      overflow-y: scroll;\r\n    }\r\n    /* LIST GROUP */\r\n    a.list-group-item.active,\r\n    a.list-group-item.active:hover,\r\n    a.list-group-item.active:focus {\r\n      background-color: #1ab394;\r\n      border-color: #1ab394;\r\n      color: #FFFFFF;\r\n      z-index: 2;\r\n    }\r\n    .list-group-item-heading {\r\n      margin-top: 10px;\r\n    }\r\n    .list-group-item-text {\r\n      margin: 0 0 10px;\r\n      color: inherit;\r\n      font-size: 12px;\r\n      line-height: inherit;\r\n    }\r\n    .no-padding .list-group-item {\r\n      border-left: none;\r\n      border-right: none;\r\n      border-bottom: none;\r\n    }\r\n    .no-padding .list-group-item:first-child {\r\n      border-left: none;\r\n      border-right: none;\r\n      border-bottom: none;\r\n      border-top: none;\r\n    }\r\n    .no-padding .list-group {\r\n      margin-bottom: 0;\r\n    }\r\n    .list-group-item {\r\n      background-color: inherit;\r\n      border: 1px solid #e7eaec;\r\n      display: block;\r\n      margin-bottom: -1px;\r\n      padding: 10px 15px;\r\n      position: relative;\r\n    }\r\n    .elements-list .list-group-item {\r\n      border-left: none;\r\n      border-right: none;\r\n      padding: 15px 25px;\r\n    }\r\n    .elements-list .list-group-item:first-child {\r\n      border-left: none;\r\n      border-right: none;\r\n      border-top: none !important;\r\n    }\r\n    .elements-list .list-group {\r\n      margin-bottom: 0;\r\n    }\r\n    .elements-list a {\r\n      color: inherit;\r\n    }\r\n    .elements-list .list-group-item.active,\r\n    .elements-list .list-group-item:hover {\r\n      background: #f3f3f4;\r\n      color: inherit;\r\n      border-color: #e7eaec;\r\n      border-radius: 0;\r\n    }\r\n    .elements-list li.active {\r\n      transition: none;\r\n    }\r\n    .element-detail-box {\r\n      padding: 25px;\r\n    }\r\n    /* FLOT CHART  */\r\n    .flot-chart {\r\n      display: block;\r\n      height: 200px;\r\n    }\r\n    .widget .flot-chart.dashboard-chart {\r\n      display: block;\r\n      height: 120px;\r\n      margin-top: 40px;\r\n    }\r\n    .flot-chart.dashboard-chart {\r\n      display: block;\r\n      height: 180px;\r\n      margin-top: 40px;\r\n    }\r\n    .flot-chart-content {\r\n      width: 100%;\r\n      height: 100%;\r\n    }\r\n    .flot-chart-pie-content {\r\n      width: 200px;\r\n      height: 200px;\r\n      margin: auto;\r\n    }\r\n    .jqstooltip {\r\n      position: absolute;\r\n      display: block;\r\n      left: 0;\r\n      top: 0;\r\n      visibility: hidden;\r\n      background: #2b303a;\r\n      background-color: rgba(43, 48, 58, 0.8);\r\n      color: white;\r\n      text-align: left;\r\n      white-space: nowrap;\r\n      z-index: 10000;\r\n      padding: 5px 5px 5px 5px;\r\n      min-height: 22px;\r\n      border-radius: 3px;\r\n    }\r\n    .jqsfield {\r\n      color: white;\r\n      text-align: left;\r\n    }\r\n    .fh-150 {\r\n      height: 150px;\r\n    }\r\n    .fh-200 {\r\n      height: 200px;\r\n    }\r\n    .h-150 {\r\n      min-height: 150px;\r\n    }\r\n    .h-200 {\r\n      min-height: 200px;\r\n    }\r\n    .h-300 {\r\n      min-height: 300px;\r\n    }\r\n    .w-150 {\r\n      min-width: 150px;\r\n    }\r\n    .w-200 {\r\n      min-width: 200px;\r\n    }\r\n    .w-300 {\r\n      min-width: 300px;\r\n    }\r\n    .legendLabel {\r\n      padding-left: 5px;\r\n    }\r\n    .stat-list li:first-child {\r\n      margin-top: 0;\r\n    }\r\n    .stat-list {\r\n      list-style: none;\r\n      padding: 0;\r\n      margin: 0;\r\n    }\r\n    .stat-percent {\r\n      float: right;\r\n    }\r\n    .stat-list li {\r\n      margin-top: 15px;\r\n      position: relative;\r\n    }\r\n    /* DATATABLES */\r\n    table.dataTable thead .sorting,\r\n    table.dataTable thead .sorting_asc:after,\r\n    table.dataTable thead .sorting_desc,\r\n    table.dataTable thead .sorting_asc_disabled,\r\n    table.dataTable thead .sorting_desc_disabled {\r\n      background: transparent;\r\n    }\r\n    .dataTables_wrapper {\r\n      padding-bottom: 30px;\r\n    }\r\n    .dataTables_length {\r\n      float: left;\r\n    }\r\n    .dataTables_filter label {\r\n      margin-right: 5px;\r\n    }\r\n    .html5buttons {\r\n      float: right;\r\n    }\r\n    .html5buttons a {\r\n      border: 1px solid #e7eaec;\r\n      background: #fff;\r\n      color: #676a6c;\r\n      box-shadow: none;\r\n      padding: 6px 8px;\r\n      font-size: 12px;\r\n    }\r\n    .html5buttons a:hover,\r\n    .html5buttons a:focus:active {\r\n      background-color: #eee;\r\n      color: inherit;\r\n      border-color: #d2d2d2;\r\n    }\r\n    div.dt-button-info {\r\n      z-index: 100;\r\n    }\r\n    @media (max-width: 768px) {\r\n      .html5buttons {\r\n        float: none;\r\n        margin-top: 10px;\r\n      }\r\n      .dataTables_length {\r\n        float: none;\r\n      }\r\n    }\r\n    /* CIRCLE */\r\n    .img-circle {\r\n      border-radius: 50%;\r\n    }\r\n    .btn-circle {\r\n      width: 30px;\r\n      height: 30px;\r\n      padding: 6px 0;\r\n      border-radius: 15px;\r\n      text-align: center;\r\n      font-size: 12px;\r\n      line-height: 1.428571429;\r\n    }\r\n    .btn-circle.btn-lg {\r\n      width: 50px;\r\n      height: 50px;\r\n      padding: 10px 16px;\r\n      border-radius: 25px;\r\n      font-size: 18px;\r\n      line-height: 1.33;\r\n    }\r\n    .btn-circle.btn-xl {\r\n      width: 70px;\r\n      height: 70px;\r\n      padding: 10px 16px;\r\n      border-radius: 35px;\r\n      font-size: 24px;\r\n      line-height: 1.33;\r\n    }\r\n    .show-grid [class^=\"col-\"] {\r\n      padding-top: 10px;\r\n      padding-bottom: 10px;\r\n      border: 1px solid #ddd;\r\n      background-color: #eee !important;\r\n    }\r\n    .show-grid {\r\n      margin: 15px 0;\r\n    }\r\n    /* ANIMATION */\r\n    .css-animation-box h1 {\r\n      font-size: 44px;\r\n    }\r\n    .animation-efect-links a {\r\n      padding: 4px 6px;\r\n      font-size: 12px;\r\n    }\r\n    #animation_box {\r\n      background-color: #f9f8f8;\r\n      border-radius: 16px;\r\n      width: 80%;\r\n      margin: 0 auto;\r\n      padding-top: 80px;\r\n    }\r\n    .animation-text-box {\r\n      position: absolute;\r\n      margin-top: 40px;\r\n      left: 50%;\r\n      margin-left: -100px;\r\n      width: 200px;\r\n    }\r\n    .animation-text-info {\r\n      position: absolute;\r\n      margin-top: -60px;\r\n      left: 50%;\r\n      margin-left: -100px;\r\n      width: 200px;\r\n      font-size: 10px;\r\n    }\r\n    .animation-text-box h2 {\r\n      font-size: 54px;\r\n      font-weight: 600;\r\n      margin-bottom: 5px;\r\n    }\r\n    .animation-text-box p {\r\n      font-size: 12px;\r\n      text-transform: uppercase;\r\n    }\r\n    /* PEACE */\r\n    .pace {\r\n      -webkit-pointer-events: none;\r\n      pointer-events: none;\r\n      -webkit-user-select: none;\r\n      -moz-user-select: none;\r\n      user-select: none;\r\n    }\r\n    .pace-inactive {\r\n      display: none;\r\n    }\r\n    .pace .pace-progress {\r\n      background: #1ab394;\r\n      position: fixed;\r\n      z-index: 2040;\r\n      top: 0;\r\n      right: 100%;\r\n      width: 100%;\r\n      height: 2px;\r\n    }\r\n    .pace-inactive {\r\n      display: none;\r\n    }\r\n    /* WIDGETS */\r\n    .widget {\r\n      border-radius: 5px;\r\n      padding: 15px 20px;\r\n      margin-bottom: 10px;\r\n      margin-top: 10px;\r\n    }\r\n    .widget.style1 h2 {\r\n      font-size: 30px;\r\n    }\r\n    .widget h2,\r\n    .widget h3 {\r\n      margin-top: 5px;\r\n      margin-bottom: 0;\r\n    }\r\n    .widget-text-box {\r\n      padding: 20px;\r\n      border: 1px solid #e7eaec;\r\n      background: #ffffff;\r\n    }\r\n    .widget-head-color-box {\r\n      border-radius: 5px 5px 0 0;\r\n      margin-top: 10px;\r\n    }\r\n    .widget .flot-chart {\r\n      height: 100px;\r\n    }\r\n    .vertical-align div {\r\n      display: inline-block;\r\n      vertical-align: middle;\r\n    }\r\n    .vertical-align h2,\r\n    .vertical-align h3 {\r\n      margin: 0;\r\n    }\r\n    .todo-list {\r\n      list-style: none outside none;\r\n      margin: 0;\r\n      padding: 0;\r\n      font-size: 14px;\r\n    }\r\n    .todo-list.small-list {\r\n      font-size: 12px;\r\n    }\r\n    .todo-list.small-list > li {\r\n      background: #f3f3f4;\r\n      border-left: none;\r\n      border-right: none;\r\n      border-radius: 4px;\r\n      color: inherit;\r\n      margin-bottom: 2px;\r\n      padding: 6px 6px 6px 12px;\r\n    }\r\n    .todo-list.small-list .btn-xs,\r\n    .todo-list.small-list .btn-group-xs > .btn {\r\n      border-radius: 5px;\r\n      font-size: 10px;\r\n      line-height: 1.5;\r\n      padding: 1px 2px 1px 5px;\r\n    }\r\n    .todo-list > li {\r\n      background: #f3f3f4;\r\n      border-left: 6px solid #e7eaec;\r\n      border-right: 6px solid #e7eaec;\r\n      border-radius: 4px;\r\n      color: inherit;\r\n      margin-bottom: 2px;\r\n      padding: 10px;\r\n    }\r\n    .todo-list .handle {\r\n      cursor: move;\r\n      display: inline-block;\r\n      font-size: 16px;\r\n      margin: 0 5px;\r\n    }\r\n    .todo-list > li .label {\r\n      font-size: 9px;\r\n      margin-left: 10px;\r\n    }\r\n    .check-link {\r\n      font-size: 16px;\r\n    }\r\n    .todo-completed {\r\n      text-decoration: line-through;\r\n    }\r\n    .geo-statistic h1 {\r\n      font-size: 36px;\r\n      margin-bottom: 0;\r\n    }\r\n    .glyphicon.fa {\r\n      font-family: \"FontAwesome\";\r\n    }\r\n    /* INPUTS */\r\n    .inline {\r\n      display: inline-block !important;\r\n    }\r\n    .input-s-sm {\r\n      width: 120px;\r\n    }\r\n    .input-s {\r\n      width: 200px;\r\n    }\r\n    .input-s-lg {\r\n      width: 250px;\r\n    }\r\n    .i-checks {\r\n      padding-left: 0;\r\n    }\r\n    .form-control,\r\n    .single-line {\r\n      background-color: #FFFFFF;\r\n      background-image: none;\r\n      border: 1px solid #e5e6e7;\r\n      border-radius: 1px;\r\n      color: inherit;\r\n      display: block;\r\n      padding: 6px 12px;\r\n      transition: border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s;\r\n      width: 100%;\r\n    }\r\n    .form-control:focus,\r\n    .single-line:focus {\r\n      border-color: #1ab394;\r\n    }\r\n    .has-success .form-control,\r\n    .has-success .form-control:focus {\r\n      border-color: #1ab394;\r\n    }\r\n    .has-warning .form-control,\r\n    .has-warning .form-control:focus {\r\n      border-color: #f8ac59;\r\n    }\r\n    .has-error .form-control,\r\n    .has-error .form-control:focus {\r\n      border-color: #ed5565;\r\n    }\r\n    .has-success .control-label {\r\n      color: #1ab394;\r\n    }\r\n    .has-warning .control-label {\r\n      color: #f8ac59;\r\n    }\r\n    .has-error .control-label {\r\n      color: #ed5565;\r\n    }\r\n    .input-group-addon {\r\n      background-color: #fff;\r\n      border: 1px solid #E5E6E7;\r\n      border-radius: 1px;\r\n      color: inherit;\r\n      font-size: 14px;\r\n      font-weight: 400;\r\n      line-height: 1;\r\n      padding: 6px 12px;\r\n      text-align: center;\r\n    }\r\n    .spinner-buttons.input-group-btn .btn-xs {\r\n      line-height: 1.13;\r\n    }\r\n    .spinner-buttons.input-group-btn {\r\n      width: 20%;\r\n    }\r\n    .noUi-connect {\r\n      background: none repeat scroll 0 0 #1ab394;\r\n      box-shadow: none;\r\n    }\r\n    .slider_red .noUi-connect {\r\n      background: none repeat scroll 0 0 #ed5565;\r\n      box-shadow: none;\r\n    }\r\n    /* UI Sortable */\r\n    .ui-sortable .ibox-title {\r\n      cursor: move;\r\n    }\r\n    .ui-sortable-placeholder {\r\n      border: 1px dashed #cecece !important;\r\n      visibility: visible !important;\r\n      background: #e7eaec;\r\n    }\r\n    .ibox.ui-sortable-placeholder {\r\n      margin: 0 0 23px !important;\r\n    }\r\n    /* SWITCHES */\r\n    .onoffswitch {\r\n      position: relative;\r\n      width: 54px;\r\n      -webkit-user-select: none;\r\n      -moz-user-select: none;\r\n      -ms-user-select: none;\r\n    }\r\n    .onoffswitch-checkbox {\r\n      display: none;\r\n    }\r\n    .onoffswitch-label {\r\n      display: block;\r\n      overflow: hidden;\r\n      cursor: pointer;\r\n      border: 2px solid #1AB394;\r\n      border-radius: 3px;\r\n    }\r\n    .onoffswitch-inner {\r\n      display: block;\r\n      width: 200%;\r\n      margin-left: -100%;\r\n      -moz-transition: margin 0.3s ease-in 0s;\r\n      -webkit-transition: margin 0.3s ease-in 0s;\r\n      -o-transition: margin 0.3s ease-in 0s;\r\n      transition: margin 0.3s ease-in 0s;\r\n    }\r\n    .onoffswitch-inner:before,\r\n    .onoffswitch-inner:after {\r\n      display: block;\r\n      float: left;\r\n      width: 50%;\r\n      height: 16px;\r\n      padding: 0;\r\n      line-height: 16px;\r\n      font-size: 10px;\r\n      color: white;\r\n      font-family: Trebuchet, Arial, sans-serif;\r\n      font-weight: bold;\r\n      -moz-box-sizing: border-box;\r\n      -webkit-box-sizing: border-box;\r\n      box-sizing: border-box;\r\n    }\r\n    .onoffswitch-inner:before {\r\n      content: \"ON\";\r\n      padding-left: 7px;\r\n      background-color: #1AB394;\r\n      color: #FFFFFF;\r\n    }\r\n    .onoffswitch-inner:after {\r\n      content: \"OFF\";\r\n      padding-right: 7px;\r\n      background-color: #FFFFFF;\r\n      color: #919191;\r\n      text-align: right;\r\n    }\r\n    .onoffswitch-switch {\r\n      display: block;\r\n      width: 18px;\r\n      margin: 0;\r\n      background: #FFFFFF;\r\n      border: 2px solid #1AB394;\r\n      border-radius: 3px;\r\n      position: absolute;\r\n      top: 0;\r\n      bottom: 0;\r\n      right: 36px;\r\n      -moz-transition: all 0.3s ease-in 0s;\r\n      -webkit-transition: all 0.3s ease-in 0s;\r\n      -o-transition: all 0.3s ease-in 0s;\r\n      transition: all 0.3s ease-in 0s;\r\n    }\r\n    .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {\r\n      margin-left: 0;\r\n    }\r\n    .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {\r\n      right: 0;\r\n    }\r\n    /* jqGrid */\r\n    .ui-jqgrid {\r\n      -moz-box-sizing: content-box;\r\n    }\r\n    .ui-jqgrid-btable {\r\n      border-collapse: separate;\r\n    }\r\n    .ui-jqgrid-htable {\r\n      border-collapse: separate;\r\n    }\r\n    .ui-jqgrid-titlebar {\r\n      height: 40px;\r\n      line-height: 15px;\r\n      color: #676a6c;\r\n      background-color: #F9F9F9;\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);\r\n    }\r\n    .ui-jqgrid .ui-jqgrid-title {\r\n      float: left;\r\n      margin: 1.1em 1em 0.2em;\r\n    }\r\n    .ui-jqgrid .ui-jqgrid-titlebar {\r\n      position: relative;\r\n      border-left: 0 solid;\r\n      border-right: 0 solid;\r\n      border-top: 0 solid;\r\n    }\r\n    .ui-widget-header {\r\n      background: none;\r\n      background-image: none;\r\n      background-color: #f5f5f6;\r\n      text-transform: uppercase;\r\n      border-top-left-radius: 0;\r\n      border-top-right-radius: 0;\r\n    }\r\n    .ui-jqgrid tr.ui-row-ltr td {\r\n      border-right-color: inherit;\r\n      border-right-style: solid;\r\n      border-right-width: 1px;\r\n      text-align: left;\r\n      border-color: #DDDDDD;\r\n      background-color: inherit;\r\n    }\r\n    .ui-search-toolbar input[type=\"text\"] {\r\n      font-size: 12px;\r\n      height: 15px;\r\n      border: 1px solid #CCCCCC;\r\n      border-radius: 0;\r\n    }\r\n    .ui-state-default,\r\n    .ui-widget-content .ui-state-default,\r\n    .ui-widget-header .ui-state-default {\r\n      background: #F9F9F9;\r\n      border: 1px solid #DDDDDD;\r\n      line-height: 15px;\r\n      font-weight: bold;\r\n      color: #676a6c;\r\n      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);\r\n    }\r\n    .ui-widget-content {\r\n      box-sizing: content-box;\r\n    }\r\n    .ui-icon-triangle-1-n {\r\n      background-position: 1px -16px;\r\n    }\r\n    .ui-jqgrid tr.ui-search-toolbar th {\r\n      border-top-width: 0 !important;\r\n      border-top-color: inherit !important;\r\n      border-top-style: ridge !important;\r\n    }\r\n    .ui-state-hover,\r\n    .ui-widget-content .ui-state-hover,\r\n    .ui-state-focus,\r\n    .ui-widget-content .ui-state-focus,\r\n    .ui-widget-header .ui-state-focus {\r\n      background: #f5f5f5;\r\n      border-collapse: separate;\r\n    }\r\n    .ui-state-highlight,\r\n    .ui-widget-content .ui-state-highlight,\r\n    .ui-widget-header .ui-state-highlight {\r\n      background: #f2fbff;\r\n    }\r\n    .ui-state-active,\r\n    .ui-widget-content .ui-state-active,\r\n    .ui-widget-header .ui-state-active {\r\n      border: 1px solid #dddddd;\r\n      background: #ffffff;\r\n      font-weight: normal;\r\n      color: #212121;\r\n    }\r\n    .ui-jqgrid .ui-pg-input {\r\n      font-size: inherit;\r\n      width: 50px;\r\n      border: 1px solid #CCCCCC;\r\n      height: 15px;\r\n    }\r\n    .ui-jqgrid .ui-pg-selbox {\r\n      display: block;\r\n      font-size: 1em;\r\n      height: 25px;\r\n      line-height: 18px;\r\n      margin: 0;\r\n      width: auto;\r\n    }\r\n    .ui-jqgrid .ui-pager-control {\r\n      position: relative;\r\n    }\r\n    .ui-jqgrid .ui-jqgrid-pager {\r\n      height: 32px;\r\n      position: relative;\r\n    }\r\n    .ui-pg-table .navtable .ui-corner-all {\r\n      border-radius: 0;\r\n    }\r\n    .ui-jqgrid .ui-pg-button:hover {\r\n      padding: 1px;\r\n      border: 0;\r\n    }\r\n    .ui-jqgrid .loading {\r\n      position: absolute;\r\n      top: 45%;\r\n      left: 45%;\r\n      width: auto;\r\n      height: auto;\r\n      z-index: 101;\r\n      padding: 6px;\r\n      margin: 5px;\r\n      text-align: center;\r\n      font-weight: bold;\r\n      display: none;\r\n      border-width: 2px !important;\r\n      font-size: 11px;\r\n    }\r\n    .ui-jqgrid .form-control {\r\n      height: 10px;\r\n      width: auto;\r\n      display: inline;\r\n      padding: 10px 12px;\r\n    }\r\n    .ui-jqgrid-pager {\r\n      height: 32px;\r\n    }\r\n    .ui-corner-all,\r\n    .ui-corner-top,\r\n    .ui-corner-left,\r\n    .ui-corner-tl {\r\n      border-top-left-radius: 0;\r\n    }\r\n    .ui-corner-all,\r\n    .ui-corner-top,\r\n    .ui-corner-right,\r\n    .ui-corner-tr {\r\n      border-top-right-radius: 0;\r\n    }\r\n    .ui-corner-all,\r\n    .ui-corner-bottom,\r\n    .ui-corner-left,\r\n    .ui-corner-bl {\r\n      border-bottom-left-radius: 0;\r\n    }\r\n    .ui-corner-all,\r\n    .ui-corner-bottom,\r\n    .ui-corner-right,\r\n    .ui-corner-br {\r\n      border-bottom-right-radius: 0;\r\n    }\r\n    .ui-widget-content {\r\n      border: 1px solid #ddd;\r\n    }\r\n    .ui-jqgrid .ui-jqgrid-titlebar {\r\n      padding: 0;\r\n    }\r\n    .ui-jqgrid .ui-jqgrid-titlebar {\r\n      border-bottom: 1px solid #ddd;\r\n    }\r\n    .ui-jqgrid tr.jqgrow td {\r\n      padding: 6px;\r\n    }\r\n    .ui-jqdialog .ui-jqdialog-titlebar {\r\n      padding: 10px 10px;\r\n    }\r\n    .ui-jqdialog .ui-jqdialog-title {\r\n      float: none !important;\r\n    }\r\n    .ui-jqdialog > .ui-resizable-se {\r\n      position: absolute;\r\n    }\r\n    /* Nestable list */\r\n    .dd {\r\n      position: relative;\r\n      display: block;\r\n      margin: 0;\r\n      padding: 0;\r\n      list-style: none;\r\n      font-size: 13px;\r\n      line-height: 20px;\r\n    }\r\n    .dd-list {\r\n      display: block;\r\n      position: relative;\r\n      margin: 0;\r\n      padding: 0;\r\n      list-style: none;\r\n    }\r\n    .dd-list .dd-list {\r\n      padding-left: 30px;\r\n    }\r\n    .dd-collapsed .dd-list {\r\n      display: none;\r\n    }\r\n    .dd-item,\r\n    .dd-empty,\r\n    .dd-placeholder {\r\n      display: block;\r\n      position: relative;\r\n      margin: 0;\r\n      padding: 0;\r\n      min-height: 20px;\r\n      font-size: 13px;\r\n      line-height: 20px;\r\n    }\r\n    .dd-handle {\r\n      display: block;\r\n      margin: 5px 0;\r\n      padding: 5px 10px;\r\n      color: #333;\r\n      text-decoration: none;\r\n      border: 1px solid #e7eaec;\r\n      background: #f5f5f5;\r\n      -webkit-border-radius: 3px;\r\n      border-radius: 3px;\r\n      box-sizing: border-box;\r\n      -moz-box-sizing: border-box;\r\n    }\r\n    .dd-handle span {\r\n      font-weight: bold;\r\n    }\r\n    .dd-handle:hover {\r\n      background: #f0f0f0;\r\n      cursor: pointer;\r\n      font-weight: bold;\r\n    }\r\n    .dd-item > button {\r\n      display: block;\r\n      position: relative;\r\n      cursor: pointer;\r\n      float: left;\r\n      width: 25px;\r\n      height: 20px;\r\n      margin: 5px 0;\r\n      padding: 0;\r\n      text-indent: 100%;\r\n      white-space: nowrap;\r\n      overflow: hidden;\r\n      border: 0;\r\n      background: transparent;\r\n      font-size: 12px;\r\n      line-height: 1;\r\n      text-align: center;\r\n      font-weight: bold;\r\n    }\r\n    .dd-item > button:before {\r\n      content: '+';\r\n      display: block;\r\n      position: absolute;\r\n      width: 100%;\r\n      text-align: center;\r\n      text-indent: 0;\r\n    }\r\n    .dd-item > button[data-action=\"collapse\"]:before {\r\n      content: '-';\r\n    }\r\n    #nestable2 .dd-item > button {\r\n      font-family: FontAwesome;\r\n      height: 34px;\r\n      width: 33px;\r\n      color: #c1c1c1;\r\n    }\r\n    #nestable2 .dd-item > button:before {\r\n      content: \"\\F067\";\r\n    }\r\n    #nestable2 .dd-item > button[data-action=\"collapse\"]:before {\r\n      content: \"\\F068\";\r\n    }\r\n    .dd-placeholder,\r\n    .dd-empty {\r\n      margin: 5px 0;\r\n      padding: 0;\r\n      min-height: 30px;\r\n      background: #f2fbff;\r\n      border: 1px dashed #b6bcbf;\r\n      box-sizing: border-box;\r\n      -moz-box-sizing: border-box;\r\n    }\r\n    .dd-empty {\r\n      border: 1px dashed #bbb;\r\n      min-height: 100px;\r\n      background-color: #e5e5e5;\r\n      background-image: -webkit-linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff), -webkit-linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff);\r\n      background-image: -moz-linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff), -moz-linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff);\r\n      background-image: linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff), linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff);\r\n      background-size: 60px 60px;\r\n      background-position: 0 0, 30px 30px;\r\n    }\r\n    .dd-dragel {\r\n      position: absolute;\r\n      z-index: 9999;\r\n      pointer-events: none;\r\n    }\r\n    .dd-dragel > .dd-item .dd-handle {\r\n      margin-top: 0;\r\n    }\r\n    .dd-dragel .dd-handle {\r\n      -webkit-box-shadow: 2px 4px 6px 0 rgba(0, 0, 0, 0.1);\r\n      box-shadow: 2px 4px 6px 0 rgba(0, 0, 0, 0.1);\r\n    }\r\n    /**\r\n    * Nestable Extras\r\n    */\r\n    .nestable-lists {\r\n      display: block;\r\n      clear: both;\r\n      padding: 30px 0;\r\n      width: 100%;\r\n      border: 0;\r\n      border-top: 2px solid #ddd;\r\n      border-bottom: 2px solid #ddd;\r\n    }\r\n    #nestable-menu {\r\n      padding: 0;\r\n      margin: 10px 0 20px 0;\r\n    }\r\n    #nestable-output,\r\n    #nestable2-output {\r\n      width: 100%;\r\n      font-size: 0.75em;\r\n      line-height: 1.333333em;\r\n      font-family: open sans, lucida grande, lucida sans unicode, helvetica, arial, sans-serif;\r\n      padding: 5px;\r\n      box-sizing: border-box;\r\n      -moz-box-sizing: border-box;\r\n    }\r\n    #nestable2 .dd-handle {\r\n      color: inherit;\r\n      border: 1px dashed #e7eaec;\r\n      background: #f3f3f4;\r\n      padding: 10px;\r\n    }\r\n    #nestable2 span.label {\r\n      margin-right: 10px;\r\n    }\r\n    #nestable-output,\r\n    #nestable2-output {\r\n      font-size: 12px;\r\n      padding: 25px;\r\n      box-sizing: border-box;\r\n      -moz-box-sizing: border-box;\r\n    }\r\n    /* CodeMirror */\r\n    .CodeMirror {\r\n      border: 1px solid #eee;\r\n      height: auto;\r\n    }\r\n    .CodeMirror-scroll {\r\n      overflow-y: hidden;\r\n      overflow-x: auto;\r\n    }\r\n    /* Google Maps */\r\n    .google-map {\r\n      height: 300px;\r\n    }\r\n    /* Validation */\r\n    label.error {\r\n      color: #cc5965;\r\n      display: inline-block;\r\n      margin-left: 5px;\r\n    }\r\n    .form-control.error {\r\n      border: 1px dotted #cc5965;\r\n    }\r\n    /* ngGrid */\r\n    .gridStyle {\r\n      border: 1px solid #d4d4d4;\r\n      width: 100%;\r\n      height: 400px;\r\n    }\r\n    .gridStyle2 {\r\n      border: 1px solid #d4d4d4;\r\n      width: 500px;\r\n      height: 300px;\r\n    }\r\n    .ngH eaderCell {\r\n      border-right: none;\r\n      border-bottom: 1px solid #e7eaec;\r\n    }\r\n    .ngCell {\r\n      border-right: none;\r\n    }\r\n    .ngTopPanel {\r\n      background: #F5F5F6;\r\n    }\r\n    .ngRow.even {\r\n      background: #f9f9f9;\r\n    }\r\n    .ngRow.selected {\r\n      background: #EBF2F1;\r\n    }\r\n    .ngRow {\r\n      border-bottom: 1px solid #e7eaec;\r\n    }\r\n    .ngCell {\r\n      background-color: transparent;\r\n    }\r\n    .ngHeaderCell {\r\n      border-right: none;\r\n    }\r\n    /* Toastr custom style */\r\n    #toast-container > .toast {\r\n      background-image: none !important;\r\n    }\r\n    #toast-container > .toast:before {\r\n      position: fixed;\r\n      font-family: FontAwesome;\r\n      font-size: 24px;\r\n      line-height: 24px;\r\n      float: left;\r\n      color: #FFF;\r\n      padding-right: 0.5em;\r\n      margin: auto 0.5em auto -1.5em;\r\n    }\r\n    #toast-container > .toast-warning:before {\r\n      content: \"\\F0E7\";\r\n    }\r\n    #toast-container > .toast-error:before {\r\n      content: \"\\F071\";\r\n    }\r\n    #toast-container > .toast-info:before {\r\n      content: \"\\F005\";\r\n    }\r\n    #toast-container > .toast-success:before {\r\n      content: \"\\F00C\";\r\n    }\r\n    #toast-container > div {\r\n      -moz-box-shadow: 0 0 3px #999;\r\n      -webkit-box-shadow: 0 0 3px #999;\r\n      box-shadow: 0 0 3px #999;\r\n      opacity: .9;\r\n      -ms-filter: alpha(opacity=90);\r\n      filter: alpha(opacity=90);\r\n    }\r\n    #toast-container > :hover {\r\n      -moz-box-shadow: 0 0 4px #999;\r\n      -webkit-box-shadow: 0 0 4px #999;\r\n      box-shadow: 0 0 4px #999;\r\n      opacity: 1;\r\n      -ms-filter: alpha(opacity=100);\r\n      filter: alpha(opacity=100);\r\n      cursor: pointer;\r\n    }\r\n    .toast {\r\n      background-color: #1ab394;\r\n    }\r\n    .toast-success {\r\n      background-color: #1ab394;\r\n    }\r\n    .toast-error {\r\n      background-color: #ed5565;\r\n    }\r\n    .toast-info {\r\n      background-color: #23c6c8;\r\n    }\r\n    .toast-warning {\r\n      background-color: #f8ac59;\r\n    }\r\n    .toast-top-full-width {\r\n      margin-top: 20px;\r\n    }\r\n    .toast-bottom-full-width {\r\n      margin-bottom: 20px;\r\n    }\r\n    /* Notifie */\r\n    .cg-notify-message.inspinia-notify {\r\n      background: #fff;\r\n      padding: 0;\r\n      box-shadow: 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2);\r\n      -webkit-box-shadow: 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2);\r\n      -moz-box-shadow: 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2);\r\n      border: none;\r\n      margin-top: 30px;\r\n      color: inherit;\r\n    }\r\n    .inspinia-notify.alert-warning {\r\n      border-left: 6px solid #f8ac59;\r\n    }\r\n    .inspinia-notify.alert-success {\r\n      border-left: 6px solid #1c84c6;\r\n    }\r\n    .inspinia-notify.alert-danger {\r\n      border-left: 6px solid #ed5565;\r\n    }\r\n    .inspinia-notify.alert-info {\r\n      border-left: 6px solid #f77032;\r\n    }\r\n    /* Image cropper style */\r\n    .img-container,\r\n    .img-preview {\r\n      overflow: hidden;\r\n      text-align: center;\r\n      width: 100%;\r\n    }\r\n    .img-preview-sm {\r\n      height: 130px;\r\n      width: 200px;\r\n    }\r\n    /* Forum styles  */\r\n    .forum-post-container .media {\r\n      margin: 10px 10px 10px 10px;\r\n      padding: 20px 10px 20px 10px;\r\n      border-bottom: 1px solid #f1f1f1;\r\n    }\r\n    .forum-avatar {\r\n      float: left;\r\n      margin-right: 20px;\r\n      text-align: center;\r\n      width: 110px;\r\n    }\r\n    .forum-avatar .img-circle {\r\n      height: 48px;\r\n      width: 48px;\r\n    }\r\n    .author-info {\r\n      color: #676a6c;\r\n      font-size: 11px;\r\n      margin-top: 5px;\r\n      text-align: center;\r\n    }\r\n    .forum-post-info {\r\n      padding: 9px 12px 6px 12px;\r\n      background: #f9f9f9;\r\n      border: 1px solid #f1f1f1;\r\n    }\r\n    .media-body > .media {\r\n      background: #f9f9f9;\r\n      border-radius: 3px;\r\n      border: 1px solid #f1f1f1;\r\n    }\r\n    .forum-post-container .media-body .photos {\r\n      margin: 10px 0;\r\n    }\r\n    .forum-photo {\r\n      max-width: 140px;\r\n      border-radius: 3px;\r\n    }\r\n    .media-body > .media .forum-avatar {\r\n      width: 70px;\r\n      margin-right: 10px;\r\n    }\r\n    .media-body > .media .forum-avatar .img-circle {\r\n      height: 38px;\r\n      width: 38px;\r\n    }\r\n    .mid-icon {\r\n      font-size: 66px;\r\n    }\r\n    .forum-item {\r\n      margin: 10px 0;\r\n      padding: 10px 0 20px;\r\n      border-bottom: 1px solid #f1f1f1;\r\n    }\r\n    .views-number {\r\n      font-size: 24px;\r\n      line-height: 18px;\r\n      font-weight: 400;\r\n    }\r\n    .forum-container,\r\n    .forum-post-container {\r\n      padding: 30px !important;\r\n    }\r\n    .forum-item small {\r\n      color: #999;\r\n    }\r\n    .forum-item .forum-sub-title {\r\n      color: #999;\r\n      margin-left: 50px;\r\n    }\r\n    .forum-title {\r\n      margin: 15px 0 15px 0;\r\n    }\r\n    .forum-info {\r\n      text-align: center;\r\n    }\r\n    .forum-desc {\r\n      color: #999;\r\n    }\r\n    .forum-icon {\r\n      float: left;\r\n      width: 30px;\r\n      margin-right: 20px;\r\n      text-align: center;\r\n    }\r\n    a.forum-item-title {\r\n      color: inherit;\r\n      display: block;\r\n      font-size: 18px;\r\n      font-weight: 600;\r\n    }\r\n    a.forum-item-title:hover {\r\n      color: inherit;\r\n    }\r\n    .forum-icon .fa {\r\n      font-size: 30px;\r\n      margin-top: 8px;\r\n      color: #9b9b9b;\r\n    }\r\n    .forum-item.active .fa {\r\n      color: #1ab394;\r\n    }\r\n    .forum-item.active a.forum-item-title {\r\n      color: #1ab394;\r\n    }\r\n    @media (max-width: 992px) {\r\n      .forum-info {\r\n        margin: 15px 0 10px 0;\r\n        /* Comment this is you want to show forum info in small devices */\r\n        display: none;\r\n      }\r\n      .forum-desc {\r\n        float: none !important;\r\n      }\r\n    }\r\n    /* New Timeline style */\r\n    .vertical-container {\r\n      /* this class is used to give a max-width to the element it is applied to, and center it horizontally when it reaches that max-width */\r\n      width: 90%;\r\n      max-width: 1170px;\r\n      margin: 0 auto;\r\n    }\r\n    .vertical-container::after {\r\n      /* clearfix */\r\n      content: '';\r\n      display: table;\r\n      clear: both;\r\n    }\r\n    #vertical-timeline {\r\n      position: relative;\r\n      padding: 0;\r\n      margin-top: 2em;\r\n      margin-bottom: 2em;\r\n    }\r\n    #vertical-timeline::before {\r\n      content: '';\r\n      position: absolute;\r\n      top: 0;\r\n      left: 18px;\r\n      height: 100%;\r\n      width: 4px;\r\n      background: #f1f1f1;\r\n    }\r\n    .vertical-timeline-content .btn {\r\n      float: right;\r\n    }\r\n    #vertical-timeline.light-timeline:before {\r\n      background: #e7eaec;\r\n    }\r\n    .dark-timeline .vertical-timeline-content:before {\r\n      border-color: transparent #f5f5f5 transparent transparent;\r\n    }\r\n    .dark-timeline.center-orientation .vertical-timeline-content:before {\r\n      border-color: transparent transparent transparent #f5f5f5;\r\n    }\r\n    .dark-timeline .vertical-timeline-block:nth-child(2n) .vertical-timeline-content:before,\r\n    .dark-timeline.center-orientation .vertical-timeline-block:nth-child(2n) .vertical-timeline-content:before {\r\n      border-color: transparent #f5f5f5 transparent transparent;\r\n    }\r\n    .dark-timeline .vertical-timeline-content,\r\n    .dark-timeline.center-orientation .vertical-timeline-content {\r\n      background: #f5f5f5;\r\n    }\r\n    @media only screen and (min-width: 1170px) {\r\n      #vertical-timeline.center-orientation {\r\n        margin-top: 3em;\r\n        margin-bottom: 3em;\r\n      }\r\n      #vertical-timeline.center-orientation:before {\r\n        left: 50%;\r\n        margin-left: -2px;\r\n      }\r\n    }\r\n    @media only screen and (max-width: 1170px) {\r\n      .center-orientation.dark-timeline .vertical-timeline-content:before {\r\n        border-color: transparent #f5f5f5 transparent transparent;\r\n      }\r\n    }\r\n    .vertical-timeline-block {\r\n      position: relative;\r\n      margin: 2em 0;\r\n    }\r\n    .vertical-timeline-block:after {\r\n      content: \"\";\r\n      display: table;\r\n      clear: both;\r\n    }\r\n    .vertical-timeline-block:first-child {\r\n      margin-top: 0;\r\n    }\r\n    .vertical-timeline-block:last-child {\r\n      margin-bottom: 0;\r\n    }\r\n    @media only screen and (min-width: 1170px) {\r\n      .center-orientation .vertical-timeline-block {\r\n        margin: 4em 0;\r\n      }\r\n      .center-orientation .vertical-timeline-block:first-child {\r\n        margin-top: 0;\r\n      }\r\n      .center-orientation .vertical-timeline-block:last-child {\r\n        margin-bottom: 0;\r\n      }\r\n    }\r\n    .vertical-timeline-icon {\r\n      position: absolute;\r\n      top: 0;\r\n      left: 0;\r\n      width: 40px;\r\n      height: 40px;\r\n      border-radius: 50%;\r\n      font-size: 16px;\r\n      border: 3px solid #f1f1f1;\r\n      text-align: center;\r\n    }\r\n    .vertical-timeline-icon i {\r\n      display: block;\r\n      width: 24px;\r\n      height: 24px;\r\n      position: relative;\r\n      left: 50%;\r\n      top: 50%;\r\n      margin-left: -12px;\r\n      margin-top: -9px;\r\n    }\r\n    @media only screen and (min-width: 1170px) {\r\n      .center-orientation .vertical-timeline-icon {\r\n        width: 50px;\r\n        height: 50px;\r\n        left: 50%;\r\n        margin-left: -25px;\r\n        -webkit-transform: translateZ(0);\r\n        -webkit-backface-visibility: hidden;\r\n        font-size: 19px;\r\n      }\r\n      .center-orientation .vertical-timeline-icon i {\r\n        margin-left: -12px;\r\n        margin-top: -10px;\r\n      }\r\n      .center-orientation .cssanimations .vertical-timeline-icon.is-hidden {\r\n        visibility: hidden;\r\n      }\r\n    }\r\n    .vertical-timeline-content {\r\n      position: relative;\r\n      margin-left: 60px;\r\n      background: white;\r\n      border-radius: 0.25em;\r\n      padding: 1em;\r\n    }\r\n    .vertical-timeline-content:after {\r\n      content: \"\";\r\n      display: table;\r\n      clear: both;\r\n    }\r\n    .vertical-timeline-content h2 {\r\n      font-weight: 400;\r\n      margin-top: 4px;\r\n    }\r\n    .vertical-timeline-content p {\r\n      margin: 1em 0;\r\n      line-height: 1.6;\r\n    }\r\n    .vertical-timeline-content .vertical-date {\r\n      float: left;\r\n      font-weight: 500;\r\n    }\r\n    .vertical-date small {\r\n      color: #1ab394;\r\n      font-weight: 400;\r\n    }\r\n    .vertical-timeline-content::before {\r\n      content: '';\r\n      position: absolute;\r\n      top: 16px;\r\n      right: 100%;\r\n      height: 0;\r\n      width: 0;\r\n      border: 7px solid transparent;\r\n      border-right: 7px solid white;\r\n    }\r\n    @media only screen and (min-width: 768px) {\r\n      .vertical-timeline-content h2 {\r\n        font-size: 18px;\r\n      }\r\n      .vertical-timeline-content p {\r\n        font-size: 13px;\r\n      }\r\n    }\r\n    @media only screen and (min-width: 1170px) {\r\n      .center-orientation .vertical-timeline-content {\r\n        margin-left: 0;\r\n        padding: 1.6em;\r\n        width: 45%;\r\n      }\r\n      .center-orientation .vertical-timeline-content::before {\r\n        top: 24px;\r\n        left: 100%;\r\n        border-color: transparent;\r\n        border-left-color: white;\r\n      }\r\n      .center-orientation .vertical-timeline-content .btn {\r\n        float: left;\r\n      }\r\n      .center-orientation .vertical-timeline-content .vertical-date {\r\n        position: absolute;\r\n        width: 100%;\r\n        left: 122%;\r\n        top: 2px;\r\n        font-size: 14px;\r\n      }\r\n      .center-orientation .vertical-timeline-block:nth-child(even) .vertical-timeline-content {\r\n        float: right;\r\n      }\r\n      .center-orientation .vertical-timeline-block:nth-child(even) .vertical-timeline-content::before {\r\n        top: 24px;\r\n        left: auto;\r\n        right: 100%;\r\n        border-color: transparent;\r\n        border-right-color: white;\r\n      }\r\n      .center-orientation .vertical-timeline-block:nth-child(even) .vertical-timeline-content .btn {\r\n        float: right;\r\n      }\r\n      .center-orientation .vertical-timeline-block:nth-child(even) .vertical-timeline-content .vertical-date {\r\n        left: auto;\r\n        right: 122%;\r\n        text-align: right;\r\n      }\r\n      .center-orientation .cssanimations .vertical-timeline-content.is-hidden {\r\n        visibility: hidden;\r\n      }\r\n    }\r\n    /* Tabs */\r\n    .tabs-container .panel-body {\r\n      background: #fff;\r\n      border: 1px solid #e7eaec;\r\n      border-radius: 2px;\r\n      padding: 20px;\r\n      position: relative;\r\n    }\r\n    .tabs-container .nav-tabs > li.active > a,\r\n    .tabs-container .nav-tabs > li.active > a:hover,\r\n    .tabs-container .nav-tabs > li.active > a:focus {\r\n      border: 1px solid #e7eaec;\r\n      border-bottom-color: transparent;\r\n      background-color: #fff;\r\n    }\r\n    .tabs-container .nav-tabs > li {\r\n      float: left;\r\n      margin-bottom: -1px;\r\n    }\r\n    .tabs-container .tab-pane .panel-body {\r\n      border-top: none;\r\n    }\r\n    .tabs-container .nav-tabs > li.active > a,\r\n    .tabs-container .nav-tabs > li.active > a:hover,\r\n    .tabs-container .nav-tabs > li.active > a:focus {\r\n      border: 1px solid #e7eaec;\r\n      border-bottom-color: transparent;\r\n    }\r\n    .tabs-container .nav-tabs {\r\n      border-bottom: 1px solid #e7eaec;\r\n    }\r\n    .tabs-container .tab-pane .panel-body {\r\n      border-top: none;\r\n    }\r\n    .tabs-container .tabs-left .tab-pane .panel-body,\r\n    .tabs-container .tabs-right .tab-pane .panel-body {\r\n      border-top: 1px solid #e7eaec;\r\n    }\r\n    .tabs-container .nav-tabs > li a:hover {\r\n      background: transparent;\r\n      border-color: transparent;\r\n    }\r\n    .tabs-container .tabs-below > .nav-tabs,\r\n    .tabs-container .tabs-right > .nav-tabs,\r\n    .tabs-container .tabs-left > .nav-tabs {\r\n      border-bottom: 0;\r\n    }\r\n    .tabs-container .tabs-left .panel-body {\r\n      position: static;\r\n    }\r\n    .tabs-container .tabs-left > .nav-tabs,\r\n    .tabs-container .tabs-right > .nav-tabs {\r\n      width: 20%;\r\n    }\r\n    .tabs-container .tabs-left .panel-body {\r\n      width: 80%;\r\n      margin-left: 20%;\r\n    }\r\n    .tabs-container .tabs-right .panel-body {\r\n      width: 80%;\r\n      margin-right: 20%;\r\n    }\r\n    .tabs-container .tab-content > .tab-pane,\r\n    .tabs-container .pill-content > .pill-pane {\r\n      display: none;\r\n    }\r\n    .tabs-container .tab-content > .active,\r\n    .tabs-container .pill-content > .active {\r\n      display: block;\r\n    }\r\n    .tabs-container .tabs-below > .nav-tabs {\r\n      border-top: 1px solid #e7eaec;\r\n    }\r\n    .tabs-container .tabs-below > .nav-tabs > li {\r\n      margin-top: -1px;\r\n      margin-bottom: 0;\r\n    }\r\n    .tabs-container .tabs-below > .nav-tabs > li > a {\r\n      -webkit-border-radius: 0 0 4px 4px;\r\n      -moz-border-radius: 0 0 4px 4px;\r\n      border-radius: 0 0 4px 4px;\r\n    }\r\n    .tabs-container .tabs-below > .nav-tabs > li > a:hover,\r\n    .tabs-container .tabs-below > .nav-tabs > li > a:focus {\r\n      border-top-color: #e7eaec;\r\n      border-bottom-color: transparent;\r\n    }\r\n    .tabs-container .tabs-left > .nav-tabs > li,\r\n    .tabs-container .tabs-right > .nav-tabs > li {\r\n      float: none;\r\n    }\r\n    .tabs-container .tabs-left > .nav-tabs > li > a,\r\n    .tabs-container .tabs-right > .nav-tabs > li > a {\r\n      min-width: 74px;\r\n      margin-right: 0;\r\n      margin-bottom: 3px;\r\n    }\r\n    .tabs-container .tabs-left > .nav-tabs {\r\n      float: left;\r\n      margin-right: 19px;\r\n    }\r\n    .tabs-container .tabs-left > .nav-tabs > li > a {\r\n      margin-right: -1px;\r\n      -webkit-border-radius: 4px 0 0 4px;\r\n      -moz-border-radius: 4px 0 0 4px;\r\n      border-radius: 4px 0 0 4px;\r\n    }\r\n    .tabs-container .tabs-left > .nav-tabs .active > a,\r\n    .tabs-container .tabs-left > .nav-tabs .active > a:hover,\r\n    .tabs-container .tabs-left > .nav-tabs .active > a:focus {\r\n      border-color: #e7eaec transparent #e7eaec #e7eaec;\r\n    }\r\n    .tabs-container .tabs-right > .nav-tabs {\r\n      float: right;\r\n      margin-left: 19px;\r\n    }\r\n    .tabs-container .tabs-right > .nav-tabs > li > a {\r\n      margin-left: -1px;\r\n      -webkit-border-radius: 0 4px 4px 0;\r\n      -moz-border-radius: 0 4px 4px 0;\r\n      border-radius: 0 4px 4px 0;\r\n    }\r\n    .tabs-container .tabs-right > .nav-tabs .active > a,\r\n    .tabs-container .tabs-right > .nav-tabs .active > a:hover,\r\n    .tabs-container .tabs-right > .nav-tabs .active > a:focus {\r\n      border-color: #e7eaec #e7eaec #e7eaec transparent;\r\n      z-index: 1;\r\n    }\r\n    @media (max-width: 767px) {\r\n      .tabs-container .nav-tabs > li {\r\n        float: none !important;\r\n      }\r\n      .tabs-container .nav-tabs > li.active > a {\r\n        border-bottom: 1px solid #e7eaec !important;\r\n        margin: 0;\r\n      }\r\n    }\r\n    /* jsvectormap */\r\n    .jvectormap-container {\r\n      width: 100%;\r\n      height: 100%;\r\n      position: relative;\r\n      overflow: hidden;\r\n    }\r\n    .jvectormap-tip {\r\n      position: absolute;\r\n      display: none;\r\n      border: solid 1px #CDCDCD;\r\n      border-radius: 3px;\r\n      background: #292929;\r\n      color: white;\r\n      font-family: sans-serif, Verdana;\r\n      font-size: smaller;\r\n      padding: 5px;\r\n    }\r\n    .jvectormap-zoomin,\r\n    .jvectormap-zoomout,\r\n    .jvectormap-goback {\r\n      position: absolute;\r\n      left: 10px;\r\n      border-radius: 3px;\r\n      background: #1ab394;\r\n      padding: 3px;\r\n      color: white;\r\n      cursor: pointer;\r\n      line-height: 10px;\r\n      text-align: center;\r\n      box-sizing: content-box;\r\n    }\r\n    .jvectormap-zoomin,\r\n    .jvectormap-zoomout {\r\n      width: 10px;\r\n      height: 10px;\r\n    }\r\n    .jvectormap-zoomin {\r\n      top: 10px;\r\n    }\r\n    .jvectormap-zoomout {\r\n      top: 30px;\r\n    }\r\n    .jvectormap-goback {\r\n      bottom: 10px;\r\n      z-index: 1000;\r\n      padding: 6px;\r\n    }\r\n    .jvectormap-spinner {\r\n      position: absolute;\r\n      left: 0;\r\n      top: 0;\r\n      right: 0;\r\n      bottom: 0;\r\n      background: center no-repeat url(data:image/gif;base64,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);\r\n    }\r\n    .jvectormap-legend-title {\r\n      font-weight: bold;\r\n      font-size: 14px;\r\n      text-align: center;\r\n    }\r\n    .jvectormap-legend-cnt {\r\n      position: absolute;\r\n    }\r\n    .jvectormap-legend-cnt-h {\r\n      bottom: 0;\r\n      right: 0;\r\n    }\r\n    .jvectormap-legend-cnt-v {\r\n      top: 0;\r\n      right: 0;\r\n    }\r\n    .jvectormap-legend {\r\n      background: black;\r\n      color: white;\r\n      border-radius: 3px;\r\n    }\r\n    .jvectormap-legend-cnt-h .jvectormap-legend {\r\n      float: left;\r\n      margin: 0 10px 10px 0;\r\n      padding: 3px 3px 1px 3px;\r\n    }\r\n    .jvectormap-legend-cnt-h .jvectormap-legend .jvectormap-legend-tick {\r\n      float: left;\r\n    }\r\n    .jvectormap-legend-cnt-v .jvectormap-legend {\r\n      margin: 10px 10px 0 0;\r\n      padding: 3px;\r\n    }\r\n    .jvectormap-legend-cnt-h .jvectormap-legend-tick {\r\n      width: 40px;\r\n    }\r\n    .jvectormap-legend-cnt-h .jvectormap-legend-tick-sample {\r\n      height: 15px;\r\n    }\r\n    .jvectormap-legend-cnt-v .jvectormap-legend-tick-sample {\r\n      height: 20px;\r\n      width: 20px;\r\n      display: inline-block;\r\n      vertical-align: middle;\r\n    }\r\n    .jvectormap-legend-tick-text {\r\n      font-size: 12px;\r\n    }\r\n    .jvectormap-legend-cnt-h .jvectormap-legend-tick-text {\r\n      text-align: center;\r\n    }\r\n    .jvectormap-legend-cnt-v .jvectormap-legend-tick-text {\r\n      display: inline-block;\r\n      vertical-align: middle;\r\n      line-height: 20px;\r\n      padding-left: 3px;\r\n    }\r\n    /*Slick Carousel */\r\n    .slick-prev:before,\r\n    .slick-next:before {\r\n      color: #1ab394 !important;\r\n    }\r\n    /* Payments */\r\n    .payment-card {\r\n      background: #ffffff;\r\n      padding: 20px;\r\n      margin-bottom: 25px;\r\n      border: 1px solid #e7eaec;\r\n    }\r\n    .payment-icon-big {\r\n      font-size: 60px;\r\n      color: #d1dade;\r\n    }\r\n    .payments-method.panel-group .panel + .panel {\r\n      margin-top: -1px;\r\n    }\r\n    .payments-method .panel-heading {\r\n      padding: 15px;\r\n    }\r\n    .payments-method .panel {\r\n      border-radius: 0;\r\n    }\r\n    .payments-method .panel-heading h5 {\r\n      margin-bottom: 5px;\r\n    }\r\n    .payments-method .panel-heading i {\r\n      font-size: 26px;\r\n    }\r\n    /* Select2 custom styles */\r\n    .select2-container--default .select2-selection--single,\r\n    .select2-container--default .select2-selection--multiple {\r\n      border-color: #e7eaec;\r\n    }\r\n    .select2-container--default.select2-container--focus .select2-selection--single,\r\n    .select2-container--default.select2-container--focus .select2-selection--multiple {\r\n      border-color: #1ab394;\r\n    }\r\n    .select2-container--default .select2-results__option--highlighted[aria-selected] {\r\n      background-color: #1ab394;\r\n    }\r\n    .select2-container--default .select2-search--dropdown .select2-search__field {\r\n      border-color: #e7eaec;\r\n    }\r\n    .select2-dropdown {\r\n      border-color: #e7eaec;\r\n    }\r\n    .select2-dropdown input:focus {\r\n      outline: none;\r\n    }\r\n    .select2-selection {\r\n      outline: none;\r\n    }\r\n    .ui-select-container.ui-select-bootstrap .ui-select-choices-row.active > a {\r\n      background-color: #1ab394;\r\n    }\r\n    /* Tour */\r\n    .tour-tour .btn.btn-default {\r\n      background-color: #ffffff;\r\n      border: 1px solid #d2d2d2;\r\n      color: inherit;\r\n    }\r\n    .tour-step-backdrop {\r\n      z-index: 2101;\r\n    }\r\n    .tour-backdrop {\r\n      z-index: 2100;\r\n      opacity: .7;\r\n    }\r\n    .popover[class*=tour-] {\r\n      z-index: 2100;\r\n    }\r\n    body.tour-open .animated {\r\n      animation-fill-mode: initial;\r\n    }\r\n    /* Resizable */\r\n    .resizable-panels .ibox {\r\n      clear: none;\r\n      margin: 10px;\r\n      float: left;\r\n      overflow: hidden;\r\n      min-height: 150px;\r\n      min-width: 150px;\r\n    }\r\n    .resizable-panels .ibox .ibox-content {\r\n      height: calc(100% - 49px);\r\n    }\r\n    .ui-resizable-helper {\r\n      background: rgba(211, 211, 211, 0.4);\r\n    }\r\n    /* Wizard step fix */\r\n    .wizard > .content > .body {\r\n      position: relative;\r\n    }\r\n    /* PDF js style */\r\n    .pdf-toolbar {\r\n      max-width: 600px;\r\n      margin: 0 auto;\r\n    }\r\n    /* Dropzone */\r\n    .dropzone {\r\n      min-height: 140px;\r\n      border: 1px dashed #f77032;\r\n      background: white;\r\n      padding: 20px 20px;\r\n    }\r\n    .dropzone .dz-message {\r\n      font-size: 16px;\r\n    }\r\n    /* Activity stream */\r\n    .stream {\r\n      position: relative;\r\n      padding: 10px 0;\r\n    }\r\n    .stream:first-child .stream-badge:before {\r\n      top: 10px;\r\n    }\r\n    .stream:last-child .stream-badge:before {\r\n      height: 30px;\r\n    }\r\n    .stream .stream-badge {\r\n      width: 50px;\r\n    }\r\n    .stream .stream-badge i {\r\n      border: 1px solid #e7eaec;\r\n      border-radius: 50%;\r\n      padding: 6px;\r\n      color: #808486;\r\n      position: absolute;\r\n      background-color: #ffffff;\r\n      left: 8px;\r\n    }\r\n    .stream .stream-badge i.fa-circle {\r\n      color: #ced0d1;\r\n    }\r\n    .stream .stream-badge i.bg-success {\r\n      color: #ffffff;\r\n      background-color: #1c84c6;\r\n      border-color: #1c84c6;\r\n    }\r\n    .stream .stream-badge i.bg-primary {\r\n      color: #ffffff;\r\n      background-color: #1ab394;\r\n      border-color: #1ab394;\r\n    }\r\n    .stream .stream-badge i.bg-warning {\r\n      color: #ffffff;\r\n      background-color: #f8ac59;\r\n      border-color: #f8ac59;\r\n    }\r\n    .stream .stream-badge i.bg-info {\r\n      color: #ffffff;\r\n      background-color: #23c6c8;\r\n      border-color: #23c6c8;\r\n    }\r\n    .stream .stream-badge i.bg-danger {\r\n      color: #ffffff;\r\n      background-color: #ed5565;\r\n      border-color: #ed5565;\r\n    }\r\n    .stream .stream-badge:before {\r\n      content: '';\r\n      width: 1px;\r\n      background-color: #e7eaec;\r\n      position: absolute;\r\n      top: 0;\r\n      bottom: 0;\r\n      left: 20px;\r\n    }\r\n    .stream .stream-info {\r\n      font-size: 12px;\r\n      margin-bottom: 5px;\r\n    }\r\n    .stream .stream-info img {\r\n      border-radius: 50%;\r\n      width: 18px;\r\n      height: 18px;\r\n      margin-right: 2px;\r\n      margin-top: -4px;\r\n    }\r\n    .stream .stream-info .date {\r\n      color: #9a9d9f;\r\n      font-size: 80%;\r\n    }\r\n    .stream .stream-panel {\r\n      margin-left: 55px;\r\n    }\r\n    .stream-small {\r\n      margin: 10px 0;\r\n    }\r\n    .stream-small .label {\r\n      padding: 2px 6px;\r\n      margin-right: 2px;\r\n    }\r\n    .sidebar-panel {\r\n      width: 220px;\r\n      background: #ebebed;\r\n      padding: 10px 20px;\r\n      position: absolute;\r\n      right: 0;\r\n    }\r\n    .sidebar-panel .feed-element img.img-circle {\r\n      width: 32px;\r\n      height: 32px;\r\n    }\r\n    .sidebar-panel .feed-element,\r\n    .media-body,\r\n    .sidebar-panel p {\r\n      font-size: 12px;\r\n    }\r\n    .sidebar-panel .feed-element {\r\n      margin-top: 20px;\r\n      padding-bottom: 0;\r\n    }\r\n    .sidebar-panel .list-group {\r\n      margin-bottom: 10px;\r\n    }\r\n    .sidebar-panel .list-group .list-group-item {\r\n      padding: 5px 0;\r\n      font-size: 12px;\r\n      border: 0;\r\n    }\r\n    .sidebar-content .wrapper,\r\n    .wrapper.sidebar-content {\r\n      padding-right: 230px !important;\r\n    }\r\n    .body-small .sidebar-content .wrapper,\r\n    .body-small .wrapper.sidebar-content {\r\n      padding-right: 20px !important;\r\n    }\r\n    #right-sidebar {\r\n      background-color: #fff;\r\n      border-left: 1px solid #e7eaec;\r\n      border-top: 1px solid #e7eaec;\r\n      overflow: hidden;\r\n      position: fixed;\r\n      top: 60px;\r\n      width: 260px !important;\r\n      z-index: 1009;\r\n      bottom: 0;\r\n      right: -260px;\r\n    }\r\n    #right-sidebar.sidebar-open {\r\n      right: 0;\r\n    }\r\n    #right-sidebar.sidebar-open.sidebar-top {\r\n      top: 0;\r\n      border-top: none;\r\n    }\r\n    .sidebar-container ul.nav-tabs {\r\n      border: none;\r\n    }\r\n    .sidebar-container ul.nav-tabs.navs-4 li {\r\n      width: 25%;\r\n    }\r\n    .sidebar-container ul.nav-tabs.navs-3 li {\r\n      width: 33.3333%;\r\n    }\r\n    .sidebar-container ul.nav-tabs.navs-2 li {\r\n      width: 50%;\r\n    }\r\n    .sidebar-container ul.nav-tabs li {\r\n      border: none;\r\n    }\r\n    .sidebar-container ul.nav-tabs li a {\r\n      border: none;\r\n      padding: 12px 10px;\r\n      margin: 0;\r\n      border-radius: 0;\r\n      background: #2f4050;\r\n      color: #fff;\r\n      text-align: center;\r\n      border-right: 1px solid #334556;\r\n    }\r\n    .sidebar-container ul.nav-tabs li.active a {\r\n      border: none;\r\n      background: #f9f9f9;\r\n      color: #676a6c;\r\n      font-weight: bold;\r\n    }\r\n    .sidebar-container .nav-tabs > li.active > a:hover,\r\n    .sidebar-container .nav-tabs > li.active > a:focus {\r\n      border: none;\r\n    }\r\n    .sidebar-container ul.sidebar-list {\r\n      margin: 0;\r\n      padding: 0;\r\n    }\r\n    .sidebar-container ul.sidebar-list li {\r\n      border-bottom: 1px solid #e7eaec;\r\n      padding: 15px 20px;\r\n      list-style: none;\r\n      font-size: 12px;\r\n    }\r\n    .sidebar-container .sidebar-message:nth-child(2n+2) {\r\n      background: #f9f9f9;\r\n    }\r\n    .sidebar-container ul.sidebar-list li a {\r\n      text-decoration: none;\r\n      color: inherit;\r\n    }\r\n    .sidebar-container .sidebar-content {\r\n      padding: 15px 20px;\r\n      font-size: 12px;\r\n    }\r\n    .sidebar-container .sidebar-title {\r\n      background: #f9f9f9;\r\n      padding: 20px;\r\n      border-bottom: 1px solid #e7eaec;\r\n    }\r\n    .sidebar-container .sidebar-title h3 {\r\n      margin-bottom: 3px;\r\n      padding-left: 2px;\r\n    }\r\n    .sidebar-container .tab-content h4 {\r\n      margin-bottom: 5px;\r\n    }\r\n    .sidebar-container .sidebar-message > a > .pull-left {\r\n      margin-right: 10px;\r\n    }\r\n    .sidebar-container .sidebar-message > a {\r\n      text-decoration: none;\r\n      color: inherit;\r\n    }\r\n    .sidebar-container .sidebar-message {\r\n      padding: 15px 20px;\r\n    }\r\n    .sidebar-container .sidebar-message .media-body {\r\n      display: block;\r\n      width: auto;\r\n    }\r\n    .sidebar-container .sidebar-message .message-avatar {\r\n      height: 38px;\r\n      width: 38px;\r\n      border-radius: 50%;\r\n    }\r\n    .sidebar-container .setings-item {\r\n      padding: 15px 20px;\r\n      border-bottom: 1px solid #e7eaec;\r\n    }\r\n    body {\r\n      font-family: \"open sans\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n      background-color: #2f4050;\r\n      font-size: 13px;\r\n      color: #676a6c;\r\n      overflow-x: hidden;\r\n    }\r\n    html,\r\n    body {\r\n      height: 100%;\r\n    }\r\n    body.full-height-layout #wrapper,\r\n    body.full-height-layout #page-wrapper {\r\n      height: 100%;\r\n    }\r\n    #page-wrapper {\r\n      min-height: auto;\r\n    }\r\n    body.boxed-layout {\r\n      background: url(" + __webpack_require__(51) + ");\r\n    }\r\n    body.boxed-layout #wrapper {\r\n      background-color: #2f4050;\r\n      max-width: 1200px;\r\n      margin: 0 auto;\r\n      -webkit-box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.75);\r\n      -moz-box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.75);\r\n      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.75);\r\n    }\r\n    .top-navigation.boxed-layout #wrapper,\r\n    .boxed-layout #wrapper.top-navigation {\r\n      max-width: 1300px !important;\r\n    }\r\n    .block {\r\n      display: block;\r\n    }\r\n    .clear {\r\n      display: block;\r\n      overflow: hidden;\r\n    }\r\n    a {\r\n      cursor: pointer;\r\n    }\r\n    a:hover,\r\n    a:focus {\r\n      text-decoration: none;\r\n    }\r\n    .border-bottom {\r\n      border-bottom: 1px solid #e7eaec !important;\r\n    }\r\n    .font-bold {\r\n      font-weight: 600;\r\n    }\r\n    .font-normal {\r\n      font-weight: 400;\r\n    }\r\n    .text-uppercase {\r\n      text-transform: uppercase;\r\n    }\r\n    .font-italic {\r\n      font-style: italic;\r\n    }\r\n    .b-r {\r\n      border-right: 1px solid #e7eaec;\r\n    }\r\n    .hr-line-dashed {\r\n      border-top: 1px dashed #e7eaec;\r\n      color: #ffffff;\r\n      background-color: #ffffff;\r\n      height: 1px;\r\n      margin: 20px 0;\r\n    }\r\n    .hr-line-solid {\r\n      border-bottom: 1px solid #e7eaec;\r\n      background-color: rgba(0, 0, 0, 0);\r\n      border-style: solid !important;\r\n      margin-top: 15px;\r\n      margin-bottom: 15px;\r\n    }\r\n    video {\r\n      width: 100% !important;\r\n      height: auto !important;\r\n    }\r\n    /* GALLERY */\r\n    .gallery > .row > div {\r\n      margin-bottom: 15px;\r\n    }\r\n    .fancybox img {\r\n      margin-bottom: 5px;\r\n      /* Only for demo */\r\n      width: 24%;\r\n    }\r\n    /* Summernote text editor  */\r\n    .note-editor {\r\n      height: auto !important;\r\n    }\r\n    .note-editor.fullscreen {\r\n      z-index: 2050;\r\n    }\r\n    .note-editor.note-frame.fullscreen {\r\n      z-index: 2020;\r\n    }\r\n    .note-editor.note-frame .note-editing-area .note-editable {\r\n      color: #676a6c;\r\n      padding: 15px;\r\n    }\r\n    .note-editor.note-frame {\r\n      border: none;\r\n    }\r\n    .note-editor.panel {\r\n      margin-bottom: 0;\r\n    }\r\n    /* MODAL */\r\n    .modal-content {\r\n      background-clip: padding-box;\r\n      background-color: #FFFFFF;\r\n      border: 1px solid rgba(0, 0, 0, 0);\r\n      border-radius: 4px;\r\n      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);\r\n      outline: 0 none;\r\n      position: relative;\r\n    }\r\n    .modal-dialog {\r\n      z-index: 2200;\r\n    }\r\n    .modal-body {\r\n      padding: 20px 30px 30px 30px;\r\n    }\r\n    .inmodal .modal-body {\r\n      background: #f8fafb;\r\n    }\r\n    .inmodal .modal-header {\r\n      padding: 30px 15px;\r\n      text-align: center;\r\n    }\r\n    .animated.modal.fade .modal-dialog {\r\n      -webkit-transform: none;\r\n      -ms-transform: none;\r\n      -o-transform: none;\r\n      transform: none;\r\n    }\r\n    .inmodal .modal-title {\r\n      font-size: 26px;\r\n    }\r\n    .inmodal .modal-icon {\r\n      font-size: 84px;\r\n      color: #e2e3e3;\r\n    }\r\n    .modal-footer {\r\n      margin-top: 0;\r\n    }\r\n    /* WRAPPERS */\r\n    #wrapper {\r\n      width: 100%;\r\n      overflow-x: hidden;\r\n    }\r\n    .wrapper {\r\n      padding: 0 20px;\r\n    }\r\n    .wrapper-content {\r\n      padding: 20px 10px 40px;\r\n    }\r\n    #page-wrapper {\r\n      padding: 0 15px;\r\n      min-height: 568px;\r\n      position: relative !important;\r\n    }\r\n    @media (min-width: 768px) {\r\n      #page-wrapper {\r\n        position: inherit;\r\n        margin: 0 0 0 240px;\r\n        min-height: 2002px;\r\n      }\r\n    }\r\n    .title-action {\r\n      text-align: right;\r\n      padding-top: 30px;\r\n    }\r\n    .ibox-content h1,\r\n    .ibox-content h2,\r\n    .ibox-content h3,\r\n    .ibox-content h4,\r\n    .ibox-content h5,\r\n    .ibox-title h1,\r\n    .ibox-title h2,\r\n    .ibox-title h3,\r\n    .ibox-title h4,\r\n    .ibox-title h5 {\r\n      margin-top: 5px;\r\n    }\r\n    ul.unstyled,\r\n    ol.unstyled {\r\n      list-style: none outside none;\r\n      margin-left: 0;\r\n    }\r\n    .big-icon {\r\n      font-size: 160px !important;\r\n      color: #e5e6e7;\r\n    }\r\n    /* FOOTER */\r\n    .footer {\r\n      background: none repeat scroll 0 0 white;\r\n      border-top: 1px solid #e7eaec;\r\n      bottom: 0;\r\n      left: 0;\r\n      padding: 10px 20px;\r\n      position: absolute;\r\n      right: 0;\r\n    }\r\n    .footer.fixed_full {\r\n      position: fixed;\r\n      bottom: 0;\r\n      left: 0;\r\n      right: 0;\r\n      z-index: 1000;\r\n      padding: 10px 20px;\r\n      background: white;\r\n      border-top: 1px solid #e7eaec;\r\n    }\r\n    .footer.fixed {\r\n      position: fixed;\r\n      bottom: 0;\r\n      left: 0;\r\n      right: 0;\r\n      z-index: 1000;\r\n      padding: 10px 20px;\r\n      background: white;\r\n      border-top: 1px solid #e7eaec;\r\n      margin-left: 220px;\r\n    }\r\n    body.mini-navbar .footer.fixed,\r\n    body.body-small.mini-navbar .footer.fixed {\r\n      margin: 0 0 0 70px;\r\n    }\r\n    body.mini-navbar.canvas-menu .footer.fixed,\r\n    body.canvas-menu .footer.fixed {\r\n      margin: 0 !important;\r\n    }\r\n    body.fixed-sidebar.body-small.mini-navbar .footer.fixed {\r\n      margin: 0 0 0 220px;\r\n    }\r\n    body.body-small .footer.fixed {\r\n      margin-left: 0;\r\n    }\r\n    /* PANELS */\r\n    .page-heading {\r\n      border-top: 0;\r\n      padding: 0 10px 20px 10px;\r\n    }\r\n    .panel-heading h1,\r\n    .panel-heading h2 {\r\n      margin-bottom: 5px;\r\n    }\r\n    /* TABLES */\r\n    .table-bordered {\r\n      border: 1px solid #EBEBEB;\r\n    }\r\n    .table-bordered > thead > tr > th,\r\n    .table-bordered > thead > tr > td {\r\n      background-color: #F5F5F6;\r\n      border-bottom-width: 1px;\r\n    }\r\n    .table-bordered > thead > tr > th,\r\n    .table-bordered > tbody > tr > th,\r\n    .table-bordered > tfoot > tr > th,\r\n    .table-bordered > thead > tr > td,\r\n    .table-bordered > tbody > tr > td,\r\n    .table-bordered > tfoot > tr > td {\r\n      border: 1px solid #e7e7e7;\r\n    }\r\n    .table > thead > tr > th {\r\n      border-bottom: 1px solid #DDDDDD;\r\n      vertical-align: bottom;\r\n    }\r\n    .table > thead > tr > th,\r\n    .table > tbody > tr > th,\r\n    .table > tfoot > tr > th,\r\n    .table > thead > tr > td,\r\n    .table > tbody > tr > td,\r\n    .table > tfoot > tr > td {\r\n      border-top: 1px solid #e7eaec;\r\n      line-height: 1.42857;\r\n      padding: 8px;\r\n      vertical-align: top;\r\n    }\r\n    /* PANELS */\r\n    .panel.blank-panel {\r\n      background: none;\r\n      margin: 0;\r\n    }\r\n    .blank-panel .panel-heading {\r\n      padding-bottom: 0;\r\n    }\r\n    .nav-tabs > li > a {\r\n      color: #A7B1C2;\r\n      font-weight: 600;\r\n      padding: 10px 20px 10px 25px;\r\n    }\r\n    .nav-tabs > li > a:hover,\r\n    .nav-tabs > li > a:focus {\r\n      background-color: #e6e6e6;\r\n      color: #676a6c;\r\n    }\r\n    .ui-tab .tab-content {\r\n      padding: 20px 0;\r\n    }\r\n    /* GLOBAL  */\r\n    .no-padding {\r\n      padding: 0 !important;\r\n    }\r\n    .no-borders {\r\n      border: none !important;\r\n    }\r\n    .no-margins {\r\n      margin: 0 !important;\r\n    }\r\n    .no-top-border {\r\n      border-top: 0 !important;\r\n    }\r\n    .ibox-content.text-box {\r\n      padding-bottom: 0;\r\n      padding-top: 15px;\r\n    }\r\n    .border-left-right {\r\n      border-left: 1px solid #e7eaec;\r\n      border-right: 1px solid #e7eaec;\r\n    }\r\n    .border-top-bottom {\r\n      border-top: 1px solid #e7eaec;\r\n      border-bottom: 1px solid #e7eaec;\r\n    }\r\n    .border-left {\r\n      border-left: 1px solid #e7eaec;\r\n    }\r\n    .border-right {\r\n      border-right: 1px solid #e7eaec;\r\n    }\r\n    .border-top {\r\n      border-top: 1px solid #e7eaec;\r\n    }\r\n    .border-bottom {\r\n      border-bottom: 1px solid #e7eaec;\r\n    }\r\n    .border-size-sm {\r\n      border-width: 3px;\r\n    }\r\n    .border-size-md {\r\n      border-width: 6px;\r\n    }\r\n    .border-size-lg {\r\n      border-width: 9px;\r\n    }\r\n    .border-size-xl {\r\n      border-width: 12px;\r\n    }\r\n    .full-width {\r\n      width: 100% !important;\r\n    }\r\n    .link-block {\r\n      font-size: 12px;\r\n      padding: 10px;\r\n    }\r\n    .nav.navbar-top-links .link-block a {\r\n      font-size: 12px;\r\n    }\r\n    .link-block a {\r\n      font-size: 10px;\r\n      color: inherit;\r\n    }\r\n    body.mini-navbar .branding {\r\n      display: none;\r\n    }\r\n    img.circle-border {\r\n      border: 6px solid #FFFFFF;\r\n      border-radius: 50%;\r\n    }\r\n    .branding {\r\n      float: left;\r\n      color: #FFFFFF;\r\n      font-size: 18px;\r\n      font-weight: 600;\r\n      padding: 17px 20px;\r\n      text-align: center;\r\n      background-color: #1ab394;\r\n    }\r\n    .login-panel {\r\n      margin-top: 25%;\r\n    }\r\n    .icons-box h3 {\r\n      margin-top: 10px;\r\n      margin-bottom: 10px;\r\n    }\r\n    .icons-box .infont a i {\r\n      font-size: 25px;\r\n      display: block;\r\n      color: #676a6c;\r\n    }\r\n    .icons-box .infont a {\r\n      color: #a6a8a9;\r\n    }\r\n    .icons-box .infont a {\r\n      padding: 10px;\r\n      margin: 1px;\r\n      display: block;\r\n    }\r\n    .ui-draggable .ibox-title {\r\n      cursor: move;\r\n    }\r\n    .breadcrumb {\r\n      background-color: #ffffff;\r\n      padding: 0;\r\n      margin-bottom: 0;\r\n    }\r\n    .breadcrumb > li a {\r\n      color: inherit;\r\n    }\r\n    .breadcrumb > .active {\r\n      color: inherit;\r\n    }\r\n    code {\r\n      background-color: #F9F2F4;\r\n      border-radius: 4px;\r\n      color: #ca4440;\r\n      font-size: 90%;\r\n      padding: 2px 4px;\r\n      white-space: nowrap;\r\n    }\r\n    .ibox {\r\n      clear: both;\r\n      margin-bottom: 25px;\r\n      margin-top: 0;\r\n      padding: 0;\r\n    }\r\n    .ibox.collapsed .ibox-content {\r\n      display: none;\r\n    }\r\n    .ibox.collapsed .fa.fa-chevron-up:before {\r\n      content: \"\\F078\";\r\n    }\r\n    .ibox.collapsed .fa.fa-chevron-down:before {\r\n      content: \"\\F077\";\r\n    }\r\n    .ibox:after,\r\n    .ibox:before {\r\n      display: table;\r\n    }\r\n    .ibox-title {\r\n      -moz-border-bottom-colors: none;\r\n      -moz-border-left-colors: none;\r\n      -moz-border-right-colors: none;\r\n      -moz-border-top-colors: none;\r\n      background-color: #ffffff;\r\n      border-color: #e7eaec;\r\n      border-image: none;\r\n      border-style: solid solid none;\r\n      border-width: 2px 0 0;\r\n      color: inherit;\r\n      margin-bottom: 0;\r\n      padding: 15px 15px 7px;\r\n      min-height: 48px;\r\n    }\r\n    .ibox-content {\r\n      background-color: #ffffff;\r\n      color: inherit;\r\n      padding: 15px 20px 20px 20px;\r\n      border-color: #e7eaec;\r\n      border-image: none;\r\n      border-style: solid solid none;\r\n      border-width: 1px 0;\r\n    }\r\n    .ibox-footer {\r\n      color: inherit;\r\n      border-top: 1px solid #e7eaec;\r\n      font-size: 90%;\r\n      background: #ffffff;\r\n      padding: 10px 15px;\r\n    }\r\n    table.table-mail tr td {\r\n      padding: 12px;\r\n    }\r\n    .table-mail .check-mail {\r\n      padding-left: 20px;\r\n    }\r\n    .table-mail .mail-date {\r\n      padding-right: 20px;\r\n    }\r\n    .star-mail,\r\n    .check-mail {\r\n      width: 40px;\r\n    }\r\n    .unread td a,\r\n    .unread td {\r\n      font-weight: 600;\r\n      color: inherit;\r\n    }\r\n    .read td a,\r\n    .read td {\r\n      font-weight: normal;\r\n      color: inherit;\r\n    }\r\n    .unread td {\r\n      background-color: #f9f8f8;\r\n    }\r\n    .ibox-content {\r\n      clear: both;\r\n    }\r\n    .ibox-heading {\r\n      background-color: #f3f6fb;\r\n      border-bottom: none;\r\n    }\r\n    .ibox-heading h3 {\r\n      font-weight: 200;\r\n      font-size: 24px;\r\n    }\r\n    .ibox-title h5 {\r\n      display: inline-block;\r\n      font-size: 14px;\r\n      margin: 0 0 7px;\r\n      padding: 0;\r\n      text-overflow: ellipsis;\r\n      float: left;\r\n    }\r\n    .ibox-title .label {\r\n      float: left;\r\n      margin-left: 4px;\r\n    }\r\n    .ibox-tools {\r\n      display: block;\r\n      float: none;\r\n      margin-top: 0;\r\n      position: relative;\r\n      padding: 0;\r\n      text-align: right;\r\n    }\r\n    .ibox-tools a {\r\n      cursor: pointer;\r\n      margin-left: 5px;\r\n      color: #c4c4c4;\r\n    }\r\n    .ibox-tools a.btn-primary {\r\n      color: #fff;\r\n    }\r\n    .ibox-tools .dropdown-menu > li > a {\r\n      padding: 4px 10px;\r\n      font-size: 12px;\r\n    }\r\n    .ibox .ibox-tools.open > .dropdown-menu {\r\n      left: auto;\r\n      right: 0;\r\n    }\r\n    /* BACKGROUNDS */\r\n    .gray-bg,\r\n    .bg-muted {\r\n      background-color: #f3f3f4;\r\n    }\r\n    .white-bg {\r\n      background-color: #ffffff;\r\n    }\r\n    .blue-bg,\r\n    .bg-success {\r\n      background-color: #1c84c6;\r\n      color: #ffffff;\r\n    }\r\n    .navy-bg,\r\n    .bg-primary {\r\n      background-color: #1ab394;\r\n      color: #ffffff;\r\n    }\r\n    .lazur-bg,\r\n    .bg-info {\r\n      background-color: #23c6c8;\r\n      color: #ffffff;\r\n    }\r\n    .yellow-bg,\r\n    .bg-warning {\r\n      background-color: #f8ac59;\r\n      color: #ffffff;\r\n    }\r\n    .red-bg,\r\n    .bg-danger {\r\n      background-color: #ed5565;\r\n      color: #ffffff;\r\n    }\r\n    .black-bg {\r\n      background-color: #262626;\r\n    }\r\n    .panel-primary {\r\n      border-color: #1ab394;\r\n    }\r\n    .panel-primary > .panel-heading {\r\n      background-color: #1ab394;\r\n      border-color: #1ab394;\r\n    }\r\n    .panel-success {\r\n      border-color: #1c84c6;\r\n    }\r\n    .panel-success > .panel-heading {\r\n      background-color: #1c84c6;\r\n      border-color: #1c84c6;\r\n      color: #ffffff;\r\n    }\r\n    .panel-info {\r\n      border-color: #23c6c8;\r\n    }\r\n    .panel-info > .panel-heading {\r\n      background-color: #23c6c8;\r\n      border-color: #23c6c8;\r\n      color: #ffffff;\r\n    }\r\n    .panel-warning {\r\n      border-color: #f8ac59;\r\n    }\r\n    .panel-warning > .panel-heading {\r\n      background-color: #f8ac59;\r\n      border-color: #f8ac59;\r\n      color: #ffffff;\r\n    }\r\n    .panel-danger {\r\n      border-color: #ed5565;\r\n    }\r\n    .panel-danger > .panel-heading {\r\n      background-color: #ed5565;\r\n      border-color: #ed5565;\r\n      color: #ffffff;\r\n    }\r\n    .progress-bar {\r\n      background-color: #f77032;\r\n    }\r\n    .progress-small,\r\n    .progress-small .progress-bar {\r\n      height: 10px;\r\n    }\r\n    .progress-small,\r\n    .progress-mini {\r\n      margin-top: 5px;\r\n    }\r\n    .progress-mini,\r\n    .progress-mini .progress-bar {\r\n      height: 5px;\r\n      margin-bottom: 0;\r\n    }\r\n    .progress-bar-navy-light {\r\n      background-color: #3dc7ab;\r\n    }\r\n    .progress-bar-success {\r\n      background-color: #1c84c6;\r\n    }\r\n    .progress-bar-info {\r\n      background-color: #23c6c8;\r\n    }\r\n    .progress-bar-warning {\r\n      background-color: #f8ac59;\r\n    }\r\n    .progress-bar-danger {\r\n      background-color: #ed5565;\r\n    }\r\n    .panel-title {\r\n      font-size: inherit;\r\n    }\r\n    .jumbotron {\r\n      border-radius: 6px;\r\n      padding: 40px;\r\n    }\r\n    .jumbotron h1 {\r\n      margin-top: 0;\r\n    }\r\n    /* COLORS */\r\n    .text-navy {\r\n      color: #1ab394;\r\n    }\r\n    .text-primary {\r\n      color: inherit;\r\n    }\r\n    .text-success {\r\n      color: #1c84c6;\r\n    }\r\n    .text-info {\r\n      color: #23c6c8;\r\n    }\r\n    .text-warning {\r\n      color: #f8ac59;\r\n    }\r\n    .text-danger {\r\n      color: #ed5565;\r\n    }\r\n    .text-muted {\r\n      color: #888888;\r\n    }\r\n    .text-white {\r\n      color: #ffffff;\r\n    }\r\n    .simple_tag {\r\n      background-color: #f3f3f4;\r\n      border: 1px solid #e7eaec;\r\n      border-radius: 2px;\r\n      color: inherit;\r\n      font-size: 10px;\r\n      margin-right: 5px;\r\n      margin-top: 5px;\r\n      padding: 5px 12px;\r\n      display: inline-block;\r\n    }\r\n    .img-shadow {\r\n      -webkit-box-shadow: 0 0 3px 0 #919191;\r\n      -moz-box-shadow: 0 0 3px 0 #919191;\r\n      box-shadow: 0 0 3px 0 #919191;\r\n    }\r\n    /* For handle diferent bg color in AngularJS version */\r\n    .dashboards\\.dashboard_2 nav.navbar,\r\n    .dashboards\\.dashboard_3 nav.navbar,\r\n    .mailbox\\.inbox nav.navbar,\r\n    .mailbox\\.email_view nav.navbar,\r\n    .mailbox\\.email_compose nav.navbar,\r\n    .dashboards\\.dashboard_4_1 nav.navbar,\r\n    .metrics nav.navbar,\r\n    .metrics\\.index nav.navbar,\r\n    .dashboards\\.dashboard_5 nav.navbar {\r\n      background: #fff;\r\n    }\r\n    /* For handle diferent bg color in MVC version */\r\n    .Dashboard_2 .navbar.navbar-static-top,\r\n    .Dashboard_3 .navbar.navbar-static-top,\r\n    .Dashboard_4_1 .navbar.navbar-static-top,\r\n    .ComposeEmail .navbar.navbar-static-top,\r\n    .EmailView .navbar.navbar-static-top,\r\n    .Inbox .navbar.navbar-static-top,\r\n    .Metrics .navbar.navbar-static-top,\r\n    .Dashboard_5 .navbar.navbar-static-top {\r\n      background: #fff;\r\n    }\r\n    a.close-canvas-menu {\r\n      position: absolute;\r\n      top: 10px;\r\n      right: 15px;\r\n      z-index: 1011;\r\n      color: #a7b1c2;\r\n    }\r\n    a.close-canvas-menu:hover {\r\n      color: #fff;\r\n    }\r\n    .close-canvas-menu {\r\n      display: none;\r\n    }\r\n    .canvas-menu .close-canvas-menu {\r\n      display: block;\r\n    }\r\n    .light-navbar .navbar.navbar-static-top {\r\n      background-color: #ffffff;\r\n    }\r\n    /* FULL HEIGHT */\r\n    .full-height {\r\n      height: 100%;\r\n    }\r\n    .fh-breadcrumb {\r\n      height: calc(100% - 196px);\r\n      margin: 0 -15px;\r\n      position: relative;\r\n    }\r\n    .fh-no-breadcrumb {\r\n      height: calc(100% - 99px);\r\n      margin: 0 -15px;\r\n      position: relative;\r\n    }\r\n    .fh-column {\r\n      background: #fff;\r\n      height: 100%;\r\n      width: 240px;\r\n      float: left;\r\n    }\r\n    .modal-backdrop {\r\n      z-index: 2040 !important;\r\n    }\r\n    .modal {\r\n      z-index: 2050 !important;\r\n    }\r\n    .spiner-example {\r\n      height: 200px;\r\n      padding-top: 70px;\r\n    }\r\n    /* MARGINS & PADDINGS */\r\n    .p-xxs {\r\n      padding: 5px;\r\n    }\r\n    .p-xs {\r\n      padding: 10px;\r\n    }\r\n    .p-sm {\r\n      padding: 15px;\r\n    }\r\n    .p-m {\r\n      padding: 20px;\r\n    }\r\n    .p-md {\r\n      padding: 25px;\r\n    }\r\n    .p-lg {\r\n      padding: 30px;\r\n    }\r\n    .p-xl {\r\n      padding: 40px;\r\n    }\r\n    .p-w-xs {\r\n      padding: 0 10px;\r\n    }\r\n    .p-w-sm {\r\n      padding: 0 15px;\r\n    }\r\n    .p-w-m {\r\n      padding: 0 20px;\r\n    }\r\n    .p-w-md {\r\n      padding: 0 25px;\r\n    }\r\n    .p-w-lg {\r\n      padding: 0 30px;\r\n    }\r\n    .p-w-xl {\r\n      padding: 0 40px;\r\n    }\r\n    .p-h-xs {\r\n      padding: 10px 0;\r\n    }\r\n    .p-h-sm {\r\n      padding: 15px 0;\r\n    }\r\n    .p-h-m {\r\n      padding: 20px 0;\r\n    }\r\n    .p-h-md {\r\n      padding: 25px 0;\r\n    }\r\n    .p-h-lg {\r\n      padding: 30px 0;\r\n    }\r\n    .p-h-xl {\r\n      padding: 40px 0;\r\n    }\r\n    .m-xxs {\r\n      margin: 2px 4px;\r\n    }\r\n    .m {\r\n      margin: 15px;\r\n    }\r\n    .m-xs {\r\n      margin: 5px;\r\n    }\r\n    .m-sm {\r\n      margin: 10px;\r\n    }\r\n    .m-md {\r\n      margin: 20px;\r\n    }\r\n    .m-lg {\r\n      margin: 30px;\r\n    }\r\n    .m-xl {\r\n      margin: 50px;\r\n    }\r\n    .m-n {\r\n      margin: 0 !important;\r\n    }\r\n    .m-l-none {\r\n      margin-left: 0;\r\n    }\r\n    .m-l-xs {\r\n      margin-left: 5px;\r\n    }\r\n    .m-l-sm {\r\n      margin-left: 10px;\r\n    }\r\n    .m-l {\r\n      margin-left: 15px;\r\n    }\r\n    .m-l-md {\r\n      margin-left: 20px;\r\n    }\r\n    .m-l-lg {\r\n      margin-left: 30px;\r\n    }\r\n    .m-l-xl {\r\n      margin-left: 40px;\r\n    }\r\n    .m-l-n-xxs {\r\n      margin-left: -1px;\r\n    }\r\n    .m-l-n-xs {\r\n      margin-left: -5px;\r\n    }\r\n    .m-l-n-sm {\r\n      margin-left: -10px;\r\n    }\r\n    .m-l-n {\r\n      margin-left: -15px;\r\n    }\r\n    .m-l-n-md {\r\n      margin-left: -20px;\r\n    }\r\n    .m-l-n-lg {\r\n      margin-left: -30px;\r\n    }\r\n    .m-l-n-xl {\r\n      margin-left: -40px;\r\n    }\r\n    .m-t-none {\r\n      margin-top: 0;\r\n    }\r\n    .m-t-xxs {\r\n      margin-top: 1px;\r\n    }\r\n    .m-t-xs {\r\n      margin-top: 5px;\r\n    }\r\n    .m-t-sm {\r\n      margin-top: 10px;\r\n    }\r\n    .m-t {\r\n      margin-top: 15px;\r\n    }\r\n    .m-t-md {\r\n      margin-top: 20px;\r\n    }\r\n    .m-t-lg {\r\n      margin-top: 30px;\r\n    }\r\n    .m-t-xl {\r\n      margin-top: 40px;\r\n    }\r\n    .m-t-n-xxs {\r\n      margin-top: -1px;\r\n    }\r\n    .m-t-n-xs {\r\n      margin-top: -5px;\r\n    }\r\n    .m-t-n-sm {\r\n      margin-top: -10px;\r\n    }\r\n    .m-t-n {\r\n      margin-top: -15px;\r\n    }\r\n    .m-t-n-md {\r\n      margin-top: -20px;\r\n    }\r\n    .m-t-n-lg {\r\n      margin-top: -30px;\r\n    }\r\n    .m-t-n-xl {\r\n      margin-top: -40px;\r\n    }\r\n    .m-r-none {\r\n      margin-right: 0;\r\n    }\r\n    .m-r-xxs {\r\n      margin-right: 1px;\r\n    }\r\n    .m-r-xs {\r\n      margin-right: 5px;\r\n    }\r\n    .m-r-sm {\r\n      margin-right: 10px;\r\n    }\r\n    .m-r {\r\n      margin-right: 15px;\r\n    }\r\n    .m-r-md {\r\n      margin-right: 20px;\r\n    }\r\n    .m-r-lg {\r\n      margin-right: 30px;\r\n    }\r\n    .m-r-xl {\r\n      margin-right: 40px;\r\n    }\r\n    .m-r-n-xxs {\r\n      margin-right: -1px;\r\n    }\r\n    .m-r-n-xs {\r\n      margin-right: -5px;\r\n    }\r\n    .m-r-n-sm {\r\n      margin-right: -10px;\r\n    }\r\n    .m-r-n {\r\n      margin-right: -15px;\r\n    }\r\n    .m-r-n-md {\r\n      margin-right: -20px;\r\n    }\r\n    .m-r-n-lg {\r\n      margin-right: -30px;\r\n    }\r\n    .m-r-n-xl {\r\n      margin-right: -40px;\r\n    }\r\n    .m-b-none {\r\n      margin-bottom: 0;\r\n    }\r\n    .m-b-xxs {\r\n      margin-bottom: 1px;\r\n    }\r\n    .m-b-xs {\r\n      margin-bottom: 5px;\r\n    }\r\n    .m-b-sm {\r\n      margin-bottom: 10px;\r\n    }\r\n    .m-b {\r\n      margin-bottom: 15px;\r\n    }\r\n    .m-b-md {\r\n      margin-bottom: 20px;\r\n    }\r\n    .m-b-lg {\r\n      margin-bottom: 30px;\r\n    }\r\n    .m-b-xl {\r\n      margin-bottom: 40px;\r\n    }\r\n    .m-b-n-xxs {\r\n      margin-bottom: -1px;\r\n    }\r\n    .m-b-n-xs {\r\n      margin-bottom: -5px;\r\n    }\r\n    .m-b-n-sm {\r\n      margin-bottom: -10px;\r\n    }\r\n    .m-b-n {\r\n      margin-bottom: -15px;\r\n    }\r\n    .m-b-n-md {\r\n      margin-bottom: -20px;\r\n    }\r\n    .m-b-n-lg {\r\n      margin-bottom: -30px;\r\n    }\r\n    .m-b-n-xl {\r\n      margin-bottom: -40px;\r\n    }\r\n    .space-15 {\r\n      margin: 15px 0;\r\n    }\r\n    .space-20 {\r\n      margin: 20px 0;\r\n    }\r\n    .space-25 {\r\n      margin: 25px 0;\r\n    }\r\n    .space-30 {\r\n      margin: 30px 0;\r\n    }\r\n    .img-sm {\r\n      width: 32px;\r\n      height: 32px;\r\n    }\r\n    .img-md {\r\n      width: 64px;\r\n      height: 64px;\r\n    }\r\n    .img-lg {\r\n      width: 96px;\r\n      height: 96px;\r\n    }\r\n    .b-r-xs {\r\n      -webkit-border-radius: 1px;\r\n      -moz-border-radius: 1px;\r\n      border-radius: 1px;\r\n    }\r\n    .b-r-sm {\r\n      -webkit-border-radius: 3px;\r\n      -moz-border-radius: 3px;\r\n      border-radius: 3px;\r\n    }\r\n    .b-r-md {\r\n      -webkit-border-radius: 6px;\r\n      -moz-border-radius: 6px;\r\n      border-radius: 6px;\r\n    }\r\n    .b-r-lg {\r\n      -webkit-border-radius: 12px;\r\n      -moz-border-radius: 12px;\r\n      border-radius: 12px;\r\n    }\r\n    .b-r-xl {\r\n      -webkit-border-radius: 24px;\r\n      -moz-border-radius: 24px;\r\n      border-radius: 24px;\r\n    }\r\n    .fullscreen-ibox-mode .animated {\r\n      animation: none;\r\n    }\r\n    body.fullscreen-ibox-mode {\r\n      overflow-y: hidden;\r\n    }\r\n    .ibox.fullscreen {\r\n      z-index: 2030;\r\n      position: fixed;\r\n      top: 0;\r\n      left: 0;\r\n      right: 0;\r\n      bottom: 0;\r\n      overflow: auto;\r\n      margin-bottom: 0;\r\n    }\r\n    .ibox.fullscreen .collapse-link {\r\n      display: none;\r\n    }\r\n    .ibox.fullscreen .ibox-content {\r\n      min-height: calc(100% - 48px);\r\n    }\r\n    body.modal-open {\r\n      padding-right: inherit !important;\r\n    }\r\n    body.modal-open .wrapper-content.animated {\r\n      -webkit-animation: none;\r\n      -ms-animation-nam: none;\r\n      animation: none;\r\n    }\r\n    body.modal-open .animated {\r\n      animation-fill-mode: initial;\r\n      z-index: inherit;\r\n    }\r\n    /* Show profile dropdown on fixed sidebar */\r\n    body.mini-navbar.fixed-sidebar .profile-element,\r\n    .block {\r\n      display: block !important;\r\n    }\r\n    body.mini-navbar.fixed-sidebar .nav-header {\r\n      padding: 33px 25px;\r\n    }\r\n    body.mini-navbar.fixed-sidebar .logo-element {\r\n      display: none;\r\n    }\r\n    .fullscreen-video .animated {\r\n      animation: none;\r\n    }\r\n    /* SEARCH PAGE */\r\n    .search-form {\r\n      margin-top: 10px;\r\n    }\r\n    .search-result h3 {\r\n      margin-bottom: 0;\r\n      color: #1E0FBE;\r\n    }\r\n    .search-result .search-link {\r\n      color: #006621;\r\n    }\r\n    .search-result p {\r\n      font-size: 12px;\r\n      margin-top: 5px;\r\n    }\r\n    /* CONTACTS */\r\n    .contact-box {\r\n      background-color: #ffffff;\r\n      border: 1px solid #e7eaec;\r\n      padding: 20px;\r\n      margin-bottom: 20px;\r\n    }\r\n    .contact-box > a {\r\n      color: inherit;\r\n    }\r\n    .contact-box.center-version {\r\n      border: 1px solid #e7eaec;\r\n      padding: 0;\r\n    }\r\n    .contact-box.center-version > a {\r\n      display: block;\r\n      background-color: #ffffff;\r\n      padding: 20px;\r\n      text-align: center;\r\n    }\r\n    .contact-box.center-version > a img {\r\n      width: 80px;\r\n      height: 80px;\r\n      margin-top: 10px;\r\n      margin-bottom: 10px;\r\n    }\r\n    .contact-box.center-version address {\r\n      margin-bottom: 0;\r\n    }\r\n    .contact-box .contact-box-footer {\r\n      text-align: center;\r\n      background-color: #ffffff;\r\n      border-top: 1px solid #e7eaec;\r\n      padding: 15px 20px;\r\n    }\r\n    /* INVOICE */\r\n    .invoice-table tbody > tr > td:last-child,\r\n    .invoice-table tbody > tr > td:nth-child(4),\r\n    .invoice-table tbody > tr > td:nth-child(3),\r\n    .invoice-table tbody > tr > td:nth-child(2) {\r\n      text-align: right;\r\n    }\r\n    .invoice-table thead > tr > th:last-child,\r\n    .invoice-table thead > tr > th:nth-child(4),\r\n    .invoice-table thead > tr > th:nth-child(3),\r\n    .invoice-table thead > tr > th:nth-child(2) {\r\n      text-align: right;\r\n    }\r\n    .invoice-total > tbody > tr > td:first-child {\r\n      text-align: right;\r\n    }\r\n    .invoice-total > tbody > tr > td {\r\n      border: 0 none;\r\n    }\r\n    .invoice-total > tbody > tr > td:last-child {\r\n      border-bottom: 1px solid #DDDDDD;\r\n      text-align: right;\r\n      width: 15%;\r\n    }\r\n    /* ERROR & LOGIN & LOCKSCREEN*/\r\n    .middle-box {\r\n      max-width: 400px;\r\n      z-index: 100;\r\n      margin: 0 auto;\r\n      padding-top: 40px;\r\n    }\r\n    .lockscreen.middle-box {\r\n      width: 200px;\r\n      padding-top: 110px;\r\n    }\r\n    .loginscreen.middle-box {\r\n      width: 300px;\r\n    }\r\n    .loginColumns {\r\n      max-width: 800px;\r\n      margin: 0 auto;\r\n      padding: 100px 20px 20px 20px;\r\n    }\r\n    .passwordBox {\r\n      max-width: 460px;\r\n      margin: 0 auto;\r\n      padding: 100px 20px 20px 20px;\r\n    }\r\n    .logo-name {\r\n      color: #e6e6e6;\r\n      font-size: 180px;\r\n      font-weight: 800;\r\n      letter-spacing: -10px;\r\n      margin-bottom: 0;\r\n    }\r\n    .middle-box h1 {\r\n      font-size: 170px;\r\n    }\r\n    .wrapper .middle-box {\r\n      margin-top: 140px;\r\n    }\r\n    .lock-word {\r\n      z-index: 10;\r\n      position: absolute;\r\n      top: 110px;\r\n      left: 50%;\r\n      margin-left: -470px;\r\n    }\r\n    .lock-word span {\r\n      font-size: 100px;\r\n      font-weight: 600;\r\n      color: #e9e9e9;\r\n      display: inline-block;\r\n    }\r\n    .lock-word .first-word {\r\n      margin-right: 160px;\r\n    }\r\n    /* DASBOARD */\r\n    .dashboard-header {\r\n      border-top: 0;\r\n      padding: 20px 20px 20px 20px;\r\n    }\r\n    .dashboard-header h2 {\r\n      margin-top: 10px;\r\n      font-size: 26px;\r\n    }\r\n    .fist-item {\r\n      border-top: none !important;\r\n    }\r\n    .statistic-box {\r\n      margin-top: 40px;\r\n    }\r\n    .dashboard-header .list-group-item span.label {\r\n      margin-right: 10px;\r\n    }\r\n    .list-group.clear-list .list-group-item {\r\n      border-top: 1px solid #e7eaec;\r\n      border-bottom: 0;\r\n      border-right: 0;\r\n      border-left: 0;\r\n      padding: 10px 0;\r\n    }\r\n    ul.clear-list:first-child {\r\n      border-top: none !important;\r\n    }\r\n    /* Intimeline */\r\n    .timeline-item .date i {\r\n      position: absolute;\r\n      top: 0;\r\n      right: 0;\r\n      padding: 5px;\r\n      width: 30px;\r\n      text-align: center;\r\n      border-top: 1px solid #e7eaec;\r\n      border-bottom: 1px solid #e7eaec;\r\n      border-left: 1px solid #e7eaec;\r\n      background: #f8f8f8;\r\n    }\r\n    .timeline-item .date {\r\n      text-align: right;\r\n      width: 110px;\r\n      position: relative;\r\n      padding-top: 30px;\r\n    }\r\n    .timeline-item .content {\r\n      border-left: 1px solid #e7eaec;\r\n      border-top: 1px solid #e7eaec;\r\n      padding-top: 10px;\r\n      min-height: 100px;\r\n    }\r\n    .timeline-item .content:hover {\r\n      background: #f6f6f6;\r\n    }\r\n    /* PIN BOARD */\r\n    ul.notes li,\r\n    ul.tag-list li {\r\n      list-style: none;\r\n    }\r\n    ul.notes li h4 {\r\n      margin-top: 20px;\r\n      font-size: 16px;\r\n    }\r\n    ul.notes li div {\r\n      text-decoration: none;\r\n      color: #000;\r\n      background: #ffc;\r\n      display: block;\r\n      height: 140px;\r\n      width: 140px;\r\n      padding: 1em;\r\n      position: relative;\r\n    }\r\n    ul.notes li div small {\r\n      position: absolute;\r\n      top: 5px;\r\n      right: 5px;\r\n      font-size: 10px;\r\n    }\r\n    ul.notes li div a {\r\n      position: absolute;\r\n      right: 10px;\r\n      bottom: 10px;\r\n      color: inherit;\r\n    }\r\n    ul.notes li {\r\n      margin: 10px 40px 50px 0;\r\n      float: left;\r\n    }\r\n    ul.notes li div p {\r\n      font-size: 12px;\r\n    }\r\n    ul.notes li div {\r\n      text-decoration: none;\r\n      color: #000;\r\n      background: #ffc;\r\n      display: block;\r\n      height: 140px;\r\n      width: 140px;\r\n      padding: 1em;\r\n      /* Firefox */\r\n      -moz-box-shadow: 5px 5px 2px #212121;\r\n      /* Safari+Chrome */\r\n      -webkit-box-shadow: 5px 5px 2px rgba(33, 33, 33, 0.7);\r\n      /* Opera */\r\n      box-shadow: 5px 5px 2px rgba(33, 33, 33, 0.7);\r\n    }\r\n    ul.notes li div {\r\n      -webkit-transform: rotate(-6deg);\r\n      -o-transform: rotate(-6deg);\r\n      -moz-transform: rotate(-6deg);\r\n      -ms-transform: rotate(-6deg);\r\n    }\r\n    ul.notes li:nth-child(even) div {\r\n      -o-transform: rotate(4deg);\r\n      -webkit-transform: rotate(4deg);\r\n      -moz-transform: rotate(4deg);\r\n      -ms-transform: rotate(4deg);\r\n      position: relative;\r\n      top: 5px;\r\n    }\r\n    ul.notes li:nth-child(3n) div {\r\n      -o-transform: rotate(-3deg);\r\n      -webkit-transform: rotate(-3deg);\r\n      -moz-transform: rotate(-3deg);\r\n      -ms-transform: rotate(-3deg);\r\n      position: relative;\r\n      top: -5px;\r\n    }\r\n    ul.notes li:nth-child(5n) div {\r\n      -o-transform: rotate(5deg);\r\n      -webkit-transform: rotate(5deg);\r\n      -moz-transform: rotate(5deg);\r\n      -ms-transform: rotate(5deg);\r\n      position: relative;\r\n      top: -10px;\r\n    }\r\n    ul.notes li div:hover,\r\n    ul.notes li div:focus {\r\n      -webkit-transform: scale(1.1);\r\n      -moz-transform: scale(1.1);\r\n      -o-transform: scale(1.1);\r\n      -ms-transform: scale(1.1);\r\n      position: relative;\r\n      z-index: 5;\r\n    }\r\n    ul.notes li div {\r\n      text-decoration: none;\r\n      color: #000;\r\n      background: #ffc;\r\n      display: block;\r\n      height: 210px;\r\n      width: 210px;\r\n      padding: 1em;\r\n      -moz-box-shadow: 5px 5px 7px #212121;\r\n      -webkit-box-shadow: 5px 5px 7px rgba(33, 33, 33, 0.7);\r\n      box-shadow: 5px 5px 7px rgba(33, 33, 33, 0.7);\r\n      -moz-transition: -moz-transform 0.15s linear;\r\n      -o-transition: -o-transform 0.15s linear;\r\n      -webkit-transition: -webkit-transform 0.15s linear;\r\n    }\r\n    /* FILE MANAGER */\r\n    .file-box {\r\n      float: left;\r\n      width: 220px;\r\n    }\r\n    .file-manager h5 {\r\n      text-transform: uppercase;\r\n    }\r\n    .file-manager {\r\n      list-style: none outside none;\r\n      margin: 0;\r\n      padding: 0;\r\n    }\r\n    .folder-list li a {\r\n      color: #666666;\r\n      display: block;\r\n      padding: 5px 0;\r\n    }\r\n    .folder-list li {\r\n      border-bottom: 1px solid #e7eaec;\r\n      display: block;\r\n    }\r\n    .folder-list li i {\r\n      margin-right: 8px;\r\n      color: #3d4d5d;\r\n    }\r\n    .category-list li a {\r\n      color: #666666;\r\n      display: block;\r\n      padding: 5px 0;\r\n    }\r\n    .category-list li {\r\n      display: block;\r\n    }\r\n    .category-list li i {\r\n      margin-right: 8px;\r\n      color: #3d4d5d;\r\n    }\r\n    .category-list li a .text-navy {\r\n      color: #1ab394;\r\n    }\r\n    .category-list li a .text-primary {\r\n      color: #1c84c6;\r\n    }\r\n    .category-list li a .text-info {\r\n      color: #23c6c8;\r\n    }\r\n    .category-list li a .text-danger {\r\n      color: #EF5352;\r\n    }\r\n    .category-list li a .text-warning {\r\n      color: #F8AC59;\r\n    }\r\n    .file-manager h5.tag-title {\r\n      margin-top: 20px;\r\n    }\r\n    .tag-list li {\r\n      float: left;\r\n    }\r\n    .tag-list li a {\r\n      font-size: 10px;\r\n      background-color: #f3f3f4;\r\n      padding: 5px 12px;\r\n      color: inherit;\r\n      border-radius: 2px;\r\n      border: 1px solid #e7eaec;\r\n      margin-right: 5px;\r\n      margin-top: 5px;\r\n      display: block;\r\n    }\r\n    .file {\r\n      border: 1px solid #e7eaec;\r\n      padding: 0;\r\n      background-color: #ffffff;\r\n      position: relative;\r\n      margin-bottom: 20px;\r\n      margin-right: 20px;\r\n    }\r\n    .file-manager .hr-line-dashed {\r\n      margin: 15px 0;\r\n    }\r\n    .file .icon,\r\n    .file .image {\r\n      height: 100px;\r\n      overflow: hidden;\r\n    }\r\n    .file .icon {\r\n      padding: 15px 10px;\r\n      text-align: center;\r\n    }\r\n    .file-control {\r\n      color: inherit;\r\n      font-size: 11px;\r\n      margin-right: 10px;\r\n    }\r\n    .file-control.active {\r\n      text-decoration: underline;\r\n    }\r\n    .file .icon i {\r\n      font-size: 70px;\r\n      color: #dadada;\r\n    }\r\n    .file .file-name {\r\n      padding: 10px;\r\n      background-color: #f8f8f8;\r\n      border-top: 1px solid #e7eaec;\r\n    }\r\n    .file-name small {\r\n      color: #676a6c;\r\n    }\r\n    .corner {\r\n      position: absolute;\r\n      display: inline-block;\r\n      width: 0;\r\n      height: 0;\r\n      line-height: 0;\r\n      border: 0.6em solid transparent;\r\n      border-right: 0.6em solid #f1f1f1;\r\n      border-bottom: 0.6em solid #f1f1f1;\r\n      right: 0em;\r\n      bottom: 0em;\r\n    }\r\n    a.compose-mail {\r\n      padding: 8px 10px;\r\n    }\r\n    .mail-search {\r\n      max-width: 300px;\r\n    }\r\n    /* PROFILE */\r\n    .profile-content {\r\n      border-top: none !important;\r\n    }\r\n    .profile-stats {\r\n      margin-right: 10px;\r\n    }\r\n    .profile-image {\r\n      width: 120px;\r\n      float: left;\r\n    }\r\n    .profile-image img {\r\n      width: 96px;\r\n      height: 96px;\r\n    }\r\n    .profile-info {\r\n      margin-left: 120px;\r\n    }\r\n    .feed-activity-list .feed-element {\r\n      border-bottom: 1px solid #e7eaec;\r\n    }\r\n    .feed-element:first-child {\r\n      margin-top: 0;\r\n    }\r\n    .feed-element {\r\n      padding-bottom: 15px;\r\n    }\r\n    .feed-element,\r\n    .feed-element .media {\r\n      margin-top: 15px;\r\n    }\r\n    .feed-element,\r\n    .media-body {\r\n      overflow: hidden;\r\n    }\r\n    .feed-element > .pull-left {\r\n      margin-right: 10px;\r\n    }\r\n    .feed-element img.img-circle,\r\n    .dropdown-messages-box img.img-circle {\r\n      width: 38px;\r\n      height: 38px;\r\n    }\r\n    .feed-element .well {\r\n      border: 1px solid #e7eaec;\r\n      box-shadow: none;\r\n      margin-top: 10px;\r\n      margin-bottom: 5px;\r\n      padding: 10px 20px;\r\n      font-size: 11px;\r\n      line-height: 16px;\r\n    }\r\n    .feed-element .actions {\r\n      margin-top: 10px;\r\n    }\r\n    .feed-element .photos {\r\n      margin: 10px 0;\r\n    }\r\n    .feed-photo {\r\n      max-height: 180px;\r\n      border-radius: 4px;\r\n      overflow: hidden;\r\n      margin-right: 10px;\r\n      margin-bottom: 10px;\r\n    }\r\n    .file-list li {\r\n      padding: 5px 10px;\r\n      font-size: 11px;\r\n      border-radius: 2px;\r\n      border: 1px solid #e7eaec;\r\n      margin-bottom: 5px;\r\n    }\r\n    .file-list li a {\r\n      color: inherit;\r\n    }\r\n    .file-list li a:hover {\r\n      color: #1ab394;\r\n    }\r\n    .user-friends img {\r\n      width: 42px;\r\n      height: 42px;\r\n      margin-bottom: 5px;\r\n      margin-right: 5px;\r\n    }\r\n    /* MAILBOX */\r\n    .mail-box {\r\n      background-color: #ffffff;\r\n      border: 1px solid #e7eaec;\r\n      border-top: 0;\r\n      padding: 0;\r\n      margin-bottom: 20px;\r\n    }\r\n    .mail-box-header {\r\n      background-color: #ffffff;\r\n      border: 1px solid #e7eaec;\r\n      border-bottom: 0;\r\n      padding: 30px 20px 20px 20px;\r\n    }\r\n    .mail-box-header h2 {\r\n      margin-top: 0;\r\n    }\r\n    .mailbox-content .tag-list li a {\r\n      background: #ffffff;\r\n    }\r\n    .mail-body {\r\n      border-top: 1px solid #e7eaec;\r\n      padding: 20px;\r\n    }\r\n    .mail-text {\r\n      border-top: 1px solid #e7eaec;\r\n    }\r\n    .mail-text .note-toolbar {\r\n      padding: 10px 15px;\r\n    }\r\n    .mail-body .form-group {\r\n      margin-bottom: 5px;\r\n    }\r\n    .mail-text .note-editor .note-toolbar {\r\n      background-color: #F9F8F8;\r\n    }\r\n    .mail-attachment {\r\n      border-top: 1px solid #e7eaec;\r\n      padding: 20px;\r\n      font-size: 12px;\r\n    }\r\n    .mailbox-content {\r\n      background: none;\r\n      border: none;\r\n      padding: 10px;\r\n    }\r\n    .mail-ontact {\r\n      width: 23%;\r\n    }\r\n    /* PROJECTS */\r\n    .project-people,\r\n    .project-actions {\r\n      text-align: right;\r\n      vertical-align: middle;\r\n    }\r\n    dd.project-people {\r\n      text-align: left;\r\n      margin-top: 5px;\r\n    }\r\n    .project-people img {\r\n      width: 32px;\r\n      height: 32px;\r\n    }\r\n    .project-title a {\r\n      font-size: 14px;\r\n      color: #676a6c;\r\n      font-weight: 600;\r\n    }\r\n    .project-list table tr td {\r\n      border-top: none;\r\n      border-bottom: 1px solid #e7eaec;\r\n      padding: 15px 10px;\r\n      vertical-align: middle;\r\n    }\r\n    .project-manager .tag-list li a {\r\n      font-size: 10px;\r\n      background-color: white;\r\n      padding: 5px 12px;\r\n      color: inherit;\r\n      border-radius: 2px;\r\n      border: 1px solid #e7eaec;\r\n      margin-right: 5px;\r\n      margin-top: 5px;\r\n      display: block;\r\n    }\r\n    .project-files li a {\r\n      font-size: 11px;\r\n      color: #676a6c;\r\n      margin-left: 10px;\r\n      line-height: 22px;\r\n    }\r\n    /* FAQ */\r\n    .faq-item {\r\n      padding: 20px;\r\n      margin-bottom: 2px;\r\n      background: #fff;\r\n    }\r\n    .faq-question {\r\n      font-size: 18px;\r\n      font-weight: 600;\r\n      color: #1ab394;\r\n      display: block;\r\n    }\r\n    .faq-question:hover {\r\n      color: #179d82;\r\n    }\r\n    .faq-answer {\r\n      margin-top: 10px;\r\n      background: #f3f3f4;\r\n      border: 1px solid #e7eaec;\r\n      border-radius: 3px;\r\n      padding: 15px;\r\n    }\r\n    .faq-item .tag-item {\r\n      background: #f3f3f4;\r\n      padding: 2px 6px;\r\n      font-size: 10px;\r\n      text-transform: uppercase;\r\n    }\r\n    /* Chat view */\r\n    .message-input {\r\n      height: 90px !important;\r\n    }\r\n    .chat-avatar {\r\n      width: 36px;\r\n      height: 36px;\r\n      float: left;\r\n      margin-right: 10px;\r\n    }\r\n    .chat-user-name {\r\n      padding: 10px;\r\n    }\r\n    .chat-user {\r\n      padding: 8px 10px;\r\n      border-bottom: 1px solid #e7eaec;\r\n    }\r\n    .chat-user a {\r\n      color: inherit;\r\n    }\r\n    .chat-view {\r\n      z-index: 20012;\r\n    }\r\n    .chat-users,\r\n    .chat-statistic {\r\n      margin-left: -30px;\r\n    }\r\n    @media (max-width: 992px) {\r\n      .chat-users,\r\n      .chat-statistic {\r\n        margin-left: 0;\r\n      }\r\n    }\r\n    .chat-view .ibox-content {\r\n      padding: 0;\r\n    }\r\n    .chat-message {\r\n      padding: 10px 20px;\r\n    }\r\n    .message-avatar {\r\n      height: 48px;\r\n      width: 48px;\r\n      border: 1px solid #e7eaec;\r\n      border-radius: 4px;\r\n      margin-top: 1px;\r\n    }\r\n    .chat-discussion .chat-message.left .message-avatar {\r\n      float: left;\r\n      margin-right: 10px;\r\n    }\r\n    .chat-discussion .chat-message.right .message-avatar {\r\n      float: right;\r\n      margin-left: 10px;\r\n    }\r\n    .message {\r\n      background-color: #fff;\r\n      border: 1px solid #e7eaec;\r\n      text-align: left;\r\n      display: block;\r\n      padding: 10px 20px;\r\n      position: relative;\r\n      border-radius: 4px;\r\n    }\r\n    .chat-discussion .chat-message.left .message-date {\r\n      float: right;\r\n    }\r\n    .chat-discussion .chat-message.right .message-date {\r\n      float: left;\r\n    }\r\n    .chat-discussion .chat-message.left .message {\r\n      text-align: left;\r\n      margin-left: 55px;\r\n    }\r\n    .chat-discussion .chat-message.right .message {\r\n      text-align: right;\r\n      margin-right: 55px;\r\n    }\r\n    .message-date {\r\n      font-size: 10px;\r\n      color: #888888;\r\n    }\r\n    .message-content {\r\n      display: block;\r\n    }\r\n    .chat-discussion {\r\n      background: #eee;\r\n      padding: 15px;\r\n      height: 400px;\r\n      overflow-y: auto;\r\n    }\r\n    .chat-users {\r\n      overflow-y: auto;\r\n      height: 400px;\r\n    }\r\n    .chat-message-form .form-group {\r\n      margin-bottom: 0;\r\n    }\r\n    /* jsTree */\r\n    .jstree-open > .jstree-anchor > .fa-folder:before {\r\n      content: \"\\F07C\";\r\n    }\r\n    .jstree-default .jstree-icon.none {\r\n      width: 0;\r\n    }\r\n    /* CLIENTS */\r\n    .clients-list {\r\n      margin-top: 20px;\r\n    }\r\n    .clients-list .tab-pane {\r\n      position: relative;\r\n      height: 600px;\r\n    }\r\n    .client-detail {\r\n      position: relative;\r\n      height: 620px;\r\n    }\r\n    .clients-list table tr td {\r\n      height: 46px;\r\n      vertical-align: middle;\r\n      border: none;\r\n    }\r\n    .client-link {\r\n      font-weight: 600;\r\n      color: inherit;\r\n    }\r\n    .client-link:hover {\r\n      color: inherit;\r\n    }\r\n    .client-avatar {\r\n      width: 42px;\r\n    }\r\n    .client-avatar img {\r\n      width: 28px;\r\n      height: 28px;\r\n      border-radius: 50%;\r\n    }\r\n    .contact-type {\r\n      width: 20px;\r\n      color: #c1c3c4;\r\n    }\r\n    .client-status {\r\n      text-align: left;\r\n    }\r\n    .client-detail .vertical-timeline-content p {\r\n      margin: 0;\r\n    }\r\n    .client-detail .vertical-timeline-icon.gray-bg {\r\n      color: #a7aaab;\r\n    }\r\n    .clients-list .nav-tabs > li.active > a,\r\n    .clients-list .nav-tabs > li.active > a:hover,\r\n    .clients-list .nav-tabs > li.active > a:focus {\r\n      border-bottom: 1px solid #fff;\r\n    }\r\n    /* BLOG ARTICLE */\r\n    .blog h2 {\r\n      font-weight: 700;\r\n    }\r\n    .blog h5 {\r\n      margin: 0 0 5px 0;\r\n    }\r\n    .blog .btn {\r\n      margin: 0 0 5px 0;\r\n    }\r\n    .article h1 {\r\n      font-size: 48px;\r\n      font-weight: 700;\r\n      color: #2F4050;\r\n    }\r\n    .article p {\r\n      font-size: 15px;\r\n      line-height: 26px;\r\n    }\r\n    .article-title {\r\n      text-align: center;\r\n      margin: 40px 0 100px 0;\r\n    }\r\n    .article .ibox-content {\r\n      padding: 40px;\r\n    }\r\n    /* ISSUE TRACKER */\r\n    .issue-tracker .btn-link {\r\n      color: #1ab394;\r\n    }\r\n    table.issue-tracker tbody tr td {\r\n      vertical-align: middle;\r\n      height: 50px;\r\n    }\r\n    .issue-info {\r\n      width: 50%;\r\n    }\r\n    .issue-info a {\r\n      font-weight: 600;\r\n      color: #676a6c;\r\n    }\r\n    .issue-info small {\r\n      display: block;\r\n    }\r\n    /* TEAMS */\r\n    .team-members {\r\n      margin: 10px 0;\r\n    }\r\n    .team-members img.img-circle {\r\n      width: 42px;\r\n      height: 42px;\r\n      margin-bottom: 5px;\r\n    }\r\n    /* AGILE BOARD */\r\n    .sortable-list {\r\n      padding: 10px 0;\r\n    }\r\n    .agile-list {\r\n      list-style: none;\r\n      margin: 0;\r\n    }\r\n    .agile-list li {\r\n      background: #FAFAFB;\r\n      border: 1px solid #e7eaec;\r\n      margin: 0 0 10px 0;\r\n      padding: 10px;\r\n      border-radius: 2px;\r\n    }\r\n    .agile-list li:hover {\r\n      cursor: pointer;\r\n      background: #fff;\r\n    }\r\n    .agile-list li.warning-element {\r\n      border-left: 3px solid #f8ac59;\r\n    }\r\n    .agile-list li.danger-element {\r\n      border-left: 3px solid #ed5565;\r\n    }\r\n    .agile-list li.info-element {\r\n      border-left: 3px solid #1c84c6;\r\n    }\r\n    .agile-list li.success-element {\r\n      border-left: 3px solid #1ab394;\r\n    }\r\n    .agile-detail {\r\n      margin-top: 5px;\r\n      font-size: 12px;\r\n    }\r\n    /* DIFF */\r\n    ins {\r\n      background-color: #c6ffc6;\r\n      text-decoration: none;\r\n    }\r\n    del {\r\n      background-color: #ffc6c6;\r\n    }\r\n    /* E-commerce */\r\n    .product-box {\r\n      padding: 0;\r\n      border: 1px solid #e7eaec;\r\n    }\r\n    .product-box:hover,\r\n    .product-box.active {\r\n      border: 1px solid transparent;\r\n      -webkit-box-shadow: 0 3px 7px 0 #a8a8a8;\r\n      -moz-box-shadow: 0 3px 7px 0 #a8a8a8;\r\n      box-shadow: 0 3px 7px 0 #a8a8a8;\r\n    }\r\n    .product-imitation {\r\n      text-align: center;\r\n      padding: 90px 0;\r\n      background-color: #f8f8f9;\r\n      color: #bebec3;\r\n      font-weight: 600;\r\n    }\r\n    .cart-product-imitation {\r\n      text-align: center;\r\n      padding-top: 30px;\r\n      height: 80px;\r\n      width: 80px;\r\n      background-color: #f8f8f9;\r\n    }\r\n    .product-imitation.xl {\r\n      padding: 120px 0;\r\n    }\r\n    .product-desc {\r\n      padding: 20px;\r\n      position: relative;\r\n    }\r\n    .ecommerce .tag-list {\r\n      padding: 0;\r\n    }\r\n    .ecommerce .fa-star {\r\n      color: #d1dade;\r\n    }\r\n    .ecommerce .fa-star.active {\r\n      color: #f8ac59;\r\n    }\r\n    .ecommerce .note-editor {\r\n      border: 1px solid #e7eaec;\r\n    }\r\n    table.shoping-cart-table {\r\n      margin-bottom: 0;\r\n    }\r\n    table.shoping-cart-table tr td {\r\n      border: none;\r\n      text-align: right;\r\n    }\r\n    table.shoping-cart-table tr td.desc,\r\n    table.shoping-cart-table tr td:first-child {\r\n      text-align: left;\r\n    }\r\n    table.shoping-cart-table tr td:last-child {\r\n      width: 80px;\r\n    }\r\n    .product-name {\r\n      font-size: 16px;\r\n      font-weight: 600;\r\n      color: #676a6c;\r\n      display: block;\r\n      margin: 2px 0 5px 0;\r\n    }\r\n    .product-name:hover,\r\n    .product-name:focus {\r\n      color: #1ab394;\r\n    }\r\n    .product-price {\r\n      font-size: 14px;\r\n      font-weight: 600;\r\n      color: #ffffff;\r\n      background-color: #1ab394;\r\n      padding: 6px 12px;\r\n      position: absolute;\r\n      top: -32px;\r\n      right: 0;\r\n    }\r\n    .product-detail .ibox-content {\r\n      padding: 30px 30px 50px 30px;\r\n    }\r\n    .image-imitation {\r\n      background-color: #f8f8f9;\r\n      text-align: center;\r\n      padding: 200px 0;\r\n    }\r\n    .product-main-price small {\r\n      font-size: 10px;\r\n    }\r\n    .product-images {\r\n      margin: 0 20px;\r\n    }\r\n    /* Social feed */\r\n    .social-feed-separated .social-feed-box {\r\n      margin-left: 62px;\r\n    }\r\n    .social-feed-separated .social-avatar {\r\n      float: left;\r\n      padding: 0;\r\n    }\r\n    .social-feed-separated .social-avatar img {\r\n      width: 52px;\r\n      height: 52px;\r\n      border: 1px solid #e7eaec;\r\n    }\r\n    .social-feed-separated .social-feed-box .social-avatar {\r\n      padding: 15px 15px 0 15px;\r\n      float: none;\r\n    }\r\n    .social-feed-box {\r\n      /*padding: 15px;*/\r\n      border: 1px solid #e7eaec;\r\n      background: #fff;\r\n      margin-bottom: 15px;\r\n    }\r\n    .article .social-feed-box {\r\n      margin-bottom: 0;\r\n      border-bottom: none;\r\n    }\r\n    .article .social-feed-box:last-child {\r\n      margin-bottom: 0;\r\n      border-bottom: 1px solid #e7eaec;\r\n    }\r\n    .article .social-feed-box p {\r\n      font-size: 13px;\r\n      line-height: 18px;\r\n    }\r\n    .social-action {\r\n      margin: 15px;\r\n    }\r\n    .social-avatar {\r\n      padding: 15px 15px 0 15px;\r\n    }\r\n    .social-comment .social-comment {\r\n      margin-left: 45px;\r\n    }\r\n    .social-avatar img {\r\n      height: 40px;\r\n      width: 40px;\r\n      margin-right: 10px;\r\n    }\r\n    .social-avatar .media-body a {\r\n      font-size: 14px;\r\n      display: block;\r\n    }\r\n    .social-body {\r\n      padding: 15px;\r\n    }\r\n    .social-body img {\r\n      margin-bottom: 10px;\r\n    }\r\n    .social-footer {\r\n      border-top: 1px solid #e7eaec;\r\n      padding: 10px 15px;\r\n      background: #f9f9f9;\r\n    }\r\n    .social-footer .social-comment img {\r\n      width: 32px;\r\n      margin-right: 10px;\r\n    }\r\n    .social-comment:first-child {\r\n      margin-top: 0;\r\n    }\r\n    .social-comment {\r\n      margin-top: 15px;\r\n    }\r\n    .social-comment textarea {\r\n      font-size: 12px;\r\n    }\r\n    /* Vote list */\r\n    .vote-item {\r\n      padding: 20px 25px;\r\n      background: #ffffff;\r\n      border-top: 1px solid #e7eaec;\r\n    }\r\n    .vote-item:last-child {\r\n      border-bottom: 1px solid #e7eaec;\r\n    }\r\n    .vote-item:hover {\r\n      background: #fbfbfb;\r\n    }\r\n    .vote-actions {\r\n      float: left;\r\n      width: 30px;\r\n      margin-right: 15px;\r\n      text-align: center;\r\n    }\r\n    .vote-actions a {\r\n      color: #1ab394;\r\n      font-weight: 600;\r\n    }\r\n    .vote-actions {\r\n      font-weight: 600;\r\n    }\r\n    .vote-title {\r\n      display: block;\r\n      color: inherit;\r\n      font-size: 18px;\r\n      font-weight: 600;\r\n      margin-top: 5px;\r\n      margin-bottom: 2px;\r\n    }\r\n    .vote-title:hover,\r\n    .vote-title:focus {\r\n      color: inherit;\r\n    }\r\n    .vote-info,\r\n    .vote-title {\r\n      margin-left: 45px;\r\n    }\r\n    .vote-info,\r\n    .vote-info a {\r\n      color: #b4b6b8;\r\n      font-size: 12px;\r\n    }\r\n    .vote-info a {\r\n      margin-right: 10px;\r\n    }\r\n    .vote-info a:hover {\r\n      color: #1ab394;\r\n    }\r\n    .vote-icon {\r\n      text-align: right;\r\n      font-size: 38px;\r\n      display: block;\r\n      color: #e8e9ea;\r\n    }\r\n    .vote-icon.active {\r\n      color: #1ab394;\r\n    }\r\n    body.body-small .vote-icon {\r\n      display: none;\r\n    }\r\n    .lightBoxGallery {\r\n      text-align: center;\r\n    }\r\n    .lightBoxGallery img {\r\n      margin: 5px;\r\n    }\r\n    #small-chat {\r\n      position: fixed;\r\n      bottom: 20px;\r\n      right: 20px;\r\n      z-index: 100;\r\n    }\r\n    #small-chat .badge {\r\n      position: absolute;\r\n      top: -3px;\r\n      right: -4px;\r\n    }\r\n    .open-small-chat {\r\n      height: 38px;\r\n      width: 38px;\r\n      display: block;\r\n      background: #1ab394;\r\n      padding: 9px 8px;\r\n      text-align: center;\r\n      color: #fff;\r\n      border-radius: 50%;\r\n    }\r\n    .open-small-chat:hover {\r\n      color: white;\r\n      background: #1ab394;\r\n    }\r\n    .small-chat-box {\r\n      display: none;\r\n      position: fixed;\r\n      bottom: 20px;\r\n      right: 75px;\r\n      background: #fff;\r\n      border: 1px solid #e7eaec;\r\n      width: 230px;\r\n      height: 320px;\r\n      border-radius: 4px;\r\n    }\r\n    .small-chat-box.ng-small-chat {\r\n      display: block;\r\n    }\r\n    .body-small .small-chat-box {\r\n      bottom: 70px;\r\n      right: 20px;\r\n    }\r\n    .small-chat-box.active {\r\n      display: block;\r\n    }\r\n    .small-chat-box .heading {\r\n      background: #2f4050;\r\n      padding: 8px 15px;\r\n      font-weight: bold;\r\n      color: #fff;\r\n    }\r\n    .small-chat-box .chat-date {\r\n      opacity: 0.6;\r\n      font-size: 10px;\r\n      font-weight: normal;\r\n    }\r\n    .small-chat-box .content {\r\n      padding: 15px 15px;\r\n    }\r\n    .small-chat-box .content .author-name {\r\n      font-weight: bold;\r\n      margin-bottom: 3px;\r\n      font-size: 11px;\r\n    }\r\n    .small-chat-box .content > div {\r\n      padding-bottom: 20px;\r\n    }\r\n    .small-chat-box .content .chat-message {\r\n      padding: 5px 10px;\r\n      border-radius: 6px;\r\n      font-size: 11px;\r\n      line-height: 14px;\r\n      max-width: 80%;\r\n      background: #f3f3f4;\r\n      margin-bottom: 10px;\r\n    }\r\n    .small-chat-box .content .chat-message.active {\r\n      background: #1ab394;\r\n      color: #fff;\r\n    }\r\n    .small-chat-box .content .left {\r\n      text-align: left;\r\n      clear: both;\r\n    }\r\n    .small-chat-box .content .left .chat-message {\r\n      float: left;\r\n    }\r\n    .small-chat-box .content .right {\r\n      text-align: right;\r\n      clear: both;\r\n    }\r\n    .small-chat-box .content .right .chat-message {\r\n      float: right;\r\n    }\r\n    .small-chat-box .form-chat {\r\n      padding: 10px 10px;\r\n    }\r\n    /*\r\n     * metismenu - v2.0.2\r\n     * A jQuery menu plugin\r\n     * https://github.com/onokumus/metisMenu\r\n     *\r\n     * Made by Osman Nuri Okumus\r\n     * Under MIT License\r\n     */\r\n    .metismenu .plus-minus,\r\n    .metismenu .plus-times {\r\n      float: right;\r\n    }\r\n    .metismenu .arrow {\r\n      float: right;\r\n      line-height: 1.42857;\r\n    }\r\n    .metismenu .glyphicon.arrow:before {\r\n      content: \"\\E079\";\r\n    }\r\n    .metismenu .active > a > .glyphicon.arrow:before {\r\n      content: \"\\E114\";\r\n    }\r\n    .metismenu .fa.arrow:before {\r\n      content: \"\\F104\";\r\n    }\r\n    .metismenu .active > a > .fa.arrow:before {\r\n      content: \"\\F107\";\r\n    }\r\n    .metismenu .ion.arrow:before {\r\n      content: \"\\F3D2\";\r\n    }\r\n    .metismenu .active > a > .ion.arrow:before {\r\n      content: \"\\F3D0\";\r\n    }\r\n    .metismenu .fa.plus-minus:before,\r\n    .metismenu .fa.plus-times:before {\r\n      content: \"\\F067\";\r\n    }\r\n    .metismenu .active > a > .fa.plus-times {\r\n      -webkit-transform: rotate(45deg);\r\n      -ms-transform: rotate(45deg);\r\n      transform: rotate(45deg);\r\n    }\r\n    .metismenu .active > a > .fa.plus-minus:before {\r\n      content: \"\\F068\";\r\n    }\r\n    .metismenu .collapse {\r\n      display: none;\r\n    }\r\n    .metismenu .collapse.in {\r\n      display: block;\r\n    }\r\n    .metismenu .collapsing {\r\n      position: relative;\r\n      height: 0;\r\n      overflow: hidden;\r\n      -webkit-transition-timing-function: ease;\r\n      transition-timing-function: ease;\r\n      -webkit-transition-duration: .35s;\r\n      transition-duration: .35s;\r\n      -webkit-transition-property: height, visibility;\r\n      transition-property: height, visibility;\r\n    }\r\n    .mini-navbar .metismenu .collapse {\r\n      opacity: 0;\r\n    }\r\n    .mini-navbar .metismenu .collapse.in {\r\n      opacity: 1;\r\n    }\r\n    .mini-navbar .metismenu .collapse a {\r\n      display: none;\r\n    }\r\n    .mini-navbar .metismenu .collapse.in a {\r\n      display: block;\r\n    }\r\n    /*\r\n     *  Usage:\r\n     *\r\n     *    <div class=\"sk-spinner sk-spinner-rotating-plane\"></div>\r\n     *\r\n     */\r\n    .sk-spinner-rotating-plane.sk-spinner {\r\n      width: 30px;\r\n      height: 30px;\r\n      background-color: #1ab394;\r\n      margin: 0 auto;\r\n      -webkit-animation: sk-rotatePlane 1.2s infinite ease-in-out;\r\n      animation: sk-rotatePlane 1.2s infinite ease-in-out;\r\n    }\r\n    @-webkit-keyframes sk-rotatePlane {\r\n      0% {\r\n        -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg);\r\n        transform: perspective(120px) rotateX(0deg) rotateY(0deg);\r\n      }\r\n      50% {\r\n        -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);\r\n        transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);\r\n      }\r\n      100% {\r\n        -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);\r\n        transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);\r\n      }\r\n    }\r\n    @keyframes sk-rotatePlane {\r\n      0% {\r\n        -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg);\r\n        transform: perspective(120px) rotateX(0deg) rotateY(0deg);\r\n      }\r\n      50% {\r\n        -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);\r\n        transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);\r\n      }\r\n      100% {\r\n        -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);\r\n        transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);\r\n      }\r\n    }\r\n    /*\r\n     *  Usage:\r\n     *\r\n     *    <div class=\"sk-spinner sk-spinner-double-bounce\">\r\n     *      <div class=\"sk-double-bounce1\"></div>\r\n     *      <div class=\"sk-double-bounce2\"></div>\r\n     *    </div>\r\n     *\r\n     */\r\n    .sk-spinner-double-bounce.sk-spinner {\r\n      width: 40px;\r\n      height: 40px;\r\n      position: relative;\r\n      margin: 0 auto;\r\n    }\r\n    .sk-spinner-double-bounce .sk-double-bounce1,\r\n    .sk-spinner-double-bounce .sk-double-bounce2 {\r\n      width: 100%;\r\n      height: 100%;\r\n      border-radius: 50%;\r\n      background-color: #1ab394;\r\n      opacity: 0.6;\r\n      position: absolute;\r\n      top: 0;\r\n      left: 0;\r\n      -webkit-animation: sk-doubleBounce 2s infinite ease-in-out;\r\n      animation: sk-doubleBounce 2s infinite ease-in-out;\r\n    }\r\n    .sk-spinner-double-bounce .sk-double-bounce2 {\r\n      -webkit-animation-delay: -1s;\r\n      animation-delay: -1s;\r\n    }\r\n    @-webkit-keyframes sk-doubleBounce {\r\n      0%,\r\n      100% {\r\n        -webkit-transform: scale(0);\r\n        transform: scale(0);\r\n      }\r\n      50% {\r\n        -webkit-transform: scale(1);\r\n        transform: scale(1);\r\n      }\r\n    }\r\n    @keyframes sk-doubleBounce {\r\n      0%,\r\n      100% {\r\n        -webkit-transform: scale(0);\r\n        transform: scale(0);\r\n      }\r\n      50% {\r\n        -webkit-transform: scale(1);\r\n        transform: scale(1);\r\n      }\r\n    }\r\n    /*\r\n     *  Usage:\r\n     *\r\n     *    <div class=\"sk-spinner sk-spinner-wave\">\r\n     *      <div class=\"sk-rect1\"></div>\r\n     *      <div class=\"sk-rect2\"></div>\r\n     *      <div class=\"sk-rect3\"></div>\r\n     *      <div class=\"sk-rect4\"></div>\r\n     *      <div class=\"sk-rect5\"></div>\r\n     *    </div>\r\n     *\r\n     */\r\n    .sk-spinner-wave.sk-spinner {\r\n      margin: 0 auto;\r\n      width: 50px;\r\n      height: 30px;\r\n      text-align: center;\r\n      font-size: 10px;\r\n    }\r\n    .sk-spinner-wave div {\r\n      background-color: #1ab394;\r\n      height: 100%;\r\n      width: 6px;\r\n      display: inline-block;\r\n      -webkit-animation: sk-waveStretchDelay 1.2s infinite ease-in-out;\r\n      animation: sk-waveStretchDelay 1.2s infinite ease-in-out;\r\n    }\r\n    .sk-spinner-wave .sk-rect2 {\r\n      -webkit-animation-delay: -1.1s;\r\n      animation-delay: -1.1s;\r\n    }\r\n    .sk-spinner-wave .sk-rect3 {\r\n      -webkit-animation-delay: -1s;\r\n      animation-delay: -1s;\r\n    }\r\n    .sk-spinner-wave .sk-rect4 {\r\n      -webkit-animation-delay: -0.9s;\r\n      animation-delay: -0.9s;\r\n    }\r\n    .sk-spinner-wave .sk-rect5 {\r\n      -webkit-animation-delay: -0.8s;\r\n      animation-delay: -0.8s;\r\n    }\r\n    @-webkit-keyframes sk-waveStretchDelay {\r\n      0%,\r\n      40%,\r\n      100% {\r\n        -webkit-transform: scaleY(0.4);\r\n        transform: scaleY(0.4);\r\n      }\r\n      20% {\r\n        -webkit-transform: scaleY(1);\r\n        transform: scaleY(1);\r\n      }\r\n    }\r\n    @keyframes sk-waveStretchDelay {\r\n      0%,\r\n      40%,\r\n      100% {\r\n        -webkit-transform: scaleY(0.4);\r\n        transform: scaleY(0.4);\r\n      }\r\n      20% {\r\n        -webkit-transform: scaleY(1);\r\n        transform: scaleY(1);\r\n      }\r\n    }\r\n    /*\r\n     *  Usage:\r\n     *\r\n     *    <div class=\"sk-spinner sk-spinner-wandering-cubes\">\r\n     *      <div class=\"sk-cube1\"></div>\r\n     *      <div class=\"sk-cube2\"></div>\r\n     *    </div>\r\n     *\r\n     */\r\n    .sk-spinner-wandering-cubes.sk-spinner {\r\n      margin: 0 auto;\r\n      width: 32px;\r\n      height: 32px;\r\n      position: relative;\r\n    }\r\n    .sk-spinner-wandering-cubes .sk-cube1,\r\n    .sk-spinner-wandering-cubes .sk-cube2 {\r\n      background-color: #1ab394;\r\n      width: 10px;\r\n      height: 10px;\r\n      position: absolute;\r\n      top: 0;\r\n      left: 0;\r\n      -webkit-animation: sk-wanderingCubeMove 1.8s infinite ease-in-out;\r\n      animation: sk-wanderingCubeMove 1.8s infinite ease-in-out;\r\n    }\r\n    .sk-spinner-wandering-cubes .sk-cube2 {\r\n      -webkit-animation-delay: -0.9s;\r\n      animation-delay: -0.9s;\r\n    }\r\n    @-webkit-keyframes sk-wanderingCubeMove {\r\n      25% {\r\n        -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);\r\n        transform: translateX(42px) rotate(-90deg) scale(0.5);\r\n      }\r\n      50% {\r\n        /* Hack to make FF rotate in the right direction */\r\n        -webkit-transform: translateX(42px) translateY(42px) rotate(-179deg);\r\n        transform: translateX(42px) translateY(42px) rotate(-179deg);\r\n      }\r\n      50.1% {\r\n        -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);\r\n        transform: translateX(42px) translateY(42px) rotate(-180deg);\r\n      }\r\n      75% {\r\n        -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);\r\n        transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);\r\n      }\r\n      100% {\r\n        -webkit-transform: rotate(-360deg);\r\n        transform: rotate(-360deg);\r\n      }\r\n    }\r\n    @keyframes sk-wanderingCubeMove {\r\n      25% {\r\n        -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);\r\n        transform: translateX(42px) rotate(-90deg) scale(0.5);\r\n      }\r\n      50% {\r\n        /* Hack to make FF rotate in the right direction */\r\n        -webkit-transform: translateX(42px) translateY(42px) rotate(-179deg);\r\n        transform: translateX(42px) translateY(42px) rotate(-179deg);\r\n      }\r\n      50.1% {\r\n        -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);\r\n        transform: translateX(42px) translateY(42px) rotate(-180deg);\r\n      }\r\n      75% {\r\n        -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);\r\n        transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);\r\n      }\r\n      100% {\r\n        -webkit-transform: rotate(-360deg);\r\n        transform: rotate(-360deg);\r\n      }\r\n    }\r\n    /*\r\n     *  Usage:\r\n     *\r\n     *    <div class=\"sk-spinner sk-spinner-pulse\"></div>\r\n     *\r\n     */\r\n    .sk-spinner-pulse.sk-spinner {\r\n      width: 40px;\r\n      height: 40px;\r\n      margin: 0 auto;\r\n      background-color: #1ab394;\r\n      border-radius: 100%;\r\n      -webkit-animation: sk-pulseScaleOut 1s infinite ease-in-out;\r\n      animation: sk-pulseScaleOut 1s infinite ease-in-out;\r\n    }\r\n    @-webkit-keyframes sk-pulseScaleOut {\r\n      0% {\r\n        -webkit-transform: scale(0);\r\n        transform: scale(0);\r\n      }\r\n      100% {\r\n        -webkit-transform: scale(1);\r\n        transform: scale(1);\r\n        opacity: 0;\r\n      }\r\n    }\r\n    @keyframes sk-pulseScaleOut {\r\n      0% {\r\n        -webkit-transform: scale(0);\r\n        transform: scale(0);\r\n      }\r\n      100% {\r\n        -webkit-transform: scale(1);\r\n        transform: scale(1);\r\n        opacity: 0;\r\n      }\r\n    }\r\n    /*\r\n     *  Usage:\r\n     *\r\n     *    <div class=\"sk-spinner sk-spinner-chasing-dots\">\r\n     *      <div class=\"sk-dot1\"></div>\r\n     *      <div class=\"sk-dot2\"></div>\r\n     *    </div>\r\n     *\r\n     */\r\n    .sk-spinner-chasing-dots.sk-spinner {\r\n      margin: 0 auto;\r\n      width: 40px;\r\n      height: 40px;\r\n      position: relative;\r\n      text-align: center;\r\n      -webkit-animation: sk-chasingDotsRotate 2s infinite linear;\r\n      animation: sk-chasingDotsRotate 2s infinite linear;\r\n    }\r\n    .sk-spinner-chasing-dots .sk-dot1,\r\n    .sk-spinner-chasing-dots .sk-dot2 {\r\n      width: 60%;\r\n      height: 60%;\r\n      display: inline-block;\r\n      position: absolute;\r\n      top: 0;\r\n      background-color: #1ab394;\r\n      border-radius: 100%;\r\n      -webkit-animation: sk-chasingDotsBounce 2s infinite ease-in-out;\r\n      animation: sk-chasingDotsBounce 2s infinite ease-in-out;\r\n    }\r\n    .sk-spinner-chasing-dots .sk-dot2 {\r\n      top: auto;\r\n      bottom: 0;\r\n      -webkit-animation-delay: -1s;\r\n      animation-delay: -1s;\r\n    }\r\n    @-webkit-keyframes sk-chasingDotsRotate {\r\n      100% {\r\n        -webkit-transform: rotate(360deg);\r\n        transform: rotate(360deg);\r\n      }\r\n    }\r\n    @keyframes sk-chasingDotsRotate {\r\n      100% {\r\n        -webkit-transform: rotate(360deg);\r\n        transform: rotate(360deg);\r\n      }\r\n    }\r\n    @-webkit-keyframes sk-chasingDotsBounce {\r\n      0%,\r\n      100% {\r\n        -webkit-transform: scale(0);\r\n        transform: scale(0);\r\n      }\r\n      50% {\r\n        -webkit-transform: scale(1);\r\n        transform: scale(1);\r\n      }\r\n    }\r\n    @keyframes sk-chasingDotsBounce {\r\n      0%,\r\n      100% {\r\n        -webkit-transform: scale(0);\r\n        transform: scale(0);\r\n      }\r\n      50% {\r\n        -webkit-transform: scale(1);\r\n        transform: scale(1);\r\n      }\r\n    }\r\n    /*\r\n     *  Usage:\r\n     *\r\n     *    <div class=\"sk-spinner sk-spinner-three-bounce\">\r\n     *      <div class=\"sk-bounce1\"></div>\r\n     *      <div class=\"sk-bounce2\"></div>\r\n     *      <div class=\"sk-bounce3\"></div>\r\n     *    </div>\r\n     *\r\n     */\r\n    .sk-spinner-three-bounce.sk-spinner {\r\n      margin: 0 auto;\r\n      width: 70px;\r\n      text-align: center;\r\n    }\r\n    .sk-spinner-three-bounce div {\r\n      width: 18px;\r\n      height: 18px;\r\n      background-color: #1ab394;\r\n      border-radius: 100%;\r\n      display: inline-block;\r\n      -webkit-animation: sk-threeBounceDelay 1.4s infinite ease-in-out;\r\n      animation: sk-threeBounceDelay 1.4s infinite ease-in-out;\r\n      /* Prevent first frame from flickering when animation starts */\r\n      -webkit-animation-fill-mode: both;\r\n      animation-fill-mode: both;\r\n    }\r\n    .sk-spinner-three-bounce .sk-bounce1 {\r\n      -webkit-animation-delay: -0.32s;\r\n      animation-delay: -0.32s;\r\n    }\r\n    .sk-spinner-three-bounce .sk-bounce2 {\r\n      -webkit-animation-delay: -0.16s;\r\n      animation-delay: -0.16s;\r\n    }\r\n    @-webkit-keyframes sk-threeBounceDelay {\r\n      0%,\r\n      80%,\r\n      100% {\r\n        -webkit-transform: scale(0);\r\n        transform: scale(0);\r\n      }\r\n      40% {\r\n        -webkit-transform: scale(1);\r\n        transform: scale(1);\r\n      }\r\n    }\r\n    @keyframes sk-threeBounceDelay {\r\n      0%,\r\n      80%,\r\n      100% {\r\n        -webkit-transform: scale(0);\r\n        transform: scale(0);\r\n      }\r\n      40% {\r\n        -webkit-transform: scale(1);\r\n        transform: scale(1);\r\n      }\r\n    }\r\n    /*\r\n     *  Usage:\r\n     *\r\n     *    <div class=\"sk-spinner sk-spinner-circle\">\r\n     *      <div class=\"sk-circle1 sk-circle\"></div>\r\n     *      <div class=\"sk-circle2 sk-circle\"></div>\r\n     *      <div class=\"sk-circle3 sk-circle\"></div>\r\n     *      <div class=\"sk-circle4 sk-circle\"></div>\r\n     *      <div class=\"sk-circle5 sk-circle\"></div>\r\n     *      <div class=\"sk-circle6 sk-circle\"></div>\r\n     *      <div class=\"sk-circle7 sk-circle\"></div>\r\n     *      <div class=\"sk-circle8 sk-circle\"></div>\r\n     *      <div class=\"sk-circle9 sk-circle\"></div>\r\n     *      <div class=\"sk-circle10 sk-circle\"></div>\r\n     *      <div class=\"sk-circle11 sk-circle\"></div>\r\n     *      <div class=\"sk-circle12 sk-circle\"></div>\r\n     *    </div>\r\n     *\r\n     */\r\n    .sk-spinner-circle.sk-spinner {\r\n      margin: 0 auto;\r\n      width: 22px;\r\n      height: 22px;\r\n      position: relative;\r\n    }\r\n    .sk-spinner-circle .sk-circle {\r\n      width: 100%;\r\n      height: 100%;\r\n      position: absolute;\r\n      left: 0;\r\n      top: 0;\r\n    }\r\n    .sk-spinner-circle .sk-circle:before {\r\n      content: '';\r\n      display: block;\r\n      margin: 0 auto;\r\n      width: 20%;\r\n      height: 20%;\r\n      background-color: #1ab394;\r\n      border-radius: 100%;\r\n      -webkit-animation: sk-circleBounceDelay 1.2s infinite ease-in-out;\r\n      animation: sk-circleBounceDelay 1.2s infinite ease-in-out;\r\n      /* Prevent first frame from flickering when animation starts */\r\n      -webkit-animation-fill-mode: both;\r\n      animation-fill-mode: both;\r\n    }\r\n    .sk-spinner-circle .sk-circle2 {\r\n      -webkit-transform: rotate(30deg);\r\n      -ms-transform: rotate(30deg);\r\n      transform: rotate(30deg);\r\n    }\r\n    .sk-spinner-circle .sk-circle3 {\r\n      -webkit-transform: rotate(60deg);\r\n      -ms-transform: rotate(60deg);\r\n      transform: rotate(60deg);\r\n    }\r\n    .sk-spinner-circle .sk-circle4 {\r\n      -webkit-transform: rotate(90deg);\r\n      -ms-transform: rotate(90deg);\r\n      transform: rotate(90deg);\r\n    }\r\n    .sk-spinner-circle .sk-circle5 {\r\n      -webkit-transform: rotate(120deg);\r\n      -ms-transform: rotate(120deg);\r\n      transform: rotate(120deg);\r\n    }\r\n    .sk-spinner-circle .sk-circle6 {\r\n      -webkit-transform: rotate(150deg);\r\n      -ms-transform: rotate(150deg);\r\n      transform: rotate(150deg);\r\n    }\r\n    .sk-spinner-circle .sk-circle7 {\r\n      -webkit-transform: rotate(180deg);\r\n      -ms-transform: rotate(180deg);\r\n      transform: rotate(180deg);\r\n    }\r\n    .sk-spinner-circle .sk-circle8 {\r\n      -webkit-transform: rotate(210deg);\r\n      -ms-transform: rotate(210deg);\r\n      transform: rotate(210deg);\r\n    }\r\n    .sk-spinner-circle .sk-circle9 {\r\n      -webkit-transform: rotate(240deg);\r\n      -ms-transform: rotate(240deg);\r\n      transform: rotate(240deg);\r\n    }\r\n    .sk-spinner-circle .sk-circle10 {\r\n      -webkit-transform: rotate(270deg);\r\n      -ms-transform: rotate(270deg);\r\n      transform: rotate(270deg);\r\n    }\r\n    .sk-spinner-circle .sk-circle11 {\r\n      -webkit-transform: rotate(300deg);\r\n      -ms-transform: rotate(300deg);\r\n      transform: rotate(300deg);\r\n    }\r\n    .sk-spinner-circle .sk-circle12 {\r\n      -webkit-transform: rotate(330deg);\r\n      -ms-transform: rotate(330deg);\r\n      transform: rotate(330deg);\r\n    }\r\n    .sk-spinner-circle .sk-circle2:before {\r\n      -webkit-animation-delay: -1.1s;\r\n      animation-delay: -1.1s;\r\n    }\r\n    .sk-spinner-circle .sk-circle3:before {\r\n      -webkit-animation-delay: -1s;\r\n      animation-delay: -1s;\r\n    }\r\n    .sk-spinner-circle .sk-circle4:before {\r\n      -webkit-animation-delay: -0.9s;\r\n      animation-delay: -0.9s;\r\n    }\r\n    .sk-spinner-circle .sk-circle5:before {\r\n      -webkit-animation-delay: -0.8s;\r\n      animation-delay: -0.8s;\r\n    }\r\n    .sk-spinner-circle .sk-circle6:before {\r\n      -webkit-animation-delay: -0.7s;\r\n      animation-delay: -0.7s;\r\n    }\r\n    .sk-spinner-circle .sk-circle7:before {\r\n      -webkit-animation-delay: -0.6s;\r\n      animation-delay: -0.6s;\r\n    }\r\n    .sk-spinner-circle .sk-circle8:before {\r\n      -webkit-animation-delay: -0.5s;\r\n      animation-delay: -0.5s;\r\n    }\r\n    .sk-spinner-circle .sk-circle9:before {\r\n      -webkit-animation-delay: -0.4s;\r\n      animation-delay: -0.4s;\r\n    }\r\n    .sk-spinner-circle .sk-circle10:before {\r\n      -webkit-animation-delay: -0.3s;\r\n      animation-delay: -0.3s;\r\n    }\r\n    .sk-spinner-circle .sk-circle11:before {\r\n      -webkit-animation-delay: -0.2s;\r\n      animation-delay: -0.2s;\r\n    }\r\n    .sk-spinner-circle .sk-circle12:before {\r\n      -webkit-animation-delay: -0.1s;\r\n      animation-delay: -0.1s;\r\n    }\r\n    @-webkit-keyframes sk-circleBounceDelay {\r\n      0%,\r\n      80%,\r\n      100% {\r\n        -webkit-transform: scale(0);\r\n        transform: scale(0);\r\n      }\r\n      40% {\r\n        -webkit-transform: scale(1);\r\n        transform: scale(1);\r\n      }\r\n    }\r\n    @keyframes sk-circleBounceDelay {\r\n      0%,\r\n      80%,\r\n      100% {\r\n        -webkit-transform: scale(0);\r\n        transform: scale(0);\r\n      }\r\n      40% {\r\n        -webkit-transform: scale(1);\r\n        transform: scale(1);\r\n      }\r\n    }\r\n    /*\r\n     *  Usage:\r\n     *\r\n     *    <div class=\"sk-spinner sk-spinner-cube-grid\">\r\n     *      <div class=\"sk-cube\"></div>\r\n     *      <div class=\"sk-cube\"></div>\r\n     *      <div class=\"sk-cube\"></div>\r\n     *      <div class=\"sk-cube\"></div>\r\n     *      <div class=\"sk-cube\"></div>\r\n     *      <div class=\"sk-cube\"></div>\r\n     *      <div class=\"sk-cube\"></div>\r\n     *      <div class=\"sk-cube\"></div>\r\n     *      <div class=\"sk-cube\"></div>\r\n     *    </div>\r\n     *\r\n     */\r\n    .sk-spinner-cube-grid {\r\n      /*\r\n       * Spinner positions\r\n       * 1 2 3\r\n       * 4 5 6\r\n       * 7 8 9\r\n       */\r\n    }\r\n    .sk-spinner-cube-grid.sk-spinner {\r\n      width: 30px;\r\n      height: 30px;\r\n      margin: 0 auto;\r\n    }\r\n    .sk-spinner-cube-grid .sk-cube {\r\n      width: 33%;\r\n      height: 33%;\r\n      background-color: #1ab394;\r\n      float: left;\r\n      -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;\r\n      animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;\r\n    }\r\n    .sk-spinner-cube-grid .sk-cube:nth-child(1) {\r\n      -webkit-animation-delay: 0.2s;\r\n      animation-delay: 0.2s;\r\n    }\r\n    .sk-spinner-cube-grid .sk-cube:nth-child(2) {\r\n      -webkit-animation-delay: 0.3s;\r\n      animation-delay: 0.3s;\r\n    }\r\n    .sk-spinner-cube-grid .sk-cube:nth-child(3) {\r\n      -webkit-animation-delay: 0.4s;\r\n      animation-delay: 0.4s;\r\n    }\r\n    .sk-spinner-cube-grid .sk-cube:nth-child(4) {\r\n      -webkit-animation-delay: 0.1s;\r\n      animation-delay: 0.1s;\r\n    }\r\n    .sk-spinner-cube-grid .sk-cube:nth-child(5) {\r\n      -webkit-animation-delay: 0.2s;\r\n      animation-delay: 0.2s;\r\n    }\r\n    .sk-spinner-cube-grid .sk-cube:nth-child(6) {\r\n      -webkit-animation-delay: 0.3s;\r\n      animation-delay: 0.3s;\r\n    }\r\n    .sk-spinner-cube-grid .sk-cube:nth-child(7) {\r\n      -webkit-animation-delay: 0s;\r\n      animation-delay: 0s;\r\n    }\r\n    .sk-spinner-cube-grid .sk-cube:nth-child(8) {\r\n      -webkit-animation-delay: 0.1s;\r\n      animation-delay: 0.1s;\r\n    }\r\n    .sk-spinner-cube-grid .sk-cube:nth-child(9) {\r\n      -webkit-animation-delay: 0.2s;\r\n      animation-delay: 0.2s;\r\n    }\r\n    @-webkit-keyframes sk-cubeGridScaleDelay {\r\n      0%,\r\n      70%,\r\n      100% {\r\n        -webkit-transform: scale3D(1, 1, 1);\r\n        transform: scale3D(1, 1, 1);\r\n      }\r\n      35% {\r\n        -webkit-transform: scale3D(0, 0, 1);\r\n        transform: scale3D(0, 0, 1);\r\n      }\r\n    }\r\n    @keyframes sk-cubeGridScaleDelay {\r\n      0%,\r\n      70%,\r\n      100% {\r\n        -webkit-transform: scale3D(1, 1, 1);\r\n        transform: scale3D(1, 1, 1);\r\n      }\r\n      35% {\r\n        -webkit-transform: scale3D(0, 0, 1);\r\n        transform: scale3D(0, 0, 1);\r\n      }\r\n    }\r\n    /*\r\n     *  Usage:\r\n     *\r\n     *    <div class=\"sk-spinner sk-spinner-wordpress\">\r\n     *      <span class=\"sk-inner-circle\"></span>\r\n     *    </div>\r\n     *\r\n     */\r\n    .sk-spinner-wordpress.sk-spinner {\r\n      background-color: #1ab394;\r\n      width: 30px;\r\n      height: 30px;\r\n      border-radius: 30px;\r\n      position: relative;\r\n      margin: 0 auto;\r\n      -webkit-animation: sk-innerCircle 1s linear infinite;\r\n      animation: sk-innerCircle 1s linear infinite;\r\n    }\r\n    .sk-spinner-wordpress .sk-inner-circle {\r\n      display: block;\r\n      background-color: #fff;\r\n      width: 8px;\r\n      height: 8px;\r\n      position: absolute;\r\n      border-radius: 8px;\r\n      top: 5px;\r\n      left: 5px;\r\n    }\r\n    @-webkit-keyframes sk-innerCircle {\r\n      0% {\r\n        -webkit-transform: rotate(0);\r\n        transform: rotate(0);\r\n      }\r\n      100% {\r\n        -webkit-transform: rotate(360deg);\r\n        transform: rotate(360deg);\r\n      }\r\n    }\r\n    @keyframes sk-innerCircle {\r\n      0% {\r\n        -webkit-transform: rotate(0);\r\n        transform: rotate(0);\r\n      }\r\n      100% {\r\n        -webkit-transform: rotate(360deg);\r\n        transform: rotate(360deg);\r\n      }\r\n    }\r\n    /*\r\n     *  Usage:\r\n     *\r\n     *    <div class=\"sk-spinner sk-spinner-fading-circle\">\r\n     *      <div class=\"sk-circle1 sk-circle\"></div>\r\n     *      <div class=\"sk-circle2 sk-circle\"></div>\r\n     *      <div class=\"sk-circle3 sk-circle\"></div>\r\n     *      <div class=\"sk-circle4 sk-circle\"></div>\r\n     *      <div class=\"sk-circle5 sk-circle\"></div>\r\n     *      <div class=\"sk-circle6 sk-circle\"></div>\r\n     *      <div class=\"sk-circle7 sk-circle\"></div>\r\n     *      <div class=\"sk-circle8 sk-circle\"></div>\r\n     *      <div class=\"sk-circle9 sk-circle\"></div>\r\n     *      <div class=\"sk-circle10 sk-circle\"></div>\r\n     *      <div class=\"sk-circle11 sk-circle\"></div>\r\n     *      <div class=\"sk-circle12 sk-circle\"></div>\r\n     *    </div>\r\n     *\r\n     */\r\n    .sk-spinner-fading-circle.sk-spinner {\r\n      margin: 0 auto;\r\n      width: 22px;\r\n      height: 22px;\r\n      position: relative;\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle {\r\n      width: 100%;\r\n      height: 100%;\r\n      position: absolute;\r\n      left: 0;\r\n      top: 0;\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle:before {\r\n      content: '';\r\n      display: block;\r\n      margin: 0 auto;\r\n      width: 18%;\r\n      height: 18%;\r\n      background-color: #1ab394;\r\n      border-radius: 100%;\r\n      -webkit-animation: sk-circleFadeDelay 1.2s infinite ease-in-out;\r\n      animation: sk-circleFadeDelay 1.2s infinite ease-in-out;\r\n      /* Prevent first frame from flickering when animation starts */\r\n      -webkit-animation-fill-mode: both;\r\n      animation-fill-mode: both;\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle2 {\r\n      -webkit-transform: rotate(30deg);\r\n      -ms-transform: rotate(30deg);\r\n      transform: rotate(30deg);\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle3 {\r\n      -webkit-transform: rotate(60deg);\r\n      -ms-transform: rotate(60deg);\r\n      transform: rotate(60deg);\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle4 {\r\n      -webkit-transform: rotate(90deg);\r\n      -ms-transform: rotate(90deg);\r\n      transform: rotate(90deg);\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle5 {\r\n      -webkit-transform: rotate(120deg);\r\n      -ms-transform: rotate(120deg);\r\n      transform: rotate(120deg);\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle6 {\r\n      -webkit-transform: rotate(150deg);\r\n      -ms-transform: rotate(150deg);\r\n      transform: rotate(150deg);\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle7 {\r\n      -webkit-transform: rotate(180deg);\r\n      -ms-transform: rotate(180deg);\r\n      transform: rotate(180deg);\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle8 {\r\n      -webkit-transform: rotate(210deg);\r\n      -ms-transform: rotate(210deg);\r\n      transform: rotate(210deg);\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle9 {\r\n      -webkit-transform: rotate(240deg);\r\n      -ms-transform: rotate(240deg);\r\n      transform: rotate(240deg);\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle10 {\r\n      -webkit-transform: rotate(270deg);\r\n      -ms-transform: rotate(270deg);\r\n      transform: rotate(270deg);\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle11 {\r\n      -webkit-transform: rotate(300deg);\r\n      -ms-transform: rotate(300deg);\r\n      transform: rotate(300deg);\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle12 {\r\n      -webkit-transform: rotate(330deg);\r\n      -ms-transform: rotate(330deg);\r\n      transform: rotate(330deg);\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle2:before {\r\n      -webkit-animation-delay: -1.1s;\r\n      animation-delay: -1.1s;\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle3:before {\r\n      -webkit-animation-delay: -1s;\r\n      animation-delay: -1s;\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle4:before {\r\n      -webkit-animation-delay: -0.9s;\r\n      animation-delay: -0.9s;\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle5:before {\r\n      -webkit-animation-delay: -0.8s;\r\n      animation-delay: -0.8s;\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle6:before {\r\n      -webkit-animation-delay: -0.7s;\r\n      animation-delay: -0.7s;\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle7:before {\r\n      -webkit-animation-delay: -0.6s;\r\n      animation-delay: -0.6s;\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle8:before {\r\n      -webkit-animation-delay: -0.5s;\r\n      animation-delay: -0.5s;\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle9:before {\r\n      -webkit-animation-delay: -0.4s;\r\n      animation-delay: -0.4s;\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle10:before {\r\n      -webkit-animation-delay: -0.3s;\r\n      animation-delay: -0.3s;\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle11:before {\r\n      -webkit-animation-delay: -0.2s;\r\n      animation-delay: -0.2s;\r\n    }\r\n    .sk-spinner-fading-circle .sk-circle12:before {\r\n      -webkit-animation-delay: -0.1s;\r\n      animation-delay: -0.1s;\r\n    }\r\n    @-webkit-keyframes sk-circleFadeDelay {\r\n      0%,\r\n      39%,\r\n      100% {\r\n        opacity: 0;\r\n      }\r\n      40% {\r\n        opacity: 1;\r\n      }\r\n    }\r\n    @keyframes sk-circleFadeDelay {\r\n      0%,\r\n      39%,\r\n      100% {\r\n        opacity: 0;\r\n      }\r\n      40% {\r\n        opacity: 1;\r\n      }\r\n    }\r\n    .ibox-content > .sk-spinner {\r\n      display: none;\r\n    }\r\n    .ibox-content.sk-loading {\r\n      position: relative;\r\n    }\r\n    .ibox-content.sk-loading:after {\r\n      content: '';\r\n      background-color: rgba(255, 255, 255, 0.7);\r\n      position: absolute;\r\n      top: 0;\r\n      left: 0;\r\n      right: 0;\r\n      bottom: 0;\r\n    }\r\n    .ibox-content.sk-loading > .sk-spinner {\r\n      display: block;\r\n      position: absolute;\r\n      top: 40%;\r\n      left: 0;\r\n      right: 0;\r\n      z-index: 2000;\r\n    }\r\n    /*\r\n     *\r\n     *   INSPINIA Landing Page - Responsive Admin Theme\r\n     *   Copyright 2014 Webapplayers.com\r\n     *\r\n    */\r\n    /* GLOBAL STYLES\r\n    -------------------------------------------------- */\r\n    /* PACE PLUGIN\r\n    -------------------------------------------------- */\r\n    .landing-page.pace .pace-progress {\r\n      background: #fff;\r\n      position: fixed;\r\n      z-index: 2000;\r\n      top: 0;\r\n      left: 0;\r\n      height: 2px;\r\n      -webkit-transition: width 1s;\r\n      -moz-transition: width 1s;\r\n      -o-transition: width 1s;\r\n      transition: width 1s;\r\n    }\r\n    .pace-inactive {\r\n      display: none;\r\n    }\r\n    body.landing-page {\r\n      color: #676a6c;\r\n      font-family: 'Open Sans', helvetica, arial, sans-serif;\r\n      background-color: #fff;\r\n    }\r\n    .landing-page {\r\n      /* CUSTOMIZE THE NAVBAR\r\n      -------------------------------------------------- */\r\n      /* Flip around the padding for proper display in narrow viewports */\r\n      /* BACKGROUNDS SLIDER\r\n      -------------------------------------------------- */\r\n      /* CUSTOMIZE THE CAROUSEL\r\n      -------------------------------------------------- */\r\n      /* Carousel base class */\r\n      /* Since positioning the image, we need to help out the caption */\r\n      /* Declare heights because of positioning of img element */\r\n      /* Sections\r\n      ------------------------- */\r\n      /* Buttons - only primary custom button\r\n      ------------------------- */\r\n      /* RESPONSIVE CSS\r\n      -------------------------------------------------- */\r\n    }\r\n    .landing-page .container {\r\n      overflow: hidden;\r\n    }\r\n    .landing-page span.navy {\r\n      color: #1ab394;\r\n    }\r\n    .landing-page p.text-color {\r\n      color: #676a6c;\r\n    }\r\n    .landing-page a.navy-link {\r\n      color: #1ab394;\r\n      text-decoration: none;\r\n    }\r\n    .landing-page a.navy-link:hover {\r\n      color: #179d82;\r\n    }\r\n    .landing-page section p {\r\n      color: #aeaeae;\r\n      font-size: 13px;\r\n    }\r\n    .landing-page address {\r\n      font-size: 13px;\r\n    }\r\n    .landing-page h1 {\r\n      margin-top: 10px;\r\n      font-size: 30px;\r\n      font-weight: 200;\r\n    }\r\n    .landing-page .navy-line {\r\n      width: 60px;\r\n      height: 1px;\r\n      margin: 60px auto 0;\r\n      border-bottom: 2px solid #1ab394;\r\n    }\r\n    .landing-page .navbar-wrapper {\r\n      position: fixed;\r\n      top: 0;\r\n      right: 0;\r\n      left: 0;\r\n      z-index: 200;\r\n    }\r\n    .landing-page .navbar-wrapper > .container {\r\n      padding-right: 0;\r\n      padding-left: 0;\r\n    }\r\n    .landing-page .navbar-wrapper .navbar {\r\n      padding-right: 15px;\r\n      padding-left: 15px;\r\n    }\r\n    .landing-page .navbar-default.navbar-scroll {\r\n      background-color: #fff;\r\n      border-color: #fff;\r\n      padding: 15px 0;\r\n    }\r\n    .landing-page .navbar-default {\r\n      background-color: transparent;\r\n      border-color: transparent;\r\n      transition: all 0.3s ease-in-out 0s;\r\n    }\r\n    .landing-page .navbar-default .nav li a {\r\n      color: #fff;\r\n      font-family: 'Open Sans', helvetica, arial, sans-serif;\r\n      font-weight: 700;\r\n      letter-spacing: 1px;\r\n      text-transform: uppercase;\r\n      font-size: 14px;\r\n    }\r\n    .landing-page .navbar-nav > li > a {\r\n      padding-top: 25px;\r\n      border-top: 6px solid transparent;\r\n    }\r\n    .landing-page .navbar-default .navbar-nav > .active > a,\r\n    .landing-page .navbar-default .navbar-nav > .active > a:hover {\r\n      background: transparent;\r\n      color: #fff;\r\n      border-top: 6px solid #1ab394;\r\n    }\r\n    .landing-page .navbar-default .navbar-nav > li > a:hover,\r\n    .landing-page .navbar-default .navbar-nav > li > a:focus {\r\n      color: #1ab394;\r\n      background: inherit;\r\n    }\r\n    .landing-page .navbar-default .navbar-nav > .active > a:focus {\r\n      background: transparent;\r\n      color: #fff;\r\n    }\r\n    .landing-page .navbar-default .navbar-nav > .active > a:focus {\r\n      background: transparent;\r\n      color: #ffffff;\r\n    }\r\n    .landing-page .navbar-default.navbar-scroll .navbar-nav > .active > a:focus {\r\n      background: transparent;\r\n      color: inherit;\r\n    }\r\n    .landing-page .navbar-default .navbar-brand:hover,\r\n    .landing-page .navbar-default .navbar-brand:focus {\r\n      background: #179d82;\r\n      color: #fff;\r\n    }\r\n    .landing-page .navbar-default .navbar-brand {\r\n      color: #fff;\r\n      height: auto;\r\n      display: block;\r\n      font-size: 14px;\r\n      background: #1ab394;\r\n      padding: 15px 20px 15px 20px;\r\n      border-radius: 0 0 5px 5px;\r\n      font-weight: 700;\r\n      transition: all 0.3s ease-in-out 0s;\r\n    }\r\n    .landing-page .navbar-scroll.navbar-default .nav li a {\r\n      color: #676a6c;\r\n    }\r\n    .landing-page .navbar-scroll.navbar-default .nav li a:hover {\r\n      color: #1ab394;\r\n    }\r\n    .landing-page .navbar-wrapper .navbar.navbar-scroll {\r\n      padding-top: 0;\r\n      padding-bottom: 5px;\r\n      border-bottom: 1px solid #e7eaec;\r\n      border-radius: 0;\r\n    }\r\n    .landing-page .nav > li.active {\r\n      border: none;\r\n      background: inherit;\r\n    }\r\n    .landing-page .nav > li > a {\r\n      padding: 25px 10px 15px 10px;\r\n    }\r\n    .landing-page .navbar-scroll .navbar-nav > li > a {\r\n      padding: 20px 10px;\r\n    }\r\n    .landing-page .navbar-default .navbar-nav > .active > a,\r\n    .landing-page .navbar-default .navbar-nav > .active > a:hover {\r\n      border-top: 6px solid #1ab394;\r\n    }\r\n    .landing-page .navbar-fixed-top {\r\n      border: none !important;\r\n    }\r\n    .landing-page .navbar-fixed-top.navbar-scroll {\r\n      border-bottom: 1px solid #e7eaec !important;\r\n    }\r\n    .landing-page .navbar.navbar-scroll .navbar-brand {\r\n      margin-top: 15px;\r\n      border-radius: 5px;\r\n      font-size: 12px;\r\n      padding: 10px;\r\n      height: auto;\r\n    }\r\n    .landing-page .header-back {\r\n      height: 470px;\r\n      width: 100%;\r\n    }\r\n    .landing-page .carousel {\r\n      height: 470px;\r\n    }\r\n    .landing-page .carousel-caption {\r\n      z-index: 10;\r\n    }\r\n    .landing-page .carousel .item {\r\n      height: 470px;\r\n      background-color: #777;\r\n    }\r\n    .landing-page .carousel-inner > .item > img {\r\n      position: absolute;\r\n      top: 0;\r\n      left: 0;\r\n      min-width: 100%;\r\n      height: 470px;\r\n    }\r\n    .landing-page .carousel-fade .carousel-inner .item {\r\n      opacity: 0;\r\n      -webkit-transition-property: opacity;\r\n      transition-property: opacity;\r\n    }\r\n    .landing-page .carousel-fade .carousel-inner .active {\r\n      opacity: 1;\r\n    }\r\n    .landing-page .carousel-fade .carousel-inner .active.left,\r\n    .landing-page .carousel-fade .carousel-inner .active.right {\r\n      left: 0;\r\n      opacity: 0;\r\n      z-index: 1;\r\n    }\r\n    .landing-page .carousel-fade .carousel-inner .next.left,\r\n    .landing-page .carousel-fade .carousel-inner .prev.right {\r\n      opacity: 1;\r\n    }\r\n    .landing-page .carousel-fade .carousel-control {\r\n      z-index: 2;\r\n    }\r\n    .landing-page .carousel-control.left,\r\n    .landing-page .carousel-control.right {\r\n      background: none;\r\n    }\r\n    .landing-page .carousel-control {\r\n      width: 6%;\r\n    }\r\n    .landing-page .carousel-inner .container {\r\n      position: relative;\r\n      overflow: visible;\r\n    }\r\n    .landing-page .carousel-inner {\r\n      overflow: visible;\r\n    }\r\n    .landing-page .carousel-caption {\r\n      position: absolute;\r\n      top: 100px;\r\n      left: 0;\r\n      bottom: auto;\r\n      right: auto;\r\n      text-align: left;\r\n    }\r\n    .landing-page .carousel-caption {\r\n      position: absolute;\r\n      top: 100px;\r\n      left: 0;\r\n      bottom: auto;\r\n      right: auto;\r\n      text-align: left;\r\n    }\r\n    .landing-page .carousel-caption.blank {\r\n      top: 140px;\r\n    }\r\n    .landing-page .carousel-image {\r\n      position: absolute;\r\n      right: 10px;\r\n      top: 150px;\r\n    }\r\n    .landing-page .carousel-indicators {\r\n      padding-right: 60px;\r\n    }\r\n    .landing-page .carousel-caption h1 {\r\n      font-weight: 700;\r\n      font-size: 38px;\r\n      text-transform: uppercase;\r\n      text-shadow: none;\r\n      letter-spacing: -1.5px;\r\n    }\r\n    .landing-page .carousel-caption p {\r\n      font-weight: 700;\r\n      text-transform: uppercase;\r\n      text-shadow: none;\r\n    }\r\n    .landing-page .caption-link {\r\n      color: #fff;\r\n      margin-left: 10px;\r\n      text-transform: capitalize;\r\n      font-weight: 400;\r\n    }\r\n    .landing-page .caption-link:hover {\r\n      text-decoration: none;\r\n      color: inherit;\r\n    }\r\n    .landing-page .services {\r\n      padding-top: 60px;\r\n    }\r\n    .landing-page .services h2 {\r\n      font-size: 20px;\r\n      letter-spacing: -1px;\r\n      font-weight: 600;\r\n      text-transform: uppercase;\r\n    }\r\n    .landing-page .features-block {\r\n      margin-top: 40px;\r\n    }\r\n    .landing-page .features-text {\r\n      margin-top: 40px;\r\n    }\r\n    .landing-page .features small {\r\n      color: #1ab394;\r\n    }\r\n    .landing-page .features h2 {\r\n      font-size: 18px;\r\n      margin-top: 5px;\r\n    }\r\n    .landing-page .features-text-alone {\r\n      margin: 40px 0;\r\n    }\r\n    .landing-page .features-text-alone h1 {\r\n      font-weight: 200;\r\n    }\r\n    .landing-page .features-icon {\r\n      color: #1ab394;\r\n      font-size: 40px;\r\n    }\r\n    .landing-page .navy-section {\r\n      margin-top: 60px;\r\n      background: #1ab394;\r\n      color: #fff;\r\n      padding: 20px 0;\r\n    }\r\n    .landing-page .gray-section {\r\n      background: #f4f4f4;\r\n      margin-top: 60px;\r\n    }\r\n    .landing-page .team-member {\r\n      text-align: center;\r\n    }\r\n    .landing-page .team-member img {\r\n      margin: auto;\r\n    }\r\n    .landing-page .social-icon a {\r\n      background: #1ab394;\r\n      color: #fff;\r\n      padding: 4px 8px;\r\n      height: 28px;\r\n      width: 28px;\r\n      display: block;\r\n      border-radius: 50px;\r\n    }\r\n    .landing-page .social-icon a:hover {\r\n      background: #179d82;\r\n    }\r\n    .landing-page .img-small {\r\n      height: 88px;\r\n      width: 88px;\r\n    }\r\n    .landing-page .pricing-plan {\r\n      margin: 20px 30px 0 30px;\r\n      border-radius: 4px;\r\n    }\r\n    .landing-page .pricing-plan.selected {\r\n      transform: scale(1.1);\r\n      background: #f4f4f4;\r\n    }\r\n    .landing-page .pricing-plan li {\r\n      padding: 10px 16px;\r\n      border-top: 1px solid #e7eaec;\r\n      text-align: center;\r\n      color: #aeaeae;\r\n    }\r\n    .landing-page .pricing-plan .pricing-price span {\r\n      font-weight: 700;\r\n      color: #1ab394;\r\n    }\r\n    .landing-page li.pricing-desc {\r\n      font-size: 13px;\r\n      border-top: none;\r\n      padding: 20px 16px;\r\n    }\r\n    .landing-page li.pricing-title {\r\n      background: #1ab394;\r\n      color: #fff;\r\n      padding: 10px;\r\n      border-radius: 4px 4px 0 0;\r\n      font-size: 22px;\r\n      font-weight: 600;\r\n    }\r\n    .landing-page section.timeline {\r\n      padding-bottom: 30px;\r\n    }\r\n    .landing-page section.comments {\r\n      padding-bottom: 80px;\r\n    }\r\n    .landing-page .comments-avatar {\r\n      margin-top: 25px;\r\n      margin-left: 22px;\r\n      margin-bottom: 25px;\r\n    }\r\n    .landing-page .comments-avatar .commens-name {\r\n      font-weight: 600;\r\n      font-size: 14px;\r\n    }\r\n    .landing-page .comments-avatar img {\r\n      width: 42px;\r\n      height: 42px;\r\n      border-radius: 50%;\r\n      margin-right: 10px;\r\n    }\r\n    .landing-page .bubble {\r\n      position: relative;\r\n      height: 120px;\r\n      padding: 20px;\r\n      background: #FFFFFF;\r\n      -webkit-border-radius: 10px;\r\n      -moz-border-radius: 10px;\r\n      border-radius: 10px;\r\n      font-style: italic;\r\n      font-size: 14px;\r\n    }\r\n    .landing-page .bubble:after {\r\n      content: '';\r\n      position: absolute;\r\n      border-style: solid;\r\n      border-width: 15px 14px 0;\r\n      border-color: #FFFFFF transparent;\r\n      display: block;\r\n      width: 0;\r\n      z-index: 1;\r\n      bottom: -15px;\r\n      left: 30px;\r\n    }\r\n    .landing-page .btn-primary.btn-outline:hover,\r\n    .landing-page .btn-success.btn-outline:hover,\r\n    .landing-page .btn-info.btn-outline:hover,\r\n    .landing-page .btn-warning.btn-outline:hover,\r\n    .landing-page .btn-danger.btn-outline:hover {\r\n      color: #fff;\r\n    }\r\n    .landing-page .btn-primary {\r\n      background-color: #1ab394;\r\n      border-color: #1ab394;\r\n      color: #FFFFFF;\r\n      font-size: 14px;\r\n      padding: 10px 20px;\r\n      font-weight: 600;\r\n    }\r\n    .landing-page .btn-primary:hover,\r\n    .landing-page .btn-primary:focus,\r\n    .landing-page .btn-primary:active,\r\n    .landing-page .btn-primary.active,\r\n    .landing-page .open .dropdown-toggle.btn-primary {\r\n      background-color: #179d82;\r\n      border-color: #179d82;\r\n      color: #FFFFFF;\r\n    }\r\n    .landing-page .btn-primary:active,\r\n    .landing-page .btn-primary.active,\r\n    .landing-page .open .dropdown-toggle.btn-primary {\r\n      background-image: none;\r\n    }\r\n    .landing-page .btn-primary.disabled,\r\n    .landing-page .btn-primary.disabled:hover,\r\n    .landing-page .btn-primary.disabled:focus,\r\n    .landing-page .btn-primary.disabled:active,\r\n    .landing-page .btn-primary.disabled.active,\r\n    .landing-page .btn-primary[disabled],\r\n    .landing-page .btn-primary[disabled]:hover,\r\n    .landing-page .btn-primary[disabled]:focus,\r\n    .landing-page .btn-primary[disabled]:active,\r\n    .landing-page .btn-primary.active[disabled],\r\n    .landing-page fieldset[disabled] .btn-primary,\r\n    .landing-page fieldset[disabled] .btn-primary:hover,\r\n    .landing-page fieldset[disabled] .btn-primary:focus,\r\n    .landing-page fieldset[disabled] .btn-primary:active,\r\n    .landing-page fieldset[disabled] .btn-primary.active {\r\n      background-color: #1dc5a3;\r\n      border-color: #1dc5a3;\r\n    }\r\n    @media (min-width: 768px) {\r\n      .landing-page {\r\n        /* Navbar positioning foo */\r\n        /* The navbar becomes detached from the top, so we round the corners */\r\n        /* Bump up size of carousel content */\r\n      }\r\n      .landing-page .navbar-wrapper {\r\n        margin-top: 20px;\r\n      }\r\n      .landing-page .navbar-wrapper .container {\r\n        padding-right: 15px;\r\n        padding-left: 15px;\r\n      }\r\n      .landing-page .navbar-wrapper .navbar {\r\n        padding-right: 0;\r\n        padding-left: 0;\r\n      }\r\n      .landing-page .navbar-wrapper .navbar {\r\n        border-radius: 4px;\r\n      }\r\n      .landing-page .carousel-caption p {\r\n        margin-bottom: 20px;\r\n        font-size: 14px;\r\n        line-height: 1.4;\r\n      }\r\n      .landing-page .featurette-heading {\r\n        font-size: 50px;\r\n      }\r\n    }\r\n    @media (max-width: 992px) {\r\n      .landing-page .carousel-image {\r\n        display: none;\r\n      }\r\n    }\r\n    @media (max-width: 768px) {\r\n      .landing-page .carousel-caption,\r\n      .landing-page .carousel-caption.blank {\r\n        left: 5%;\r\n        top: 80px;\r\n      }\r\n      .landing-page .carousel-caption h1 {\r\n        font-size: 28px;\r\n      }\r\n      .landing-page .navbar.navbar-scroll .navbar-brand {\r\n        margin-top: 6px;\r\n      }\r\n      .landing-page .navbar-default {\r\n        background-color: #fff;\r\n        border-color: #fff;\r\n        padding: 15px 0;\r\n      }\r\n      .landing-page .navbar-default .navbar-nav > .active > a:focus {\r\n        background: transparent;\r\n        color: inherit;\r\n      }\r\n      .landing-page .navbar-default .nav li a {\r\n        color: #676a6c;\r\n      }\r\n      .landing-page .navbar-default .nav li a:hover {\r\n        color: #1ab394;\r\n      }\r\n      .landing-page .navbar-wrapper .navbar {\r\n        padding-top: 0;\r\n        padding-bottom: 5px;\r\n        border-bottom: 1px solid #e7eaec;\r\n        border-radius: 0;\r\n      }\r\n      .landing-page .nav > li > a {\r\n        padding: 25px 10px 15px 10px;\r\n      }\r\n      .landing-page .navbar-nav > li > a {\r\n        padding: 20px 10px;\r\n      }\r\n      .landing-page .navbar .navbar-brand {\r\n        margin-top: 6px;\r\n        border-radius: 5px;\r\n        font-size: 12px;\r\n        padding: 10px;\r\n        height: auto;\r\n      }\r\n      .landing-page .navbar-wrapper .navbar {\r\n        padding-left: 15px;\r\n        padding-right: 5px;\r\n      }\r\n      .landing-page .navbar-default .navbar-nav > .active > a,\r\n      .landing-page .navbar-default .navbar-nav > .active > a:hover {\r\n        color: inherit;\r\n      }\r\n      .landing-page .carousel-control {\r\n        display: none;\r\n      }\r\n    }\r\n    @media (min-width: 992px) {\r\n      .landing-page .featurette-heading {\r\n        margin-top: 120px;\r\n      }\r\n    }\r\n    @media (max-width: 768px) {\r\n      .landing-page .navbar .navbar-header {\r\n        display: block;\r\n        float: none;\r\n      }\r\n      .landing-page .navbar .navbar-header .navbar-toggle {\r\n        background-color: #ffffff;\r\n        padding: 9px 10px;\r\n        border: none;\r\n      }\r\n    }\r\n    body.rtls {\r\n      /* Theme config */\r\n    }\r\n    body.rtls #page-wrapper {\r\n      margin: 0 220px 0 0;\r\n    }\r\n    body.rtls .nav-second-level li a {\r\n      padding: 7px 35px 7px 10px;\r\n    }\r\n    body.rtls .ibox-title h5 {\r\n      float: right;\r\n    }\r\n    body.rtls .pull-right {\r\n      float: left !important;\r\n    }\r\n    body.rtls .pull-left {\r\n      float: right !important;\r\n    }\r\n    body.rtls .ibox-tools {\r\n      float: left;\r\n    }\r\n    body.rtls .stat-percent {\r\n      float: left;\r\n    }\r\n    body.rtls .navbar-right {\r\n      float: left !important;\r\n    }\r\n    body.rtls .navbar-top-links li:last-child {\r\n      margin-left: 40px;\r\n      margin-right: 0;\r\n    }\r\n    body.rtls .minimalize-styl-2 {\r\n      float: right;\r\n      margin: 14px 20px 5px 5px;\r\n    }\r\n    body.rtls .feed-element > .pull-left {\r\n      margin-left: 10px;\r\n      margin-right: 0;\r\n    }\r\n    body.rtls .timeline-item .date {\r\n      text-align: left;\r\n    }\r\n    body.rtls .timeline-item .date i {\r\n      left: 0;\r\n      right: auto;\r\n    }\r\n    body.rtls .timeline-item .content {\r\n      border-right: 1px solid #e7eaec;\r\n      border-left: none;\r\n    }\r\n    body.rtls .theme-config {\r\n      left: 0;\r\n      right: auto;\r\n    }\r\n    body.rtls .spin-icon {\r\n      border-radius: 0 20px 20px 0;\r\n    }\r\n    body.rtls .toast-close-button {\r\n      float: left;\r\n    }\r\n    body.rtls #toast-container > .toast:before {\r\n      margin: auto -1.5em auto 0.5em;\r\n    }\r\n    body.rtls #toast-container > div {\r\n      padding: 15px 50px 15px 15px;\r\n    }\r\n    body.rtls .center-orientation .vertical-timeline-icon i {\r\n      margin-left: 0;\r\n      margin-right: -12px;\r\n    }\r\n    body.rtls .vertical-timeline-icon i {\r\n      right: 50%;\r\n      left: auto;\r\n      margin-left: auto;\r\n      margin-right: -12px;\r\n    }\r\n    body.rtls .file-box {\r\n      float: right;\r\n    }\r\n    body.rtls ul.notes li {\r\n      float: right;\r\n    }\r\n    body.rtls .chat-users,\r\n    body.rtls .chat-statistic {\r\n      margin-right: -30px;\r\n      margin-left: auto;\r\n    }\r\n    body.rtls .dropdown-menu > li > a {\r\n      text-align: right;\r\n    }\r\n    body.rtls .b-r {\r\n      border-left: 1px solid #e7eaec;\r\n      border-right: none;\r\n    }\r\n    body.rtls .dd-list .dd-list {\r\n      padding-right: 30px;\r\n      padding-left: 0;\r\n    }\r\n    body.rtls .dd-item > button {\r\n      float: right;\r\n    }\r\n    body.rtls .theme-config-box {\r\n      margin-left: -220px;\r\n      margin-right: 0;\r\n    }\r\n    body.rtls .theme-config-box.show {\r\n      margin-left: 0;\r\n      margin-right: 0;\r\n    }\r\n    body.rtls .spin-icon {\r\n      right: 0;\r\n      left: auto;\r\n    }\r\n    body.rtls .skin-settings {\r\n      margin-right: 40px;\r\n      margin-left: 0;\r\n    }\r\n    body.rtls .skin-settings {\r\n      direction: ltr;\r\n    }\r\n    body.rtls .footer.fixed {\r\n      margin-right: 220px;\r\n      margin-left: 0;\r\n    }\r\n    @media (max-width: 992px) {\r\n      body.rtls .chat-users,\r\n      body.rtls .chat-statistic {\r\n        margin-right: 0;\r\n      }\r\n    }\r\n    body.rtls.mini-navbar .footer.fixed,\r\n    body.body-small.mini-navbar .footer.fixed {\r\n      margin: 0 70px 0 0;\r\n    }\r\n    body.rtls.mini-navbar.fixed-sidebar .footer.fixed,\r\n    body.body-small.mini-navbar .footer.fixed {\r\n      margin: 0 0 0 0;\r\n    }\r\n    body.rtls.top-navigation .navbar-toggle {\r\n      float: right;\r\n      margin-left: 15px;\r\n      margin-right: 15px;\r\n    }\r\n    .body-small.rtls.top-navigation .navbar-header {\r\n      float: none;\r\n    }\r\n    body.rtls.top-navigation #page-wrapper {\r\n      margin: 0;\r\n    }\r\n    body.rtls.mini-navbar #page-wrapper {\r\n      margin: 0 70px 0 0;\r\n    }\r\n    body.rtls.mini-navbar.fixed-sidebar #page-wrapper {\r\n      margin: 0 0 0 0;\r\n    }\r\n    body.rtls.body-small.fixed-sidebar.mini-navbar #page-wrapper {\r\n      margin: 0 220px 0 0;\r\n    }\r\n    body.rtls.body-small.fixed-sidebar.mini-navbar .navbar-static-side {\r\n      width: 220px;\r\n    }\r\n    .body-small.rtls .navbar-fixed-top {\r\n      margin-right: 0;\r\n    }\r\n    .body-small.rtls .navbar-header {\r\n      float: right;\r\n    }\r\n    body.rtls .navbar-top-links li:last-child {\r\n      margin-left: 20px;\r\n    }\r\n    body.rtls .top-navigation #page-wrapper,\r\n    body.rtls.mini-navbar .top-navigation #page-wrapper,\r\n    body.rtls.mini-navbar.top-navigation #page-wrapper {\r\n      margin: 0;\r\n    }\r\n    body.rtls .top-navigation .footer.fixed,\r\n    body.rtls.top-navigation .footer.fixed {\r\n      margin: 0;\r\n    }\r\n    @media (max-width: 768px) {\r\n      body.rtls .navbar-top-links li:last-child {\r\n        margin-left: 20px;\r\n      }\r\n      .body-small.rtls #page-wrapper {\r\n        position: inherit;\r\n        margin: 0 0 0 0;\r\n        min-height: 1000px;\r\n      }\r\n      .body-small.rtls .navbar-static-side {\r\n        display: none;\r\n        z-index: 2001;\r\n        position: absolute;\r\n        width: 70px;\r\n      }\r\n      .body-small.rtls.mini-navbar .navbar-static-side {\r\n        display: block;\r\n      }\r\n      .rtls.fixed-sidebar.body-small .navbar-static-side {\r\n        display: none;\r\n        z-index: 2001;\r\n        position: fixed;\r\n        width: 220px;\r\n      }\r\n      .rtls.fixed-sidebar.body-small.mini-navbar .navbar-static-side {\r\n        display: block;\r\n      }\r\n    }\r\n    .rtls .ltr-support {\r\n      direction: ltr;\r\n    }\r\n    .rtls.mini-navbar .nav-second-level,\r\n    .rtls.mini-navbar li.active .nav-second-level {\r\n      left: auto;\r\n      right: 70px;\r\n    }\r\n    .rtls #right-sidebar {\r\n      left: -260px;\r\n      right: auto;\r\n    }\r\n    .rtls #right-sidebar.sidebar-open {\r\n      left: 0;\r\n    }\r\n    /*\r\n     *\r\n     *   This is style for skin config\r\n     *   Use only in demo theme\r\n     *\r\n    */\r\n    .theme-config {\r\n      position: absolute;\r\n      top: 90px;\r\n      right: 0;\r\n      overflow: hidden;\r\n    }\r\n    .theme-config-box {\r\n      margin-right: -220px;\r\n      position: relative;\r\n      z-index: 2000;\r\n      transition-duration: 0.8s;\r\n    }\r\n    .theme-config-box.show {\r\n      margin-right: 0;\r\n    }\r\n    .spin-icon {\r\n      background: #1ab394;\r\n      position: absolute;\r\n      padding: 7px 10px 7px 13px;\r\n      border-radius: 20px 0 0 20px;\r\n      font-size: 16px;\r\n      top: 0;\r\n      left: 0;\r\n      width: 40px;\r\n      color: #fff;\r\n      cursor: pointer;\r\n    }\r\n    .skin-settings {\r\n      width: 220px;\r\n      margin-left: 40px;\r\n      background: #f3f3f4;\r\n    }\r\n    .skin-settings .title {\r\n      background: #efefef;\r\n      text-align: center;\r\n      text-transform: uppercase;\r\n      font-weight: 600;\r\n      display: block;\r\n      padding: 10px 15px;\r\n      font-size: 12px;\r\n    }\r\n    .setings-item {\r\n      padding: 10px 30px;\r\n    }\r\n    .setings-item.skin {\r\n      text-align: center;\r\n    }\r\n    .setings-item .switch {\r\n      float: right;\r\n    }\r\n    .skin-name a {\r\n      text-transform: uppercase;\r\n    }\r\n    .setings-item a {\r\n      color: #fff;\r\n    }\r\n    .default-skin,\r\n    .blue-skin,\r\n    .ultra-skin,\r\n    .yellow-skin {\r\n      text-align: center;\r\n    }\r\n    .default-skin {\r\n      font-weight: 600;\r\n      background: #283A49;\r\n    }\r\n    .default-skin:hover {\r\n      background: #1e2e3d;\r\n    }\r\n    .blue-skin {\r\n      font-weight: 600;\r\n      background: url(" + __webpack_require__(11) + ") repeat scroll 0 0;\r\n    }\r\n    .blue-skin:hover {\r\n      background: #0d8ddb;\r\n    }\r\n    .yellow-skin {\r\n      font-weight: 600;\r\n      background: url(" + __webpack_require__(12) + ") repeat scroll 0 100%;\r\n    }\r\n    .yellow-skin:hover {\r\n      background: #ce8735;\r\n    }\r\n    .ultra-skin {\r\n      padding: 20px 10px;\r\n      font-weight: 600;\r\n      background: url(" + __webpack_require__(46) + ") repeat scroll 0 0;\r\n    }\r\n    .ultra-skin:hover {\r\n      background: url(" + __webpack_require__(10) + ") repeat scroll 0 0;\r\n    }\r\n    /*\r\n     *\r\n     *   SKIN 1 - INSPINIA - Responsive Admin Theme\r\n     *   NAME - Blue light\r\n     *\r\n    */\r\n    .skin-1 .minimalize-styl-2 {\r\n      margin: 14px 5px 5px 30px;\r\n    }\r\n    .skin-1 .navbar-top-links li:last-child {\r\n      margin-right: 30px;\r\n    }\r\n    .skin-1.fixed-nav .minimalize-styl-2 {\r\n      margin: 14px 5px 5px 15px;\r\n    }\r\n    .skin-1 .spin-icon {\r\n      background: #0e9aef !important;\r\n    }\r\n    .skin-1 .nav-header {\r\n      background-color: #0e9aef;\r\n      background-image: url(" + __webpack_require__(11) + ");\r\n    }\r\n    .skin-1.mini-navbar .nav-second-level {\r\n      background: #3e495f;\r\n    }\r\n    .skin-1 .breadcrumb {\r\n      background: transparent;\r\n    }\r\n    .skin-1 .page-heading {\r\n      border: none;\r\n    }\r\n    .skin-1 .nav > li.active {\r\n      background: #3a4459;\r\n    }\r\n    .skin-1 .nav > li > a {\r\n      color: #9ea6b9;\r\n    }\r\n    .skin-1 ul.nav-second-level {\r\n      background-color: inherit;\r\n    }\r\n    .skin-1 .nav > li.active > a {\r\n      color: #fff;\r\n    }\r\n    .skin-1 .navbar-minimalize {\r\n      background: #0e9aef;\r\n      border-color: #0e9aef;\r\n    }\r\n    body.skin-1 {\r\n      background: #3e495f;\r\n    }\r\n    .skin-1 .navbar-static-top {\r\n      background: #ffffff;\r\n    }\r\n    .skin-1 .dashboard-header {\r\n      background: transparent;\r\n      border-bottom: none !important;\r\n      border-top: none;\r\n      padding: 20px 30px 10px 30px;\r\n    }\r\n    .fixed-nav.skin-1 .navbar-fixed-top {\r\n      background: #fff;\r\n    }\r\n    .skin-1 .wrapper-content {\r\n      padding: 30px 15px;\r\n    }\r\n    .skin-1 #page-wrapper {\r\n      background: #f4f6fa;\r\n    }\r\n    .skin-1 .ibox-title,\r\n    .skin-1 .ibox-content {\r\n      border-width: 1px;\r\n    }\r\n    .skin-1 .ibox-content:last-child {\r\n      border-style: solid solid solid solid;\r\n    }\r\n    .skin-1 .nav > li.active {\r\n      border: none;\r\n    }\r\n    .skin-1 .nav-header {\r\n      padding: 35px 25px 25px 25px;\r\n    }\r\n    .skin-1 .nav-header a.dropdown-toggle {\r\n      color: #fff;\r\n      margin-top: 10px;\r\n    }\r\n    .skin-1 .nav-header a.dropdown-toggle .text-muted {\r\n      color: #fff;\r\n      opacity: 0.8;\r\n    }\r\n    .skin-1 .profile-element {\r\n      text-align: center;\r\n    }\r\n    .skin-1 .img-circle {\r\n      border-radius: 5px;\r\n    }\r\n    .skin-1 .navbar-default .nav > li > a:hover,\r\n    .skin-1 .navbar-default .nav > li > a:focus {\r\n      background: #3a4459;\r\n      color: #fff;\r\n    }\r\n    .skin-1 .nav.nav-tabs > li.active > a {\r\n      color: #555;\r\n    }\r\n    .skin-1 .nav.nav-tabs > li.active {\r\n      background: transparent;\r\n    }\r\n    /*\r\n     *\r\n     *   SKIN 2 - INSPINIA - Responsive Admin Theme\r\n     *   NAME - Inspinia Ultra\r\n     *\r\n    */\r\n    body.skin-2 {\r\n      color: #565758 !important;\r\n    }\r\n    .skin-2 .minimalize-styl-2 {\r\n      margin: 14px 5px 5px 25px;\r\n    }\r\n    .skin-2 .navbar-top-links li:last-child {\r\n      margin-right: 25px;\r\n    }\r\n    .skin-2 .spin-icon {\r\n      background: #23c6c8 !important;\r\n    }\r\n    .skin-2 .nav-header {\r\n      background-color: #23c6c8;\r\n      background-image: url(" + __webpack_require__(49) + ");\r\n    }\r\n    .skin-2.mini-navbar .nav-second-level {\r\n      background: #ededed;\r\n    }\r\n    .skin-2 .breadcrumb {\r\n      background: transparent;\r\n    }\r\n    .skin-2.fixed-nav .minimalize-styl-2 {\r\n      margin: 14px 5px 5px 15px;\r\n    }\r\n    .skin-2 .page-heading {\r\n      border: none;\r\n      background: rgba(255, 255, 255, 0.7);\r\n    }\r\n    .skin-2 ul.nav-second-level {\r\n      background-color: inherit;\r\n    }\r\n    .skin-2 .nav > li.active {\r\n      background: #e0e0e0;\r\n    }\r\n    .skin-2 .logo-element {\r\n      padding: 17px 0;\r\n    }\r\n    .skin-2 .nav > li > a,\r\n    .skin-2 .welcome-message {\r\n      color: #edf6ff;\r\n    }\r\n    .skin-2 #top-search::-moz-placeholder {\r\n      color: #edf6ff;\r\n      opacity: 0.5;\r\n    }\r\n    .skin-2 #side-menu > li > a,\r\n    .skin-2 .nav.nav-second-level > li > a {\r\n      color: #586b7d;\r\n    }\r\n    .skin-2 .nav > li.active > a {\r\n      color: #213a53;\r\n    }\r\n    .skin-2.mini-navbar .nav-header {\r\n      background: #213a53;\r\n    }\r\n    .skin-2 .navbar-minimalize {\r\n      background: #23c6c8;\r\n      border-color: #23c6c8;\r\n    }\r\n    .skin-2 .border-bottom {\r\n      border-bottom: none !important;\r\n    }\r\n    .skin-2 #top-search {\r\n      color: #fff;\r\n    }\r\n    body.skin-2 #wrapper {\r\n      background-color: #ededed;\r\n    }\r\n    .skin-2 .navbar-static-top {\r\n      background: #213a53;\r\n    }\r\n    .fixed-nav.skin-2 .navbar-fixed-top {\r\n      background: #213a53;\r\n      border-bottom: none !important;\r\n    }\r\n    .skin-2 .nav-header {\r\n      padding: 30px 25px 30px 25px;\r\n    }\r\n    .skin-2 .dashboard-header {\r\n      background: rgba(255, 255, 255, 0.4);\r\n      border-bottom: none !important;\r\n      border-top: none;\r\n      padding: 20px 30px 20px 30px;\r\n    }\r\n    .skin-2 .wrapper-content {\r\n      padding: 30px 15px;\r\n    }\r\n    .skin-2 .dashoard-1 .wrapper-content {\r\n      padding: 0 30px 25px 30px;\r\n    }\r\n    .skin-2 .ibox-title {\r\n      background: rgba(255, 255, 255, 0.7);\r\n      border: none;\r\n      margin-bottom: 1px;\r\n    }\r\n    .skin-2 .ibox-content {\r\n      background: rgba(255, 255, 255, 0.4);\r\n      border: none !important;\r\n    }\r\n    .skin-2 #page-wrapper {\r\n      background: #f6f6f6;\r\n      background: -webkit-radial-gradient(center, ellipse cover, #f6f6f6 20%, #d5d5d5 100%);\r\n      background: -o-radial-gradient(center, ellipse cover, #f6f6f6 20%, #d5d5d5 100%);\r\n      background: -ms-radial-gradient(center, ellipse cover, #f6f6f6 20%, #d5d5d5 100%);\r\n      background: radial-gradient(ellipse at center, #f6f6f6 20%, #d5d5d5 100%);\r\n      -ms-filter: \"progid:DXImageTransform.Microsoft.gradient(startColorstr=#f6f6f6, endColorstr=#d5d5d5)\";\r\n    }\r\n    .skin-2 .ibox-title,\r\n    .skin-2 .ibox-content {\r\n      border-width: 1px;\r\n    }\r\n    .skin-2 .ibox-content:last-child {\r\n      border-style: solid solid solid solid;\r\n    }\r\n    .skin-2 .nav > li.active {\r\n      border: none;\r\n    }\r\n    .skin-2 .nav-header a.dropdown-toggle {\r\n      color: #edf6ff;\r\n      margin-top: 10px;\r\n    }\r\n    .skin-2 .nav-header a.dropdown-toggle .text-muted {\r\n      color: #edf6ff;\r\n      opacity: 0.8;\r\n    }\r\n    .skin-2 .img-circle {\r\n      border-radius: 10px;\r\n    }\r\n    .skin-2 .nav.navbar-top-links > li > a:hover,\r\n    .skin-2 .nav.navbar-top-links > li > a:focus {\r\n      background: #1a2d41;\r\n    }\r\n    .skin-2 .navbar-default .nav > li > a:hover,\r\n    .skin-2 .navbar-default .nav > li > a:focus {\r\n      background: #e0e0e0;\r\n      color: #213a53;\r\n    }\r\n    .skin-2 .nav.nav-tabs > li.active > a {\r\n      color: #555;\r\n    }\r\n    .skin-2 .nav.nav-tabs > li.active {\r\n      background: transparent;\r\n    }\r\n    /*\r\n     *\r\n     *   SKIN 3 - INSPINIA - Responsive Admin Theme\r\n     *   NAME - Yellow/purple\r\n     *\r\n    */\r\n    .skin-3 .minimalize-styl-2 {\r\n      margin: 14px 5px 5px 30px;\r\n    }\r\n    .skin-3 .navbar-top-links li:last-child {\r\n      margin-right: 30px;\r\n    }\r\n    .skin-3.fixed-nav .minimalize-styl-2 {\r\n      margin: 14px 5px 5px 15px;\r\n    }\r\n    .skin-3 .spin-icon {\r\n      background: #ecba52 !important;\r\n    }\r\n    body.boxed-layout.skin-3 #wrapper {\r\n      background: #3e2c42;\r\n    }\r\n    .skin-3 .nav-header {\r\n      background-color: #ecba52;\r\n      background-image: url(" + __webpack_require__(12) + ");\r\n    }\r\n    .skin-3.mini-navbar .nav-second-level {\r\n      background: #3e2c42;\r\n    }\r\n    .skin-3 .breadcrumb {\r\n      background: transparent;\r\n    }\r\n    .skin-3 .page-heading {\r\n      border: none;\r\n    }\r\n    .skin-3 ul.nav-second-level {\r\n      background-color: inherit;\r\n    }\r\n    .skin-3 .nav > li.active {\r\n      background: #38283c;\r\n    }\r\n    .fixed-nav.skin-3 .navbar-fixed-top {\r\n      background: #fff;\r\n    }\r\n    .skin-3 .nav > li > a {\r\n      color: #948b96;\r\n    }\r\n    .skin-3 .nav > li.active > a {\r\n      color: #fff;\r\n    }\r\n    .skin-3 .navbar-minimalize {\r\n      background: #ecba52;\r\n      border-color: #ecba52;\r\n    }\r\n    body.skin-3 {\r\n      background: #3e2c42;\r\n    }\r\n    .skin-3 .navbar-static-top {\r\n      background: #ffffff;\r\n    }\r\n    .skin-3 .dashboard-header {\r\n      background: transparent;\r\n      border-bottom: none !important;\r\n      border-top: none;\r\n      padding: 20px 30px 10px 30px;\r\n    }\r\n    .skin-3 .wrapper-content {\r\n      padding: 30px 15px;\r\n    }\r\n    .skin-3 #page-wrapper {\r\n      background: #f4f6fa;\r\n    }\r\n    .skin-3 .ibox-title,\r\n    .skin-3 .ibox-content {\r\n      border-width: 1px;\r\n    }\r\n    .skin-3 .ibox-content:last-child {\r\n      border-style: solid solid solid solid;\r\n    }\r\n    .skin-3 .nav > li.active {\r\n      border: none;\r\n    }\r\n    .skin-3 .nav-header {\r\n      padding: 35px 25px 25px 25px;\r\n    }\r\n    .skin-3 .nav-header a.dropdown-toggle {\r\n      color: #fff;\r\n      margin-top: 10px;\r\n    }\r\n    .skin-3 .nav-header a.dropdown-toggle .text-muted {\r\n      color: #fff;\r\n      opacity: 0.8;\r\n    }\r\n    .skin-3 .profile-element {\r\n      text-align: center;\r\n    }\r\n    .skin-3 .img-circle {\r\n      border-radius: 5px;\r\n    }\r\n    .skin-3 .navbar-default .nav > li > a:hover,\r\n    .skin-3 .navbar-default .nav > li > a:focus {\r\n      background: #38283c;\r\n      color: #fff;\r\n    }\r\n    .skin-3 .nav.nav-tabs > li.active > a {\r\n      color: #555;\r\n    }\r\n    .skin-3 .nav.nav-tabs > li.active {\r\n      background: transparent;\r\n    }\r\n    body.md-skin {\r\n      font-family: \"Roboto\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n      background-color: #ffffff;\r\n    }\r\n    .md-skin .nav-header {\r\n      background: url(" + __webpack_require__(10) + ") no-repeat;\r\n    }\r\n    .md-skin .label,\r\n    .md-skin .badge {\r\n      font-family: 'Roboto';\r\n    }\r\n    .md-skin ul.nav-second-level {\r\n      background-color: inherit;\r\n    }\r\n    .md-skin .font-bold {\r\n      font-weight: 500;\r\n    }\r\n    .md-skin .wrapper-content {\r\n      padding: 30px 20px 40px;\r\n    }\r\n    @media (max-width: 768px) {\r\n      .md-skin .wrapper-content {\r\n        padding: 30px 0 40px;\r\n      }\r\n    }\r\n    .md-skin .page-heading {\r\n      border-bottom: none !important;\r\n      border-top: 0;\r\n      padding: 0 10px 20px 10px;\r\n      box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.34), 0 0 6px 0 rgba(0, 0, 0, 0.14);\r\n    }\r\n    .md-skin .full-height-layout .page-heading {\r\n      border-bottom: 1px solid #e7eaec !important;\r\n    }\r\n    .md-skin .ibox {\r\n      clear: both;\r\n      margin-bottom: 25px;\r\n      margin-top: 0;\r\n      padding: 0;\r\n      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\r\n    }\r\n    .md-skin .ibox.border-bottom {\r\n      border-bottom: none !important;\r\n    }\r\n    .md-skin .ibox-title,\r\n    .md-skin .ibox-content {\r\n      border-style: none;\r\n    }\r\n    .md-skin .ibox-title h5 {\r\n      font-size: 16px;\r\n      font-weight: 400;\r\n    }\r\n    .md-skin a.close-canvas-menu {\r\n      color: #ffffff;\r\n    }\r\n    .md-skin .welcome-message {\r\n      color: #ffffff;\r\n      font-weight: 300;\r\n    }\r\n    .md-skin #top-search::-moz-placeholder {\r\n      color: #ffffff;\r\n    }\r\n    .md-skin #top-search::-webkit-input-placeholder {\r\n      color: #ffffff;\r\n    }\r\n    .md-skin #nestable-output,\r\n    .md-skin #nestable2-output {\r\n      font-family: 'Roboto', lucida grande, lucida sans unicode, helvetica, arial, sans-serif;\r\n    }\r\n    .md-skin .landing-page {\r\n      font-family: 'Roboto', helvetica, arial, sans-serif;\r\n    }\r\n    .md-skin .landing-page.navbar-default.navbar-scroll {\r\n      background-color: #fff !important;\r\n    }\r\n    .md-skin .landing-page.navbar-default {\r\n      background-color: transparent !important;\r\n      box-shadow: none;\r\n    }\r\n    .md-skin .landing-page.navbar-default .nav li a {\r\n      font-family: 'Roboto', helvetica, arial, sans-serif;\r\n    }\r\n    .md-skin .nav > li > a {\r\n      color: #676a6c;\r\n      padding: 14px 20px 14px 25px;\r\n    }\r\n    .md-skin .nav.navbar-right > li > a {\r\n      color: #ffffff;\r\n    }\r\n    .md-skin .nav > li.active > a {\r\n      color: #5b5d5f;\r\n      font-weight: 700;\r\n    }\r\n    .md-skin .navbar-default .nav > li > a:hover,\r\n    .md-skin .navbar-default .nav > li > a:focus {\r\n      font-weight: 700;\r\n      color: #5b5d5f;\r\n    }\r\n    .md-skin .nav .open > a,\r\n    .md-skin .nav .open > a:hover,\r\n    .md-skin .nav .open > a:focus {\r\n      background: #1ab394;\r\n    }\r\n    .md-skin .navbar-top-links li {\r\n      display: inline-table;\r\n    }\r\n    .md-skin .navbar-top-links .dropdown-menu li {\r\n      display: block;\r\n    }\r\n    .md-skin .pace-done .nav-header {\r\n      transition: all 0.4s;\r\n    }\r\n    .md-skin .nav > li.active {\r\n      background: #f8f8f9;\r\n    }\r\n    .md-skin .nav-second-level li a {\r\n      padding: 7px 10px 7px 52px;\r\n    }\r\n    .md-skin .nav-third-level li a {\r\n      padding-left: 62px;\r\n    }\r\n    .md-skin .navbar-top-links li a {\r\n      padding: 20px 10px;\r\n      min-height: 50px;\r\n    }\r\n    .md-skin .nav > li > a {\r\n      font-weight: 400;\r\n    }\r\n    .md-skin .navbar-static-side .nav > li > a:focus,\r\n    .md-skin .navbar-static-side .nav > li > a:hover {\r\n      background-color: inherit;\r\n    }\r\n    .md-skin .navbar-top-links .dropdown-menu li a {\r\n      padding: 3px 20px;\r\n      min-height: inherit;\r\n    }\r\n    .md-skin .nav-header .navbar-fixed-top a {\r\n      color: #ffffff;\r\n    }\r\n    .md-skin .nav-header .text-muted {\r\n      color: #ffffff;\r\n    }\r\n    .md-skin .navbar-form-custom .form-control {\r\n      font-weight: 300;\r\n    }\r\n    .md-skin .mini-navbar .nav-second-level {\r\n      background-color: inherit;\r\n    }\r\n    .md-skin .mini-navbar li.active .nav-second-level {\r\n      left: 65px;\r\n    }\r\n    .md-skin .canvas-menu.mini-navbar .nav-second-level {\r\n      background: inherit;\r\n    }\r\n    .md-skin .pace-done .navbar-static-side,\r\n    .md-skin .pace-done .nav-header,\r\n    .md-skin .pace-done li.active,\r\n    .md-skin .pace-done #page-wrapper,\r\n    .md-skin .pace-done .footer {\r\n      -webkit-transition: all 0.4s;\r\n      -moz-transition: all 0.4s;\r\n      -o-transition: all 0.4s;\r\n      transition: all 0.4s;\r\n    }\r\n    .md-skin .navbar-fixed-top {\r\n      background: #fff;\r\n      transition-duration: 0.4s;\r\n      z-index: 2030;\r\n      border-bottom: none !important;\r\n    }\r\n    .md-skin .navbar-fixed-top,\r\n    .md-skin .navbar-static-top {\r\n      background-color: #1ab394 !important;\r\n      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\r\n    }\r\n    .md-skin .navbar-static-side {\r\n      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\r\n    }\r\n    .md-skin #right-sidebar {\r\n      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\r\n      border: none;\r\n      z-index: 900;\r\n    }\r\n    .md-skin .white-bg .navbar-fixed-top,\r\n    .md-skin .white-bg .navbar-static-top {\r\n      background: #fff !important;\r\n    }\r\n    .md-skin .contact-box {\r\n      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\r\n      border: none;\r\n    }\r\n    .md-skin .dashboard-header {\r\n      border-bottom: none !important;\r\n      border-top: 0;\r\n      padding: 20px 20px 20px 20px;\r\n      margin: 30px 20px 0 20px;\r\n      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\r\n    }\r\n    @media (max-width: 768px) {\r\n      .md-skin .dashboard-header {\r\n        margin: 20px 0 0 0;\r\n      }\r\n    }\r\n    .md-skin ul.notes li div {\r\n      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\r\n    }\r\n    .md-skin .file {\r\n      border: none;\r\n      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\r\n    }\r\n    .md-skin .mail-box {\r\n      background-color: #ffffff;\r\n      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\r\n      padding: 0;\r\n      margin-bottom: 20px;\r\n      border: none;\r\n    }\r\n    .md-skin .mail-box-header {\r\n      border: none;\r\n      background-color: #ffffff;\r\n      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\r\n      padding: 30px 20px 20px 20px;\r\n    }\r\n    .md-skin .mailbox-content {\r\n      border: none;\r\n      padding: 20px;\r\n      background: #ffffff;\r\n    }\r\n    .md-skin .social-feed-box {\r\n      border: none;\r\n      background: #fff;\r\n      margin-bottom: 15px;\r\n      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\r\n    }\r\n    .md-skin.landing-page .navbar-default {\r\n      background-color: transparent !important;\r\n      border-color: transparent;\r\n      transition: all 0.3s ease-in-out 0s;\r\n      box-shadow: none;\r\n    }\r\n    .md-skin.landing-page .navbar-default.navbar-scroll,\r\n    .md-skin.landing-page.body-small .navbar-default {\r\n      background-color: #ffffff !important;\r\n    }\r\n    .md-skin.landing-page .nav > li.active {\r\n      background: inherit;\r\n    }\r\n    .md-skin.landing-page .navbar-scroll .navbar-nav > li > a {\r\n      padding: 20px 10px;\r\n    }\r\n    .md-skin.landing-page .navbar-default .nav li a {\r\n      font-family: 'Roboto', helvetica, arial, sans-serif;\r\n    }\r\n    .md-skin.landing-page .nav > li > a {\r\n      padding: 25px 10px 15px 10px;\r\n    }\r\n    .md-skin.landing-page .navbar-default .navbar-nav > li > a:hover,\r\n    .md-skin.landing-page .navbar-default .navbar-nav > li > a:focus {\r\n      background: inherit;\r\n      color: #1ab394;\r\n    }\r\n    .md-skin.landing-page.body-small .nav.navbar-right > li > a {\r\n      color: #676a6c;\r\n    }\r\n    .md-skin .landing_link a,\r\n    .md-skin .special_link a {\r\n      color: #ffffff !important;\r\n    }\r\n    .md-skin.canvas-menu.mini-navbar .nav-second-level {\r\n      background: #f8f8f9;\r\n    }\r\n    .md-skin.mini-navbar .nav-second-level {\r\n      background-color: #ffffff;\r\n      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\r\n    }\r\n    .md-skin.mini-navbar .nav-second-level li a {\r\n      padding-left: 0;\r\n    }\r\n    .md-skin.mini-navbar.fixed-sidebar .nav-second-level li a {\r\n      padding-left: 52px;\r\n    }\r\n    .md-skin.top-navigation .nav.navbar-right > li > a {\r\n      padding: 15px 20px;\r\n      color: #676a6c;\r\n    }\r\n    .md-skin.top-navigation .nav > li a:hover,\r\n    .md-skin .top-navigation .nav > li a:focus,\r\n    .md-skin.top-navigation .nav .open > a,\r\n    .md-skin.top-navigation .nav .open > a:hover,\r\n    .md-skin.top-navigation .nav .open > a:focus {\r\n      color: #1ab394;\r\n      background: #ffffff;\r\n    }\r\n    .md-skin.top-navigation .nav > li.active a {\r\n      color: #1ab394;\r\n      background: #ffffff;\r\n    }\r\n    .md-skin.fixed-nav #side-menu {\r\n      background-color: #fff;\r\n    }\r\n    .md-skin.fixed-nav #wrapper.top-navigation #page-wrapper {\r\n      margin-top: 0;\r\n    }\r\n    .md-skin.fixed-sidebar.mini-navbar .navbar-static-side {\r\n      width: 0;\r\n    }\r\n    .md-skin.fixed-sidebar.mini-navbar #page-wrapper {\r\n      margin: 0 0 0 0;\r\n    }\r\n    .md-skin.body-small.fixed-sidebar.mini-navbar #page-wrapper {\r\n      margin: 0 0 0 0;\r\n    }\r\n    .md-skin.body-small.fixed-sidebar.mini-navbar .navbar-static-side {\r\n      width: 220px;\r\n      background-color: #ffffff;\r\n    }\r\n    .md-skin.boxed-layout #wrapper {\r\n      background-color: #ffffff;\r\n    }\r\n    .md-skin.canvas-menu nav.navbar-static-side {\r\n      z-index: 2001;\r\n      background: #ffffff;\r\n      height: 100%;\r\n      position: fixed;\r\n      display: none;\r\n    }\r\n    @media (min-width: 768px) {\r\n      #page-wrapper {\r\n        position: inherit;\r\n        margin: 0 0 0 220px;\r\n        min-height: 100vh;\r\n      }\r\n      .navbar-static-side {\r\n        z-index: 2001;\r\n        position: absolute;\r\n        width: 220px;\r\n      }\r\n      .navbar-top-links .dropdown-messages,\r\n      .navbar-top-links .dropdown-tasks,\r\n      .navbar-top-links .dropdown-alerts {\r\n        margin-left: auto;\r\n      }\r\n    }\r\n    @media (max-width: 768px) {\r\n      #page-wrapper {\r\n        position: inherit;\r\n        margin: 0 0 0 0;\r\n        min-height: 100vh;\r\n      }\r\n      .body-small .navbar-static-side {\r\n        display: none;\r\n        z-index: 2001;\r\n        position: absolute;\r\n        width: 70px;\r\n      }\r\n      .body-small.mini-navbar .navbar-static-side {\r\n        display: block;\r\n      }\r\n      .lock-word {\r\n        display: none;\r\n      }\r\n      .navbar-form-custom {\r\n        display: none;\r\n      }\r\n      .navbar-header {\r\n        display: inline;\r\n        float: left;\r\n      }\r\n      .sidebar-panel {\r\n        z-index: 2;\r\n        position: relative;\r\n        width: auto;\r\n        min-height: 100% !important;\r\n      }\r\n      .sidebar-content .wrapper {\r\n        padding-right: 0;\r\n        z-index: 1;\r\n      }\r\n      .fixed-sidebar.body-small .navbar-static-side {\r\n        display: none;\r\n        z-index: 2001;\r\n        position: fixed;\r\n        width: 220px;\r\n      }\r\n      .fixed-sidebar.body-small.mini-navbar .navbar-static-side {\r\n        display: block;\r\n      }\r\n      .ibox-tools {\r\n        float: none;\r\n        text-align: right;\r\n        display: block;\r\n      }\r\n      .navbar-static-side {\r\n        display: none;\r\n      }\r\n      body:not(.mini-navbar) {\r\n        -webkit-transition: background-color 500ms linear;\r\n        -moz-transition: background-color 500ms linear;\r\n        -o-transition: background-color 500ms linear;\r\n        -ms-transition: background-color 500ms linear;\r\n        transition: background-color 500ms linear;\r\n        background-color: #f3f3f4;\r\n      }\r\n    }\r\n    @media (max-width: 350px) {\r\n      .timeline-item .date {\r\n        text-align: left;\r\n        width: 110px;\r\n        position: relative;\r\n        padding-top: 30px;\r\n      }\r\n      .timeline-item .date i {\r\n        position: absolute;\r\n        top: 0;\r\n        left: 15px;\r\n        padding: 5px;\r\n        width: 30px;\r\n        text-align: center;\r\n        border: 1px solid #e7eaec;\r\n        background: #f8f8f8;\r\n      }\r\n      .timeline-item .content {\r\n        border-left: none;\r\n        border-top: 1px solid #e7eaec;\r\n        padding-top: 10px;\r\n        min-height: 100px;\r\n      }\r\n      .nav.navbar-top-links li.dropdown {\r\n        display: none;\r\n      }\r\n      .ibox-tools {\r\n        float: none;\r\n        text-align: left;\r\n        display: inline-block;\r\n      }\r\n    }\r\n    /* Only demo */\r\n    @media (max-width: 1000px) {\r\n      .welcome-message {\r\n        display: none;\r\n      }\r\n    }\r\n    @media print {\r\n      nav.navbar-static-side {\r\n        display: none;\r\n      }\r\n      body {\r\n        overflow: visible !important;\r\n      }\r\n      #page-wrapper {\r\n        margin: 0;\r\n      }\r\n    }\r\n    \r\n    .inputfile {\r\n      width: 0.1px;\r\n      height: 0.1px;\r\n      opacity: 0;\r\n      overflow: hidden;\r\n      position: absolute;\r\n      z-index: -1;\r\n    }\r\n    \r\n    .inputfile + label {\r\n      width: 100%;\r\n      height: 40px;\r\n      font-size: 1.5rem;\r\n      /* 20px */\r\n      font-weight: 700;\r\n      text-overflow: ellipsis;\r\n      white-space: nowrap;\r\n      cursor: pointer;\r\n      display: inline-block;\r\n      overflow: hidden;\r\n      padding: 0.625rem 1.25rem;\r\n      /* 10px 20px */\r\n    }\r\n    \r\n    .no-js .inputfile + label {\r\n      display: none;\r\n    }\r\n    \r\n    .inputfile:focus + label,\r\n    .inputfile.has-focus + label {\r\n      outline: 1px dotted #000;\r\n      outline: -webkit-focus-ring-color auto 5px;\r\n    }\r\n    \r\n    .inputfile + label * {\r\n      /* pointer-events: none; */\r\n      /* in case of FastClick lib use */\r\n    }\r\n    \r\n    .inputfile + label svg {\r\n      width: 1em;\r\n      height: 1em;\r\n      vertical-align: middle;\r\n      fill: currentColor;\r\n      margin-top: -0.25em;\r\n      /* 4px */\r\n      margin-right: 0.25em;\r\n      /* 4px */\r\n    }\r\n    \r\n    .inputfile-2 + label {\r\n      color: #f77032;\r\n      border: 2px solid currentColor;\r\n    }\r\n    \r\n    .inputfile-2:focus + label,\r\n    .inputfile-2.has-focus + label,\r\n    .inputfile-2 + label:hover {\r\n      color: #d34300;\r\n    }\r\n    \r\n    .trash-icon {\r\n      margin-left: 10px;\r\n      margin-top: 10px;\r\n      color: #d34300;\r\n      cursor: pointer;\r\n    }\r\n    \r\n    .error {\r\n      color: red;\r\n    }\r\n    \r\n    .logTable td {\r\n      text-overflow: ellipsis;\r\n      overflow: hidden;\r\n      white-space: nowrap;\r\n    }\r\n    \r\n    .logTableMax {\r\n      max-width: 100px;\r\n    }\r\n    \r\n    /* iCheck plugin Square skin, green\r\n    ----------------------------------- */\r\n    .i-checks {\r\n      position: absolute; \r\n      opacity: 0;\r\n      cursor: pointer;\r\n    }\r\n    \r\n    .icheckbox_square-green,\r\n    .iradio_square-green {\r\n        display: inline-block;\r\n        *display: inline;\r\n        vertical-align: middle;\r\n        margin: 0;\r\n        padding: 0;\r\n        width: 22px;\r\n        height: 22px;\r\n        background: url(" + __webpack_require__(47) + ") no-repeat;\r\n        border: none;\r\n        cursor: pointer;\r\n    }\r\n    \r\n    .icheckbox_square-green {\r\n        background-position: 0 0;\r\n    }\r\n    .icheckbox_square-green:hover {\r\n        background-position: -24px 0;\r\n    }\r\n    .icheckbox_square-green.checked {\r\n        background-position: -48px 0;\r\n    }\r\n    .icheckbox_square-green .disabled {\r\n        background-position: -72px 0;\r\n        cursor: default;\r\n    }\r\n    .icheckbox_square-green .checked .disabled {\r\n        background-position: -96px 0;\r\n    }\r\n    \r\n    .iradio_square-green {\r\n        background-position: -120px 0;\r\n    }\r\n    .iradio_square-green :hover {\r\n        background-position: -144px 0;\r\n    }\r\n    .iradio_square-green.checked {\r\n        background-position: -168px 0;\r\n    }\r\n    .iradio_square-green.disabled {\r\n        background-position: -192px 0;\r\n        cursor: default;\r\n    }\r\n    .iradio_square-green.checked.disabled {\r\n        background-position: -216px 0;\r\n    }\r\n    \r\n    /* HiDPI support */\r\n    @media (-o-min-device-pixel-ratio: 5/4), (-webkit-min-device-pixel-ratio: 1.25), (min-resolution: 120dpi) {\r\n        .icheckbox_square-green,\r\n        .iradio_square-green {\r\n            background-image: url(" + __webpack_require__(48) + ");\r\n            -webkit-background-size: 240px 24px;\r\n            background-size: 240px 24px;\r\n        }\r\n    }\r\n    \r\n    .suspendLabel {\r\n      margin-left: 5px;\r\n    }\r\n    \r\n    .btn-login-fb {\r\n      background-color: #3b5998 !important;\r\n      color: white !important;\r\n    }\r\n    \r\n    .btn-login-li {\r\n      background-color: #0077B5 !important;\r\n      color: white !important;\r\n    }\r\n    \r\n    .login-alert {\r\n      position: absolute;\r\n      bottom: 0;\r\n      right: 0;\r\n    }\r\n\r\n    .ng-valid[required], .ng-valid.required  {\r\n      border-left: 5px solid #42A948; /* green */\r\n    }\r\n    \r\n    .ng-invalid:not(form)  {\r\n      border-left: 5px solid #a94442; /* red */\r\n    }\r\n", ""]);

// exports


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)(undefined);
// imports


// module
exports.push([module.i, "li .glyphicon {\r\n    margin-right: 10px;\r\n}\r\n\r\n/* Highlighting rules for nav menu items */\r\nli.link-active a,\r\nli.link-active a:hover,\r\nli.link-active a:focus {\r\n    background-color: #4189C7;\r\n    color: white;\r\n}\r\n\r\n/* Keep the nav menu independent of scrolling and on top of other items */\r\n.main-nav {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 1;\r\n}\r\n\r\n@media (min-width: 768px) {\r\n    /* On small screens, convert the nav menu to a vertical sidebar */\r\n    .main-nav {\r\n        height: 100%;\r\n        width: calc(18% - 20px);\r\n    }\r\n    .navbar {\r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;\r\n    }\r\n    .navbar-header {\r\n        float: none;\r\n    }\r\n    .navbar-collapse {\r\n        border-top: 1px solid #444;\r\n        padding: 0px;\r\n    }\r\n    .navbar ul {\r\n        float: none;\r\n    }\r\n    .navbar li {\r\n        float: none;\r\n        font-size: 15px;\r\n        margin: 6px;\r\n    }\r\n    .navbar li a {\r\n        padding: 10px 16px;\r\n        border-radius: 4px;\r\n    }\r\n    .navbar a {\r\n        /* If a menu item's text is too long, truncate it */\r\n        width: 100%;\r\n        white-space: nowrap;\r\n        overflow: hidden;\r\n        text-overflow: ellipsis;\r\n    }\r\n}\r\n", ""]);

// exports


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(32),
  Html4Entities: __webpack_require__(31),
  Html5Entities: __webpack_require__(9),
  AllHtmlEntities: __webpack_require__(9)
};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = "";

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = "<div class=\"wrapper wrapper-content animated fadeIn\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <div class=\"ibox float-e-margins\">\r\n                <div class='container-fluid'>\r\n                    <div class='row'>\r\n                        <div class='col-sm-2'>\r\n                            <nav-menu></nav-menu>\r\n                        </div>\r\n                        <div class='col-sm-10 body-content'>\r\n                            <router-outlet></router-outlet>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n";

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = "<div class=\"ibox-title\">\r\n    <h5>Customer Form\r\n        <small>Fill in all blanks</small>\r\n    </h5>\r\n</div>\r\n<hr/>\r\n<div class=\"col-sm-9 m-b-xs\"  *ngIf=\"isEdit\">\r\n    <div class=\"btn-group\">\r\n        <p>Not able to make it last second?</p>\r\n        <p>We've got you covered</p>\r\n        <button class=\"btn btn-sm btn-white\" [routerLink]=\"['/excuse']\"> Create an excuse </button>\r\n    </div>\r\n</div>\r\n<div class=\"ibox-content\">\r\n    \r\n    <form #custForm=\"ngForm\">\r\n        <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Customer First Name</label>\r\n            <div class=\"col-sm-9\">\r\n                <input id=\"custFName\" class=\"form-control\"\r\n                    required name=\"custFName\"\r\n                    [(ngModel)]=\"model.custFName\" #custFName=\"ngModel\" >\r\n                <div *ngIf=\"custFName.invalid && (custFName.dirty || custFName.touched)\"\r\n                    class=\"alert alert-danger\">\r\n                    <div *ngIf=\"custFName.errors.required\">\r\n                        First Name is required.\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Customer Last Name</label>\r\n            <div class=\"col-sm-9\">\r\n                <input id=\"custLName\" class=\"form-control\"\r\n                    required name=\"custLName\"\r\n                    [(ngModel)]=\"model.custLName\" #custLName=\"ngModel\" >\r\n                <div *ngIf=\"custLName.invalid && (custLName.dirty || custLName.touched)\"\r\n                    class=\"alert alert-danger\">\r\n                    <div *ngIf=\"custLName.errors.required\">\r\n                        Last Name is required.\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Street</label>\r\n            <div class=\"col-sm-9\">\r\n                <input id=\"street\" class=\"form-control\"\r\n                    required name=\"street\"\r\n                    [(ngModel)]=\"model.street\" #street=\"ngModel\" >\r\n                <div *ngIf=\"street.invalid && (street.dirty || street.touched)\"\r\n                    class=\"alert alert-danger\">\r\n                    <div *ngIf=\"street.errors.required\">\r\n                        Street address is required.\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"form-group\"><label class=\"col-sm-3 control-label\">City</label>\r\n            <div class=\"col-sm-9\">\r\n                <input id=\"city\" class=\"form-control\"\r\n                    required name=\"city\"\r\n                    [(ngModel)]=\"model.city\" #city=\"ngModel\" >\r\n                <div *ngIf=\"city.invalid && (city.dirty || city.touched)\"\r\n                    class=\"alert alert-danger\">\r\n                    <div *ngIf=\"city.errors.required\">\r\n                        City is required.\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"form-group\"><label class=\"col-sm-3 control-label\">State</label>\r\n            <div class=\"col-sm-9\">\r\n                <input id=\"state\" class=\"form-control\"\r\n                    required name=\"state\" minlength=\"2\" maxlength=\"2\"\r\n                    [(ngModel)]=\"model.state\" #state=\"ngModel\" >\r\n                <div *ngIf=\"state.invalid && (state.dirty || state.touched)\"\r\n                    class=\"alert alert-danger\">\r\n                    <div *ngIf=\"state.errors.required\">\r\n                        State is required.\r\n                    </div>\r\n                    <div *ngIf=\"state.errors.minlength\">\r\n                        The state must be 2 letters.\r\n                    </div>\r\n                    <div *ngIf=\"state.errors.maxlength\">\r\n                        The state must be 2 letters.\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Zip</label>\r\n            <div class=\"col-sm-9\">\r\n                <input id=\"zip\" class=\"form-control\"\r\n                    required  name=\"zip\" maxlength=\"5\"\r\n                    [(ngModel)]=\"model.zip\" #zip=\"ngModel\" \r\n                    pattern=\"^\\d{5}(?:[-\\s]\\d{4})?$\">\r\n                <div *ngIf=\"zip.invalid && (zip.dirty ||zip.touched)\"\r\n                    class=\"alert alert-danger\">\r\n                    <div *ngIf=\"zip.errors.required\">\r\n                        The zip code is required.\r\n                    </div>\r\n                    <div *ngIf=\"zip.errors.pattern\">\r\n                        The zip code must be 5 NUMBERS.\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Email</label>\r\n            <div class=\"col-sm-9\">\r\n                <input id=\"email\" class=\"form-control\"\r\n                    required name=\"email\" type=\"email\"\r\n                    [(ngModel)]=\"model.email\" #email=\"ngModel\"\r\n                    pattern='^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$' >\r\n                <div *ngIf=\"email.invalid && (email.dirty || email.touched)\"\r\n                    class=\"alert alert-danger\">\r\n                    <div *ngIf=\"email.errors.required\">\r\n                        Email is required.\r\n                    </div>\r\n                    <div *ngIf=\"email.errors.pattern\">\r\n                        A valid email address is required.\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Phone Number</label>\r\n            <div class=\"col-sm-9\">\r\n                <input id=\"phone\" class=\"form-control\" \r\n                    required name=\"phone\" pattern=\"^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$\"\r\n                    [(ngModel)]=\"model.phone\" #phone=\"ngModel\" >\r\n                <div *ngIf=\"phone.invalid && (phone.dirty || phone.touched)\"\r\n                    class=\"alert alert-danger\">\r\n                    <div *ngIf=\"phone.errors.required\">\r\n                        A phone number is required.\r\n                    </div>\r\n                    <div *ngIf=\"phone.errors.pattern\">\r\n                        You must enter a valid phone number(000-000-0000).\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Appointment Date</label>\r\n            <div class=\"col-sm-9\">\r\n                <input id=\"appointDate\" class=\"form-control\"\r\n                    required name=\"appointDate\" type=\"date\"\r\n                    [(ngModel)]=\"model.appointDate\" #appointDate=\"ngModel\" >\r\n                <div *ngIf=\"appointDate.invalid && (appointDate.dirty || appointDate.touched)\"\r\n                    class=\"alert alert-danger\">\r\n                    <div *ngIf=\"appointDate.errors.required\">\r\n                        A date is required.\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Appointment Time</label>\r\n            <div class=\"col-sm-9\">\r\n                <input id=\"appointTime\" class=\"form-control\"\r\n                    required name=\"appointTime\" type=\"time\"\r\n                    [(ngModel)]=\"model.appointTime\" #appointTime=\"ngModel\" >\r\n                <div *ngIf=\"appointTime.invalid && (appointTime.dirty || appointTime.touched)\"\r\n                    class=\"alert alert-danger\">\r\n                    <div *ngIf=\"appointTime.errors.required\">\r\n                        A time is required.\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"form-group\" *ngIf=\"showGuide\"><label class=\"col-sm-3 control-label\"></label>\r\n            <div class=\"col-sm-9\" >\r\n                <p class=\"alert-danger\" >If you fill out your company profile these boxes below will autofill</p>\r\n            </div>\r\n        </div>\r\n        <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Company Name</label>\r\n            <div class=\"col-sm-9\">\r\n                <input id=\"compName\" class=\"form-control\"\r\n                    required name=\"compName\" \r\n                    [(ngModel)]=\"model.compName\" #compName=\"ngModel\" >\r\n                <div *ngIf=\"compName.invalid && (compName.dirty || compName.touched)\"\r\n                    class=\"alert alert-danger\">\r\n                    <div *ngIf=\"compName.errors.required\">\r\n                        Your company's name is required.\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <br/>\r\n        <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Company Email</label>\r\n            <div class=\"col-sm-9\">\r\n                <input id=\"compEmail\" class=\"form-control\"\r\n                    required name=\"compEmail\" type=\"email\" \r\n                    [(ngModel)]=\"model.compEmail\" #compEmail=\"ngModel\"\r\n                    pattern='^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$' >\r\n                <div *ngIf=\"compEmail.invalid && (compEmail.dirty || compEmail.touched)\"\r\n                    class=\"alert alert-danger\">\r\n                    <div *ngIf=\"compEmail.errors.required\">\r\n                        Your company's email is required.\r\n                    </div>\r\n                    <div *ngIf=\"email.errors.pattern\">\r\n                        A valid email address is required.\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n            <div class=\"col-sm-4 col-sm-offset-2\"  *ngIf=\"!isEdit\">\r\n                <button  [disabled]=\"custForm.invalid\" (click)=\"onSubmit()\" class=\"btn btn-white\" >Send Confirmation</button>\r\n            </div>\r\n            <div class=\"col-sm-4 col-sm-offset-2\" *ngIf=\"isEdit\">\r\n                <button  [disabled]=\"custForm.invalid\" (click)=\"onEdit()\" class=\"btn btn-white\" >Update</button>\r\n                <button  (click)=\"onDelete()\" class=\"btn btn-white\" >Delete</button>\r\n            </div>\r\n        </div>\r\n    </form>\r\n</div>";

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = "<div class=\"ibox-title\">\r\n    <h1>Excuse</h1>\r\n    <div ibox-tools></div>\r\n</div>\r\n<div class=\"ibox-content\" *ngIf=\"!isDone\">\r\n    <form class=\"form-horizontal\"  #excuseForm=\"ngForm\">\r\n        <p>We know your busy, let us help you get out of your commitments</p>\r\n        <button (click)=\"onExcuse()\" class=\"btn btn-sm btn-white\" >Generate Excuse</button>\r\n        <div class=\"form-group\"><label class=\"col-lg-2 control-label\">Excuse</label>\r\n            <div class=\"col-lg-10\"><input required class=\"form-control\"\r\n                    id=\"excuse\" name=\"excuse\" minlength=\"10\"\r\n                    [(ngModel)]=\"model.excuse\" #excuse=\"ngModel\" >\r\n                <div *ngIf=\"excuse.invalid && (excuse.dirty || excuse.touched)\"\r\n                    class=\"alert alert-danger\">\r\n                    <div *ngIf=\"excuse.errors.required\">\r\n                        A good excuse is required.\r\n                    </div>\r\n                    <div *ngIf=\"excuse.errors.minlength\">\r\n                       Seriously?.. they aren't going to believe you if your excuse is less than 10 characters\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"form-group\"><label class=\"col-lg-2 control-label\">Picture</label>\r\n            <div class=\"col-lg-10\">\r\n                <img class=\"img-responsive\" src='{{ model.image }}' alt=\"the link pic here\" >\r\n            </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n            <div class=\"col-lg-offset-2 col-lg-10\">\r\n                <button  [disabled]=\"excuseForm.invalid\" (click)=\"onSend()\" class=\"btn btn-sm btn-white\" type=\"submit\">Send Excuse</button>\r\n            </div>\r\n        </div>\r\n    </form>\r\n</div>\r\n<div class=\"row\" *ngIf=\"isDone\">\r\n    <div class=\"col-lg-12\">\r\n        <div class=\"wrapper wrapper-content\">\r\n            <div class=\"middle-box text-center animated fadeIn\">\r\n                <h3 class=\"font-bold\">Great Job!</h3>\r\n                <div class=\"error-desc\">\r\n                    You're off the hook!\r\n                </div>\r\n                <div class=\"btn-group\">\r\n                    <button class=\"btn btn-sm btn-white\" [routerLink]=\"['/home']\">Don't Click</button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = "<div class=\"ibox-title\">\r\n    <h1></h1>\r\n    <div ibox-tools></div>\r\n</div>\r\n<div class=\"ibox-content\">\r\n    <div class=\"row\">\r\n        <!-- <div class=\"col-sm-5 m-b-xs\"><select class=\"input-sm form-control input-s-sm inline\">\r\n            <option value=\"0\">Option 1</option>\r\n            <option value=\"1\">Option 2</option>\r\n            <option value=\"2\">Option 3</option>\r\n            <option value=\"3\">Option 4</option>\r\n        </select>\r\n        </div>\r\n        <div class=\"col-sm-4 m-b-xs\">\r\n            <div data-toggle=\"buttons\" class=\"btn-group\">\r\n                <label class=\"btn btn-sm btn-white\"> <input type=\"radio\" id=\"option1\" name=\"options\"> Day </label>\r\n                <label class=\"btn btn-sm btn-white active\"> <input type=\"radio\" id=\"option2\" name=\"options\"> Week </label>\r\n                <label class=\"btn btn-sm btn-white\"> <input type=\"radio\" id=\"option3\" name=\"options\"> Month </label>\r\n            </div>\r\n        </div> -->\r\n        <div class=\"col-sm-9 m-b-xs\">\r\n            <div class=\"btn-group\">\r\n                <button class=\"btn btn-sm btn-white\" [routerLink]=\"['/custform']\">   Create New Appointment </button>\r\n                <button class=\"btn btn-sm btn-white\" (click)=\"upcomAppoint()\">Upcoming Appointments</button>\r\n                <button class=\"btn btn-sm btn-white\" (click)=\"pastAppoint()\">Past Appointments</button>\r\n            </div>\r\n        </div>\r\n       \r\n        <div class=\"col-sm-3\">\r\n            <div class=\"input-group\"><input type=\"text\" placeholder=\"Search\" class=\"input-sm form-control\"> <span class=\"input-group-btn\">\r\n                            <button type=\"button\" class=\"btn btn-sm btn-primary\"> Go!</button> </span></div>\r\n        </div>\r\n    </div>\r\n    <div class=\"table-responsive\">\r\n        <table class=\"table table-striped\">\r\n            <thead>\r\n                <tr>\r\n                    <!-- <th></th> -->\r\n                    <th>Appointment</th>\r\n                    <th>Phone</th>\r\n                    <th>Email</th>\r\n                    <th>Date</th>\r\n                    <th>Time</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <tr *ngFor=\"let dates of appoint\" (click)=\"edit(dates)\" >\r\n                    <!-- <td><input icheck type=\"checkbox\" ng-model=\"main.checkOne\"></td> -->\r\n                    <td>{{ dates.custFName }} {{ dates.custLName }}\r\n                        <small>{{ dates.street }}</small>\r\n                    </td>\r\n                    <td>{{ dates.phone }}</td>\r\n                    <td>{{ dates.email }}</td>\r\n                    <td>{{ dates.appoint | date: 'shortDate' }}</td>\r\n                    <td>{{ dates.appoint | date: 'shortTime' }}</td>\r\n                </tr>\r\n            </tbody>\r\n        </table>\r\n    </div>\r\n</div>";

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "<div class='main-nav'>\r\n    <div class='navbar navbar-inverse'>\r\n        <div class='navbar-header'>\r\n            <button type='button' class='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>\r\n                <span class='sr-only'>Toggle navigation</span>\r\n                <span class='icon-bar'></span>\r\n                <span class='icon-bar'></span>\r\n                <span class='icon-bar'></span>\r\n            </button>\r\n            <a class='navbar-brand' [routerLink]=\"['/home']\">Options</a>\r\n        </div>\r\n        <div class='clearfix'></div>\r\n        <div class='navbar-collapse collapse'>\r\n            <ul class='nav navbar-nav'>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/home']\">\r\n                        <span class='glyphicon glyphicon-home'></span> Appointments\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/profile']\">\r\n                        <span class='glyphicon glyphicon-user'></span> Profile\r\n                    </a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</div>\r\n";

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = "<div class=\"ibox-title\">\r\n    <h5>Company Profile</h5>\r\n</div>\r\n<div  *ngIf=\"!coffee\">\r\n    <div *ngIf=\"!isEdit\">\r\n        <div *ngIf=\"!isUpt\">\r\n            <div class=\"ibox-content no-padding border-left-right\">\r\n            </div>\r\n            <div class=\"ibox-content profile-content\">\r\n                <h3><strong>Your Company Name</strong></h3>\r\n                <h4><strong>Your Name</strong></h4>\r\n                <h5>\r\n                    My Info\r\n                </h5>\r\n                <p>\r\n                    Your Address\r\n                </p>\r\n                <p>\r\n                    Your Phone Number\r\n                </p>\r\n                <p>\r\n                    Your Email Address\r\n                </p>\r\n                <div class=\"user-button\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-md-6\">\r\n                            <button type=\"button\" (click)=\"editProf()\" class=\"btn btn-white btn-sm btn-block\"><i class=\"fa fa-envelope\"></i> Add Company Info Here!</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div *ngIf=\"isUpt\">\r\n            <div class=\"ibox-content no-padding border-left-right\">\r\n            </div>\r\n            <div class=\"ibox-content profile-content\">\r\n                <h3><strong>{{ model.compName }}</strong></h3>\r\n                <h4><strong>{{ model.fName }} {{ model.lName }}</strong></h4>\r\n                <h5>\r\n                    My Info\r\n                </h5>\r\n                <p>\r\n                    Address: {{ model.street }}\r\n                </p>\r\n                <p>\r\n                    {{ model.city }}, {{ model.state }} {{ model.zip }}\r\n                </p>\r\n                <p>\r\n                    Phone Number: {{ model.phone }}\r\n                </p>\r\n                <p>\r\n                    Email Address: {{ model.email }}\r\n                </p>\r\n                <div class=\"user-button\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-md-6\">\r\n                            <button type=\"button\" (click)=\"editProf()\" class=\"btn  btn-white btn-sm btn-block\"><i class=\"fa fa-envelope\"></i> Edit Profile </button>\r\n                        </div>\r\n                        <div class=\"col-md-6\">\r\n                            <button  (click)=\"onCoffee()\" type=\"button\" class=\"btn  btn-white btn-sm btn-block\"><i class=\"fa fa-coffee\"></i> Buy a coffee</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"ibox-content\" *ngIf=\"isEdit\">\r\n        <form #profForm=\"ngForm\">\r\n            <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Company Name</label>\r\n                <div class=\"col-sm-9\">\r\n                    <input id=\"compName\" class=\"form-control\"\r\n                        required name=\"compName\"\r\n                        [(ngModel)]=\"model.compName\" #compName=\"ngModel\" >\r\n                    <div *ngIf=\"compName.invalid && (compName.dirty || compName.touched)\"\r\n                        class=\"alert alert-danger\">\r\n                        <div *ngIf=\"compName.errors.required\">\r\n                            Company Name is required.\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Your First Name</label>\r\n                <div class=\"col-sm-9\">\r\n                    <input id=\"fName\" class=\"form-control\"\r\n                        required name=\"fName\"\r\n                        [(ngModel)]=\"model.fName\" #fName=\"ngModel\" >\r\n                    <div *ngIf=\"fName.invalid && (fName.dirty || fName.touched)\"\r\n                        class=\"alert alert-danger\">\r\n                        <div *ngIf=\"fName.errors.required\">\r\n                            First Name is required.\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <br/>\r\n            <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Your Last Name</label>\r\n                <div class=\"col-sm-9\">\r\n                    <input id=\"lName\" class=\"form-control\"\r\n                        required name=\"lName\"\r\n                        [(ngModel)]=\"model.lName\" #lName=\"ngModel\" >\r\n                    <div *ngIf=\"lName.invalid && (lName.dirty || lName.touched)\"\r\n                        class=\"alert alert-danger\">\r\n                        <div *ngIf=\"lName.errors.required\">\r\n                            Last Name is required.\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <br/>\r\n            <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Street</label>\r\n                <div class=\"col-sm-9\">\r\n                    <input id=\"street\" class=\"form-control\"\r\n                        required name=\"street\"\r\n                        [(ngModel)]=\"model.street\" #street=\"ngModel\" >\r\n                    <div *ngIf=\"street.invalid && (street.dirty || street.touched)\"\r\n                        class=\"alert alert-danger\">\r\n                        <div *ngIf=\"street.errors.required\">\r\n                            Street address is required.\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <br/>\r\n            <div class=\"form-group\"><label class=\"col-sm-3 control-label\">City</label>\r\n                <div class=\"col-sm-9\">\r\n                    <input id=\"city\" class=\"form-control\"\r\n                        required name=\"city\"\r\n                        [(ngModel)]=\"model.city\" #city=\"ngModel\" >\r\n                    <div *ngIf=\"city.invalid && (city.dirty || city.touched)\"\r\n                        class=\"alert alert-danger\">\r\n                        <div *ngIf=\"city.errors.required\">\r\n                            City is required.\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <br/>\r\n            <div class=\"form-group\"><label class=\"col-sm-3 control-label\">State</label>\r\n                <div class=\"col-sm-9\">\r\n                    <input id=\"state\" class=\"form-control\"\r\n                        required name=\"state\" minlength=\"2\" maxlength=\"2\"\r\n                        [(ngModel)]=\"model.state\" #state=\"ngModel\" >\r\n                    <div *ngIf=\"state.invalid && (state.dirty || state.touched)\"\r\n                        class=\"alert alert-danger\">\r\n                        <div *ngIf=\"state.errors.required\">\r\n                            State is required.\r\n                        </div>\r\n                        <div *ngIf=\"state.errors.minlength\">\r\n                            The state must be 2 letters.\r\n                        </div>\r\n                        <div *ngIf=\"state.errors.maxlength\">\r\n                            The state must be 2 letters.\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <br/>\r\n            <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Zip</label>\r\n                <div class=\"col-sm-9\">\r\n                    <input id=\"zip\" class=\"form-control\"\r\n                        required  name=\"zip\" maxlength=\"5\"\r\n                        [(ngModel)]=\"model.zip\" #zip=\"ngModel\" \r\n                        pattern=\"^\\d{5}(?:[-\\s]\\d{4})?$\">\r\n                    <div *ngIf=\"zip.invalid && (zip.dirty ||zip.touched)\"\r\n                        class=\"alert alert-danger\">\r\n                        <div *ngIf=\"zip.errors.required\">\r\n                            The zip code is required.\r\n                        </div>\r\n                        <div *ngIf=\"zip.errors.pattern\">\r\n                            The zip code must be 5 NUMBERS.\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <br/>\r\n            <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Email</label>\r\n                <div class=\"col-sm-9\">\r\n                    <input id=\"email\" class=\"form-control\"\r\n                        required email name=\"email\" type=\"email\"\r\n                        [(ngModel)]=\"model.email\" #email=\"ngModel\" >\r\n                    <div *ngIf=\"email.invalid && (email.dirty || email.touched)\"\r\n                        class=\"alert alert-danger\">\r\n                        <div *ngIf=\"email.errors.required\">\r\n                            Email is required.\r\n                        </div>\r\n                        <div *ngIf=\"email.errors.email\">\r\n                            A valid email address is required.\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <br/>\r\n            <div class=\"form-group\"><label class=\"col-sm-3 control-label\">Phone Number</label>\r\n                <div class=\"col-sm-9\">\r\n                    <input id=\"phone\" class=\"form-control\" \r\n                        required name=\"phone\" pattern=\"^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$\"\r\n                        [(ngModel)]=\"model.phone\" #phone=\"ngModel\" >\r\n                    <div *ngIf=\"phone.invalid && (phone.dirty || phone.touched)\"\r\n                        class=\"alert alert-danger\">\r\n                        <div *ngIf=\"phone.errors.required\">\r\n                            A phone number is required.\r\n                        </div>\r\n                        <div *ngIf=\"phone.errors.pattern\">\r\n                            You must enter a valid phone number(000-000-0000).\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <br/>\r\n            <div class=\"form-group\">\r\n                <div class=\"col-sm-4 col-sm-offset-2\"  *ngIf=\"!isUpt\">\r\n                    <button [disabled]=\"profForm.invalid\" (click)=\"onSubmit()\" class=\"btn btn-white\" >Submit</button>\r\n                    <button (click)=\"editProf()\" class=\"btn btn-white\" >Back</button>\r\n                </div>\r\n                <div class=\"col-sm-4 col-sm-offset-2\" *ngIf=\"isUpt\">\r\n                    <button [disabled]=\"profForm.invalid\" (click)=\"onEdit()\" class=\"btn btn-white\" >Update</button>\r\n                    <button (click)=\"onDelete()\" class=\"btn btn-white\" >Delete</button>\r\n                    <button (click)=\"editProf()\" class=\"btn btn-white\" >Back</button>\r\n                </div>\r\n            </div>\r\n        </form>\r\n    </div>\r\n</div>\r\n<div class=\"row\" *ngIf=\"coffee\">\r\n    <div class=\"col-lg-12\">\r\n        <div class=\"wrapper wrapper-content\">\r\n            <div class=\"middle-box text-center animated fadeIn\">\r\n                <h3 class=\"font-bold\">Great Job!</h3>\r\n                <div class=\"error-desc\">\r\n                    You bought a coffee!\r\n                </div>\r\n                <div class=\"btn-group\">\r\n                    <button class=\"btn btn-sm btn-white\" (click)=\"onCoffee()\">Vow to spend your money better</button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(40);
exports.encode = exports.stringify = __webpack_require__(41);


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    // feature test for Symbol support
    var supportsSymbol = typeof Symbol === "function";
    var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
    var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
    var HashMap;
    (function (HashMap) {
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        HashMap.create = supportsCreate
            ? function () { return MakeDictionary(Object.create(null)); }
            : supportsProto
                ? function () { return MakeDictionary({ __proto__: null }); }
                : function () { return MakeDictionary({}); };
        HashMap.has = downLevel
            ? function (map, key) { return hasOwn.call(map, key); }
            : function (map, key) { return key in map; };
        HashMap.get = downLevel
            ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
            : function (map, key) { return map[key]; };
    })(HashMap || (HashMap = {}));
    // Load global or shim versions of Map, Set, and WeakMap
    var functionPrototype = Object.getPrototypeOf(Function);
    var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
    var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
    var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
    var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
    // [[Metadata]] internal slot
    // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
    var Metadata = new _WeakMap();
    /**
      * Applies a set of decorators to a property of a target object.
      * @param decorators An array of decorators.
      * @param target The target object.
      * @param propertyKey (Optional) The property key to decorate.
      * @param attributes (Optional) The property descriptor for the target key.
      * @remarks Decorators are applied in reverse order.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Example = Reflect.decorate(decoratorsArray, Example);
      *
      *     // property (on constructor)
      *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Object.defineProperty(Example, "staticMethod",
      *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
      *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
      *
      *     // method (on prototype)
      *     Object.defineProperty(Example.prototype, "method",
      *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
      *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
      *
      */
    function decorate(decorators, target, propertyKey, attributes) {
        if (!IsUndefined(propertyKey)) {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsObject(target))
                throw new TypeError();
            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                throw new TypeError();
            if (IsNull(attributes))
                attributes = undefined;
            propertyKey = ToPropertyKey(propertyKey);
            return DecorateProperty(decorators, target, propertyKey, attributes);
        }
        else {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsConstructor(target))
                throw new TypeError();
            return DecorateConstructor(decorators, target);
        }
    }
    Reflect.decorate = decorate;
    // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
    // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
    /**
      * A default metadata decorator factory that can be used on a class, class member, or parameter.
      * @param metadataKey The key for the metadata entry.
      * @param metadataValue The value for the metadata entry.
      * @returns A decorator function.
      * @remarks
      * If `metadataKey` is already defined for the target and target key, the
      * metadataValue for that key will be overwritten.
      * @example
      *
      *     // constructor
      *     @Reflect.metadata(key, value)
      *     class Example {
      *     }
      *
      *     // property (on constructor, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticProperty;
      *     }
      *
      *     // property (on prototype, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         property;
      *     }
      *
      *     // method (on constructor)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticMethod() { }
      *     }
      *
      *     // method (on prototype)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         method() { }
      *     }
      *
      */
    function metadata(metadataKey, metadataValue) {
        function decorator(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                throw new TypeError();
            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        return decorator;
    }
    Reflect.metadata = metadata;
    /**
      * Define a unique metadata entry on the target.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param metadataValue A value that contains attached metadata.
      * @param target The target object on which to define metadata.
      * @param propertyKey (Optional) The property key for the target.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Reflect.defineMetadata("custom:annotation", options, Example);
      *
      *     // property (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
      *
      *     // method (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
      *
      *     // decorator factory as metadata-producing annotation.
      *     function MyAnnotation(options): Decorator {
      *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
      *     }
      *
      */
    function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }
    Reflect.defineMetadata = defineMetadata;
    /**
      * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasMetadata = hasMetadata;
    /**
      * Gets a value indicating whether the target object has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasOwnMetadata = hasOwnMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getMetadata = getMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getOwnMetadata = getOwnMetadata;
    /**
      * Gets the metadata keys defined on the target object or its prototype chain.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "method");
      *
      */
    function getMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryMetadataKeys(target, propertyKey);
    }
    Reflect.getMetadataKeys = getMetadataKeys;
    /**
      * Gets the unique metadata keys defined on the target object.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
      *
      */
    function getOwnMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryOwnMetadataKeys(target, propertyKey);
    }
    Reflect.getOwnMetadataKeys = getOwnMetadataKeys;
    /**
      * Deletes the metadata entry from the target object with the provided key.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata entry was found and deleted; otherwise, false.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.deleteMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function deleteMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        if (!metadataMap.delete(metadataKey))
            return false;
        if (metadataMap.size > 0)
            return true;
        var targetMetadata = Metadata.get(target);
        targetMetadata.delete(propertyKey);
        if (targetMetadata.size > 0)
            return true;
        Metadata.delete(target);
        return true;
    }
    Reflect.deleteMetadata = deleteMetadata;
    function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsConstructor(decorated))
                    throw new TypeError();
                target = decorated;
            }
        }
        return target;
    }
    function DecorateProperty(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsObject(decorated))
                    throw new TypeError();
                descriptor = decorated;
            }
        }
        return descriptor;
    }
    function GetOrCreateMetadataMap(O, P, Create) {
        var targetMetadata = Metadata.get(O);
        if (IsUndefined(targetMetadata)) {
            if (!Create)
                return undefined;
            targetMetadata = new _Map();
            Metadata.set(O, targetMetadata);
        }
        var metadataMap = targetMetadata.get(P);
        if (IsUndefined(metadataMap)) {
            if (!Create)
                return undefined;
            metadataMap = new _Map();
            targetMetadata.set(P, metadataMap);
        }
        return metadataMap;
    }
    // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
    function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return true;
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryHasMetadata(MetadataKey, parent, P);
        return false;
    }
    // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        return ToBoolean(metadataMap.has(MetadataKey));
    }
    // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
    function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryGetMetadata(MetadataKey, parent, P);
        return undefined;
    }
    // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return undefined;
        return metadataMap.get(MetadataKey);
    }
    // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
        metadataMap.set(MetadataKey, MetadataValue);
    }
    // 3.1.6.1 OrdinaryMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
    function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (parent === null)
            return ownKeys;
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0)
            return ownKeys;
        if (ownKeys.length <= 0)
            return parentKeys;
        var set = new _Set();
        var keys = [];
        for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
            var key = ownKeys_1[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
            var key = parentKeys_1[_a];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        return keys;
    }
    // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
    function OrdinaryOwnMetadataKeys(O, P) {
        var keys = [];
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return keys;
        var keysObj = metadataMap.keys();
        var iterator = GetIterator(keysObj);
        var k = 0;
        while (true) {
            var next = IteratorStep(iterator);
            if (!next) {
                keys.length = k;
                return keys;
            }
            var nextValue = IteratorValue(next);
            try {
                keys[k] = nextValue;
            }
            catch (e) {
                try {
                    IteratorClose(iterator);
                }
                finally {
                    throw e;
                }
            }
            k++;
        }
    }
    // 6 ECMAScript Data Typ0es and Values
    // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
    function Type(x) {
        if (x === null)
            return 1 /* Null */;
        switch (typeof x) {
            case "undefined": return 0 /* Undefined */;
            case "boolean": return 2 /* Boolean */;
            case "string": return 3 /* String */;
            case "symbol": return 4 /* Symbol */;
            case "number": return 5 /* Number */;
            case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
            default: return 6 /* Object */;
        }
    }
    // 6.1.1 The Undefined Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
    function IsUndefined(x) {
        return x === undefined;
    }
    // 6.1.2 The Null Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
    function IsNull(x) {
        return x === null;
    }
    // 6.1.5 The Symbol Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
    function IsSymbol(x) {
        return typeof x === "symbol";
    }
    // 6.1.7 The Object Type
    // https://tc39.github.io/ecma262/#sec-object-type
    function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
    }
    // 7.1 Type Conversion
    // https://tc39.github.io/ecma262/#sec-type-conversion
    // 7.1.1 ToPrimitive(input [, PreferredType])
    // https://tc39.github.io/ecma262/#sec-toprimitive
    function ToPrimitive(input, PreferredType) {
        switch (Type(input)) {
            case 0 /* Undefined */: return input;
            case 1 /* Null */: return input;
            case 2 /* Boolean */: return input;
            case 3 /* String */: return input;
            case 4 /* Symbol */: return input;
            case 5 /* Number */: return input;
        }
        var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
        var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
        if (exoticToPrim !== undefined) {
            var result = exoticToPrim.call(input, hint);
            if (IsObject(result))
                throw new TypeError();
            return result;
        }
        return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
    }
    // 7.1.1.1 OrdinaryToPrimitive(O, hint)
    // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
    function OrdinaryToPrimitive(O, hint) {
        if (hint === "string") {
            var toString_1 = O.toString;
            if (IsCallable(toString_1)) {
                var result = toString_1.call(O);
                if (!IsObject(result))
                    return result;
            }
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        else {
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
            var toString_2 = O.toString;
            if (IsCallable(toString_2)) {
                var result = toString_2.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        throw new TypeError();
    }
    // 7.1.2 ToBoolean(argument)
    // https://tc39.github.io/ecma262/2016/#sec-toboolean
    function ToBoolean(argument) {
        return !!argument;
    }
    // 7.1.12 ToString(argument)
    // https://tc39.github.io/ecma262/#sec-tostring
    function ToString(argument) {
        return "" + argument;
    }
    // 7.1.14 ToPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-topropertykey
    function ToPropertyKey(argument) {
        var key = ToPrimitive(argument, 3 /* String */);
        if (IsSymbol(key))
            return key;
        return ToString(key);
    }
    // 7.2 Testing and Comparison Operations
    // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
    // 7.2.2 IsArray(argument)
    // https://tc39.github.io/ecma262/#sec-isarray
    function IsArray(argument) {
        return Array.isArray
            ? Array.isArray(argument)
            : argument instanceof Object
                ? argument instanceof Array
                : Object.prototype.toString.call(argument) === "[object Array]";
    }
    // 7.2.3 IsCallable(argument)
    // https://tc39.github.io/ecma262/#sec-iscallable
    function IsCallable(argument) {
        // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
        return typeof argument === "function";
    }
    // 7.2.4 IsConstructor(argument)
    // https://tc39.github.io/ecma262/#sec-isconstructor
    function IsConstructor(argument) {
        // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
        return typeof argument === "function";
    }
    // 7.2.7 IsPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-ispropertykey
    function IsPropertyKey(argument) {
        switch (Type(argument)) {
            case 3 /* String */: return true;
            case 4 /* Symbol */: return true;
            default: return false;
        }
    }
    // 7.3 Operations on Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-objects
    // 7.3.9 GetMethod(V, P)
    // https://tc39.github.io/ecma262/#sec-getmethod
    function GetMethod(V, P) {
        var func = V[P];
        if (func === undefined || func === null)
            return undefined;
        if (!IsCallable(func))
            throw new TypeError();
        return func;
    }
    // 7.4 Operations on Iterator Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
    function GetIterator(obj) {
        var method = GetMethod(obj, iteratorSymbol);
        if (!IsCallable(method))
            throw new TypeError(); // from Call
        var iterator = method.call(obj);
        if (!IsObject(iterator))
            throw new TypeError();
        return iterator;
    }
    // 7.4.4 IteratorValue(iterResult)
    // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
    function IteratorValue(iterResult) {
        return iterResult.value;
    }
    // 7.4.5 IteratorStep(iterator)
    // https://tc39.github.io/ecma262/#sec-iteratorstep
    function IteratorStep(iterator) {
        var result = iterator.next();
        return result.done ? false : result;
    }
    // 7.4.6 IteratorClose(iterator, completion)
    // https://tc39.github.io/ecma262/#sec-iteratorclose
    function IteratorClose(iterator) {
        var f = iterator["return"];
        if (f)
            f.call(iterator);
    }
    // 9.1 Ordinary Object Internal Methods and Internal Slots
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
    // 9.1.1.1 OrdinaryGetPrototypeOf(O)
    // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
    function OrdinaryGetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype)
            return proto;
        // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
        // Try to determine the superclass constructor. Compatible implementations
        // must either set __proto__ on a subclass constructor to the superclass constructor,
        // or ensure each class has a valid `constructor` property on its prototype that
        // points back to the constructor.
        // If this is not the same as Function.[[Prototype]], then this is definately inherited.
        // This is the case when in ES6 or when using __proto__ in a compatible browser.
        if (proto !== functionPrototype)
            return proto;
        // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
        var prototype = O.prototype;
        var prototypeProto = prototype && Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype)
            return proto;
        // If the constructor was not a function, then we cannot determine the heritage.
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function")
            return proto;
        // If we have some kind of self-reference, then we cannot determine the heritage.
        if (constructor === O)
            return proto;
        // we have a pretty good guess at the heritage.
        return constructor;
    }
    // naive Map shim
    function CreateMapPolyfill() {
        var cacheSentinel = {};
        var arraySentinel = [];
        var MapIterator = (function () {
            function MapIterator(keys, values, selector) {
                this._index = 0;
                this._keys = keys;
                this._values = values;
                this._selector = selector;
            }
            MapIterator.prototype["@@iterator"] = function () { return this; };
            MapIterator.prototype[iteratorSymbol] = function () { return this; };
            MapIterator.prototype.next = function () {
                var index = this._index;
                if (index >= 0 && index < this._keys.length) {
                    var result = this._selector(this._keys[index], this._values[index]);
                    if (index + 1 >= this._keys.length) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    else {
                        this._index++;
                    }
                    return { value: result, done: false };
                }
                return { value: undefined, done: true };
            };
            MapIterator.prototype.throw = function (error) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                throw error;
            };
            MapIterator.prototype.return = function (value) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                return { value: value, done: true };
            };
            return MapIterator;
        }());
        return (function () {
            function Map() {
                this._keys = [];
                this._values = [];
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            }
            Object.defineProperty(Map.prototype, "size", {
                get: function () { return this._keys.length; },
                enumerable: true,
                configurable: true
            });
            Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
            Map.prototype.get = function (key) {
                var index = this._find(key, /*insert*/ false);
                return index >= 0 ? this._values[index] : undefined;
            };
            Map.prototype.set = function (key, value) {
                var index = this._find(key, /*insert*/ true);
                this._values[index] = value;
                return this;
            };
            Map.prototype.delete = function (key) {
                var index = this._find(key, /*insert*/ false);
                if (index >= 0) {
                    var size = this._keys.length;
                    for (var i = index + 1; i < size; i++) {
                        this._keys[i - 1] = this._keys[i];
                        this._values[i - 1] = this._values[i];
                    }
                    this._keys.length--;
                    this._values.length--;
                    if (key === this._cacheKey) {
                        this._cacheKey = cacheSentinel;
                        this._cacheIndex = -2;
                    }
                    return true;
                }
                return false;
            };
            Map.prototype.clear = function () {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            };
            Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
            Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
            Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
            Map.prototype["@@iterator"] = function () { return this.entries(); };
            Map.prototype[iteratorSymbol] = function () { return this.entries(); };
            Map.prototype._find = function (key, insert) {
                if (this._cacheKey !== key) {
                    this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                }
                if (this._cacheIndex < 0 && insert) {
                    this._cacheIndex = this._keys.length;
                    this._keys.push(key);
                    this._values.push(undefined);
                }
                return this._cacheIndex;
            };
            return Map;
        }());
        function getKey(key, _) {
            return key;
        }
        function getValue(_, value) {
            return value;
        }
        function getEntry(key, value) {
            return [key, value];
        }
    }
    // naive Set shim
    function CreateSetPolyfill() {
        return (function () {
            function Set() {
                this._map = new _Map();
            }
            Object.defineProperty(Set.prototype, "size", {
                get: function () { return this._map.size; },
                enumerable: true,
                configurable: true
            });
            Set.prototype.has = function (value) { return this._map.has(value); };
            Set.prototype.add = function (value) { return this._map.set(value, value), this; };
            Set.prototype.delete = function (value) { return this._map.delete(value); };
            Set.prototype.clear = function () { this._map.clear(); };
            Set.prototype.keys = function () { return this._map.keys(); };
            Set.prototype.values = function () { return this._map.values(); };
            Set.prototype.entries = function () { return this._map.entries(); };
            Set.prototype["@@iterator"] = function () { return this.keys(); };
            Set.prototype[iteratorSymbol] = function () { return this.keys(); };
            return Set;
        }());
    }
    // naive WeakMap shim
    function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var keys = HashMap.create();
        var rootKey = CreateUniqueKey();
        return (function () {
            function WeakMap() {
                this._key = CreateUniqueKey();
            }
            WeakMap.prototype.has = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.has(table, this._key) : false;
            };
            WeakMap.prototype.get = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.get(table, this._key) : undefined;
            };
            WeakMap.prototype.set = function (target, value) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                table[this._key] = value;
                return this;
            };
            WeakMap.prototype.delete = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? delete table[this._key] : false;
            };
            WeakMap.prototype.clear = function () {
                // NOTE: not a real clear, just makes the previous data unreachable
                this._key = CreateUniqueKey();
            };
            return WeakMap;
        }());
        function CreateUniqueKey() {
            var key;
            do
                key = "@@WeakMap@@" + CreateUUID();
            while (HashMap.has(keys, key));
            keys[key] = true;
            return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
            if (!hasOwn.call(target, rootKey)) {
                if (!create)
                    return undefined;
                Object.defineProperty(target, rootKey, { value: HashMap.create() });
            }
            return target[rootKey];
        }
        function FillRandomBytes(buffer, size) {
            for (var i = 0; i < size; ++i)
                buffer[i] = Math.random() * 0xff | 0;
            return buffer;
        }
        function GenRandomBytes(size) {
            if (typeof Uint8Array === "function") {
                if (typeof crypto !== "undefined")
                    return crypto.getRandomValues(new Uint8Array(size));
                if (typeof msCrypto !== "undefined")
                    return msCrypto.getRandomValues(new Uint8Array(size));
                return FillRandomBytes(new Uint8Array(size), size);
            }
            return FillRandomBytes(new Array(size), size);
        }
        function CreateUUID() {
            var data = GenRandomBytes(UUID_SIZE);
            // mark as random - RFC 4122 § 4.4
            data[6] = data[6] & 0x4f | 0x40;
            data[8] = data[8] & 0xbf | 0x80;
            var result = "";
            for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8)
                    result += "-";
                if (byte < 16)
                    result += "0";
                result += byte.toString(16).toLowerCase();
            }
            return result;
        }
    }
    // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
    function MakeDictionary(obj) {
        obj.__ = undefined;
        delete obj.__;
        return obj;
    }
    // patch global Reflect
    (function (__global) {
        if (typeof __global.Reflect !== "undefined") {
            if (__global.Reflect !== Reflect) {
                for (var p in Reflect) {
                    if (hasOwn.call(Reflect, p)) {
                        __global.Reflect[p] = Reflect[p];
                    }
                }
            }
        }
        else {
            __global.Reflect = Reflect;
        }
    })(typeof global !== "undefined" ? global :
        typeof self !== "undefined" ? self :
            Function("return this;")());
})(Reflect || (Reflect = {}));
//# sourceMappingURL=Reflect.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(55), __webpack_require__(61)))

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(17)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(29);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "8307c45ca34d4af71912b535b6c05c54.png";

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "ea2316224d45899c59bc285ba09dd920.png";

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};
for (var key in styles) {
  clientOverlay.style[key] = styles[key];
}

var ansiHTML = __webpack_require__(16);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);

var Entities = __webpack_require__(30).AllHtmlEntities;
var entities = new Entities();

exports.showProblems =
function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
};

exports.clear =
function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
};

var problemColors = {
  errors: colors.red,
  warnings: colors.yellow
};

function problemType (type) {
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { ignoreUnaccepted: true };

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(23);

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(38);

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(40);

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(42);

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(47);

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(6);

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(8);

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(9);

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(15);
__webpack_require__(14);
module.exports = __webpack_require__(13);


/***/ })
/******/ ]);
//# sourceMappingURL=main-client.js.map