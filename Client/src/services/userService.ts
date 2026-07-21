import { gql } from 'graphql-request';
import { graphqlClient } from '@/lib/graphql';

const USERS_QUERY = gql`
  query Users {
    users {
      id
      name
      email
      isAdmin
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;

export async function getUsers() {
  const token = localStorage.getItem('token');

  const result = await graphqlClient.request(
    USERS_QUERY,
    {},
    {
      Authorization: `Bearer ${token}`,
    },
  );

  return result.users;
}

export async function deleteUser(id: number) {
  const token = localStorage.getItem('token');

  return graphqlClient.request(
    DELETE_USER,
    { id },
    {
      Authorization: `Bearer ${token}`,
    },
  );
}
