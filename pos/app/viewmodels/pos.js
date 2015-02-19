define(['./lib/dataManager'], function(dataManager){

    var posViewmodel = function(){
        
        this.categories = [];
        
        this.showItemlist = [];
        this.selectedCategoryName = null;
        this.category = null;
        this.orderLines = [];
        this.order = null;
        this.todayDate = null;
        
        this.getdate = function(){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            var hour = today.getHours();
            var minute = today.getMinutes();
            if(dd<10) {
                dd='0'+dd
            } 
            
            if(mm<10) {
                mm='0'+mm
            } 
            if(hour >= 12){
                var state = 'pm';
            }else{
                var state = 'am';
            }
            this.todayDate = yyyy+'/'+mm+'/'+dd+' '+hour+':'+minute+' '+state; 
            return this.todayDate;
        }
        
        this.activate = function(){
//             console.log('ddddddd');
            return new Promise(function(resolve, reject){
                dataManager.initialize().then(function(message){                
                    this.categories = dataManager.getCategories();   
                    this.selectedCategoryName = this.categories[0].name;
                    this.category = dataManager.getCategory(this.categories[0].name);
//                    this.products = dataManager.getProducts();
                    this.orderLines = dataManager.getOrderLines();
                    this.order = dataManager.getOrder();
                    this.getdate();
//                    alert(message);
                    resolve();
                }.bind(this));
            }.bind(this));
        };
        
        this.setCategory = function(categoryName){
            this.selectedCategoryName = categoryName;
            this.category = dataManager.getCategory(categoryName);
        };
        
        this.addOrderLine = function(item){
            this.orderLines = dataManager.addOrderLine(item);
            this.order = dataManager.getOrder();
        };
        
    };
    return posViewmodel;
});