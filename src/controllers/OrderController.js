const {BadRequest, NotFound, isHttpError, InternalServerError, Conflict} = require('http-errors');
const orderService = require('../services/orderService');
const userService = require('../services/userService');
//const klaviyoService = require('../services/klaviyoService');

const MailService = require('../services/mailService');
const mailService = new MailService(process.env.MAILGUN_API_KEY, 'yawnsworld.com');

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

    sendTransactionReceipt: async (req, res, next) => {
        const {order_id, email} = req.body;
        try {

            const order = await orderService.getOrderById(order_id);
            if(!order){
                throw new NotFound("Order Not Found");
            }

            if(order.txReceipt){
                throw new Conflict(`Already sent to ${order.email}`);
            }

            const emailHtml = mailService.generateTransactionReceiptEmail({
                transactionId: order.crypto.txHash,
                date: new Date().toLocaleDateString(),
                amount: order.toToken.tokenAmount,
                token: '$YAWN',
                toAddress: order.toToken.walletAddress,
                totalPaid: order.amount,
                currency: order.currency,
                totalFee: order.fee,
                blockchainLink: `https://etherscan.io/tx/${order.crypto.txHash}`,
            });

            await mailService.sendEmail({
                to: email,
                subject: 'Your Transaction Receipt',
                html: emailHtml,
            });

            await orderService.saveOrder({
                txReceipt: true,
                email: email
            }, order_id);
            res.status(200).json({message: "Transaction receipt sent"});
        } catch (error) {
            if(isHttpError(error)) next(error);
            else next(new InternalServerError('Something Went Wrong'));
        }
        
    },
};

module.exports = ctrl;