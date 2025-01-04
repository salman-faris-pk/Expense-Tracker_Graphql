import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./user.typeDefs.js";
import transactionTypeDefs from "./transaction.typeDefs.js";


const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDefs]);

export default mergedTypeDefs;
