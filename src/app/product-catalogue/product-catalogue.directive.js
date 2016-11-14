(function(angular) {
	'use strict';

	/**
	 * @desc directive to present Products Catalogue
	 * @example <daw-product-catalogue></daw-product-catalogue>
	*/
	angular
		.module('ascii-warehouse.product-catalogue.widget', [
			'ascii-warehouse.product-catalogue',
			'infinite-scroll',
			'ascii-warehouse.advertisement.widget',
			'widget.humanize-date',
			'widget.notification'])
		.value('THROTTLE_MILLISECONDS', 250) // process scroll events a maximum of once every 250 milliseconds
		.directive('dawProductCatalogue', dawProductCatalogue);

	dawProductCatalogue.$inject = [];
	function dawProductCatalogue() {
		function link(scope, element, attrs, controller) {
			controller.loadProducts();
		}

		return {
			restrict: 'E',
			link: link,
			templateUrl: 'app/product-catalogue/product-catalogue.tpl.html',
			scope: {},
			controller: 'ProductCatalogueCtrl',
			controllerAs: 'vm'
		};
	}

})(angular);
