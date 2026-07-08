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

export async function login(data: LoginRequest) {
  const response = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Login failed');
  }

  return result;
}

export async function register(data: CreateUserRequest) {
  const response = await fetch(`/api/auth/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Register failed');
  }

  return result;
}

export async function checkInvitation(email: string) {
  const response = await fetch(`/api/auth/invitation/${encodeURIComponent(email)}`, {
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Invitation invalid');
  }

  return result;
}

export async function activateAccount(data: ActivateAccountRequest) {
  const response = await fetch(`/api/auth/activate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Activation failed');
  }

  return result;
}

export async function me() {
  const response = await fetch(`/api/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Unauthorized');
  }

  return result;
}

export async function logout() {
  await fetch(`/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
