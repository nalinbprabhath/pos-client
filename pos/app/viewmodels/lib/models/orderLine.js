define(['./item'], function(item){
    var Item = item.Item;
   var OrderLine = function(Item){
        this.item = Item;
        this.quantity = 1;
        this.amount = Item.price * this.quantity;
   };
   return{
     OrderLine: OrderLine  
   };
});