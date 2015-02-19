/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['knockout'], function (ko) {
    var clickViewmodel = function(){
        this.textResult = ko.observable('');
        this.operand1 = ko.observable();
        this.operand2 = ko.observable();
        this.operator = ko.observable();
        this.result = ko.observable();
        this.equalSymbol = ko.observable([
            {value: '='}
        ]);
        this.row1 = ko.observableArray([
            {value: 7},{value: 8},{value: 9},{value: '/'}
        ]);
        this.row2 = ko.observableArray([
            {value: 4},{value: 5},{value: 6},{value: '*'}
        ]);
        this.row3 = ko.observableArray([
            {value: 1},{value: 2},{value: 3},{value: '-'}
        ]);
        this.row4 = ko.observableArray([
            {value: 'C'},{value: 0},{value: '.'},{value: '+'}
        ]);
        
        this.one = function(value){
            var lastChar = this.textResult().slice(-1);
            if(value == '+' || value == '-' || value == '*' || value == '/' ){
                if(lastChar == '+' || lastChar == '-' || lastChar == '*' || lastChar == '/' || lastChar == '' || lastChar == '.'){
                    return;
                }else{
                    if(ko.utils.unwrapObservable(this.operator()) == null){
                        this.operator(value);
                        this.operand1(parseFloat(this.textResult()));
                        this.textResult(this.textResult() + value);
                    }else{
                        this.operand2(parseFloat(this.textResult().split(this.operator())[1]));
                        switch(this.operator()){
                            case '+' :
                                this.result(this.operand1() + this.operand2());
                                break;
                            case '-':
                                this.result(this.operand1() - this.operand2());
                                break;
                            case '*':
                                this.result(this.operand1() * this.operand2());
                                break;
                            case '/':
                                this.result(this.operand1() / this.operand2());
                                break;
                        }
                        this.textResult(this.result().toString() + value);
                        this.operator(value);
                        this.operand1(parseFloat(this.result().toString()));
                        this.operand2(null);
                    }
                    
                }
            }else{
                if(value == 'C'){
                    var oldText = this.textResult();
                    this.textResult(oldText.substr(0,oldText.length-1));
                    if(lastChar == '+' || lastChar == '-' || lastChar == '*' || lastChar == '/'){
                        this.operator(null);
                    }
                }else{
                    if(value == '='){
                        alert('dd');
                        if(ko.utils.unwrapObservable(this.operand2()) != null){
                            return;
                        }else{
                            this.operand2(parseFloat(this.textResult().split(this.operator())[1]));
                            switch(this.operator()){
                                case '+' :
                                    this.result(this.operand1() + this.operand2());
                                    break;
                                case '-':
                                    this.result(this.operand1() - this.operand2());
                                    break;
                                case '*':
                                    this.result(this.operand1() * this.operand2());
                                    break;
                                case '/':
                                    this.result(this.operand1() / this.operand2());
                                    break;
                            }
                            this.textResult(this.result().toString());
                            this.operator(null);
                            this.operand1(null);
                            this.operand2(null);
                        }
                    }else{
                        if(value == '.'){
                            if(lastChar == '+' || lastChar == '-' || lastChar == '*' || lastChar == '/' || lastChar == '' || lastChar == '.'){
                                return;
                            }else{
                                if(ko.utils.unwrapObservable(this.operator()) == null){
                                    if(this.textResult().indexOf('.') == -1){
                                        this.textResult(this.textResult()+value);
                                    }
                                }else{
                                    var operatorIndex = this.textResult().indexOf(this.operator());
                                    if(this.textResult().indexOf('.',operatorIndex) == -1){
                                        this.textResult(this.textResult()+value);
                                    }
                                }
                                
                                
                            }
                        }else{
                            if(value == '0'){
                                if(ko.utils.unwrapObservable(this.operator()) == null && this.textResult().length == 1 && parseInt(this.textResult().charAt(0)) == 0 ){
                                    return;
                                }else{
                                    if(ko.utils.unwrapObservable(this.operator()) != null){
                                        var operatorIndex = this.textResult().indexOf(this.operator());
                                        if(this.textResult().length == operatorIndex+1){
                                            this.textResult(this.textResult()+value);
                                        }else{
                                            if(this.textResult().length == operatorIndex+2 && parseInt(this.textResult().charAt(operatorIndex+1)) == 0){
                                                return;
                                            }
                                        }
                                        
                                    }else{
                                        this.textResult(this.textResult() + value);
                                    }
                                }
                            }else{
                                this.textResult(this.textResult() + value);   
                            }
                            
                        }
                    }
                }
            }
        };
    };
    return clickViewmodel;
});