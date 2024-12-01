import "reflect-metadata";
import mongoose from "mongoose";
import { InversifyExpressServer } from "inversify-express-utils";
import { container } from "./config/inversify.config";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 3000;
const DATABASE_URL = 'mongodb://admin:secret@localhost:27017/umami-profile?authSource=admin';


let server = new InversifyExpressServer(container);
server.setConfig((app) => {
  // add body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
});



mongoose.connect(DATABASE_URL)
.then(() => {
  let app = server.build();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})
.catch(err => console.error(`Failed to connect to MongoDB Server : ${DATABASE_URL}`,err));