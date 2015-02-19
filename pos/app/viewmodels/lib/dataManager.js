define(['./models/item', './models/category','./models/orderLine', './models/order', 'breeze'], function(item, category ,orderLine, order, breeze){
    
//    var serviceUrl = 'http://rpos.susta.co/posserver/web/app_dev.php/common/api';
//    var serviceUrl = 'http://localhost:81/breeze.demo-master/index.php';
    var serviceUrl = 'http://localhost:81/symfony/myproject/web/app_dev.php/api';
    var entityManager = new breeze.EntityManager(serviceUrl);
    
    var Item = item.Item;
    var Category = category.Category;
    var OrderLine = orderLine.OrderLine;
    var Order = order.Order;
    var dataManager = {};
    dataManager.items = [];
    dataManager.categories = [
        new Category('Biriyani',[
            new Item('Chicken Biriyani', 100),
            new Item('Mutton Biriyani', 150),
            new Item('Fish Biriyani', 200)
        ]),
        new Category('Lunch',[
            new Item('Vegetable rice & curry', 110),
            new Item('Chicken rice & curry', 160),
            new Item('Fish rice & curry', 130)
        ]), 
        new Category('Curry',[
            new Item('Babath curry', 40),
            new Item('Chickencurry', 60),
            new Item('Fish curry', 30),
            new Item('Seman curry', 30),
            new Item('Dhal curry', 20)
            
        ]),
        new Category('Short Eats',[
            new Item('Fish roll', 30),
            new Item('Samosa', 20),
            new Item('Pan cake', 20),
            new Item('Chicken roll', 40),
            new Item('Tea bun', 30)
        ])];
    
    dataManager.orderLines = [
        
    ];
    
//    dataManager.total = 0;
    dataManager.calculateTotal = function(){
        dataManager.total = 0;
        for(i=0; i<dataManager.orderLines.length;i++){
            dataManager.total = dataManager.total + dataManager.orderLines[i].amount;
        }
        return dataManager.total;
    };
    
    
    
    dataManager.addItem = function(itemName){
        dataManager.items.push(new Item(itemName));
    };
    dataManager.getItems = function(){
        return dataManager.items;
    };
    dataManager.getCategories = function(){
        return dataManager.categories;
    };
    dataManager.getOrderLines = function(){
        return dataManager.orderLines;
    };
    
    dataManager.order = {};
    dataManager.getOrder = function(){
        dataManager.totals = dataManager.calculateTotal();
        dataManager.order = new Order(dataManager.orderLines, dataManager.totals);
        return dataManager.order;
    };
    
    
    dataManager.getCategory = function(categoryName){
        for(i=0;i<dataManager.categories.length;i++){
            if(dataManager.categories[i].name == categoryName){
                console.log('gggg',dataManager.categories[i]);
                return dataManager.categories[i];
            }
        }
    };
    
    dataManager.addOrderLine = function(item){
        dataManager.count = 0;
        for(i=0;i<dataManager.orderLines.length;i++){
            if(dataManager.orderLines[i].item.name == item.name){
                dataManager.orderLines[i].quantity++;
                dataManager.orderLines[i].amount = dataManager.orderLines[i].amount + item.price;
                dataManager.count++;
            }
            
        }
        if(dataManager.count==0){
            dataManager.orderLines.push(new OrderLine(item));
        }
        dataManager.count = 0;
        
        dataManager.totals = dataManager.calculateTotal();
        dataManager.order = new Order(dataManager.orderLines, dataManager.totals);
        
        return dataManager.orderLines;
        
    };
    
    dataManager.fetchItems = function(){
        var query = new breeze.EntityQuery().from('Categories')
                .expand('products');
        return entityManager.executeQuery(query);
    }
    
    dataManager.initialize = function(){
        return new Promise(function(resolve, reject){
            dataManager.fetchItems().then(function(data){
                dataManager.categories = data.results;
                resolve();
            });
        });
    }
    dataManager.initializeOLD = function(){
        return new Promise(function(resolve, reject){
            resolve(); return;
            this.fetchItems().then(function(data){
                var products = data.results;
                var categoriesMap = {};
                for(var i = 0; i < products.length; i++){
                    var catName = products[i].productCategories[0] && products[i].productCategories[0].category.name;
                    var color = products[i].productCategories[0] && products[i].productCategories[0].category.color;
                    if(!catName){
                        continue;
                    }
                    if(!categoriesMap[catName]){
                        categoriesMap[catName] = new Category(catName);
                        categoriesMap[catName].color = color;
                    }
                    var item = new Item(products[i].name, products[i].unitPrice);
                    item.category = categoriesMap[catName];
                    if(!item.category.items){
                        item.category.items = [];
                    }
                    item.category.items.push(item);
                }  
                var categories = [];
                for(var catName in categoriesMap){
                    categories.push(categoriesMap[catName]);
                }
                console.log('ALL Categories', categories);
                dataManager.categories = categories;
                resolve();
            }.bind(this), function(error){
                alert(error);
            });
        }.bind(this));
    };
    
    dataManager.saveChanges = function(data){
        return entityManager.saveChanges(data);
    };
    
    dataManager.deleteCategory = function(category){
        category.entityAspect.setDeleted();
        return dataManager.saveChanges([category]);
    };
    
    dataManager.deleteProduct = function(product){
        product.entityAspect.setDeleted();
        return dataManager.saveChanges([product]);
    };
    
    dataManager.deleteProducts = function(products){
        alert('fgfgfg');
       
        return dataManager.saveChanges(products);
    };
    
    dataManager.addCategory = function(){
        return entityManager.createEntity('Category');
    };
    
    dataManager.addProduct = function(){
        return entityManager.createEntity('Product');
    };
    
    return dataManager;
});