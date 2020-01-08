/* .....................................................................................
....................................BUDGET CONTROLLER................................... */

var BudjectController = (function(){

    var Expense = function(date, id, description, value) {
        this.id = id;
        this.date = date;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    var Income = function(date, id, description, value) {
        this.id = id;
        this.date = date;
        this.description = description;
        this.value = value;
    };

        // Apply a method for calculating Expenses percentages

        Expense.prototype.calcPercetage = function(totalIncome) {

            /* Calculate percetage of expenses. 
            Example : 
            exp1 = 10;
            exp2 = 30;
            exp3 = 50;
            total Income = 100; 
            perc%1  = (exp1/total Income)*100 == (10/100)*100 = 10% */
    
            if (totalIncome > 0) {
                this.percentage = Math.round((this.value/totalIncome) *100);
            } else {
                this.percentage = -1;
            }
            
    
        };
    
        // Method to return percentage
        Expense.prototype.getPercentage = function() {
            return this.percentage;
        }

        //calculate totals using the private function
        var culculateTotals = function(type) {
            var sum;
            sum=0;
    
            /*for Each element in the array (inc or exp) we use function 
            which uses 'current' element in the array with its value and add sum to it.*/
            data.allItems[type].forEach(function(cur){
                sum += cur.value;
            })
            // we store the result in a public variable "totals"
            data.totals[type] = sum;
        };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc:0
        }, 
        budget: 0,
        persentage: -1
    };

return {
    addItem: function(type, date, des, val) {

        var newItem, ID;

        if (data.allItems[type].length > 0) {

            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;}
            else {ID = 0}

        
        if(type === 'exp') { // проверка на тип
            newItem = new Expense(date, ID, des, val); // создаем новый объект с параметрами
        }
        else if (type === 'inc') {
            newItem = new Income(date, ID, des, val);
        }

        data.allItems[type].push(newItem); // вводим новое значение в array последним элементом
        
        return newItem;

    }, 

     //delete an item from budget 
    deleteItem: function(type, id){
        var ids, index;
        
        // loop through the array to find correct index of id
        // id = 6; [2,3,6,8]; index = 2;
        ids = data.allItems[type].map(function(current) { 
            return current.id; 
        });

        index = ids.indexOf(id); // get index of the array.id

        if(index !== -1) {
            data.allItems[type].splice(index, 1) //delete 1 element with an index
        }

    },
    calculateBudget:function() {

        // 1. culculate total income and expenses
        culculateTotals('exp');
        culculateTotals('inc');

        // 2. calculate the budget: income - expenses
        data.budget = data.totals.inc - data.totals.exp;

        // 3. culaculate the persentage of the income that we spent
        if (data.totals.inc > 0) {
            data.persentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else(data.persentage = -1);
        
    },
    // we calculate percetages of expenses
    calculetePercetages: function() {
        data.allItems.exp.forEach(function(cur){
            cur.calcPercetage(data.totals.inc)}) },

    /* We use MAP mathod to loop throght the array of exp
    and store the result of the "getPercentage" func in a new array - "Allpercentages"
    then it returns new array */
    getPercentage:function() {
        var allPercentages = data.allItems.exp.map(function(cur) {
            return cur.getPercentage();
        });
        return allPercentages;
    },

    getBUdget: function() {
        return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            persentage: data.persentage
        }}
}


})();


/* .....................................................................................
....................................UI CONTROLLER................................... */

