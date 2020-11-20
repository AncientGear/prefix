'use strict'

const { triplo } = require('../utils/triplo');

/**
 * 
 * @param {Object} req - object with all the info of the http request
 * @param {Object} res - object with all the info of the http response
 */
const getTriplo = (req, res) => {

    try{
        const body = req.body;
        const { prefix } = body;
        const triploArr = triplo(prefix);
        console.log('3');
        return res.status(200).send({
            ok: true,
            triploArr
        })
    } catch (err){
        console.log(err);
        const { status = 500, message = 'Internal Server Error'} = err;
        return res.status(status).send({
            ok: false,
            message
        });
    }

}

module.exports = {
    getTriplo
}