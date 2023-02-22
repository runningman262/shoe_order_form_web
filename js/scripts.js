
// back-end JS order handling
var OrderController = (function() {
    
    // method to create an order object
        var order = function(id, fName, lName, phoneNmbr, dateRequested, shoeBrand, shoeStyle, shoeStyleNumber, shoeColor, shoeColorCode, empName, prepay, orderNumber = '', orderNotes = '') {
            this.orderID = id;
            this.firstName = fName;
            this.lastName = lName;
            this.phoneNumber = phoneNmbr;
            this.requestedDate = dateRequested;
            this.brand = shoeBrand;
            this.style = shoeStyle;
            this.styleNumber = shoeStyleNumber;
            this.color = shoeColor;
            this.colorCode = shoeColorCode;
            this.employeeName = empName;
            this.prepaid = prepay;
            this.POnumber = orderNumber;
            this.notes = orderNotes;
        };
    
    var orders = [];
    
    return {
        
        addOrder: function(fName, lName, phoneNmbr, dateRequested, shoeBrand, shoeStyle, shoeStyleNumber, shoeColor, shoeColorCode, empName, prepay, orderNumber = '', orderNotes = '') {
            
            var orderID;
            
            // determine the next order ID
            if (orders.length > 0) {
                // get the order ID of the last element and add 1
                //orderID = orders[orders.length - 1].orderID + 1;
                // function to determine the largest order ID and add 1
                var orderID = 0;
                //var index = 0;
                
                // FIXME START HERE
                for (index = 0; index < orders.length; index++) {
                    console.log('Checking index ' + index);
                    if (orders[index].orderID >= orderID) {
                        orderID = orders[index].orderID + 1;
                    }
                }
                
            } else {
                orderID = 1;
            }
            
            // create a new order object
            var newOrder = new order(orderID, fName, lName, phoneNmbr, dateRequested, shoeBrand, shoeStyle, shoeStyleNumber, shoeColor, shoeColorCode, empName, prepay, orderNumber, orderNotes);
            
            // add the order to the array
            orders.push(newOrder);
            console.log(orders);
            
            // return the new order object to the calling method (in this case: Main)
            return newOrder;
            
        },
        
        delItem: function(id) {
            var numOrders = orders.length;
            var i = 0;
            var itemNotFound = true;
            
            while ((i < numOrders) && itemNotFound) {
                // iterate through the orders array looking for 
                // orderID in each object to == id.  Once found,
                // exit the loop.
                
                if (orders[i].orderID === id) {
                    orders.splice(i, 1);
                    itemNotFound = false;
                    console.log(orders);
                }
                i++;
            }
        },
        
        // create and return a copy of the orders array
        getOrders: function() {
            
            ordersCopy = orders.slice();
            return ordersCopy;
            
        },
        
        // send orders to server
        sendToServer: function(orderObject) {
            
            try {
//                // create JSON string
//                var orderString = JSON.stringify(orderObject);
//                console.log(orderString);   // DELETE DEBUG ONLY
//                
//                var url = 'submit.php'
//
//                // create XHR object
//                var xhr = new XMLHttpRequest();
//                
//
//                // open the connection
//                xhr.open('POST', url, true);
//                
//                // set which type of content to be sent
//                xhr.setRequestHeader('Content-Type', 'application/json');
//                
//                // verify data was successfully sent
//                xhr.onreadystatechange = function() {
//                    if(xhr.readyState === 4 && xhr.status === 200) {
//                        console.log('Data received on the server.');
//                    }  
//                };
//                
//                xhr.send(orderString);
                
//                $.post(url, orderString, function(response) {
//                    console.log('Data received on the server.');
//                }, 'json');
                
                
                
            } catch (except) {
                console.log(except);
                throw 'Error sending data to the server: ' + except.message;
            }
            
            
            
        },
        
        // get orders from file
        getFromServer: function() {
            
        },
        
        // sort the orders array in ascending order
        sortAscending: function(propName) {
                        
            try {
                
                // sort with function argument to compare similar properties of an order object
                orders.sort(function(order1, order2) {
                    var property1 = order1[propName].toLowerCase();
                    var property2 = order2[propName].toLowerCase();
                    if (property1 < property2) { return -1;}
                    if (property1 > property2) {return 1;}
                    return 0;       // represents a tie
                });
                console.log(orders);
            } catch (except) {
                 'Something went wrong during sorting column ' + propName + '...' + except;
                
            }
            
        },
        
        // sort the order list descending by field
        sortDescending: function(propName) {
            
            try {
                
                // sort with function argument to compare similar properties of an order object
                orders.sort(function(order1, order2) {
                    var property1 = order1[propName].toLowerCase();
                    var property2 = order2[propName].toLowerCase();
                    if (property1 > property2) { return -1;}
                    if (property1 < property2) {return 1;}
                    return 0;       // represents a tie
                });
                console.log(orders);
            } catch (except) {
                throw 'Something went wrong during sorting column ' + propName + '...' + except;
                
            }
        },
        
        // create a new order list containing the search term
        searchOrders: function(filterByField, searchTerm) {
            try {
                
                // the find function only returns the first instance
                // var foundOrder = orders.find(order => order.firstName.includes(searchTerm));
                
                var foundOrders = [];
                
                // function to check the current field for the search term and push the order to an array.
                var pushOrder = function(currField, currOrder) {
                    
                    if (currField.includes(searchTerm.toLowerCase())) {
                        foundOrders.push(currOrder);
                        
                        // if search term found and order pushed, return true
                        return true;
                    }
                    
                    // if search term not found/order not pushed, return false
                    return false;
                    
                }
                
                // iterate through orders array to find the search term.  Searches all fiels.
                orders.forEach(function(order) {
                    
                    var currentField;
                    var orderPushed = false;
                    
                    if (filterByField == 'none') {
                        // put the order object into a searchable array
                        var orderArray = Object.values(order);

                        // iterate through the array looking for a pattern match.  Skip the first index as that is the order ID.
                        for (i = 1; i < orderArray.length; i++) {

                            // convert the field to lowercase
                            currentField = orderArray[i].toLowerCase();

                            // get return value from pushOrder - check for search term in current field and push order
                            orderPushed = pushOrder(currentField, order);
                            
                            // if the order was pushed, break out of the for loop.  No need to keep searching this order and create duplicates.
                            if (orderPushed) {
                                break;
                            }

                        }
                        
                    } else {
                        // search the specified field of the order
                        currentField = order[filterByField].toLowerCase();
                        
                        // check for search term in current field and push order
                        pushOrder(currentField, order);
                    }
                    
                    
                });

                return foundOrders;                
                
            } catch (except) {
                console.log(except);
            }
        }
    };
    
})();

