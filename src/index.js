const expess = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = expess();
const port = process.env.PORT || 3001

app.get('/', (req, res) => {
    return res.send('Hello')
})

app.listen(port, () => {
    console.log('Server is running in port: ', + port)
});