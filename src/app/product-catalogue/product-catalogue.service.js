(function(angular) {
	'use strict';

	/**
	* ascii-warehouse.product-catalogue - Product Catalogue Module Service
	*/
	angular
		.module('ascii-warehouse.product-catalogue')
		.factory('ProductCatalogue', ProductCatalogueFactory);

	ProductCatalogueFactory.$inject = ['$q', '$timeout'];
	function ProductCatalogueFactory($q, $timeout) {
		
		function ProductCatalogue(options) {
			this._products = []; // keep products results
			this._skip = 0; // keep skip position
			this._page = 0; // keep the page of pagination
			this._currentSkip = 0; // keep the position of the actual skip
			this._sortList = ['id', 'price', 'size'];
			this._settings = {};
			this._statuses = {
				FREE: 		'free',
				LOADING: 	'loading',
				BUFFERING: 	'buffering',
				END: 		'end'
			};
			this._status = this._statuses.FREE;
			this._callbackPool = [];
			this._url = '/api/products';

			this._init(options);
		}

		/**
		 *	Initialize object
		 */
		ProductCatalogue.prototype._init = function(options) {
			var defaultOptions = {
				limit: 20, // default limit
				sort: this._sortList[0] // default sort
			};
			this._settings = angular.extend({}, defaultOptions, options);

			this._products = [];
			this._skip = 0;
			this._page = 0;
			this._currentSkip = 0;
		};

		/**
		 *	Set the limit of results per loading
		 */
		ProductCatalogue.prototype.setLimit = function(limit) {
			this._settings.limit = limit;
		};

		/**
		 *	Get the limit
		 */
		ProductCatalogue.prototype.getLimit = function() {
			return this._settings.limit;
		};

		/**
		 *	Set the sort option. And reinitialize the object
		 */
		ProductCatalogue.prototype.setSort = function(sort) {
			this._init({ sort: sort });
		};

		/**
		 *	Get sort option
		 */
		ProductCatalogue.prototype.getSort = function() {
			return this._settings.sort;
		};

		/**
		 *	Get products already loaded
		 */
		ProductCatalogue.prototype.getProducts = function() {
			return this._products;
		};

		/**
		 *	Get products in current block (from skip to limit)
		 */
		ProductCatalogue.prototype._getProductsBlock = function() {
			return this._products.slice(this._skip, this._skip + this._settings.limit);
		};

		ProductCatalogue.prototype._inSortList = function(sort) {
	    	return this._sortList.indexOf(sort) > -1;
	    }

		ProductCatalogue.prototype._incrementSkip = function() {
	    	this._skip = this._page * this._settings.limit;
	    	this._page++;
	    };

		/**
		 *	Load Products from server
		 */
		ProductCatalogue.prototype._getFromServer = function(limit, skip, sort) {
	    	var deferred = $q.defer(),
	    		count = 0,
	    		oboeStream = null,
	    		url = this._url;
	        url += '?limit=' + limit;
	        url += '&skip='  + skip;
	        url += '&sort='  + sort;

	        var that = this;

	        oboeStream = oboe({
	        	url: url
	        })
	        // '{id}' Get the object with id. Fired when the whole response is available, in our case each newline-delimited JSON
	        .node('{id}', function(product) {
	        	that._products.push(product);
	        	// notify about new product until promise is resolved
	    		deferred.notify(product);
	    		count++;
	        })
	        .done(function(product) {
	        	// if it's not a valid product or reached the end or loaded all 411 products
	        	// didn't figure out how to know the streaming has ended.
	        	if (!product.id || that._status === that._statuses.END || that._products.length === 411) {
	        		// reached the end, no more products to load
	            	// indicates no more products to load
	                that._status = that._statuses.END;
	            	// resolve the promise
	                deferred.resolve(that._getProductsBlock());
	                this.abort(); // abort oboe to end the connection.
	                // remove deferred from list
	                that._callbackPool.pop();
	            } else if (count === that._limit || count === limit) {
	        		// loaded all products required by the client
	        		// indicates it is free for next load
	                that._status = that._statuses.FREE;
	            	// resolve the promise
	            	deferred.resolve(that._getProductsBlock());
	                // remove deferred from list
	                that._callbackPool.pop();
	            }
	            
	            // By returning oboe.drop, the parsed JSON object will be freed,
	            // allowing it to be garbage collected.
	            return oboe.drop;
	        })
	        .fail(function(error) {
	        	// indicates it is free for next load
	            that._status = that._statuses.FREE;
	            deferred.reject(error);
	            that._callbackPool.pop(); // remove deferred from list
	            return oboe.drop;
	        });

	        // add abort function to promise to abort oboe stream
	        deferred.promise.abort = deferred.promise.abort || function() {
	        	oboeStream.abort();
	        };

	        return deferred.promise;
	    }

	    /**
		 *	Load Products from buffer
		 */
	    ProductCatalogue.prototype._getFromBuffer = function() {
	    	var deferred = $q.defer();

			// put following function to be executed next so #notify function won't be called before promise is returned.
	    	$timeout(function() {
	    		// get requested batch of products
	    		var batch = this._getProductsBlock();

	    		// stream it back to client
	    		for (var i = 0, l = batch.length; i < l; i++) {
	    			deferred.notify(batch[i]);
	    		}
	    		deferred.resolve(batch);
	    	}.bind(this));

	    	return deferred.promise;
	    };

	    /**
		 *	Responsible for managing the requests for Products.
		 *	It performs 1 products loading per time to make sure the products order won't be damaged.
		 *	And on every request for products, the next batch is loaded in advance.
		 */
	    ProductCatalogue.prototype.getProducts = function(sort) {
	    	sort = this._inSortList(sort) ? sort : this._sortList[0];
	    	var limit = this._settings.limit,
	    		promise = null;

	    	// client changed sort option?
	    	if (this._page && sort === this._settings.sort) {

	    		switch(this._status) {
	    			case this._statuses.FREE:
	    				// No streaming occurring, free to load the next batch
		    			this._incrementSkip();
		    			break; // move on

	    			case this._statuses.BUFFERING:
	    				// There is a buffering (streaming from server) to be resolved
	    				// Return it to the client
	    				// And then load the next batch in advance
	    				promise = this._callbackPool.pop(); // get promise on pool
	    				if (promise) {
	    					this._incrementSkip();
	    					// wait for streaming to end
	    					promise.then(function() {

	    						// load next batch in advance if not reached the end
	    						if (this._status !== this._statuses.END) {
		    						this._status = this._statuses.BUFFERING;
			    					promise = this._getFromServer(limit, this._currentSkip, sort);

			    					// update how many products have been loaded
							    	this._currentSkip += limit;
							    	// save current promise to pool
							    	this._callbackPool.push(promise);
							    }

		    				}.bind(this));

	    					return promise;
	    				}

	    			default:
	    				// Status equal to LOADING or END
	    				// nothing to do.
	    				return $q.when(this.getProducts()); // Cancel this request
	    		}

			} else {
	    		// if different sort option, reinit object

	    		// Abort last/current request if any
	    		promise = this._callbackPool.pop();
	    		if (promise && typeof promise.abort === 'function') {
					promise.abort(); // Abort oboe stream
				}

	    		this.setSort(sort); // it will change sort option and reinitialize object
	    		limit = this._settings.limit * 2; // '* 2' to also get the next batch in advance
	    		this._page++;

	    	}
			
			this._status = this._statuses.LOADING;

			// load next batch of products from server
			promise = this._getFromServer(limit, this._currentSkip, sort);

	    	// update how many products have been loaded
	    	this._currentSkip += limit;
	    	// save current promise to pool
	    	this._callbackPool.push(promise);

	        // check if requested batch is in buffer
			if (this._skip + this._settings.limit <= this._products.length) {
				this._status = this._statuses.BUFFERING;

				// return products from buffer
				return this._getFromBuffer();
		    }

	        return promise;
		};

		ProductCatalogue.prototype.getSortOptions = function() {
			return this._sortList;
		};

		ProductCatalogue.prototype.getStatus = function() {
			return this._status;
		};

		return ProductCatalogue;
	}

})(angular);
