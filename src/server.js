import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
    console.log(`server started at https://localhost:${env.port}`)
})