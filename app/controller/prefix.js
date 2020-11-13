'use strict'

const { toPrefix } = require('../utils/prefix')

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
        const { status = 500, message = 'Internal Server Error'} = err;
        return res.status(status).send({
            ok: false,
            message
        })
    }
    
}

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