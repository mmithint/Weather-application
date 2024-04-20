const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

const app = express();
const port = 3000;
p.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const weatherApiKey = '056ed5b10da447ff84a712e2528e7712';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testing@gmail.com',
        pass: 'XXXX'
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/send-weather-email', async (req, res) => {
    const city = req.body.city;
    const email = req.body.email;

    try {
        
        const weatherResponse = await fetch(`http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city}`);
        const weatherData = await weatherResponse.json();

       
        const emailContent = `
            Current weather in ${city}:
            Temperature: ${weatherData.current.temp_c}°C
            Condition: ${weatherData.current.condition.text}
        `;

        
        const mailOptions = {
            from: 'your-email@example.com',
            to: email,
            subject: `Weather in ${city}`,
            text: emailContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send('An error occurred while sending the email.');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('Email sent successfully.');
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred.');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});