const express = require('express');
const unsplashApi = require('./api/unsplash');
const ipcheckApi = require('./api/ipcheck');
const cerpenApi = require('./api/cerpen');
const fakexyApi = require('./api/fakexy');
const lirikApi = require('./api/lirik');
const app = express();
const port = process.env.PORT || 7860;

app.use('/api', unsplashApi);
app.use('/api', ipcheckApi);
app.use('/api', cerpenApi);
app.use('/api', fakexyApi);
app.use('/api', lirikApi);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
