const {BadRequest, NotFound, isHttpError, InternalServerError} = require('http-errors');
const orderService = require('../services/orderService');
const userService = require('../services/userService');
//const klaviyoService = require('../services/klaviyoService');

const ctrl = {
    saveOrder: async (req, res, next) => {
        try {
            const orderData = req.body;
            /** this is discontinued since we're not using Web3Auth now

            const user = await userService.getUserByVerifierId(req.user.verifierId);
            if(!user) throw new NotFound('No user found');
             */
    
            const createdOrder = await orderService.saveOrder(orderData, orderData.click_id);
            //if(orderData.status==='success') await klaviyoService.updateSceneraioToProfile(user, "SuccessfulPurchase");
            //if(orderData.status==='failed') await klaviyoService.updateSceneraioToProfile(user, "FailedPurchase");
            res.status(200).json(createdOrder);
        } catch (error) {
            if(isHttpError(error)) next(error);
            else next(new InternalServerError('Something Went Wrong'));
        }
    },
    
    getUserOrders: async (req, res, next) => {
        try {
            //const user = await userService.getUserByVerifierId(req.user.verifierId);
            //if(!user) throw new NotFound('No user found');

            const {userId} = req.params;
            const orders = await orderService.getUserOrders(userId);
            res.status(200).json({message: "Orders fetched", orders});
        } catch (error) {
            if(isHttpError(error)) next(error);
            else next(new InternalServerError('Something Went Wrong'));
        }
    },

    getOrderById: async (req, res, next) => {
        const {order_id} = req.params;
        const order = await orderService.getOrderById(order_id);
        res.status(200).json({order});
    },
};

module.exports = ctrl;