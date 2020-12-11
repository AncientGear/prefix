'use strict'

/**
 * @description transford the prefix into triplos
 * @param {Array} prefix are all the prefixes
 * @returns {Array} triplo its an array with the triplos
 */
const triplo = (prefix) => {
    try {
        let triplo = [];
        while (prefix[0].length > 0) {
            let line = prefix[0];
            let aux;
            if (line[0].id === 'OR') {
                aux = iterator(prefix, triplo.length);
            } else {
                aux = assignation(line);
            }

            triplo = triplo.concat(aux);
            prefix.shift();
            if(prefix.length === 0) break;
        }
        return triplo;
    } catch (err) {
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
    let triplos;
    while (operators.length > 0) {
        op1 = operators.pop();
        if (operators.length === 0) {
            const resp = bodyWhile(prefix, context);
            
            triplos = resp.triplos;
            prefix = resp.prefix;
            triplo = triplo.concat(triplos);
            end = end + triplos.length;
            newTriplo = {
                from: 'JMP',
                to: '',
                op: start,
                id: 'JMP'
            }
            triplo.push(newTriplo);
            end++;

            if (op1.lexeme === '||') {
                const or1 = auxOps.shift();
                const or2 = auxOps.shift();
                const or3 = auxOps.shift();
                const or4 = auxOps.shift();

                or1.op = or4.pos + 1;
                or2.op = or2.pos + 1;
                or3.op = or4.pos + 1;
                or4.op = end;
            } else if (op1.lexeme === '&&') {
                const or1 = auxOps.shift();
                const or2 = auxOps.shift();
                const or3 = auxOps.shift();
                const or4 = auxOps.shift();

                or1.op = or1.pos+2;
                or2.op = end;
                or3.op = or4.pos+1;
                or4.op = end;
            }
        } else {
            op2 = operators.pop();
            op3 = operators.pop();
            newTriplo = {
                from: op1.lexeme,
                to: `T${counter}`,
                op: '=',
                id: 'AS'
            };
            triplo.push(newTriplo);
            counter++;
            end++;

            newTriplo = {
                from: op2.lexeme,
                to: `T${counter}`,
                op: '=',
                id: 'AS'
            };
            triplo.push(newTriplo);
            counter++;
            end++;
            newTriplo = {
                from: triplo[triplo.length - 2].to,
                to: triplo[triplo.length - 1].to,
                op: op3.lexeme,
                id: op3.id
            };
            triplo.push(newTriplo);
            end++;

            newTriplo = {
                from: 'TRUE',
                to: `TR${counterCond}`,
                op: undefined,
                pos: end,
                id: 'TR'
            }
            auxOps.push(newTriplo);
            triplo.push(newTriplo);
            end++;
            newTriplo = {
                from: 'FALSE',
                to: `TR${counterCond}`,
                op: undefined,
                pos: end,
                id: 'TR'
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
    const auxPrefix = [...prefix];
    let triplos = [];
    for (let i = 0; i < prefix.length; i++) {
        const token = auxPrefix[0];
        if (token[0].context === context && token.id !== 'OR') {
            body.push(token);
            auxPrefix.slice(0, 1);
        } else {
            break;
        }
    }

    for (let i = 0; i < body.length; i++) {
        const resp = assignation(body[i]);

        triplos = triplos.concat(resp);
    }

    prefix = auxPrefix;
    return { triplos, prefix };
}

/**
 * 
 * @param {Array} prefix - array what represents the line code
 * @return {Array} triplo - array with the tiplo of the line
 */
const assignation = (prefix) => {
    let auxs = [];
    let cont = 0;
    let newTriplo = {};
    let triplo = [];
    let band = true;

    prefix = prefix.reverse();

    console.log(prefix);

    while (prefix.length !== 0 && band) {
        let operator1 = 0, operator2 = 0, operating = 0;
        for (let i = 0; i < prefix.length; i++) {
            if (prefix[i].id === 'OA') {
                operating = prefix[i];
                operator1 = prefix[i - 1] || undefined;
                operator2 = prefix[i - 2] || undefined;

                prefix.splice(i, 1);
                if (operator1 !== undefined) {
                    prefix.splice(i - 1, 1);
                }

                if (operator2 !== undefined) {
                    prefix.splice(i - 2, 1);
                }
                break;
            } else if (prefix[i].id === 'AS') {
                operating = prefix[i];
                operator1 = prefix[i - 1] || undefined;
                prefix.splice(i, 1);
                if (operator1 !== undefined) {
                    prefix.splice(i - 1, 1);
                }
                break;
            }
        }
        if (operating.id === 'OA') {
            if (operator1 !== undefined && operator2 === undefined) {
                cont++;
                newTriplo = {
                    from: operator1.lexeme,
                    to: `T${cont}`,
                    op: '=',
                    id: 'AS'
                }
                triplo.push(newTriplo);
                const lastOp = auxs.pop();

                newTriplo = {
                    from: lastOp.to,
                    to: `T${cont}`,
                    op: operating.lexeme,
                    id: operating.id
                }
                triplo.push(newTriplo);
                auxs.push(newTriplo);
            } else if (operator1 !== undefined && operator2 !== undefined) {
                cont++;

                newTriplo = {
                    from: operator1.lexeme,
                    to: `T${cont}`,
                    op: '=',
                    id: 'AS'
                }
                triplo.push(newTriplo);

                newTriplo = {
                    from: operator2.lexeme,
                    to: `T${cont}`,
                    op: operating.lexeme,
                    id: operating.id
                }
                triplo.push(newTriplo);
                auxs.push(newTriplo);
            }
        } else if (operating.id === 'AS') {
            const aux = auxs.pop();
            if (aux) {
                newTriplo = {
                    from: aux.to,
                    to: operator1.lexeme,
                    op: operating.lexeme,
                    id: operating.id
                }
                triplo.push(newTriplo);
            } else {
                operator2 = prefix.pop();
                newTriplo = {
                    from: operator2.lexeme,
                    to: `T${cont}`,
                    op: '=',
                    id: 'AS'
                }

                triplo.push(newTriplo);
                cont++;

                newTriplo = {
                    from: operator1.lexeme,
                    to: operator2.lexeme,
                    op: operating.lexeme,
                    id: operating.id
                }

                triplo.push(newTriplo);
            }
            band = false;
        }
    }


    return triplo;
}

module.exports = {
    triplo
}