angular.module("app", ["templates"])
  .directive("app", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/app.tpl.html",
      controller: ["$scope", appCtl]
    };
    function appCtl($scope) {
      $scope.model = {
        elementDetails: {}
      }
    }
  })
  .directive("contentView", () => {
    return {
      scope: {
        elementDetails: '='
      },
      restrict: "E",
      templateUrl: "./js/app/content-view.tpl.html",
      controller: ["$scope", contentViewCtrl],
    };
    function contentViewCtrl($scope) {
      $scope.orderAttrs = [
        {
          order: 'Title'
        },
        {
          order: 'Date'
        }
      ];
      $scope.model = {
        displayOptions: {
          order: $scope.orderAttrs[0],
          onlyDate: false,
          searchValue: ''
        },
        filteringData: makeDefaulData(),
        newTitle: '',
        elementDetails: undefined
      };
      $scope.model.originalData = [...$scope.model.filteringData];

      $scope.sortingElements = (sortParam) => {
        if (sortParam && sortParam.order) {
          let data = $scope.model.filteringData;
          switch (sortParam.order) {
            case 'Date':
              data = data.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
              break;
            case 'Title':
              data = data.sort((a, b) => a.title.localeCompare(b.title));
              break;
            default:
              break;
          }
        }
      };

      $scope.showDate = (dateStr) => {
        if (dateStr) {
          let date = new Date(dateStr);
          let time = date.toLocaleTimeString().slice(0, -3);
          date = date.toLocaleDateString();
          return $scope.model.displayOptions.onlyDate ? date : `${date} ${time}`
        }
        return '';
      };

      $scope.addNewTitle = (title) => {
        if (title) {
          let newElement = {
            id: makeDataId(),
            title,
            tags: [],
            date: new Date().toISOString()
          }
          $scope.model.originalData.push(newElement);
          if ($scope.searchTitle) {
            $scope.searchElement($scope.searchTitle);
          } else {
            $scope.model.filteringData = [...$scope.model.originalData];
          }
          $scope.sortingElements($scope.model.displayOptions.order);
          $scope.model.newTitle = ''
        }
      };

      $scope.showElementDetails = (element) => {
        if (element && Object.keys(element).length) {
          $scope.elementDetails = element
        }
      };

      $scope.searchElement = (title) => {
        $scope.searchTitle = title;
        $scope.model.filteringData = $scope.model.originalData.filter(el => ~el.title.indexOf(title));
      };

      $scope.sortingElements($scope.orderAttrs[0]);
    }
  })
  .directive("sidebarView", () => {
    return {
      scope: {
        elementDetails: '='
      },
      restrict: "E",
      templateUrl: "./js/app/sidebar-view.tpl.html",
      controller: ["$scope", sidebarViewCtrl]
    };
    function sidebarViewCtrl($scope) {
      $scope.tags = '';
      $scope.showWarning = false;

      $scope.addNewTags = (tag) => {
        let tags = $scope.elementDetails.tags;
        if (tag) {
          if (!tags.includes(tag)) {
            tags.push(tag);
            $scope.tags = '';
            $scope.showWarning = false;
          } else {
            $scope.showWarning = true;
          }
        }
      }

      $scope.removeTag = (tag) => {
        if (tag) {
          let tags = $scope.elementDetails.tags;
          tags.splice(tags.findIndex(el => el === tag), 1);
        }
      }
    }
  })
  .directive("elementsView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/elements-view.tpl.html",
      controller: ["$scope", "$element", elementsViewCtrl],
    };
    function elementsViewCtrl($scope, $element) {
      $scope.model = {
        width: 300,
      };
      $scope.elements = [
        {
          title: 'Item 1 item 1 item 1 item 1 item 1',
          id: makeDataId()
        },
        {
          title: 'Item 2 item 2 item 2 item 2 item 2',
          id: makeDataId()
        },
        {
          title: 'Item 3',
          id: makeDataId()
        }
      ];
      $scope.isVisebleBlocks = {};

      $scope.setWidth = () => {
        let width = $scope.model.width;
        if (!width) {
          width = 1;
          $scope.model.width = width;
        }
        $element.css("width", `${width}px`);
      };

      $scope.mouseHover = (id) => {
        $scope.isVisebleBlocks[id] = !$scope.isVisebleBlocks[id];
      };

      $scope.setWidth();
    }
  })
  .directive("some1", () => {
    return {
      scope: {
        data: '='
      },
      restrict: "E",
      template: "<some-2 data='data'></some-2>",
    };
  })
  .directive("some2", () => {
    return {
      scope: {
        data: '='
      },
      restrict: "E",
      template: "<some-3 data='data'></some-3>",
    };
  })
  .directive("some3", () => {
    return {
      scope: {
        data: '='
      },
      restrict: "E",
      template: "<summary-view data='data'></summary-view>",
    };
  })
  .directive("summaryView", () => {
    return {
      scope: {
        data: '='
      },
      restrict: "E",
      templateUrl: "./js/app/summary-view.tpl.html",
      controller: ["$scope", summaryViewCtrl]
    };
    function summaryViewCtrl ($scope) {
      const data = [...$scope.data];

      $scope.$watch('data', () => {
        $scope.lastElement = getLastElement();
      }, true);

      $scope.getUnicElementsTags = (data) => {
        if (data.length) {
          let tags = data.reduce((acc, el) => [...acc, ...el.tags], []);
          let unicTags = [...new Set(tags)].join(', ');
          return unicTags;
        }
      };

      function getLastElement() {
        return data.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))[0]
      }
    }
  });

