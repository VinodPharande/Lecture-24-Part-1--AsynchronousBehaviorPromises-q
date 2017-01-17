(function(){
  'use strict';

  angular.module('ShoppingListPromiseApp', [])
  .controller('ShoppingListController', ShoppingListController)
  .service('ShoppingListService', ShoppingListService)
  .service('WeightLossFilterService', WeightLossFilterService);

  ShoppingListController.$inject = ['ShoppingListService'];
  function ShoppingListController(ShoppingListService) {
    var list = this;

    // consuming call to service to get item
    list.items = ShoppingListService.getItems();

    list.itemName ="";
    list.itemQuantity ="";

    // consuming call to service to add item method
    list.addItem = function () {
      ShoppingListService.addItem(list.itemName, list.itemQuantity);
      list.itemName = "";
      list.itemQuantity = "";
    }

    // consuming call to service to remove item method
    list.removeItem = function (itemIndex) {
      ShoppingListService.removeItem(itemIndex);
    }
  }

  ShoppingListService.$inject = ['$q','WeightLossFilterService'];
  // Service implementation
  function ShoppingListService($q, WeightLossFilterService) {
      var service = this;

      // List of shopping items
      var items = [];

      // Servie method for adding item
      // 1st version of addItem using nextPromise and then method
      // service.addItem = function (name, quantity) {
      //   var promise = WeightLossFilterService.checkName(name);
      //   promise.then(function (response) {
      //     var nextPromise = WeightLossFilterService.checkQuantity(quantity);
      //
      //     nextPromise.then(function (result) {
      //       var item={
      //         name: name,
      //         quantity: quantity
      //       };
      //       items.push(item);
      //     }, function (errorResponse) {
      //       console.log(errorResponse.message);
      //     });
      //   }, function (errorResponse) {
      //     console.log(errorResponse.message);
      //   });
      // };

      // 2nd version of addItem using promise and then method
      // service.addItem = function (name, quantity) {
      //   var promise = WeightLossFilterService.checkName(name);
      //
      //   promise.
      //   then(function (response) {
      //     return WeightLossFilterService.checkQuantity(quantity);
      //   })
      //   .then(function (response) {
      //     var item = {
      //       name: name,
      //       quantity: quantity
      //     };
      //     items.push(item);
      //   })
      //   .catch(function (errorResponse) {
      //     console.log(errorResponse.message);
      //   });
      // };

      // 3rd version of addItem using promise and all and then method
      // more efficient way to handle asynchronous code/task
      service.addItem = function (name, quantity) {
        var namePromise = WeightLossFilterService.checkName(name);
        var quantityPromise = WeightLossFilterService.checkQuantity(quantity);

        $q.all([namePromise, quantityPromise]).
        then(function (response) {
          var item = {
            name: name,
            quantity: quantity
          };
          items.push(item);
        })
        .catch(function (errorResponse) {
          console.log(errorResponse.message);
        });
      };

      // Servie method to remove items from list
      service.removeItem = function (itemIndex) {
        items.splice(itemIndex);
      }

      // Servie method to get items
      service.getItems = function () {
        console.log('inside get: ' + JSON.stringify(items));
        return items;
      };
  }

  WeightLossFilterService.$inject = ['$q', '$timeout']
  function WeightLossFilterService($q, $timeout) {
    var service = this;

    service.checkName = function (name) {
      var deferred = $q.defer();
      var result = {
          message: ""
      };

      $timeout(function () {
        //Checck for cookies
        if (name.toLowerCase().indexOf('cookie') === -1) {
          deferred.resolve(result);
        }
        else{
          result.message = "Stay away from cookies, Yaakov!";
          deferred.reject(result);
        }
      }, 3000);

      return deferred.promise;
    };

    service.checkQuantity = function (quantity) {
    var deferred = $q.defer();
    var result = {
        message: ""
    };
    $timeout(function () {
      //Checck for cookies
      if (quantity < 6) {
        deferred.resolve(result);
      }
      else{
        result.message = "That's too much, Yaakov!";
        deferred.reject(result);
      }
    }, 1000);

    return deferred.promise;
  };
}

})();
