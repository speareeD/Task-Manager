import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient('https://localhost:7258/graphql');

export function setAuthToken() {
  const token = localStorage.getItem('token');

  graphqlClient.setHeader('Authorization', token ? `Bearer ${token}` : '');
}
