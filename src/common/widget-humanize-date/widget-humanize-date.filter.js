(function(angular) {
	'use strict';

	/**
	 * @desc filter to return the date in relative time (eg. "3 days ago") unless they are older than 1 week,
	 * in which case the full date is returned.
	 * @example {{date | humanize-date}}
	*/
	angular
		.module('widget.humanize-date', [])
		.filter('humanizeDate', humanizeDateFilter);

	humanizeDateFilter.$inject = ['$filter'];
	function humanizeDateFilter($filter) {

		/**
		  * Return the date in relative time (eg. "3 days ago") unless they are older than 1 week, 
		  * in which case the full date is returned.
		  */
		function humanizeDate(date) {
			if (!date) {
				return;
			}

			var dayCalc = 24 * 60 * 60 * 1000,
				dateObj = new Date(date),
				timeAgo = Date.now() - dateObj,
				daysAgo = Math.floor(timeAgo / dayCalc);

			// if older than 1 week
			if (daysAgo > 7) {
				// display full date
				return $filter('date')(dateObj, 'fullDate');
			} else {
				// otherwise, display in relative time (eg. "3 days ago")
				if (daysAgo === 0) {
					return 'today';
				} else if (daysAgo === 1) {
					return '1 day ago';
				}
				return daysAgo + ' days ago';
			}

		}

		return humanizeDate;
	}

})(angular);
