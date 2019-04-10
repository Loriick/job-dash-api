exports.typeDefs = `

    type Job {
        _id: ID!
        position: String!
        company: String!
        spontaneous: Boolean
        jobUrl: String
        date: String
        creator: User!
        interviews: [Interview]
    }

    input JobInput {
        position: String!
        company: String!
        spontaneous: Boolean
        jobUrl: String
        date: String
    }

    input JobInputUpdate{
        position: String
        company: String
        jobUrl: String
        date: String
    }

    type User{
        _id: ID!
        username: String!
        password: String!
        email: String!  @unique
        applications: [Job]
    }

    input SignupUserInput{
        username: String!
        email:String!
        password: String!
    }

    input SigninUserInput{
        email: String!
        password: String!
    }


    type Token{
        token: String!
    }


    type Interview {
        _id: ID!
        address: String
        date: String!
        application: Job!
    }

    input InterviewInput{
        address: String
        date: String!
        application: ID!
    }

    input InterviewInputUpdate {
        address: String
        date: String
    }

 


    type Query {
        getJobs:[Job]
        getJob(_id:ID!):Job
        getUserJob:[Job]
        getInterviews: [Interview]
        getJobInterview(_id:ID!): [Interview]
        me:User
    }
    

    type Mutation{
        addJob(data: JobInput): Job
        updateJob(_id: ID!, data: JobInputUpdate):Job
        deleteJob(_id:ID!):Job
        addInterview(data: InterviewInput): Interview
        updateInterview(_id:ID!, data: InterviewInputUpdate): Interview
        deleteInterview(_id:ID!):Interview
        signupUser(data: SignupUserInput):Token
        signinUser(data: SigninUserInput): Token
    }
       
    `;
