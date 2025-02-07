import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import gadgetRoutes from "./routes/gadget.routes"
import loginRoute from "./routes/login.routes"


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use("/", loginRoute)
app.use("/gadgets", gadgetRoutes)

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Upraised!!!!");
});


app.listen(port, () => {
  console.log(`[server]: IMF Gadget Server is running at http://localhost:${port}...`);
});

//daebf6ac9109