var budgetController = (function() {
  //Some code later
})();

var UIController = (function() {
  //Some code later
})();

var appController = (function(budgetCtrl, UICtrl) {
  var buttonAdd = ".add__btn";

  var appCrtlAddItem = function() {
    //1. Get the field input data
    //2. Add the item to the budget controller
    //3. Add the item to the UI
    //4. Calculate the budget
    //5. Display the budget on the UI

    console.log("was clicked");

  };

  document.querySelector(buttonAdd).addEventListener("click", appCrtlAddItem);

  document.addEventListener("keypress", function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      appCrtlAddItem();
    }
  });
})(budgetController, UIController);
