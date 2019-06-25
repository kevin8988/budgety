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

    //  Calculate the income
    calculateIncome: function() {
      var incTotal = 0;

      data.allItems.inc.forEach(element => {
        incTotal += element.value;
      });

      return incTotal;
    },

    //  Calculate the expense
    calculateExpense: function() {
      var expTotal = 0;

      data.allItems.exp.forEach(element => {
        expTotal += element.value;
      });

      return expTotal;
    },

    //  Calculate the budget
    calculateBudget: function() {
      return this.calculateIncome() - this.calculateExpense();
    },
    getAllItems: function() {
      return data.allItems;
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
    budgetValue: ".budget__value"
  };

  // Get DOM
  budgetType = document.querySelector(DOMStrings.inputType);
  budgetDescription = document.querySelector(DOMStrings.inputDescription);
  budgetValue = document.querySelector(DOMStrings.inputValue);

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
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMStrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //2. Replace the placeholder text with actual data
      newHtml = html.replace("%id%", item.id);
      newHtml = newHtml.replace("%description%", item.description);
      newHtml = newHtml.replace("%value%", item.value);

      //3. Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
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

    // Update the budget value
    updateBudget: function(value) {
      var budgetField = document.querySelector(DOMStrings.budgetValue);
      if (value > 0) {
        budgetField.textContent = "+ " + value;
      } else {
        budgetField.textContent = value;
      }
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
    }
  };

  var updateBudget = function() {
    //1. Calculate the budget
    var budgetValue = budgetController.calculateBudget();
    //2. Display the budget on the UI
    UICtrl.updateBudget(budgetValue);
  };

  return {
    // Init function
    init: function() {
      setUpEventListeners();
    }
  };
})(budgetController, UIController);

appController.init();
