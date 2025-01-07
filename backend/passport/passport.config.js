import passport from "passport"
import bcrypt  from "bcryptjs"
import prisma from "../lib/prisma.js"
import { GraphQLLocalStrategy } from "graphql-passport";



export const configurePassport =async()=>{

    passport.serializeUser((user, done)=> {   // Storing user identifier (like user ID) in the session.
        console.log("serializing user");
        done(null, user.id);
    });

    passport.deserializeUser(async(id, done)=> {  //checks for autharization 
        console.log("Desrialozing user");
        try {
            const user=await prisma.user.findUnique({
                where: { id: id },
            }); 
            done(null, user)  // null indicates success,if err then shows error instead of null
        } catch (err) {
            done(err);
        }
        
    });


    //middleware, user login with localStrategy in passport

    passport.use(new GraphQLLocalStrategy(async(username,password, done)=> {

        try {
            const user=await prisma.user.findUnique({
                where: {
                    username: username
                },
            });

            if(!user){
                throw new Error("Invalid username or password");
            };

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                throw new Error("Invalid username or password");
            };

            done(null, user);

            
        } catch (err) {
            return done(err);
        }

    }));


};