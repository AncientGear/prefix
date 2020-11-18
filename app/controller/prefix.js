'use strict'

const { toPrefix } = require('../utils/prefix')

/**
 * @description the endpoint what transform the operations in prefix
 * @param {Object} req - object with all the info of the http request
 * @param {Object} res - object with all the info of the http response
 */
const getPrefix = (req, res) => {
    try{
        const body = req.body;
        const { lexemes } = body;

        if (!lexemes || lexemes.length === 0) {
            throw new Error({
                status: 400,
                message: 'Lexemes array dont was send'
            })
        }

        const prefixArray = getPrefixArr(lexemes);
        
        return res.status(200).json({
            data: {
                prefixArray
            },
            ok: true
        });

    } catch(err) {
        console.log(err);
        const { status = 500, message = 'Internal Server Error'} = err;
        return res.status(status).send({
            ok: false,
            message
        });
    }
    
}

/**
 * @description get all the lines and call a function what transform the line into prefix
 * @param {Array} lexemes 
 */
const getPrefixArr = (lexemes) => {
    let lex = [];
    let auxLexemes = [];
    let prefixArray = [];

    for(let i = 0; i < lexemes.length; i++) {
        lex = [];
        auxLexemes = [];
        while(lexemes[i] !== '\n') {
            auxLexemes.push(lexemes[i]);
            i++;
        }
        if(auxLexemes.length !== 0) {
            const resp = toPrefix(auxLexemes);
            prefixArray.push(resp);
        }
    }

    return prefixArray;
}


module.exports = {
    getPrefix
}