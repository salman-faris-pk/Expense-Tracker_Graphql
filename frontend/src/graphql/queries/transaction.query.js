import { gql } from "@apollo/client"


export const GET_TRANSACTIONS=gql`
      query GetTransactions{
        transactions{
            id
			description
			paymentType
			category
			amount
			location
			date
        }
      }

`;


