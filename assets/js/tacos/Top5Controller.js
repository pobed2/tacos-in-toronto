angular.module('ActivityOverlordDashboard').controller('Top5Controller', ['$scope','$http', function($scope, $http) {
  var top = this;
  /////////////////////////////////////////////////////////////////////////////////
  // When HTML is rendered...
  /////////////////////////////////////////////////////////////////////////////////

  top.keywords =[];
  loadTopFive();

  /////////////////////////////////////////////////////////////////////////////////
  // DOM events:
  /////////////////////////////////////////////////////////////////////////////////
  io.socket.on('keyword', function (event){
    if (event.verb === 'updated') {
      var foundKeyword = _.find(top.keywords, {id: event.id});
      if (foundKeyword && (event.data.times === 'undefined' || event.dataevent.data.times >= foundKeyword.times)) {
        _.extend(foundKeyword, event.data);
        $scope.$apply();
      }else{
        top.loadTopFive();
      }

      return;
    }

    if (event.verb === 'created') {
      //A new keyword necessitates a full refresh of the Top5
      top.loadTopFive()
      return;
    }

    if (event.verb === 'destroyed') {
      //A full refresh from DB is only necessary when keyword is in top 5
      var foundKeyword = _.find(top.keywords, {id: event.id});
      if (foundKeyword) {
        loadTopFive();
      }
      return;
    }

    throw new Error('Unexpected/unknown socket event: "'+event.verb+'" received from Sails.');
  });


  /////////////////////////////////////////////////////////////////////////////////
  // Private methods:
  /////////////////////////////////////////////////////////////////////////////////
   function loadTopFive(){
    io.socket.get("/keyword/topfive", function onResponse(data, jwr){
    if (jwr.error) {
      console.log(jwr.error);
      return;
    }
    top.keywords = data;
    $scope.$apply();
  })};
  top.loadTopFive = loadTopFive;

}]);
