define([], function(){
    var Item = function(name, price, category){
        this.name =  name;
        this.price = price || 0;
        this.categoryName  = category;
        this.category = null;
    };
    return{
        Item: Item  
    };
});