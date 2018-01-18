const express = require("express");
const brandStore = require("json-fs-store")("store/companies");
const router = express.Router();
const Company = require("../models/Company");

router.get("/", (req, res) => {
  Company.getAll("brand", res);
});

router.get("/search", (req, res) => {
  Company.search(req.query.q, "brand", res);
});

router.get("/state", (req, res) => {
  Company.searchByState(req.query.state, "brand", res);
});

router.put("/:id", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  Company.update(req.params.id, "brand", req.body, res);
});

router.delete("/:id", (req, res) => {
  Company.delete(req.params.id, res);
});

router.get("/:id", (req, res) => {
  Company.show(req.params.id, res);
});

router.post("/", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  Company.createCompany(req.body, "brand", res);
});

module.exports = router;
