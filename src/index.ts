import app from "./app";
import { config } from "./config";

const port = Number(config.port);
app.listen(port, () => console.log(`server listening on :${port}`));
