var budgetController = (function() {
  //Income constructor
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  //Expense constructor
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
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
    },
    budget: 0,
    percentage: -1
  };

  //  Calculate and set each total
  var calculateTotal = function(type) {
    var total = 0;

    data.allItems[type].forEach(element => {
      total += element.value;
    });

    data.totals[type] = total;
  };

  // Calculate and set the percentage
  var calculatePercentage = function() {
    if (data.totals.inc > 0) {
      data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    } else {
      data.percentage = -1;
    }
  };

  // Calculate and set the budget
  var calculateBudgetProperty = function() {
    data.budget = data.totals.inc - data.totals.exp;
  };

  return {
    //Function to add an item
    addItem: function(type, description, value) {
      var newItem, ID;

      //Get the last element id
      //Id = last id + 1
      data.allItems[type].length > 0
        ? (ID = data.allItems[type][data.allItems[type].length - 1].id + 1)
        : (ID = 1);

      //Create a new item based on item type
      if (type === "inc") {
        newItem = new Income(ID, description, value);
      } else if (type === "exp") {
        newItem = new Expense(ID, description, value, 0);
      }

      //Push it into our data structure
      data.allItems[type].push(newItem);
      return newItem;
    },

    //Delete an item from array
    deleteItem: function(type, id) {
      var index, ids;

      ids = data.allItems[type].map(element => {
        return element.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    //  Calculate the budget
    calculateBudget: function() {
      calculateTotal("inc");
      calculateTotal("exp");
      calculateBudgetProperty();
      calculatePercentage();
    },

    //  Calculate the percentages
    calculateEachPercentage: function() {
      data.allItems.exp.forEach(element => {
        element.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(element => {
        return element.getPercentage();
      });

      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    }
  };
})();

var UIController = (function() {
  var budgetType, budgetDescription, budgetValue;

  // Class names
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    expensesContainer: ".expenses__list",
    incomeContainer: ".income__list",
    budgetValue: ".budget__value",
    budgetIncomeValue: ".budget__income--value",
    budgetExpensesPercentage: ".budget__expenses--percentage",
    budgetExpenseValue: ".budget__expenses--value",
    budgetPercentageValue: ".item__percentage",
    container: ".container"
  };

  // Get DOM
  budgetType = document.querySelector(DOMStrings.inputType);
  budgetDescription = document.querySelector(DOMStrings.inputDescription);
  budgetValue = document.querySelector(DOMStrings.inputValue);

  var formatNumber = function(number, type) {
    var numberSplit,
      decimalPart,
      integerPart,
      integerPartFormatted = "",
      count = 0;
    number = Math.abs(number);
    number = number.toFixed(2);

    numberSplit = number.split(".");

    integerPart = numberSplit[0];

    for (var i = integerPart.length - 1; i >= 0; i--) {
      if (count === 3) {
        integerPartFormatted = "," + integerPartFormatted;
        count = 0;
      }
      integerPartFormatted = integerPart.charAt(i) + integerPartFormatted;
      count++;
    }

    decimalPart = numberSplit[1];

    if (type === "inc") {
      type = "+";
    } else if (type === "exp") {
      type = "-";
    } else {
      type = "";
    }

    return type + " " + integerPartFormatted + "." + decimalPart;
  };

  return {
    // Return a input values
    getInput: function() {
      return {
        type: budgetType.value,
        value: parseFloat(budgetValue.value),
        description: budgetDescription.value
      };
    },

    addListItem: function(item, type) {
      var html, newHtml, element;

      //1. Create a html string with placeholder text
      if (type === "inc") {
        element = DOMStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMStrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">---</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //2. Replace the placeholder text with actual data
      newHtml = html.replace("%id%", item.id);
      newHtml = newHtml.replace("%description%", item.description);
      newHtml = newHtml.replace("%value%", formatNumber(item.value, type));

      //3. Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    // Remove an item
    removeListItem: function(selectorId) {
      var el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
    },

    // Clear the input fields
    clearFields: function() {
      var fields, fieldsArray;
      fields = document.querySelectorAll(
        DOMStrings.inputDescription + ", " + DOMStrings.inputValue
      );

      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(element => {
        element.value = "";
      });

      fieldsArray[0].focus();
    },

    // Display the budget value
    displayBudget: function(data) {
      var budgetField,
        budgetIncomeField,
        budgetExpenseField,
        budgetExpensePercentageField,
        type;

      budgetField = document.querySelector(DOMStrings.budgetValue);
      budgetIncomeField = document.querySelector(DOMStrings.budgetIncomeValue);
      budgetExpenseField = document.querySelector(
        DOMStrings.budgetExpenseValue
      );
      budgetExpensePercentageField = document.querySelector(
        DOMStrings.budgetExpensesPercentage
      );

      if (data.budget > 0) {
        type = "inc";
      } else if (data.budget < 0) {
        type = "exp";
      } else {
        type = "";
      }

      budgetField.textContent = formatNumber(data.budget, type);
      budgetIncomeField.textContent = formatNumber(data.totalInc, "inc");
      budgetExpenseField.textContent = formatNumber(data.totalExp, "exp");

      if (data.percentage > 0) {
        budgetExpensePercentageField.textContent = data.percentage + "%";
      } else {
        budgetExpensePercentageField.textContent = "---";
      }
    },

    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(DOMStrings.budgetPercentageValue);

      var nodeListForEach = (list, callback) => {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, (element, index) => {
        if (percentages[index] > 0) {
          element.textContent = percentages[index] + "%";
        } else {
          element.textContent = "---";
        }
      });
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

    document
      .querySelector(DOMStrings.container)
      .addEventListener("click", appcrtlDeleteItem);
  };

  // Update a budget
  var updateBudget = function() {
    //1. Calculate the budget
    budgetController.calculateBudget();
    //2. Get budget
    var budget = budgetCtrl.getBudget();
    //3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  //Update percentages
  var updatePercentage = function() {
    //1. Calculate percentages
    budgetCtrl.calculateEachPercentage();
    //2. Read percentages from the budget
    var percentages = budgetController.getPercentages();
    //3. Update the UI
    UICtrl.displayPercentages(percentages);
  };

  //Add an item
  var appCrtlAddItem = function() {
    var input, item;
    //1. Get the field input data
    input = UICtrl.getInput();

    if (input.description && input.value) {
      //2. Add the item to the budget controller
      item = budgetCtrl.addItem(input.type, input.description, input.value);
      //3. Add the item to the UI
      UICtrl.addListItem(item, input.type);
      //4. Clear the input fields
      UICtrl.clearFields();
      //5. Calculate and display the budget
      updateBudget();
      //6.Calculate and update percentages
      updatePercentage();
    }
  };

  // Delete an item
  var appcrtlDeleteItem = function(event) {
    var itemId, splitId, type, ID;

    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemId) {
      splitId = itemId.split("-");
      type = splitId[0];
      ID = parseInt(splitId[1]);

      //1. Delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      //2. Delete the item from UI
      UICtrl.removeListItem(itemId);

      //3. Update and show the new budget
      updateBudget();

      //4.Calculate and update percentages
      updatePercentage();
    }
  };

  return {
    // Init function
    init: function() {
      setUpEventListeners();
      updateBudget();
    }
  };
})(budgetController, UIController);

appController.init();
