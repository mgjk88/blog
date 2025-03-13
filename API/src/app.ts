import "dotenv/config";
import express from "express";
import cors from "cors";

//routers
import indexRouter from "../src/routes/indexRouter";
import userRouter from "../src/routes/userRouter";
import postRouter from "../src/routes/postRouter";

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);

app.listen(process.env.PORT || 3000, (error) => {
    if(error) {
        console.error(error);
        console.log("server start fail");
        return;
    }
    console.log(`server start on port: ${process.env.PORT || 3000}`);
});