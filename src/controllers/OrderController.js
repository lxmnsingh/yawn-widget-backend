const {BadRequest, NotFound, isHttpError, InternalServerError} = require('http-errors');
const orderService = require('../services/orderService');
const userService = require('../services/userService');
const klaviyoService = require('../services/klaviyoService');

const ctrl = {
    saveOrder: async (req, res, next) => {
        try {
            const orderData = req.body;
            const user = await userService.getUserByVerifierId(req.user.verifierId);
            if(!user) throw new NotFound('No user found');
    
            const createdOrder = await orderService.saveOrder(orderData, user._id);
            if(orderData.status==='success') await klaviyoService.updateSceneraioToProfile(user, "SuccessfulPurchase");
            if(orderData.status==='failed') await klaviyoService.updateSceneraioToProfile(user, "FailedPurchase");
            res.status(200).json(createdOrder);
        } catch (error) {
            if(isHttpError(error)) next(error);
            else next(new InternalServerError('Something Went Wrong'));
        }
    },
    
    getUserOrders: async (req, res, next) => {
        try {
            const user = await userService.getUserByVerifierId(req.user.verifierId);
            if(!user) throw new NotFound('No user found');
    
            const orders = await orderService.getUserOrders(user._id);
            res.status(200).json({message: "Orders fetched", orders});
        } catch (error) {
            if(isHttpError(error)) next(error);
            else next(new InternalServerError('Something Went Wrong'));
        }
    }
};

module.exports = ctrl;