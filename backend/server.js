"use strict";

import express from "express";
import cors from "cors";
import Router from "./Routes.js";
import { expireBorrowRequests } from "../functions/db/loanFunctions.js";

const app = express();
const port = 3000;

app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/lekhapi", Router);
app.get("/", (req, res) => {
    res.send("<h1>LEKH API is running</h1>");
});

expireBorrowRequests();
setInterval(() => {
    expireBorrowRequests();
}, 60000);

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});