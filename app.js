var budgetController = (function() {
  //Some code later
})();

var UIController = (function() {
  

})();

var appController = (function(budgetCtrl, UICtrl) {
  var buttonAdd = ".add__btn";

  document.querySelector(buttonAdd).addEventListener("click", function() {
    //1. Get the field input data
    //2. Add the item to the budget controller
    //3. Add the item to the UI
    //4. Calculate the budget
    //5. Display the budget on the UI
  });
})(budgetController, UIController);
