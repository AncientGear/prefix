'use strict';

const config = require('./app/config/env');

const app = require('./app');

try{
    console.log(config);
    app.listen(config.port, () => console.log('Server online in port', config.port));
} catch(err) {
    console.log(err);
}