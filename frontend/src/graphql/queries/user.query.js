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