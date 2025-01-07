import prisma from "../lib/prisma.js"
import bcrypt from "bcryptjs";

const userResolver={
     
    Mutation : {
        signUp: async(_,{input},context)=>{
          try {

            const { username, name, password, gender }=input;

            if (!username || !name || !password || !gender) {
                throw new Error("All fields are required");
            };

            const existUser=await prisma.user.findUnique({
              where:{username: username}
            });

            if (existUser) {
                throw new Error("User already exists");
            };
             
             const salt=await bcrypt.genSalt(10);
             const hashedPass= await bcrypt.hash(password, salt);
                
                //https://avatar-placeholder.iran.liara.run/ 
                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
				        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

                const newUser=await prisma.user.create({
                 data:{ 
                   username,
                   name,
                   password: hashedPass,
                   gender,
                   profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
                 }
                });

                await context.login(newUser); //context.login,"graphql-passport" built in feature
                return newUser;

          } catch (err) { 
            console.error("Error in signUp: ", err);
			      throw new Error(err.message || "Internal server error");
          }
        },

        login: async(_,{input},context)=>{
           try {
              const {username,password}=input;
              if (!username || !password) throw new Error("All fields are required");

              const { user }=await context.authenticate("graphql-local", {username,password}); //context.authenticate,"graphql-passport" built in feature

              await context.login(user); 
              return user;
            
           } catch (err) {
             console.error("Error in login:", err);
			       throw new Error(err.message || "Internal server error");
           }
        },


        logout: async(_,__,context)=>{
           try {
              await context.logout(); //context.logout,"graphql-passport" built in feature

              context.req.session.destroy((err)=> {
                if (err) throw err;
              });
               
              context.res.clearCookie("token");

              return { message: "Logged out successfully!" }

           } catch (error) {
             console.error("Error in logout:", err);
			 throw new Error(err.message || "Internal server error");
           }
        },


    },


    Query: {
        authUser: async(_,__,context)=> {
            try {
                const user= await context.getUser();  //getUser,"graphql-passport" built in feature
                return user;
                
            } catch (err) {
                console.error("Error in authUser: ", err);
				throw new Error("Internal server error");
            }
        },

        user: async(_, { userId })=>{
          try {
             const user= await prisma.user.findUnique({
                where:{ id : userId }
             });

             return user;
            
          } catch (err) {
            console.error("Error in user query:", err);
			throw new Error(err.message || "Error getting user");
          }
        },


    },

     //User and Transaction relation..
    User: {
        transactions: async(parent)=>{
            try {
                const transactions = await prisma.transaction.findMany({
                  where:{
                    userId: parent.id
                  },
                });

                return transactions;
                
            } catch (err) {
                console.log("Error in user.transactions resolver: ", err);
				throw new Error(err.message || "Internal server error");
            }
        }

    },


};




export default userResolver;