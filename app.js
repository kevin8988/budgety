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
    incomeContainer: ".income__list"
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
        value: budgetValue.value,
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
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description"</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //2. Replace the placeholder text with actual data
      newHtml = html.replace("%id%", item.id);
      newHtml = newHtml.replace("%description%", item.description);
      newHtml = newHtml.replace("%value%", item.value);

      //3. Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
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
    //2. Add the item to the budget controller
    item = budgetController.addItem(input.type, input.description, input.value);
    //3. Add the item to the UI
    UICtrl.addListItem(item, input.type);
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
