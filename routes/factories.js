const express = require("express");
const brandStore = require("json-fs-store")("store/companies");
const router = express.Router();
const Company = require("../models/Company");

router.get("/", (req, res) => {
  Company.getAll("factory", res);
});

router.get("/search", (req, res) => {
  Company.search(req.query.q, "factory", res);
});

router.get("/state", (req, res) => {
  Company.searchByState(req.query.state, "factory", res);
});

router.put("/:id", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  Company.update(req.params.id, "factory", req.body, res);
});

router.delete("/:id", (req, res) => {
  Company.delete(req.params.id, res);
});

router.get("/:id", (req, res) => {
  Company.show(req.params.id, res);
});

router.post("/", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  Company.createCompany(req.body, "factory", res);
});

module.exports = router;
