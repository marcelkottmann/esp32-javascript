/*
Original source from:
https://github.com/msuperina/es3-promise

*/

module.exports=(function() {

	var PENDING = 'pending';
	var FULFILLED = 'fulfilled';
	var REJECTED = 'rejected';

	function emptyFn() {}
	function isFn(fn) { return fn && typeof fn === 'function'; }

	function isPending(promise) { return promise.state === PENDING; }
	function isFulfilled(promise) { return promise.state === FULFILLED; }
	function isRejected(promise) { return promise.state === REJECTED; }

	// Promise Resolution Procedure [[Resolve]](promise2, x)
	function prp(enhancedPromise, x) {

		// 2.3.1: If `promise` and `x` refer to the same 
		// object, reject `promise` with a `TypeError' as 
		// the reason.
		if (enhancedPromise.promise === x) {
			rejectFn(enhancedPromise)(new TypeError(
				'The result of a then execution cannot be the promise itself.'
			));
			return;
		}

		// 2.3.3: Otherwise, if `x` is an object or function,
		if (x && (typeof x === 'object' || typeof x === 'function')) {

			// 2.3.3.3.3: If both `resolvePromise` and `rejectPromise` are 
			// called, or multiple calls to the same argument are made, the 
			// first call takes precedence, and any further calls are ignored.
			var called = false;

			try {

				// 2.3.3.1: Let `then` be `x.then`
				var then = x.then;

				// 2.3.3.3: If `then` is a function, call it 
				// with `x` as `this`, 
				// first argument `resolvePromise`, 
				// and second argument `rejectPromise`
				if (typeof then === 'function') {
					then.apply(x, [
						function(value) {
							if (!called) {
								called = true;
								prp(enhancedPromise, value);	
							}
						}, 
						function(reason) {
							if (!called) {
								called = true;
								rejectFn(enhancedPromise)(reason);
							}
						}
					]);

				} else {
					// 2.3.3.4: If `then` is not a function, fulfill promise 
					// with `x`
					resolveFn(enhancedPromise)(x); 
				}

			} catch(err) {
				// 2.3.3.2: If retrieving the property `x.then` 
				// results in a thrown exception `e`, reject 
				// `promise` with `e` as the reason.
				if (!called) {
					called = true;
					rejectFn(enhancedPromise)(err);
				}
			}
			
		} else {
			// 2.3.4: If `x` is not an object or function, fulfill `promise` 
			// with `x`
			resolveFn(enhancedPromise)(x); 
		}
	
	}

	function cleanThen(enhancedPromise, enhancedState) {

		var promise = enhancedPromise.promise;

		// if the promise is not pending
		// then it's either resolved or rejected
		if (enhancedState.isStateFn(promise)) {

			// get the then stack based on the promise state
			var stack = enhancedPromise['on' + enhancedState.state];

			// while there are elements in the stack
			while (stack.length) {

				// 2.2.2: If `onFulfilled` is a function
				// 2.2.2.3: it must not be called more than once.
				// remove the first element of the stack
				// then calls are handled on registering order
				var element = stack.shift();

				// the nextEnhancedPromise returned by the specific then
				var nextEnhancedPromise = element.nextEnhancedPromise;
				// the then callback (onFulfillment or onRejection)
				var callback = element.callback;
				// the data of the promise (value or reason)
				var data = promise[ enhancedState.dataName ];

				// 2.2.4: `onFulfilled` or `onRejected` must not be 
				// called until the execution context stack contains 
				// only platform code.

				// execute the resolve / reject on a new execution context
				// to ensure that the execution is performed with the correct
				// data, use an immediately invoked function call and pass
				// to it the data that will be used in a future execution
				// context
				(function(callback, data, nextEnhancedPromise) {

					setTimeout(function() {

					// 2.2.1: Both `onFulfilled` and `onRejected` are optional 
					// arguments.
					// 2.2.1.1: If `onFulfilled` is not a function, it must be 
					// ignored.
					// 2.2.1.2: If `onRejected` is not a function, it must be 
					// ignored.
					if (isFn(callback)) {

						// 2.2.4: `onFulfilled` or `onRejected` must not be 
						// called until the execution context stack contains 
						// only platform code.
						//setTimeout(function() {

						// 2.2.2: If `onFulfilled` is a function
						// 2.2.2.1: it must be called after `promise` is 
						// fulfilled, with `promise`’s fulfillment value 
						// as its first argument.
        				// 2.2.2.2: it must not be called before `promise` 
        				// is fulfilled
						// 2.2.3: If `onRejected` is a function,
						// 2.2.3.1: it must be called after `promise` is 
						// rejected, with `promise`’s rejection reason as 
						// its first argument.
        				// 2.2.3.2: it must not be called before `promise` 
        				// is rejected
        				// 2.2.3.3: it must not be called more than once.

						// 2.2.5 `onFulfilled` and `onRejected` must be 
						// called as functions (i.e. with no `this` value).
						// -> thus the apply with undefined as context

						// 2.2.6.1 : multiple fulfillment handlers, one of which throws
						// need a try catch block

						try {

							var x;

							x = callback.apply(undefined, [ data ]);

							// run the Promise Resolution Procedure 
							// [[Resolve]](promise2, x)
							prp(nextEnhancedPromise, x);

						} catch(err) {

							rejectFn(nextEnhancedPromise)(err);
						}

					} else {
						// resolve / reject the nextEnhancedPromise
						// with the value / reason of the invoking promise
						enhancedState.execFn(nextEnhancedPromise)(data);
					}

					}, 0);

				})(callback, data, nextEnhancedPromise)

			}
			// clear the other stack
			enhancedPromise['on' + enhancedState.otherState] = [];

		}

	}

	// 2.2.6: `then` may be called multiple times on the same promise.
	function registerThen(enhancedPromise, nextEnhancedPromise, onFulfillment, onRejection) {

		var promise = enhancedPromise.promise;

		// 2.2.6.1: If/when `promise` is fulfilled, all respective `onFulfilled` 
		// callbacks must execute in the order of their originating calls to `then`

		// register the onFulfillment callback in its stack, with the 
		// nextEnhancedPromise by the then function
		enhancedPromise.onfulfilled.push({
			nextEnhancedPromise: nextEnhancedPromise,
			callback: onFulfillment
		});

		// 2.2.6.2: If/when `promise` is rejected, all respective `onRejected` 
		// callbacks must execute in the order of their originating calls to `then`

		// register the onRejection callback in its stack, with the 
		// nextEnhancedPromise by the then function
		enhancedPromise.onrejected.push({
			nextEnhancedPromise: nextEnhancedPromise,
			callback: onRejection
		});

		// if the promise is already fulfilled
		if (isFulfilled(promise)) {
			// execute all the onFulfilled callbacks register within the
			// various then calls
			cleanThen(enhancedPromise, enhancedState[FULFILLED]);

		} else if (isRejected(promise)) {
			// execute all the onRejected callbacks register within the
			// various then calls	
			cleanThen(enhancedPromise, enhancedState[REJECTED]);

		}

	}

	function resolveFn(enhancedPromise) {
		var promise = enhancedPromise.promise;
		return function (value) {
			// 2.1.2.1: When fulfilled, a promise: must not transition to any 
			// other state.
			if (isPending(promise)) {
				promise.state = FULFILLED;
				promise.value = value;
				cleanThen(enhancedPromise, enhancedState[FULFILLED]);
			}
		};
	}

	function rejectFn(enhancedPromise) {
		var promise = enhancedPromise.promise;
		return function (reason) {
			// 2.1.3.1: When rejected, a promise: must not transition to any 
			// other state.
			if (isPending(promise)) {
				promise.state = REJECTED;
				promise.reason = reason;
				cleanThen(enhancedPromise, enhancedState[REJECTED]);
			}
		};
	}

	var enhancedState = {};
	enhancedState[FULFILLED] = {
		state: FULFILLED,
		otherState: REJECTED,
		isStateFn: isFulfilled,
		execFn: resolveFn,
		otherExecFn: rejectFn,
		dataName: 'value'
	};
	enhancedState[REJECTED] = {
		state: REJECTED,
		otherState: FULFILLED,
		isStateFn: isRejected,
		execFn: rejectFn,
		otherExecFn: resolveFn,
		dataName: 'reason'
	}

	function enhancePromise(promise, resolve, reject) {

		return {
			// promise itself whose state can change
			promise: promise,
			// resolve function
			resolve: resolve,
			// reject function
			reject: reject,
			// then stack { onFulfillment, nextEnhancedPromise returned by then }
			onfulfilled : [],
			// then stack { onRejection, nextEnhancedPromise returned by then }
			onrejected: []
		};

	}

	var registry = (function() {
		
		var records = [];

		function add(promise, enhancedPromise) {
			records.push({
				promise: promise,
				enhancedPromise: enhancedPromise
			});
		}

		function getEnhanced(promise) {
			for(var i = 0; i < records.length; i++) {
				var record = records[i];
				if(record.promise === promise) {
					return record.enhancedPromise;
				}
			}
		}

		return {
			add: add,
			getEnhanced: getEnhanced
		} 

	})();

	function Promise(executor) {

		if (!(this instanceof Promise)) 
			throw new TypeError('Not enough arguments to Promise.');

		if (!executor || typeof executor !== 'function')
			throw new TypeError('Argument 1 of Promise.constructor is not an object.');

		this.state = PENDING;

		var resolve = undefined;
		var reject = undefined;

		var enhancedPromise = enhancePromise(this, resolve, reject);

		registry.add(this, enhancedPromise);

		resolve = resolveFn(enhancedPromise);
		reject = rejectFn(enhancedPromise);

		executor.apply(undefined, [ resolve, reject ]);		

	}

	function then(enhancedPromise, onFulfillment, onRejection) {

		var nextPromise = new Promise(emptyFn);

		// 2.2.1: Both `onFulfilled` and `onRejected` are optional arguments.
		// 2.2.1.1: If `onFulfilled` is not a function, it must be ignored.
		// 2.2.1.2: If `onRejected` is not a function, it must be ignored.
		registerThen(enhancedPromise, registry.getEnhanced(nextPromise), onFulfillment, onRejection);

		// 2.2.7: `then` must return a promise: 
		// `promise2 = promise1.then(onFulfilled, onRejected)`
		return nextPromise;

	}

	function resolve(value) {
		var promise = new Promise(emptyFn);
		promise.state = FULFILLED;
		promise.value = value;
		return promise;
	}

	function reject(reason) {
		var promise = new Promise(emptyFn);
		promise.state = REJECTED;
		promise.reason = reason;
		return promise;
	}

	Promise.resolve = resolve;
	Promise.reject = reject;

	Promise.prototype.then = function(onFulfillment, onRejection) {
		return then(registry.getEnhanced(this), onFulfillment, onRejection);
	}

	Promise.prototype.catch = function(onRejection) {
		return then(registry.getEnhanced(this), function(p){return p}, onRejection);
	}

	return { 
		Promise: Promise
	};

})();