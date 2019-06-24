var budgetController = (function() {
  //Income constructor
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  //Expense constructor
  var Expense = function(id, description, value, percentage) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = percentage;
  };

  //Store data
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };
})();

var UIController = (function() {
  // Class names
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn"
  };

  // Get DOM
  var budgetType = document.querySelector(DOMStrings.inputType);
  var budgetDescription = document.querySelector(DOMStrings.inputDescription);
  var budgetValue = document.querySelector(DOMStrings.inputValue);

  return {
    // Return a input values
    getInput: function() {
      return {
        type: budgetType.value,
        value: budgetValue.value,
        description: budgetDescription.value
      };
    },

    // Return a class names
    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

var appController = (function(budgetCtrl, UICtrl) {
  // Set up event listeners
  var setUpEventListeners = function() {
    var DOMStrings = UICtrl.getDOMStrings();
    document
      .querySelector(DOMStrings.inputButton)
      .addEventListener("click", appCrtlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        appCrtlAddItem();
      }
    });
  };

  //Add an item
  var appCrtlAddItem = function() {
    //1. Get the field input data
    var input = UICtrl.getInput();
    //2. Add the item to the budget controller

    //3. Add the item to the UI
    //4. Calculate the budget
    //5. Display the budget on the UI
  };

  return {
    // Init function
    init: function() {
      setUpEventListeners();
    }
  };
})(budgetController, UIController);

appController.init();
