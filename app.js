var app = angular.module('plunker', []);

function Choice(name, children) {
  this.name = name;
  this.checked = false;
  this.children = children || [];
}

var apparel = new Choice('Apparel', [
  new Choice('Mens Shirts', [
    new Choice('Mens Special Shirts')
  ]),
  new Choice('Womens Shirts'),
  new Choice('Pants')
]);
var boats = new Choice('Boats');

app.controller('MainCtrl', function($scope) {
  $scope.name = 'World';
  $scope.myTree = [apparel, boats];
});

app.directive('choiceTree', function() {
      return {
        template: '<ul><choice ng-repeat="choice in tree"></choice></ul>',
        replace: true,
        transclude: true,
        restrict: 'E',
        scope: {
          tree: '=ngModel',
          withchildren: '=withchildren'
        }
      };
});

app.directive('choice', function($compile) {
  return { 
    restrict: 'E',
    //In the template, we do the thing with the span so you can click the 
    //text or the checkbox itself to toggle the check
    template: '<li>' +
      '<span ng-click="choiceClicked(choice)">' +
        '<input type="checkbox" ng-checked="choice.checked"> {{choice.name}}' +
      '</span>' +
    '</li>',
    link: function(scope, elm, attrs) {
      scope.choiceClicked = function(choice) {
        choice.checked = !choice.checked;
        function checkChildren(c) {
          angular.forEach(c.children, function(c) {
            c.checked = choice.checked;
            checkChildren(c);
          });
        }
        
        if(scope.withchildren) checkChildren(choice);
        attrs.$observe('tooltip', function(value) {
          if (value) {
            element.addClass('tooltip-title');
          }
        });
      };
      
      //Add children by $compiling and doing a new choice directive
      if (scope.choice.children.length > 0) {
        var childChoice = $compile('<choice-tree ng-model="choice.children" withchildren="withchildren"></choice-tree>')(scope);
        elm.append(childChoice);
      }
    }
  };
});