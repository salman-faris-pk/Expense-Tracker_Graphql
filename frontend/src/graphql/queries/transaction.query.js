import { gql } from "@apollo/client"


export const GET_TRANSACTIONS=gql`
      query GetTransactions{
        transactions{
            id
			userId
			description
			paymentType
			category
			amount
			location
			date
			user {
				profilePicture
			}
        }
      }

`;


export const GET_TRANSACTION= gql`
       query GetTransaction($id: ID!){
		  transaction(transactionId: $id){
			id
			description
			paymentType
			category
			amount
			location
			date
			user {
				name
				username
				profilePicture
			}
		  }
	   }

`;


export const  GET_TRANSACTION_STATISTICS=gql`
        query GetTransactionStatistics{
			categoryStatistics {
				category
				totalamount
			}
		}
`;

