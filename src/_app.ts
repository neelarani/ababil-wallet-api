import express from "express";
import { globalErrorHandler, notFound } from "@/app/errors";
import { rootResponse } from "@/shared";

const app = express();

app.set("json spaces", 2);
app.all("/", rootResponse);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
