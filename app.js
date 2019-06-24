var budgetController = (function() {
  //Some code later
})();

var UIController = (function() {
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn"
  };

  var budgetType = document.querySelector(DOMStrings.inputType);
  var budgetDescription = document.querySelector(DOMStrings.inputDescription);
  var budgetValue = document.querySelector(DOMStrings.inputValue);

  return {
    getInput: function() {
      return {
        type: budgetType.value,
        value: budgetValue.value,
        description: budgetDescription.value
      };
    },

    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

var appController = (function(budgetCtrl, UICtrl) {
  var DOMStrings = UICtrl.getDOMStrings();

  var appCrtlAddItem = function() {
    //1. Get the field input data
    var input = UICtrl.getInput();
    console.log(input);
    //2. Add the item to the budget controller
    //3. Add the item to the UI
    //4. Calculate the budget
    //5. Display the budget on the UI
  };

  document
    .querySelector(DOMStrings.inputButton)
    .addEventListener("click", appCrtlAddItem);

  document.addEventListener("keypress", function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      appCrtlAddItem();
    }
  });
})(budgetController, UIController);
