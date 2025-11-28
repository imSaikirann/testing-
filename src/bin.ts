import { app } from ".";
import type { Request, Response } from "express";

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running on port 4000");
});

app.listen(4000, () => {
  console.log("🚀 Server is running on port 4000");
});
