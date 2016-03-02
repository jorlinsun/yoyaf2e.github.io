var Groot = angular.module("Groot", ["ngRoute"]);
var GrootMore = "--GrootMore--";


Groot.controller("indexCtrl", function ($scope, $http, $timeout, $sce, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $http.get("articles.json")
        .success(function (data) {
            $scope.articles = data;
            var j = 0;
            (function addContent() {
                if (j < data.length) {
                    $http.get("articles/" + data[j].path)
                        .success(function (data) {

                            if (data.indexOf(GrootMore) > 0) {
                                data = data.split(GrootMore)[0];
                                $scope.articles[j].readMore = true;
                            }
                            $scope.articles[j].content = $sce.trustAsHtml(marked(data));
                            j++;
                            $timeout(addContent, 1000);
                        })
                } else {
                    console.log("文章加载完毕")
                }
            })();

        })

});

Groot.controller("articleCtrl", function ($scope, $routeParams, $sce, $http) {
    $scope.params = $routeParams;
    $scope.post = "";
    for (var i = 0; i < $scope.articles.length; i++) {
        if ($scope.articles[i].url + ".html" == $scope.params.url) {
            $scope.articles[i].readMore=false;
            $scope.post = $scope.articles[i];
            $http.get("articles/" + $scope.post.path)
                .success(function (data) {
                    data = data.replace(/--GrootMore--/g, "");
                    $scope.post.content = $sce.trustAsHtml(marked(data));


                })
        } else {
            $scope.post.content = $sce.trustAsHtml("目前还没有此文章，请检查链接");
        }
    }
});


Groot.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'view/home.html'
        })
        .when('/:url', {
            templateUrl: 'view/article.html',
            controller: 'articleCtrl',
            resolve: {
                delay: function ($q, $timeout) {
                    var delay = $q.defer();
                    $timeout(delay.resolve, 1000);
                    return delay.promise;
                }
            }
        })
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(false).hashPrefix('');
});
