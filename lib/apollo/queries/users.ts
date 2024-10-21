import { gql } from "@apollo/client";

export const getProfileUser = gql`
  query GetUser($id: ID!) {
    users(id: $id) {
      username
      name
    }
  }
`;
