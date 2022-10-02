import { controller } from "../plugins/controllers";

export default controller(async (server) => {
    server.get("/", async (_, res) => {
        return res.view("index.liquid")
    })
});