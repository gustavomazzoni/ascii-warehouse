(function(angular) {
	'use strict';

	/**
	 * @desc directive to present a notification
	 * @example <widget-notification></widget-notification>
	*/
	angular
		.module('widget.notification', [])
		.directive('widgetNotification', widgetNotification);

	widgetNotification.$inject = [];
	function widgetNotification() {
		function link(scope, elem, attr) {
			scope.type = attr.type || 'success';
			scope.message = attr.message;
		}

		return {
			restrict: 'E',
			link: link,
			template: '<div class="alert alert-{{type}}"><strong>{{message}}</strong></div>'
		};
	}

})(angular);
