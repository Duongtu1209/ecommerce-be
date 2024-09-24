const expess = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser')

dotenv.config();

const app = expess();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

routes(app);

mongoose
  .connect(
    `mongodb+srv://ecm:${process.env.MONGOOSE_PW}@cdtn.gfmyull.mongodb.net/?retryWrites=true&w=majority&appName=cdtn`
  )
  .then(() => {
    console.log("Connect DB success");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(port, () => {
  console.log("Server is running in port: ", +port);
});
