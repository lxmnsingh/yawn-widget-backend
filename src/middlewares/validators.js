const yup = require('yup');

exports.validateLoginRequest = async (req, res, next) => {
  const schema = yup.object().shape({
    token: yup.string().required(),
  });

  try {
    await schema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
};

exports.validateOrderCreation = async (req, res, next) => {
  const schema = yup.object().shape({
    userId: yup.string().required('User ID is required'),
    click_id: yup.string().required('Click ID is required'),

    fromToken: yup.object({
      tokenAddress: yup.string().required('fromToken.tokenAddress is required'),
      walletAddress: yup.string().required('fromToken.walletAddress is required'),
      tokenAmount: yup.string().required('fromToken.tokenAmount is required'),
      chainId: yup.number().required('fromToken.chainId is required'),
      tokenSymbol: yup.string().required('fromToken.tokenSymbol is required'),
    }).required('fromToken is required'),

    toToken: yup.object({
      tokenAddress: yup.string().required('toToken.tokenAddress is required'),
      walletAddress: yup.string().required('toToken.walletAddress is required'),
      tokenAmount: yup.string().required('toToken.tokenAmount is required'),
      chainId: yup.number().required('toToken.chainId is required'),
      tokenSymbol: yup.string().required('toToken.tokenSymbol is required'),
    }).required('toToken is required'),

    amount: yup.number().required('Total amount is required'),
    fee: yup.number().required('Fee is required'),
    currency: yup.string().required('Currency is required'),
    paymentMethod: yup
      .string()
      .oneOf(['yawn', 'metamask', 'walletconnect', 'stripe'], 'Invalid payment method')
      .required('Payment method is required'),

    status: yup
      .string()
      .oneOf(['pending', 'completed', 'failed'], 'Invalid order status')
      .default('pending'),

    errorReason: yup.string().nullable(),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
}

exports.validateSendTransactionReceipt = async (req, res, next) => {
  const schema = yup.object().shape({
    order_id: yup.string().required('Order ID is required'),
    email: yup.string().required('Email is required').email('Invalid email'),

  });

  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors });
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
    res.status(400).json({ error: error.errors });
  }

};