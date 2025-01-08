import { gql } from "@apollo/client"

export const GET_AUTHENTICATED_USER=gql`
            query GetAuthenticatedUser {
                authUser {
                    id
                    username
                    name
                    profilePicture
                }
            }
`;


export const GET_USER_AND_TRANSACTIONS =gql`
          query GetUserAndTransactions($userId: ID!) {
              user(userId: $userId) {
                  id
			      name
			      username
			      profilePicture
                  transactions {
                        id
				        description
				        paymentType
				        category
				        amount
				        location
				        date
                 }
             }
          }
`;