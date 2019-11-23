const router = require("express").Router();
const Soldier = require("../models/Soldier");
const Commander = require("../models/Commander");
const Request = require("../models/Request");
const validateInput = require("../util/validateInput");

// adding new Soldier to DB
router.post("/addrequest", async (req, res, next) => {
  if (validateInput(req.body)) {
    const { content, startDate, endDate, soldier, commander } = req.body;
    if (
      (await Commander.findOne({ id: commander })) &&
      (await Soldier.findOne({ id: soldier }))
    ) {
      await new Request({
        content,
        startDate,
        endDate,
        soldier,
        commander
      }).save();
      res.send("Success");
    } else {
      res.status(500).send("Soldier or Commadner Already Exists!");
    }
  } else {
    res.status(500).send("Fields Must Not be Empty");
  }
});

router.get("/:id/:type", async (req, res) => {
  const { id, type } = req.params;
  if (type === "soldier") {
    if (await Soldier.findOne({ id })) {
      res.send(await Request.find({ soldier: id }));
    } else {
      res.status(500).send("Soldier Not Found");
    }
  } else if (type === "commander") {
    if (await Commander.findOne({ id })) {
      res.send(await Request.find({ commander: id }));
    } else {
      res.status(500).send("Commander Not Found");
    }
  } else {
    res.status(500).send("Type Is Not Correct");
  }
});

module.exports = router;
