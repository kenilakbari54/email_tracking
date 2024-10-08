const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv')
const app = express();
env.config()
// Connect to MongoDB (use your own MongoDB connection string)
mongoose.connect(process.env.MONGO);

// Define schema for tracking
const emailTrackingSchema = new mongoose.Schema({
    email: String,
    openedAt: { type: Date, default: Date.now }
});

const EmailTracking = mongoose.model('EmailTracking', emailTrackingSchema);

// Route to handle tracking pixel
app.get('/pixel', async (req, res) => {
    const { email } = req.query;

    if (email) {
        // Save the email to the database
        const track = new EmailTracking({ email });
        await track.save();

        console.log(`Email: ${email} opened at: ${new Date().toISOString()}`);
    }

    // Send a 1x1 transparent pixel
    const pixel = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgMBAfTShWQAAAAASUVORK5CYII=",
        "base64"
    );
    res.setHeader('Content-Type', 'image/png');
    res.send(pixel);
});

// Start the server
app.listen(3000, () => {
    console.log('Tracking server running on port 3000');
});
