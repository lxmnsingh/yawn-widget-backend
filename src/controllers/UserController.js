const { BadRequest, NotFound, InternalServerError, isHttpError } = require('http-errors');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const clickService = require('../services/clickService');
const klaviyoService = require('../services/klaviyoService');

const ctrl = {
    saveUser: async (req, res, next) => {
        try {
            // user data from the web3auth
            const web3AuthUser = req.user;
            // prepare user object to store in mongodb
            const userObj = {
                verifierId: web3AuthUser.verifierId,
                email: web3AuthUser?.email,
                name: web3AuthUser?.name,
                phone: web3AuthUser?.phone,
            }
            const user = await userService.saveUser(userObj);
            klaviyoService.subscribeUserToList(user);
            res.status(200).json({ message: "User saved", user });
        } catch (error) {
            if (isHttpError(error)) next(error);
            else next(new InternalServerError('Something Went Wrong'));
        }
    },

    getUser: async (req, res, next) => {
        const verifierId = req.user?.verifierId;
        const user = await userService.getUserByVerifierId(verifierId);
        if (!user) throw new NotFound("User Not Found");
        res.status(200).json({ message: "User fetched", user });
    },

    saveClick: async (req, res, next) => {
        try {
            const verifierId = req.user?.verifierId;
            const user = await userService.getUserByVerifierId(verifierId);
            if (!user) throw new NotFound("User Not Found");

            const {click_id} = req.body;
            const click = await clickService.saveClick({
                click_id:click_id, 
                userId: user._id
            }, click_id);
            res.status(200).json({ click });
        } catch (error) {
            if (isHttpError(error)) next(error);
            else next(new InternalServerError('Something Went Wrong'));
        }
    },

    getClick: async (req, res, next) => {
        try {
            const verifierId = req.user?.verifierId;
            const user = await userService.getUserByVerifierId(verifierId);
            if (!user) throw new NotFound("User Not Found");

            const { click_id } = req.params;
            const click = await clickService.getClick(click_id);
            res.status(200).json({ click });
        } catch (error) {
            if (isHttpError(error)) next(error);
            else next(new InternalServerError('Something Went Wrong'));
        }
    },
};

module.exports = ctrl;