const yup = require('yup');

exports.validateLoginRequest = async (req, res, next) => {
    const schema = yup.object().shape({
        token: yup.string().required(),
    });

    try {
        await schema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json({error: error.errors});
    }
};

exports.validateOrderCreation = async (req, res, next) => {
    const schema = yup.object().shape({
        order_id: yup.string().required('No order id found'),
        tx_id: yup.string().required('No Tx id found'),
        status: yup.string().required('Status is required'),
    });

    try {
       await schema.validate(req.body);
       next(); 
    } catch (error) {
        res.status(400).json({error: error.errors});
    }

};

exports.validateClickSave = async (req, res, next) => {
    const schema = yup.object().shape({
        click_id: yup.string().required('click_id is required')
    });

    try {
       await schema.validate(req.body);
       next(); 
    } catch (error) {
        res.status(400).json({error: error.errors});
    }

};