# Backend for YAWN Presale Widget

Welcome to the backend repository! This project is designed to provide a scalable and secure backend solution for the YAWN presale widget application. It integrates Web3Auth for user authentication, Wert for order processing & management, and CoinMarketCap API for fetching token stats.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication with Web3Auth
- Integration with Wert for order management
- Webhook handling for real-time order updates
- Fetching cryptocurrency stats from CoinMarketCap
- Route-level authentication for protected routes
- Error handling middleware for consistent API responses

## Technologies

This backend is built using:

- Node.js
- Express.js
- MongoDB Atlas for database management
- Yup for request validation
- Axios for API integration

## Project Structure
```
yawn-backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── repositories/
│   ├── services/
│   ├── utils/
│   ├── webhooks/
│   └── app.js
├── server.js
├── .env
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v14 or later)
- MongoDB Atlas account
- Access to the CoinMarketCap API (optional)

### Installation

1\. Clone the repository:

```bash
git clone git@github.com/yawn-widget-backend.git

cd yawn-backend
```
2\. Install the dependencies:
```bash
npm install
```

3\. Set up your environment variables. Rename .env.example file to .env file in the root directory and update its value. Some of them are mentioned below for reference:

```plaintext
PORT=3000
MONGODB_URI=your_mongodb_connection_string
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
WEB3AUTH_JWKS_URL=https://api.openlogin.com/jwks
```
4\. Start the server:

```bash
npm run start
```
The server should be running on http://localhost:3000.

## API Endpoints
> For detailed API documentation, you can [click here](link_to_your_postman_documentation) to view the Postman API documentation.

### User Management

- **POST** `/api/user`
  - Description: Save Web3Auth user information.

- **GET** `/api/user`
  - Description: Returns user information.

- **POST** `/api/user/click`
  - Description: Save & Map Wert click ID with user.

- **GET** `/api/user/click/:click_id`
  - Description: Returns user-click mapping.

### Order Management

- **POST** `/api/order`
  - Description: Creates a new order.

- **GET** `/api/order/users`
  - Description: Fetches all orders for a user.

- **GET** `/api/order/:order_id`
  - Description: Fetches a specific order by ID.

### Token Stats

- **GET** `/api/cmc`
  - Description: Fetches cryptocurrency stats from CoinMarketCap.


## Error Handling
All API responses will include a standardized error message and status code. Unhandled errors will be caught and sent back as a response instead of exiting the service.

## Contributing
Contributions are welcome! If you have suggestions or improvements, please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
