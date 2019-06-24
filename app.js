var budgetController = (function() {
  //Some code later
})();

var UIController = (function() {
  //Some code later
})();

var appController = (function(budgetCtrl, UICtrl) {
  var buttonAdd = ".add__btn";
  var removeIncomeButton = ".item__delete--btn";
  var removeExpensesButton = ".";

  document.querySelector(bottomAdd).addEventListener("click", function() {
    console.log("Add Clicked");
  });

  document
    .querySelector(removeIncomeButton)
    .addEventListener("click", function() {
      console.log("Remove Income Clicked");
    });
})(budgetController, UIController);
