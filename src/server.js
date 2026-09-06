import { app } from "./app.js";
import { PORT } from "./config/app.config.js";

app.listen(PORT, () => {
    console.log(`server started at https://localhost:${PORT}`)
})