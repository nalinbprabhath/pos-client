define(['./lib/dataManager'], function(dataManager){
   var viewModel = function(){
//       alert('sss');
this.activeCategory  = null;
this.activeProduct  = null;
       this.activate = function(){
            return new Promise(function(resolve, reject){
                dataManager.initialize().then(function(message){                
                    this.categories = dataManager.getCategories();
                    if(this.categories[0]){
                        this.activeCategory = this.categories[0];
                        this.activeProduct = this.categories[0].products[0];
                    }
//                    this.activeProducts = this.categories[0].products;
//                    this.orderLines = dataManager.getOrderLines();
//                    this.order = dataManager.getOrder();
//                    this.getdate();
//                    alert(message);
                    resolve();
                }.bind(this));
            }.bind(this));
        };
        
        this.saveChanges = function(data){
            console.log(data);
            dataManager.saveChanges([data]).then(function(data){
                alert('success');
                for(var i=0;i<this.categories.length;i++){
                    if(data == this.categories[i]){
                        this.categories[i] = data;
                    }
                }
            }, function(e){
                alert('failed');
            });
        };
        
        this.saveProduct = function(data){
            dataManager.saveChanges([data]).then(function(data){
                alert('success');
                for(var i=0;i<this.categories.products.length;i++){
                    if(data == this.categories.products[i]){
                        this.categories.products[i] = data;
                    }
                }
            }, function(e){
                alert('failed');
            });
        };
        
        this.deleteCategory = function(data){
            var that = this;
            dataManager.deleteCategory(data).then(function(result){
                that.categories.remove(data);
                that.activeCategory  = that.categories[0];
                that.activeProduct  = that.categories[0].products[0];
//          }.bind(this), function(e){
            }, function(e){
                alert('failed');
            });;
            
        };
        
        this.deleteProduct = function(data){
            var that = this;
            dataManager.deleteProduct(data).then(function(result){
                that.activeCategory.products.splice(that.activeCategory.products.indexOf(data), 1);
                if(that.activeCategory.products[0]){
                    that.activeProduct = that.activeCategory.products[0];
                }else{
                    that.activeProduct = null;
                }
//                alert('success');
            }, function(e){
                alert('failed');
            });
            
        };
        
        this.addCategory = function(){
            var newCategory = dataManager.addCategory();
            this.categories.push(newCategory);
            this.setCategory(newCategory);
        };
        
        this.addProduct = function(){
            var newProduct = dataManager.addProduct();
            this.categories[this.categories.indexOf(this.activeCategory)].products.push(newProduct);
            this.setProduct(newProduct);
        };
        
        this.setCategory = function(data){
            this.activeCategory = data;
            if(this.activeCategory.products[0]){
                this.activeProduct = this.activeCategory.products[0];
            }else{
                this.activeProduct = null;
            }
        };
        this.setProduct = function(data){
            this.activeProduct = data;
            if(this.activeProduct.products[0]){
                this.activeProduct = this.activeProduct.products[0];
            }else{
                this.activeProduct = null;
            }
        };
        
        this.setProduct = function(data){
            this.activeProduct = data;
        };
   };
   return viewModel;
});