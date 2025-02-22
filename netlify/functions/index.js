import express from 'express';

// Create an instance of Express
const app = express();

// Simple "Hello World" endpoint
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Export the handler for Netlify
export default (req, res) => {
    app(req, res); // Pass the request and response to the express app
};
