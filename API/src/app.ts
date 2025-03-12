import "dotenv/config"
import express from "express";

//routers
import postRouter from "../src/routes/postRouter"

const app = express();
app.use(express.urlencoded({extended: true}));

app.use('/users', );
app.use('/posts', postRouter);

app.listen(process.env.PORT || 3000, (error) => {
    if(error) {
        console.error(error);
        console.log("server start fail");
        return;
    }
    console.log("server start");
});
