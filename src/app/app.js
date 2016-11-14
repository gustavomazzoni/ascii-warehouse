(function(angular) {
	'use strict';

	/**
	 * ascii-warehouse - App base Module
	*/
	angular
		.module('ascii-warehouse', [
			'ascii-warehouse.product-catalogue.widget', 
			'ascii-warehouse.advertisement.widget'
		]);

})(angular);
