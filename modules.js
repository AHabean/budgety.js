//Create the Module
//IIFE - allow us to create data privacy

//this is an IIFE function (a function which is immediately invoked )

//BUDGET CONTROLLER
var budgetController = (function() {
	//we create a function constructor(FC) because we will have a lot
	//of items in incomes and expenses, we store the data in an FC 
    
    var Expenses = function(id, description, value) {
    	this.id = id;
    	this.description = description;
    	this.value = value
    	this.percentange = -1;
    };

    //calculate the percentage

    Expenses.prototype.calcPercent = function(totalIncome) {
        if(totalIncome > 0) {
           this.percentange = Math.round((this.value/totalIncome) * 100);
	    } else {
	    	this.percentange = -1;
	    }
    };

    // return the percentage

    Expenses.prototype.getPercentage = function(){
    	return this.percentange;
    };

    var Income = function(id, description, value) {
    	this.id = id;
    	this.description = description;
    	this.value = value
    };

    var calculateTotal = function(type) {
        var sum = 0;
         /*for Each element in the array (inc or exp) we use function 
            which uses 'current' element in the array with its value and add sum to it.*/
        //cur se refera daca elementul curent accesat este inc sau exp
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });

        //we store the result in a public varible "totals"
        data.totals[type] = sum;
    };

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

    return {
    	addItem: function(type, des, val) {
    		var newItem, ID;//id = in which part of the list the newItem will be stored -inc or -exp

    		//Create new ID

    		//ID = ID + 1; -structure we need to respect when creating
    		//a new id

    		//to create a new id we need the length of our
    		//allItems data structure
    		//allItems is a Type(out's or inc's)
    		//we need the length of data type
    		//-1 to access the last item
    		//id because we need to recive just the id [0, 1, 2 etc]
    		//+1 because we nedd to create an new ID for a new item
            

            //daca in data structure exista deja un element..cream altul nou
            if(data.allItems[type].length > 0) {
            	ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
            	//daca nu, setam id la 0
            	ID = 0;
            }

    		//Create new item based in "exp" or 'inc'
    		if(type === 'exp') {
    			newItem =  new Expenses(ID, des, val);
    		} else if(type === 'inc') {
    			newItem = new Income(ID, des, val); 
    		}

    		//Push the new item in our data structure
    		data.allItems[type].push(newItem);

    		//Return the new element
    		return newItem;
       	},

       	//delete an item from the budget

       deleteItem: function(type, id) {
            var ids, index;
            
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },

       	calculateBudget: function(){

       		//calculate total incomes and total expenses
       		calculateTotal('exp');
       		calculateTotal('inc');

       		//calculate the budget: inc - exp
       		data.budget = data.totals.inc - data.totals.exp;

       		//calculate the percetange of income that we spent
       	    if(data.totals.inc > 0) {
       	    	data.percentange = Math.round((data.totals.exp / data.totals.inc) * 100);
       	    } else {
       	    	data.percentange = -1;
       	    }
       	},

       	calculatePercentages: function() {
           data.allItems.exp.forEach(function(cur){
               cur.calcPercent(data.totals.inc);
           });
       	},

       	/* We use MAP mathod to loop throght the array of exp
    and store the result of the "getPercentage" func in a new array - "Allpercentages"
    then it returns new array */

       	getPercentages: function() {
       		var allPercent = data.allItems.exp.map(function(cur) {
               //getPercentage from prototype
                return cur.getPercentage();
       		});
       		return allPercent;
       	},

       	getBudget: function() {
       		return {
       			budget: data.budget,
       		    totalInc: data.totals.inc,
       		    totalExp: data.totals.exp,
       		    percentange: data.percentange
       		};
       	},

       	testing: function() {
       		console.log(data);
        },
    };
   
})();


