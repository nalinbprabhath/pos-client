define([], function(){
    var Item = function(name, price){
        this.name = name;
        this.price = price || 0;
//        fgf = f(){}
    }
    return {
        Item: Item
    }
});