var UIController = (function(){

    var DOMstrings = {
        InputDateInc: '.inc__add__date',
        InputDiscriptionInc:'.inc__add__description',
        InputValueInc:'.inc__add__value',
        InputDate: '.add__date',
        InputDiscription:'.add__description',
        InputValue:'.add__value',
        InputBtn1: '.add__btn1',
        InputBtn2: '.add__btn2',
        incomeConteiner: '.income__list',
        expensesConteiner: '.expenses__list', 
        budgetLabel: '.budget__value', 
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        persentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLebel: '.budget__title--month', 
        Expenses: '.expenses'
    };

    var formatNumbers = function(num, type) {
        var numSplit, int, dec, type;
        /* 
        1) + or - before number depends on type
        2) exactly 2 decimals points
        3) comma seperating thousands */

        // why we don't need to declare the variable ????????
        num = Math.abs(num); 
        num = num.toFixed(2); // Give us 2 decimals after point

        numSplit = num.split('.');
        int = numSplit[0]; // int is first obj of the array;
        if(int.length > 3) {
            // input 2345, output 2,345
            int = int.substr(0, int.length -3) + ',' + int.substr(int.length-3,3); 
        }
        dec = numSplit[1];

        

        return (type === 'exp' ? '-' : '+') + ' ' + int +'.' + dec;

    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInputInc: function() {
            return {
                type: 'inc',
                date: document.querySelector(DOMstrings.InputDateInc).value,
                description: document.querySelector(DOMstrings.InputDiscriptionInc).value,
                value: parseFloat(document.querySelector(DOMstrings.InputValueInc).value) 

            }
        },
        getInputExp: function() {
            return {
                type: 'exp',
                date: document.querySelector(DOMstrings.InputDate).value,
                description: document.querySelector(DOMstrings.InputDiscription).value,
                value: parseFloat(document.querySelector(DOMstrings.InputValue).value) 

            }

        },
        
    
        addListItems: function(obj, type) { 
            var html, newHtml, element; 

            //get HTML string

            if(type === 'inc') {
        
                element = DOMstrings.incomeConteiner;

                html = '<div class="item clearfix" id="inc-%id%"><div class ="item__date">%date%</div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {

                element = DOMstrings.expensesConteiner;

                html = '<div class="item clearfix" id="exp-%id%"><div class ="item__date">%date%</div><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            // replace HTMl string with user's answer
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%date%', obj.date);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumbers(obj.value, type));

            //select element 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
        }, 

        /* We make this function to format Date structure */
        formatDate: function(date) {
                var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
            ];
        
            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();
        
            return day + ' ' + monthNames[monthIndex] + ' ' + year;
            
        
        },

        deleteListItems: function(selectorId) {

            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);

        },

        //clear the fields of description and value 
        clearFields: function(type) { 
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.InputDateInc  + ', '+ DOMstrings.InputDiscriptionInc + ', '+ DOMstrings.InputValueInc + ', ' + DOMstrings.InputDate +', '+ DOMstrings.InputDiscription + ', '+ DOMstrings.InputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            if(type === 'inc') {fieldsArr[0].focus(); }
            else if (type === 'exp') {fieldsArr[3].focus(); };
            
        },
        displayBudget: function(obj) {

            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumbers(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumbers(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumbers(obj.totalExp, 'exp') ;
            document.querySelector(DOMstrings.persentageLabel).textContent = obj.persentage;
        },

        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            

            
            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },

        displayMonth: function() {
            var now, months, year, month;
            /* we creat a new object which is called 
            Date Constructor. 
            it'll return current date*/
            now = new Date();
            months = ['January', 'February', 'March', 
            'April', 'May', 'June', 'July', 'August', 
            'September', 'October', 'November', 'December'];
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMstrings.dateLebel).textContent = months[month] + ' '+ year;
        },

        hideContainerInc: function(){

            document.querySelector('.income').style.display = 'none';
        },

        hideContainerExp: function(){
            document.querySelector('.expenses').style.display = 'none';
        },

        displayContainerInc: function() {
            document.querySelector('.income').style.display = 'block';
        },

        displayContainerExp: function() {
            document.querySelector('.expenses').style.display = 'block';
        },

        getDOMstrings: function() {  // we made all DOM string public
            return DOMstrings;
        }

        
    }
    
})();



/* .....................................................................................
....................................APP CONTROLLER................................... */

