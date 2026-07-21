import { gql } from 'graphql-request';
import { graphqlClient } from '@/lib/graphql';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface ActivateAccountRequest {
  email: string;
  password: string;
}

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      expiresAt
      user {
        id
        name
        email
        isAdmin
      }
    }
  }
`;

export async function login(data: LoginRequest) {
  const result = await graphqlClient.request(LOGIN_MUTATION, {
    input: data,
  });

  localStorage.setItem('token', result.login.token);

  return result.login;
}

const INVITE_MUTATION = gql`
  mutation Invite($input: InviteInput!) {
    invite(input: $input) {
      message
      url
    }
  }
`;

export async function register(data: CreateUserRequest) {
  const token = localStorage.getItem('token');

  const result = await graphqlClient.request(
    INVITE_MUTATION,
    {
      input: data,
    },
    {
      Authorization: `Bearer ${token}`,
    },
  );

  return result.invite;
}

const CHECK_INVITATION_QUERY = gql`
  query Invitation($email: String!) {
    invitation(email: $email) {
      name
      email
    }
  }
`;

export async function checkInvitation(email: string) {
  const result = await graphqlClient.request(CHECK_INVITATION_QUERY, {
    email,
  });

  if (!result.invitation) {
    throw new Error('Invitation invalid');
  }

  return result.invitation;
}

const ACTIVATE_MUTATION = gql`
  mutation Activate($input: ActivateInput!) {
    activate(input: $input) {
      message
    }
  }
`;

export async function activateAccount(data: ActivateAccountRequest) {
  const result = await graphqlClient.request(ACTIVATE_MUTATION, {
    input: data,
  });

  return result.activate;
}

export function logout() {
  localStorage.removeItem('token');
  graphqlClient.setHeader('Authorization', '');
}
