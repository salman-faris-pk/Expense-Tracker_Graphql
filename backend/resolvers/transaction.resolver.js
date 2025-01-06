import prisma from "../lib/prisma.js"

const transactionResolver = {
    Query: {
        transactions: async(_,__,context)=>{
          try {
            if (!context.getUser()) throw new Error("Unauthorized");
            const userId=await context.getUser._id;

            const transactions=await prisma.transaction.findMany({
                 where:{ userId: userId}
            });

            return transactions;
            
          } catch (err) {
            console.error("Error getting transactions:", err);
			throw new Error("Error getting transactions");
          }
        },
        
        transaction: async(_, {transactionId})=>{
            try {
                const transaction = await prisma.transaction.findUnique({
                  where:{
                    id: transactionId
                  }
                });

                return transaction;
                
            } catch (err) {
                console.error("Error getting transaction:", err);
				throw new Error("Error getting transaction");
            }
        },

        categoryStatistics: async(_,__,context)=>{
            if (!context.getUser()) throw new Error("Unauthorized");

            const userId = context.getUser()._id;
            const transactions= await prisma.transaction.findMany({
                where:{id: userId}
            });

            const categoryMap = {};

            transactions.forEach((transaction)=> {
                 if(!categoryMap[transaction.category]){
                    categoryMap[transaction.category] = 0;
                 }

                 categoryMap[transaction.category] += transaction.amount;
            });

             return Object.entries(categoryMap).map(([category, totalamount]) => ({ category, totalamount})); //convert object into array and map
        },

    },

    Mutation: {
        createTransaction: async(_,{input},context)=>{
           try {
            const user = context.getUser();
             if(!user) {
                throw new Error("Unauthorized");
              };
            const newTransaction=await prisma.transaction.create({
                data:{
                    ...input,
                    userId: user._id,
                }
            });

            return newTransaction;
            
           } catch (err) {
             console.error("Error creating transaction:", err);
			 throw new Error("Error creating transaction");
           }
        },


        updateTransaction: async(_,{input},context)=>{
           try {
            const user = context.getUser();
            if(!user) {
               throw new Error("Unauthorized");
             };

             const updatedTransaction = await prisma.transaction.update({
                where:{
                    id: input.transactionId,
                },
                data: input,
             });

             return updatedTransaction;

           } catch (err) {
            console.error("Error updating transaction:", err);
            throw new Error("Error updating transaction");
           }
        },

        deleteTransaction:async(_,{transactionId},context)=>{
          try {
            const user= context.getUser();
            if(!user){
                throw new Error("Unauthorized");
            };

            const deleteTransaction=await prisma.transaction.delete({
                where:{id: transactionId},
            });

            return deleteTransaction;
            
          } catch (err) {
            console.error("Error deleting transaction:", err);
            throw new Error("Error deleting transaction");
          }
        }
    },


    Transaction:{
        user: async(parent)=>{
          const userId= parent.userId;
          try {
            const user=await prisma.user.findUnique({
              where:{
                id: userId
              }
            });
            return user;
            
          } catch (err) {
            console.error("Error fetching user:", err);
            throw new Error("Error fetching user");
          }
        },
    },

};


export default transactionResolver;