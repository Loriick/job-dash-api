exports.resolvers = {
  Query: {
    getJobs: async (root, args, { Job }) => {
      return await Job.find()
        .sort({ createdDate: "desc" })
        .populate({ path: "interviews", model: "Interview" });
    },
    getJob: async (root, { _id }, { Job }) => {
      return await Job.findOne({ _id });
    },
    getInterviews: async (root, args, { Interview }) => {
      const interviews = await Interview.find()
        .sort({ createdDate: "desc" })
        .populate({ path: "application", model: "Job" });
      return interviews;
    },
    getJobInterview: async (root, { _id }, { Job }) => {
      const job = await Job.findOne({ _id }).populate({
        path: "interviews",
        model: "Interview"
      });

      const JobInterviews = job.interviews;
      return JobInterviews;
    }
  },
  Mutation: {
    addJob: async (root, { data }, { Job }) => {
      const job = await new Job({
        ...data
      }).save();
      return job;
    },
    updateJob: async (root, { _id, data }, { Job }) => {
      const updatedJob = await Job.findOneAndUpdate(
        { _id },
        { $set: { ...data } },
        { new: true }
      );

      return updatedJob;
    },
    deleteJob: async (root, { _id }, { Job }) => {
      const deletedJob = await Job.findOneAndDelete({ _id });
      return deletedJob;
    },
    addInterview: async (root, { data }, { Job, Interview }) => {
      console.log(data);
      const interview = await new Interview({
        ...data
      }).save();
      const application = await Job.findOne({ _id: data.application });
      application.interviews.push(interview);
      await application.save();
      return interview;
    },
    updateInterview: async (root, { _id, data }, { Interview }) => {
      const updatedInterview = await Interview.findOneAndUpdate(
        { _id },
        { $set: { ...data } },
        { new: true }
      );
      return updatedInterview;
    },
    deleteInterview: async (root, { _id }, { Interview }) => {
      const deletedInterview = await Interview.findOneAndDelete({ _id });
      return deletedInterview;
    }
  }
};
