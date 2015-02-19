define([], function(){

var stringToColour = function(str) {

    // str to hash
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

    // int/hash to hex
    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

    return colour;
}

    var Category = function(name, items){
        this.name = name;
        this.color = stringToColour(this.name);
        this.setItems = function(items){
            if(!(items && items.length)){
                return;
            }
            for(var i = 0; i < items.length; i++){
                items[i].category = this;
            }
            this.items = items || [];
        }
        this.setItems(items);
//        this.toString = function(){
//            return this.name;
//        }
    };
    return{
        Category: Category
    };
});