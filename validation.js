const joi = require('@hapi/joi');

const createValidation = data =>{
    const schema = {
        userName: joi.string().min(6).required(),
        password: joi.string().min(6).required(),
        email: joi.string().min(6).required().email()
    }

    return joi.validate(data, schema);
}

const loginValidation = data =>{
    const schema = {
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required()
    }

    return joi.validate(data, schema);
}

module.exports.createValidation = createValidation;
module.exports.loginValidation = loginValidation;
