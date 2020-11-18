'use strict'

/**
 * @description transford the prefix into triplos
 * @param {Array} prefix are all the prefixes
 * @returns {Array} triplo its an array with the triplos
 */
const triplo = (prefix) => {
    try{
        let triplo = [];
        while(prefix.length > 0) {
            let line = prefix[0];
            let aux;
            if (line[0].id === 'OR') {
                aux = iterator(prefix, triplo.length);
            } else{
                aux = assignation(line);
            }
            
            triplo.push(aux);
            prefix.shift();
        }

        return triplo;
    } catch(err) {
        throw new Error(err);
    }
}

/**
 * @description travel all the parameters in the while and return the triplo
 * @param {Array} prefix - array of all the lines code
 * @param {Number} start - index when start the body of the while
 * @returns {Array} triplo - array with all the triplos inside the bucle while
 */
const iterator = (prefix, start) => {
    let end = start;
    let newTriplo = {};
    let operators = prefix.shift();
    let counter = 1;
    let counterCond = 1;
    let triplo = [];
    let auxOps = [];
    let op1, op2, op3;
    const context = operators[0].context;
    while(operators.length > 0) {
        op1 = operators.pop();
        console.log(op1);
        if(operators.length === 0) {
            const {triplos, body} = bodyWhile(prefix, context);

            triplo = triplo.concat(triplos);
            end = end + body.length;
        }

        if(op1.lexeme === '||') {
            const or1 = auxOps.shift();
            const or2 = auxOps.shift();
            const or3 = auxOps.shift();
            const or4 = auxOps.shift();

            or1.op = or4.pos;
            or2.op = or3.pos-1;
            or3.op = or4.pos;
            or4.op = end;
        } else if(op1.lexeme === '&&'){
            const or1 = auxOps.shift();
            const or2 = auxOps.shift();
            const or3 = auxOps.shift();
            const or4 = auxOps.shift();

            or1.op = or3.pos-1;
            or2.op = end;
            or3.op = or4.pos;
            or4.op = end;
        } else {
            op2 = operators.pop();
            op3 = operators.pop();
            newTriplo = {
                from: op1.lexeme,
                to: `T${counter}`,
                op: '='
            };
            triplo.push(newTriplo);
            counter++;
            end++;

            newTriplo = {
                from: op2.lexeme,
                to: `T${counter}`,
                op: '='
            };
            triplo.push(newTriplo);
            counter++;
            end++;

            newTriplo = {
                from: triplo[triplo.length-2].to,
                to: triplo[triplo.length-1].to,
                op: op3.lexeme
            };
            triplo.push(newTriplo);
            counter++;
            end++;

            newTriplo = {
                from: 'TRUE',
                to: `TR${counterCond}`,
                op: undefined,
                pos: triplo.length + 1
            }
            auxOps.push(newTriplo);
            triplo.push(newTriplo);
            end++;

            newTriplo = {
                from: 'FALSE',
                to: `TR${counterCond}`,
                op: undefined,
                pos: triplo.length + 1
            }
            auxOps.push(newTriplo);
            triplo.push(newTriplo);
            counterCond++;
            end++;
        }
        
        

    }

    return triplo;
}
/**
 * @description verify and run the body of the while
 * @param {Array} prefix - are all the lines in the code
 * @param {Number} context - its an flag to know when ends the while
 * @returns {Array} triplo - 
 */
const bodyWhile = (prefix, context) => {
    const body = [];
    const auxPrefix = {...prefix};
    let triplos = [];

    for(let i = 0; i < prefix.length; i++) {
        const token = auxPrefix.shift();

        if(token.context === context) {
            body.push(token);
        } else {
            break;
        }
    }
    
    triplos = assignation(body);
    prefix = auxPrefix;
    return {triplos, body};
}

/**
 * 
 * @param {Array} prefix - array what represents the line code
 * @return {Array} triplo - array with the tiplo of the line
 */

const assignation = (prefix) => {
    let auxs = [];
    let contador = 1;
    let triplo = [];
    let newTriplo = {};
    let nextOp;
    for(let i = prefix.length-1; i >= 0; i--) {
        let last = prefix[i];
        newTriplo = {
            from: last.lexeme,
            to: `T${contador}`,
            op: '='
        }
        triplo.push(newTriplo);
        auxs.push(newTriplo);
        prefix.splice(i, 1);
        i = prefix.length - 1;
        contador++;
        let before = prefix[i-1];
        if(before.id === 'ID') {
            for(let j = i-1; j >= 0; j--) {
                if(prefix[j].id === 'AS' || prefix[j].id === 'OA') {
                    nextOp = prefix[j];
                    prefix.splice(i, 1);
                    i = prefix.length - 1;
                    break;
                }
            }

            if(nextOp === 'AS') {
                newTriplo = {
                    from: auxs[0].to,
                    to: nextOp.lexeme,
                    op: nextOp.lexeme
                }
                triplo.push(newTriplo);
            } else {
                if (auxs.length > 1) {
                    for(let j = i-1; j >= 0; j--) {
                        if(prefix[j].id === 'OA') {
                            nextOp = prefix[j];
                            prefix.splice(i, 1);
                            i = prefix.length - 1;
                            break;
                        }
                    }
                    newTriplo = {
                        from: auxs[0].to,
                        to: auxs[1].to,
                        op: nextOp.lexeme
                    }
                    triplo.push(newTriplo);
                    auxs.splice(0,1);
                } else{
                    newTriplo = {
                        from: auxs[auxs.length - 1 ],
                        to: before.lexeme,
                        op: nextOp.lexeme
                    }

                    triplo.push(newTriplo);
                    prefix.splice(i, 1);
                    auxs.push(newTriplo);
                    i = prefix.length - 1;
                }
            }
        } else if(before.id === 'AS') {

        }
    }

    return triplo;
}

module.exports = {
    triplo
}