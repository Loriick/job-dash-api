const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

const unAuthenticated = currentUser => {
  if (!currentUser) {
    throw new Error("You must be signed in");
  }
};

exports.resolvers = {
  Query: {
    getJobs: async (root, args, { Job, currentUser }) => {
      try {
        unAuthenticated(currentUser);
        return await Job.find()
          .sort({ createdDate: "desc" })
          .populate({ path: "interviews", model: "Interview" });
      } catch (error) {
        console.log("error", error);
      }
    },
    getJob: async (root, { _id }, { Job, currentUser }) => {
      unAuthenticated(currentUser);
      try {
        return await Job.findOne({ _id });
      } catch (error) {
        console.log("error", error);
      }
    },
    getInterviews: async (root, args, { Interview, currentUser }) => {
      try {
        unAuthenticated(currentUser);
        const interviews = await Interview.find()
          .sort({ createdDate: "desc" })
          .populate({ path: "application", model: "Job" });
        return interviews;
      } catch (error) {
        return await Job.findOne({ _id });
      }
    },
    getJobInterview: async (root, { _id }, { Job, currentUser }) => {
      try {
        unAuthenticated(currentUser);
        const job = await Job.findOne({ _id }).populate({
          path: "interviews",
          model: "Interview"
        });
        const JobInterviews = job.interviews;
        return JobInterviews;
      } catch (error) {
        console.error("error", error);
      }
    }
  },
  Mutation: {
    addJob: async (root, { data }, { Job, currentUser }) => {
      try {
        unAuthenticated(currentUser);
        const job = await new Job({
          ...data
        }).save();
        return job;
      } catch (error) {
        console.error("error", error);
      }
    },
    updateJob: async (root, { _id, data }, { Job, currentUser }) => {
      try {
        unAuthenticated(currentUser);
        const updatedJob = await Job.findOneAndUpdate(
          { _id },
          { $set: { ...data } },
          { new: true }
        );
        return updatedJob;
      } catch (error) {
        console.error("error", error);
      }
    },
    deleteJob: async (root, { _id }, { Job, currentUser }) => {
      try {
        unAuthenticated(currentUser);
        const deletedJob = await Job.findOneAndDelete({ _id });
        return deletedJob;
      } catch (error) {
        console.error("error", error);
      }
    },
    addInterview: async (root, { data }, { Job, Interview, currentUser }) => {
      try {
        unAuthenticated(currentUser);
        const interview = await new Interview({
          ...data
        }).save();
        const application = await Job.findOne({ _id: data.application });
        application.interviews.push(interview);
        await application.save();
        return interview;
      } catch (error) {
        console.error("error", error);
      }
    },
    updateInterview: async (
      root,
      { _id, data },
      { Interview, currentUser }
    ) => {
      try {
        unAuthenticated(currentUser);
        const updatedInterview = await Interview.findOneAndUpdate(
          { _id },
          { $set: { ...data } },
          { new: true }
        );
        return updatedInterview;
      } catch (error) {
        console.error("error", error);
      }
    },
    deleteInterview: async (root, { _id }, { Interview, currentUser }) => {
      try {
        unAuthenticated(currentUser);
        const deletedInterview = await Interview.findOneAndDelete({ _id });
        return deletedInterview;
      } catch (error) {
        console.error("error", error);
      }
    },
    signupUser: async (
      root,
      { data: { username, email, password } },
      { User }
    ) => {
      try {
        const user = await User.findOne({ email });
        if (user) {
          throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const neweMail = email.toLowerCase();
        const newUser = new User({
          username,
          email: neweMail,
          password: hashedPassword
        }).save();
        return { token: createToken(newUser, process.env.SECRET, "1hr") };
      } catch (error) {
        console.error("error", error);
      }
    },
    signinUser: async (root, { data: { email, password } }, { User }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("Username/Password is invalid");
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("Username/Password is invalid");
        }
        return { token: createToken(user, process.env.SECRET, "1hr") };
      } catch (error) {
        console.error("error", error);
      }
    }
  }
};