var Controller = (function(BudjetCtr, UICtr){

        var setupEventListener = function() {

        var DOM = UICtr.getDOMstrings(); 
        document.querySelector(DOM.InputBtn1).addEventListener('click', function(){
            ctrAddItemInc();
        });

        document.querySelector(DOM.InputBtn2).addEventListener('click', function(){
            ctrAddItemExp();
        });
        document.querySelector(DOM.container).addEventListener('click', cntrDeleteItem); 
        document.querySelector('.budget__income').addEventListener('click', function(){
            if(document.querySelector('.income').style.display =='none') {
                UICtr.displayContainerInc();
            } else { 
                UICtr.hideContainerInc()
            }
        });
        document.querySelector('.budget__expenses').addEventListener('click', function(){
            if(document.querySelector('.expenses').style.display =='none') {UICtr.displayContainerExp();}
            else { UICtr.hideContainerExp()}
            
        });
    }; 

        var updateBudget = function() {

            //1.  Calculate Budget
            BudjetCtr.calculateBudget();
    
            //2. Return culculation result
            var budget = BudjetCtr.getBUdget(); 
    
            //3. Add budget to the UI
            UICtr.displayBudget(budget);
        };

        var updatePercetages = function() {

            // 1. Calculate persentages 
            BudjetCtr.calculetePercetages();
    
            //2. read percetages from budget controller (returned results)
            var percentages = BudjetCtr.getPercentage();
    
            //3. Update UI
            UICtr.displayPercentages(percentages);
    
        };



                        /* ......Function for Income........ */

    var ctrAddItemInc = function() {

        //1. Get date from Input
        var input, newItem;

        input = UICtr.getInputInc();
        console.log(input);



        //2.check input for empty string, for non a number
        if (input.description !== "" && !isNaN(input.value) && input.value >0 ) 
        {
            if (input.date === "") {

                /* We format date structure
                Ex: 10  July 2019 */
                input.date = UICtr.formatDate(new Date());
            } else {input.date = UICtr.formatDate(new Date (input.date));}

        //3.Take date to BUDGET CONTROLLER 
        newItem = BudjetCtr.addItem(input.type, input.date, input.description, input.value);
        console.log(newItem);

        //4. Add date to UI CONTROLLER
        UICtr.addListItems(newItem, input.type);
        

        //5. clear the fields of description and value 

        UICtr.clearFields(input.type);

        //6. Culculate and update Budget
        updateBudget();

        //7. Calculate and update percentages
        updatePercetages();
        }

                



    };

                            /* ......Function for Expenses...... */

    var ctrAddItemExp = function() {

        //1. Get date from Input
        var input, newItem;

        input = UICtr.getInputExp();
        console.log(input);



        //2.check input for empty string, for non a number
        if (input.description !== "" && !isNaN(input.value) && input.value >0 ) {

            
            if (input.date === "") {

            input.date = UICtr.formatDate(new Date());
            } else {input.date = UICtr.formatDate(new Date (input.date));}
            
        //3.Take date to BUDGET CONTROLLER 
        newItem = BudjetCtr.addItem(input.type, input.date, input.description, input.value);
        console.log(newItem);
    
        //4. Add date to UI CONTROLLER
        UICtr.addListItems(newItem, input.type);
    
        //5. clear the fields of description and value
        UICtr.clearFields(input.type); 
    
        //6. Culculate and update Budget
        updateBudget();
    
        //7. Calculate and update percentages 
        updatePercetages();
    }



    };

    // create a function which on clicking understands a target element 
    var cntrDeleteItem = function(event) { ///????? mistake here 
        var itemId, splitId, type, Id;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId) {

            splitId = itemId.split('-');
            type = splitId[0];
            Id = parseInt(splitId[1]);

            //1. Delete an item from data stracture

            BudjetCtr.deleteItem(type, Id);

            //2. Delete an item from Ui 
            UICtr.deleteListItems(itemId);

            //3. Update and show new Budget
            updateBudget();

             //4. Calculate and update percentages
            updatePercetages();
        }

    };

    return {
        init: function(){   //function which is executed at the beginning of the app. 
        UICtr.displayMonth();
        UICtr.displayBudget({
            budget:0,
            totalInc: 0,
            totalExp:0,
            percentage:-1
        });
        UICtr.hideContainerInc();
        UICtr.hideContainerExp();
        setupEventListener();  // we made this function public
        }
    }
            
            
            
})(BudjectController,UIController);

Controller.init();