//UI CONTROLLER
var UIController = (function() {

	var DOMstrings = {
		inputType: '.type',
		inputDescription: '.input-description',
		inputValue: '.input-value',
		inputButton: '.check-btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget-value',
		incomeLabel: '.budget-box-income--value',
		expensesLabel: '.budget-box-expenses--value',
		percentangeLabel: '.budget-box-expenses--percet',
		container: '.container',
		expensesPercentagesLabel: '.item__percentage',
		dateLabel: '.budget_month',
		deleteLabel: '.delete',
		resetIncomeLabel: '.reset-inc',
		resetExpensesLabel:'.reset-exp'
    }

    var formatNumber = function(num, type) {
			var numSplit, int, dec, type;
			/* + or - before the number
			exactly 2 decimal points
			comma separating the thousands
			2310.4567 -> +/-2,310.46
			*/

			num = Math.abs(num);
			num = num.toFixed(2);//returns a string

			numSplit = num.split('.');//returns an array
			int = numSplit[0];
            
            if (int.length > 3) {
            	int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
            }

			dec = numSplit[1];

		    return (type ==='exp'? '-':'+') + ' ' + int + '.' + dec;
	};

	var nodeListForEach = function(list, callback) {
        for(var i = 0; i < list.length; i++){
        	callback(list[i], i);
        }
    };

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMstrings.inputType).value, //we will get inc or out(what in html value is)
			  description: document.querySelector(DOMstrings.inputDescription).value,
			  value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

        //obj = obiectul obtinut in momentul cand adaugam un nou venit sau cheltuiala
        //adica obj = newItem(folosita sa display obiectul in interfata utilizatorului) din controller 
		addListItem: function(obj, type) {
			var html, newHtml, element;

			//Create HTML string with placeholder text
			if(type === 'inc') {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>\
			<div class="right clearfix"><div class="item__value">%value%</div<div class="item__delete">\
			<button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>';
			} else if(type === 'exp') {
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>\
			<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>\
			<div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>'
		    }			

			//Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

			//Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		deleteListItem: function(selectorID) {
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);

		},

		clearFields: function() {
			var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)
            fieldsArr = Array.prototype.slice.call(fields);

		        fieldsArr.forEach(function(current, index, arr) {
		    	//fieldsArr = arr parameter
		    	//current value of array that is currently being processed
		    	//array index
                current.value = "";
		        });

		    fieldsArr[0].focus();
		}, 

		displayBudget: function(obj) {
			var type;
			obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
		    
		    if(obj.percentange > 0) {
		    	document.querySelector(DOMstrings.percentangeLabel).textContent = obj.percentange + '%';
		    } else {
		    	document.querySelector(DOMstrings.percentangeLabel).textContent ='--';
     	    }

		},

		displayPercentages: function(perc) {
			var fields = document.querySelectorAll(DOMstrings.expensesPercentagesLabel);//return a list cald nodeList
           
           //current = list and index = i position in array from for loop  
            nodeListForEach(fields, function(current, index) {
            	if(perc[index] > 0) {
            	    current.textContent = perc[index] + '%';
            	} else {
            		current.textContent = '--';
            	}

            });
		},

		displayMonth: function() {
			var currentDate, month, months, year;

			currentDate = new Date();
			months = ['January', 'February', 'March', 'April', 'May', 'June',
			         'July', 'August', 'September', 'October', 'November', 'December'];
			month = currentDate.getMonth();
			year = currentDate.getFullYear();
			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
		},

		changeType: function() {

			var fields = document.querySelectorAll(
				DOMstrings.inputType + ',' +
				DOMstrings.inputDescription + ',' +
				DOMstrings.inputValue);

			nodeListForEach(fields, function(current) {
				current.classList.toggle('red-focus');
			});

			document.querySelector(DOMstrings.inputButton).classList.toggle('red');
		},

		getDOMstrings: function() {
			return DOMstrings;
		}
	};

})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function() {
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
	    document.addEventListener('keypress', function(event){
	    	//enter = code 13 which in older browser = keypress;codul lui enter este 13
	    	if(event.keypress === 13 || event.which === 13){
	    		ctrlAddItem();	
	    	}
	    });
	    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
	};

	var updateBudget = function() {
		//1. Calculate budget
		budgetCtrl.calculateBudget();

		//2. Return the budget
		var budget = budgetCtrl.getBudget();

		//3. Update UI(display the budget on the UI)
		//obiectul budget creat la pct.2
		UICtrl.displayBudget(budget);
	};

	var updatePercentages = function() {
        //1. calc percentages
        budgetCtrl.calculatePercentages();

        //2. read them from BudgetControler
        var percentages = budgetCtrl.getPercentages();

        //3. update the UI
        UICtrl.displayPercentages(percentages);
	};

    var ctrlAddItem = function(){

    	var input, newItem;

    	//1. Get the field input data.
    	input = UICtrl.getInput();
    	//console.log(input);

    	if(input.description !== "" && !isNaN(input.value) && input.value > 0){
    		
            //functia addItem in budgetController module primeste trei parametrii:(type, des, val) 
            //acestia sunt cei definiti in UIController - DOMstrings getInput
            //pt ca iii avem salvati in variabila input, cu ajutorul ei ii accesam in newItem;
            //obiect nou care se adauga in input de fiecare data cand adaugam noi incomes si expenses
	        
            //2. Add the item to the budget controller
	        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		    //3. Add the item to the UI
		    UICtrl.addListItem(newItem, input.type);

		    //4. Clear the fields;
		    UICtrl.clearFields();

		    //5. Calculate and update budget
		    updateBudget();

		    //6. Calc and update Percentages
		    updatePercentages();
    	}		
   };

   var ctrlDeleteItem = function(event) {
   	    var itemID, splitID, type, ID;

   	    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
   	    
   	    if(itemID){
          splitID = itemID.split('-');
   	      type = splitID[0];
   	      ID = parseInt(splitID[1]);
   	    
   	    //1. Delete the item from our data structure;
   	      budgetCtrl.deleteItem(type, ID);

   	    //2. Delete the item from the UI
   	      UICtrl.deleteListItem(itemID);

   	    //3. Update the Budget
   	      updateBudget();

   	    //4. Calc and update Percentages
		      updatePercentages();
        }
   };

   return {

   	init: function() {
   		console.log('App has started');
   		UICtrl.displayMonth();
   		UICtrl.displayBudget({budget: 0,
   		       		    totalInc: 0,
   		       		    totalExp: 0,
   		       		    percentange: -1});
  	    setupEventListeners();
   	}

   };


 
})(budgetController, UIController);

controller.init();