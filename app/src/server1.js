const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/my-login-db', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    console.log('Login endpoint hit');  // Log to verify endpoint is hit
    try {
        const user = await User.findOne({ email: req.body.email });
        console.log('User found:', user);  // Log the user details
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            const responseMessage = { message: 'User logged in', redirectUrl: '/landing' };
            console.log('Response message:', responseMessage);  // Log the response message
            res.status(200).json(responseMessage);
        } else {
            console.log('Invalid credentials');  // Log invalid credentials
            res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in user', error);  // Log any errors
        res.status(400).json({ error: 'Error logging in user' });
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});