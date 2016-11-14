(function(angular) {
	'use strict';

	/**
	 * @desc directive to insert an advertisement from one of our sponsors
	 * @example <div daw-advertisement></div>
	*/
	angular
		.module('ascii-warehouse.advertisement.widget', [])
		.controller('AdvertisementCtrl', AdvertisementController)
		.directive('dawAdvertisement', dawAdvertisement);

	dawAdvertisement.$inject = [];
	function dawAdvertisement() {
		function link(scope, element, attrs, controller) {
			element.append('<img src="/ad/?r=' + controller.getAd() + '"/>');

			scope.$on('$destroy', function() {
				controller.removeAd();
			});
		}

		return {
			restrict: 'A',
			link: link,
			controller: 'AdvertisementCtrl',
			controllerAs: 'vm'
		};
	}

	AdvertisementController.$inject = ['$rootScope'];
	function AdvertisementController($rootScope) {
		var vm = this;
		/**
		 * Returns a random integer between min (inclusive) and max (inclusive)
		 */
		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		/**
		 * Returns a random integer between 1 (inclusive) and 16 (inclusive)
		 */
		vm.getAd = function() {
			var random = getRandomInt(1, 16); // placekitten.com has 16 cat images from 1 to 16 only
			if (random === $rootScope.currentAd) {
				random = (random < 16) ? random + 1 : random - 1;
			}
			return $rootScope.currentAd = random;
		};

		vm.removeAd = function() {
			delete $rootScope.currentAd;
		};
	}

})(angular);
