# Node.js Register API

This is a simple Node.js application that provides an API endpoint to handle register requests.

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js: You can download and install Node.js from [here](https://nodejs.org/).
- npm (Node Package Manager): This is included with Node.js.

To check if you have Node.js and npm installed, run:

```bash
node -v
npm -v
```

## Getting Started

Follow these steps to set up and run the application on your local machine:

1. Clone the Repository
   <br />If you haven't already, clone the repository to your local machine. For example:

```bash
git clone https://github.com/happyBanshee/aab-server.git
cd aab-server
```

2. Install Dependencies
   <br />In the project directory, run the following command to install the necessary dependencies:

```bash
npm install
```

This will install the required packages listed in package.json, including express.

3. Run the Server
   <br />After installing the dependencies, you can start the server using the following command:

```bash
npm run start
```

The server will start and listen on port 3000 by default. You should see a message like:

```bash
Server is running on http://localhost:3000
```

4. Test the API
   <br />You can now test the API using tools like Postman or curl. Below are the steps to test the register endpoint.
   ``
   Endpoint:
   POST /register

Example:

```bash
curl -X POST http://localhost:3000/register \
-H "Content-Type: application/json" \
-d '{"username": "myuser", "password": "Password123!", "email": "user@example.com"}'
```
