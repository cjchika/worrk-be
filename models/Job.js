const mongoose = require("mongoose");

// Constants for job statuses in a job portal
const JOB_STATUSES = {
  OPEN: "Open",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  FILLED: "Filled",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
  REJECTED: "Rejected",
};

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Temporary", "Internship"],
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(JOB_STATUSES),
      default: JOB_STATUSES.OPEN,
    },
    companyName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salaryRange: {
      type: String,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    responsibilities: [
      {
        type: String,
      },
    ],
    benefits: [
      {
        type: String,
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    applicationDeadline: {
      type: Date,
    },
    interviewDate: {
      type: Date,
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = { Job, jobSchema, JOB_STATUSES };
