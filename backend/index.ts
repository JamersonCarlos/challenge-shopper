import { server } from "./server/server";
import { db } from "./models";

const port = 8080;

db.sequelize
  .sync()
  .then(() => {
    console.log("Banco de dados sicronizado");
    server.listen(port, () => {
      console.log(`Api rodando na porta ${port}`);
    });
  })
  .catch((error: any) => {
    console.error("Error syncing database:", error);
  });
