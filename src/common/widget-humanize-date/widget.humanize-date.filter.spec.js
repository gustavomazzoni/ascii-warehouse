describe('humanizeDate', function() {

	beforeEach(module('widget.humanize-date'));

	it('should return a human full date when older than 1 week', inject(function(humanizeDateFilter) {
		var date = 'Thu Sep 15 2016 10:16:48 GMT-0300 (BRT)',
			expected = 'Thursday, September 15, 2016';

		expect(humanizeDateFilter(date)).toEqual(expected);
	}));

	it('should return a human relative time until 1 week', inject(function(humanizeDateFilter) {
		var date = new Date(),
			expected = '7 days ago';

		date.setDate(date.getDate() - 7);
		expect(humanizeDateFilter(date)).toEqual(expected);
	}));
});
