(function(angular) {
	'use strict';

	/**
	* ascii-warehouse.product-catalogue - Product Catalogue Module
	*/
	angular
		.module('ascii-warehouse.product-catalogue', [])
		.controller('ProductCatalogueCtrl', ProductCatalogueController);

	ProductCatalogueController.$inject = ['ProductCatalogue'];
	function ProductCatalogueController(ProductCatalogue) {
		var vm = this,
			adPosition = 20,
			productCatalogue = new ProductCatalogue({ limit: 20 });
		vm.products = [];
		vm.sortList = productCatalogue.getSortOptions();
		vm.sort = 'id';

		vm.onSortChange = function() {
			vm.products = [];
			vm.loadProducts();
		};

		vm.loadProducts = function() {
			vm.status = 'loading';
			productCatalogue.getProducts(vm.sort).then(function(result) {
				vm.status = productCatalogue.getStatus();
			}, function(error) {
				vm.status = productCatalogue.getStatus();
				console.log('Error', error);
			}, function(product) {
				vm.products.push(product);
			});
		};

		vm.setAdPosition = function(position) {
			adPosition = position;
		};

		vm.isAdPosition = function(index) {
			return index && index % adPosition === 0;
		};
	}

})(angular);
