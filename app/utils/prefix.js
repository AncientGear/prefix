/**
 * @description retorna el valor del operador
 * de acuerod a la jerarquÃ­a de operaciones
 * @param {operator} String que contiene el operador
 * a evaluar.
 * @returns {Int} valor segun la jerarquÃ­a 
 */
function hierarchy(operator) {
    let resp = 0;
    if(operator.match(/^[\(|\)]$/)){
        resp = 1;
    }else if( operator.match(/(^(?!.)*)(&&|\|\|)(?!.)/)){
        if (operator === '&&') {
            resp = 2.1;
        } else if (operator === '||') {
            resp = 2.2;
        }
    }else if( operator.match(/(^(?!.)*)(<|>|<=|>=|\!=|\=\=)(?!.)/)){
        resp = 3;
    }else if( operator.match(/^[\+|\-]$/)){
        resp = 4;
    }else if( operator.match(/^[\*|\/|\%]$/)){
        resp = 5;
    }else if( operator.match(/^[\=]$/)){
        resp = 0;
    }

    return resp;
}

/**
 * @description se enacarga de realizar el prefijo
 * @param {lexemes} Array con los lexemes
 * @return Array con el prefijo
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
    // console.log(results.map( item => item.lexeme).join(''));
    return results;
}

module.exports= {
    toPrefix
}