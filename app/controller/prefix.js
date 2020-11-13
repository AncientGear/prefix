'use strict'

const { toPrefix } = require('../utils/prefix')

const getPrefix = (req, res) => {
    try{
        const body = req.body;
        const { lexemes } = body;
        const prefixArray = getPrefixArr(lexemes);
        
        return res.status(200).json({
            data: {
                prefixArray
            },
            ok: true
        });
    } catch(err) {
        console.log(err);
        return res.status(500).send({
            ok: false,
            message: 'Internal Server Error'
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