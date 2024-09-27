const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

router.get("/", getAllJobs);
router.post("/", authenticateUser, createJob);
router.get("/:id", getJob);
router.patch("/:id", authenticateUser, updateJob);
router.delete("/:id", authenticateUser, deleteJob);

module.exports = router;