// DOM and visualization order handling
var UIController = (function() {
    
    // set the HTML vars to JS vars for ease of updating
    var DOMstrings = {
        // format is JS: DOM
        // field inputs
        firstName: '.add-customer-first-name',
        lastName: '.add-customer-last-name',
        phoneNumber: '.add-customer-phone-number',
        requestedDate: '.add-date-requested',
        brand: '.add-brand',
        style: '.add-style',
        styleNumber: '.add-style-number',
        color: '.add-color',
        colorCode: '.add-color-code',
        employeeName: '.add-employee-name',
        POnumber: '.add-order-number',
        prepaid: 'input[name="prepaid-order"]:checked',
        notes: '.add-notes',
        submitButton: '.inputBtn'
        
    };
    
    // table interaction fields
    var DOMtableInteract = {
        
        filterBy: 'filter-1', // ID
        searchBar: '.search',
        deleteButton: '.delete-order-btn',
        deleteIcon: 'close-circle-outline',
        editIcon: 'create-outline',
        orderListContainer: '.order-list',
        orderHeader: '.order-head',
        orderItem: '.order',
        sort: '.sort-btn',
        ascending: 'ascending',
        ascendingIcon: 'caret-up-outline',
        descendingIcon: 'caret-down-outline'

    };
    
    var DOMcolumns = {
        // format is DOM: JS
        'none': 'none',
        'first-name': 'firstName',
        'last-name': 'lastName',
        'phone-number': 'phoneNumber',
        'date-requested': 'requestedDate',
        'brand': 'brand',
        'style': 'style',
        'style-number': 'styleNumber',
        'color': 'color',
        'color-code': 'colorCode',
        'emp-name': 'employeeName',
        'PO-number': 'POnumber',
        'prepaid': 'prepaid',
        'notes': 'notes'
    };    
    
    return { 
        // make dictionary of DOM input classes and id's available in other functions
        getDOMstrings: function() {
            return DOMstrings;
        },
        
        // make dictionary of DOM table interaction classas available in other functions
        getDOMtableInteract: function() {
            return DOMtableInteract;  
        },
        
        // make dictionary of DOM id's to JS vars available in other functions
        getDOMcolumns: function() {
            return DOMcolumns;
        },

        // get values from the DOM
        getInput: function() {
            return {
                fName: document.querySelector(DOMstrings.firstName).value,
                lName: document.querySelector(DOMstrings.lastName).value,
                phoneNmbr: document.querySelector(DOMstrings.phoneNumber).value,
                dateRequested: document.querySelector(DOMstrings.requestedDate).value,
                shoeBrand: document.querySelector(DOMstrings.brand).value,
                shoeStyle: document.querySelector(DOMstrings.style).value,
                shoeStyleNumber: document.querySelector(DOMstrings.styleNumber).value,
                shoeColor: document.querySelector(DOMstrings.color).value,
                shoeColorCode: document.querySelector(DOMstrings.colorCode).value,
                empName: document.querySelector(DOMstrings.employeeName).value,
                prepaid: document.querySelector(DOMstrings.prepaid).value,
                orderNumber: document.querySelector(DOMstrings.POnumber).value,
                orderNotes: document.querySelector(DOMstrings.notes).value
                
            };
        },
        
        // get "filter by" field
        getFilterBy: function() {
            var filterBy = document.getElementById(DOMtableInteract.filterBy).value;
            
            return DOMcolumns[filterBy];
        },
        
        // get search terms from the searchbar
        getSearch: function() {
            // return string entered into searchbar
            return document.querySelector(DOMtableInteract.searchBar).value;
        },
        
        // add html to display added order
        addOrderItem: function(obj) {
            var element, html, newHtml;
            
            // element we want to update
            element = DOMtableInteract.orderListContainer;
            
            // standard html that will be used as a framework
            html = '<tr class="order clearfix" id="%id%"><td class="cust-order-last-name">%LastName%</td><td class="cust-order-first-name">%FirstName%</td><td class="cust-order-phone-number">%PhoneNumber%</td><td class="order-date-requested">%DateRequested%</td><td class="order-brand">%Brand%</td><td class="order-style">%Style%</td><td class="order-style-number">%StyleNumber%</td><td class="order-color">%StyleColor%</td><td class="order-color-number">%ColorCode%</td><td class="order-employee-name">%Employee%</td><td class="order-number">%PONumber%</td><td class="order-prepaid">%Prepaid%</td><td class="order-notes">%Notes%</td><td class="delete-order"><button class="edit-order-btn order-btn"><ion-icon name="create-outline"></ion-icon><span class="tooltip-text">Edit</span></button><button class="delete-order-btn order-btn"><ion-icon name="close-circle-outline"></ion-icon><span class="tooltip-text">Delete</span></button></td></tr>';
            
            // update the standard HTML framework with actual data
            newHtml = html.replace('%id%', obj.orderID);
            newHtml = newHtml.replace('%LastName%', obj.lastName);
            newHtml = newHtml.replace('%FirstName%', obj.firstName);
            newHtml = newHtml.replace('%PhoneNumber%', obj.phoneNumber);
            newHtml = newHtml.replace('%DateRequested%', obj.requestedDate);
            newHtml = newHtml.replace('%Brand%', obj.brand);
            newHtml = newHtml.replace('%Style%', obj.style);
            newHtml = newHtml.replace('%StyleNumber%', obj.styleNumber);
            newHtml = newHtml.replace('%StyleColor%', obj.color);
            newHtml = newHtml.replace('%ColorCode%', obj.colorCode);
            newHtml = newHtml.replace('%Employee%', obj.employeeName);
            newHtml = newHtml.replace('%PONumber%', obj.POnumber);
            newHtml = newHtml.replace('%Prepaid%', obj.prepaid);
            newHtml = newHtml.replace('%Notes%', obj.notes);
            
            // insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },
        
        // remove html from DOM to update the order list
        remOrder: function(id) {
            
            var element = document.getElementById(id);
            element.remove();
            
        },
        
        // clear the input fields
        clearInput: function() {
            
            try {
                
                var fields, fieldsArray;
                // select all input fields and convert to an array
                fields = document.querySelectorAll('input');
                fieldsArray = Array.prototype.slice.call(fields);
                
                // loop through the array and set each value as an empty string
                fieldsArray.forEach(function(currentField) {
                   currentField.value = ''; 
                });
                
                // focus in on the first field
                fieldsArray[0].focus();
                
                // TODO set the date field to today
                
            } catch (except) {
                
            }
        },
        
        refreshTable: function(ordersArray) {
            
            
            while (document.querySelector(DOMtableInteract.orderItem)) {
                document.querySelector(DOMtableInteract.orderItem).remove();
            }
            
            ordersArray.forEach(this.addOrderItem);
            
        },
        
        // add column sort filter icon
        addSortFilter: function(id) {
            // create the HTML for the icon
            var iconHTML = '<button class="sort-btn ascending"><ion-icon name="caret-up-outline"></ion-icon></button>';

            try {
                // remove the filter icon from any other column it may be in
                this.removeSortFilter();
                
                // add the ascending filter icon to the column header
                document.getElementById(id).insertAdjacentHTML('beforeend', iconHTML);
                
                return 'ascending';
                
            } catch (except) {
                throw 'Sort filter cannot be added here.';
            }
            
        },
        
        // remove the column sort filter icon
        removeSortFilter: function() {
            try {
                // remove the icon element
                document.querySelector(DOMtableInteract.sort).remove();
                
            } catch (except) {
                console.log('No filter to remove: ' + except.message);
            }
        },
        
        // toggle sort icon between ascending and descending
        toggleSort: function(target) {
            
            try {
                
                // toggle between ascending and descending icon
                if (document.querySelector(target).classList.contains(DOMtableInteract.ascending)) {

                    // switch to descending icon
                    document.querySelector(target).firstChild.setAttribute('aria-label', DOMtableInteract.descendingIcon);
                    document.querySelector(target).firstChild.setAttribute('name', DOMtableInteract.descendingIcon);
                    document.querySelector(target).classList.toggle(DOMtableInteract.ascending);
                    return 'descending';
                } else {

                    // switch to ascending icon
                    document.querySelector(target).firstChild.setAttribute('aria-label', DOMtableInteract.ascendingIcon);
                    document.querySelector(target).firstChild.setAttribute('name', DOMtableInteract.ascendingIcon);
                    document.querySelector(target).classList.toggle(DOMtableInteract.ascending);
                    return 'ascending';
                }
                
                
            } catch (except) {
                
                throw 'toggleSort error: ' + except.message;

            }
            
        },
        
        // decision in how to add the sort: add the filter or toggle the column that is sorted
        addSort: function(id) {
                        
            // combine attributes to select the button child of an id
            var target = '#' + id + ' > button';
            
            try {
                // if target not found, add the sort filter
                // else toggle the sort filter
                if (document.querySelector(target) === null) {
                    
                    // add the sort filter
                    console.log('Add sort filter');
                    return this.addSortFilter(id);
                    
                } else {
                    // toggle the sort filter
                    return this.toggleSort(target);
                }               
                
            } catch (except) {
                // if clicking on an area we can't sort on (i.e. invalid id), append message
                if (except instanceof DOMException) {
                    console.log('Can\'t sort here...');
                }
                
                console.log('Error sorting...' + except.message);
                throw except.message;
                
            }
        }
    };
    
})();

// main program
var Main = (function(UICtrl, orderCtrl) {
    
    // get the HTML vars into this block
    var DOM = UICtrl.getDOMstrings();
    var DOMtableInteract = UICtrl.getDOMtableInteract();
    var DOMcols = UICtrl.getDOMcolumns();
    
    var setupEventListeners = function() {
        
        // click submit button listener
        document.querySelector(DOM.submitButton).addEventListener('click', newOrder);
        
        // enter button (keyboard) listener
        document.addEventListener('keypress', function(e) {
           if (e.keyCode === 13 || e.which === 13) {    // most browsers use keyCode but some older ones use which
               newOrder();
           } 
        });
        
        // delete order button event listener
        document.querySelector(DOMtableInteract.orderListContainer).addEventListener('click', editOrder);
        
        // sort event listener
        document.querySelector(DOMtableInteract.orderHeader).addEventListener('click', sort);
        
        // search event listener.  Execute search each time a character is typed.
        document.querySelector(DOMtableInteract.searchBar).addEventListener('input', search);
    };
    
        
    // add order function creates a new order object
    var newOrder = function() {
        console.log('adding order');    // FIXME DELETE. Debug only.
        var input = UICtrl.getInput();

        // call the order method to create a new order
        var newOrder = orderCtrl.addOrder(input.fName, input.lName, input.phoneNmbr, input.dateRequested, input.shoeBrand, input.shoeStyle, input.shoeStyleNumber, input.shoeColor, input.shoeColorCode, input.empName, input.prepaid, input.orderNumber, input.orderNotes);
        
        UICtrl.addOrderItem(newOrder);
        
        // remove the sort filter if it is there
        UICtrl.removeSortFilter();
        
        // clear input fields
        UICtrl.clearInput();
        
        //console.log(newOrder);
    };
    
    // function to edit the order including deleting the order
    var editOrder = function(event) {
        
        var itemID;
        var clickedIcon;

        try {
            // search up the DOM stack to find the ID
            clickedIcon = event.target.name;
            itemID = parseInt(event.target.parentNode.parentNode.parentNode.id);
            
            // Delete item if itemID is a valid int and delete icon was clicked
            if (itemID && clickedIcon === DOMtableInteract.deleteIcon) {
                
                var confirmDelete = confirm('Are you sure you want to delete this order?');
                
                if (confirmDelete) {
                    // delete the item from the data structure
                    orderCtrl.delItem(itemID);

                    // delete the item from the UI
                    UICtrl.remOrder(itemID);
                }
                
            } else if (itemID && clickedIcon === DOMtableInteract.editIcon) {
                console.log('edit item');
            }
            
            
        } catch (except) {
            console.log('Error deleting order: ' + except);
        }
        
    };
    
    var sort = function() {
        
        var itemClassList, itemID, colName, sortDir;
        
        // get the DOM column ID
        itemID = event.target.id;
        console.log('Sorting ID ' + itemID);
        
        try {
        
            // try to toggle between ascending and descending sort
            sortDir = UICtrl.addSort(itemID);
            
            // code to sort ascending or descending
            console.log('Sorting...');
            
            if (sortDir === 'ascending') {
                orderCtrl.sortAscending(DOMcols[itemID]);
            } else {
                orderCtrl.sortDescending(DOMcols[itemID]);
            }
            
            // update the UI
            UICtrl.refreshTable(orderCtrl.getOrders());
            
        } catch (except) {
            
            console.log(except);
            
        }
        
    };
    
    var search = function() {
        
        // get the filter by field dropdown value
        var filterByField = UICtrl.getFilterBy();
        
        // if search box is active and upon keystroke, search
        var searchInput = UICtrl.getSearch();
        
        // store orders matching search terms
        var foundOrders = orderCtrl.searchOrders(filterByField, searchInput);
        
        // update the UI
        UICtrl.refreshTable(foundOrders);
    }

    return {
        init: function() {
            console.log('Application has started.');
            
            setupEventListeners();
            UICtrl.clearInput;
            
            // FIXME DELETE CODE FOR DEBUG ONLY
            var johnOrder = orderCtrl.addOrder('John', 'Smith', '217-555-0123', '2021-01-24', 'Hoka', 'Clifton', '123', 'Orange', 'BHBI', 'Kyle', 'no', 'john1.24kk', 'some notes');
            
            UICtrl.addOrderItem(johnOrder);
            
            var billOrder = orderCtrl.addOrder('Bill', 'Rogers', '719-555-5455', '2021-02-24', 'Nike', 'Pegasus', '154-9', 'Blue', '154', 'Cayla', 'yes', 'Bill2.25mc', 'more notes');
            
            UICtrl.addOrderItem(billOrder);
            
            var oscarOrder = orderCtrl.addOrder('Oscar', 'Nunez', '214-555-6545', '2021-02-25', 'Brooks', 'Glycerin', 'D154-01', 'Black', '051', 'Grant', 'no', 'Oscar2.25mc', 'send text when arrived');
            
            UICtrl.addOrderItem(oscarOrder);
            
            var adamOrder = orderCtrl.addOrder('Adam', 'Savage', '719-555-9899', '2021-02-23', 'Saucony', 'Ride', 'S2154-01', 'Slate', '92', 'Mike', 'no', '', '20% discount');
            
            UICtrl.addOrderItem(adamOrder);
//            try {
//                orderCtrl.sendToServer(adamOrder);
//            } catch (except) {
//                console.log(except);
//            }
//            
            
            // END DEBUG CODE
        }
    };
    
    
})(UIController, OrderController);

Main.init();


