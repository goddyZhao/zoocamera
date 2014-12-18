app.directive('zooNotification', function () {
  return {
    restrict: 'EA',
    scope: {
      content: '=notiContent',
      type: '=notiType'
    },
    templateUrl: '/templates/notification.html'
  };
});