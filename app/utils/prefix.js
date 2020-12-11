/**
 * @description return the value of the operation
 * based in the hierarchy
 * @param {String} operator - it's the operator
 * to evaluate
 * @returns {Int} value based in the hierarchy
 */
function hierarchy(operator) {
    let resp = 0;
    if(operator.match(/^[\(|\)]$/)){
        resp = 1;
    }else if( operator.match(/(^(?!.)*)(&&|\|\|)(?!.)/)){
        resp = 2;
    }else if( operator.match(/(^(?!.)*)(<|>|<=|>=|\!=|\=\=)(?!.)/)){
        resp = 3;
    }else if( operator.match(/^[\+|\-]$/)){
        resp = 4;
    }else if( operator.match(/(^(?!.)*)(\*|\/|\%)(?!.)/)){
        resp = 5;
    }else if( operator.match(/^[\=]$/)){
        resp = 0;
    }

    return resp;
}

/**
 * @description - 
 * @param {Array} lexemes array with the lexemes
 * @return {Array} results - Array with the prefix  
 */

function toPrefix(lexemes) {
    let stackTemp = [], stack = [];
    for(let index = lexemes.length -1; index >= 0; index--) {
        const lex = lexemes[index].lexeme;
        const token = lexemes[index].id;
        if(lex === ')') {
            stackTemp.push(lexemes[index]);
        }else if(lex === '(') {
            let temp = stackTemp.pop();
            while(temp && temp.lexeme !== ')'){
                stack.push(temp);
                temp = stackTemp.pop();
            }
        }else if(token === 'OA' || token === 'OR' || token === 'AS'){
            while(stackTemp.length !== 0 && hierarchy(lex) < hierarchy(stackTemp[stackTemp.length-1].lexeme)){
                stack.push(stackTemp.pop());
            }
            stackTemp.push(lexemes[index]);
        }else if(!lex.match(/\;|(while)|\{|\)/) && token !== 'TD'){
            stack.push(lexemes[index]);
        }
    }
    while(stackTemp.length !== 0){
        let index = stackTemp.pop();
        index !== ')' && stack.push(index);
    }
    let results = stack.reverse();

    return results;
}

module.exports= {
    toPrefix
}