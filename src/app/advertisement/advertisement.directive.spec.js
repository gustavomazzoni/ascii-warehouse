describe('AdvertisementCtrl', function() {
	var AdvertisementController;

	beforeEach(module('ascii-warehouse.advertisement.widget'));

	beforeEach(inject(function($controller) {
		AdvertisementController = $controller('AdvertisementCtrl');
	}));

	describe('getAd', function() {
		it('should return random number, but never the same twice in a row.', inject(function() {
			var last = AdvertisementController.getAd();
			for (var i = 0; i < 30; i++) {
				var random = AdvertisementController.getAd();
				expect(random).not.toEqual(last);
				last = random;
			}
		}));

		it('should return random number from 1 to 16.', inject(function() {
			for (var i = 0; i < 30; i++) {
				var number = AdvertisementController.getAd();
				expect(number).toBeGreaterThan(0);
				expect(number).toBeLessThan(17);
			}
		}));
	});
});
