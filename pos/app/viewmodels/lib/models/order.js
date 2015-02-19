define([], function(){
    var Order = function(orderLines, total){
        this.orderLines = orderLines;
        this.total = total;
    };
    return {
        Order: Order
    };
});