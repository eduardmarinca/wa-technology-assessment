import { http, HttpResponse } from 'msw';

// Mock user database
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  },
];

// Token storage
let refreshTokens: string[] = [];

export const handlers = [
  // Login endpoint
  http.post('/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    
    const user = mockUsers.find(
      (u) => u.email === body.email && u.password === body.password
    );

    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const accessToken = `access_token_${Date.now()}`;
    const refreshToken = `refresh_token_${Date.now()}`;
    
    refreshTokens.push(refreshToken);

    return HttpResponse.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  }),

  // Refresh token endpoint
  http.post('/auth/refresh', async ({ request }) => {
    const body = (await request.json()) as { refreshToken: string };

    if (!refreshTokens.includes(body.refreshToken)) {
      return HttpResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    const newAccessToken = `access_token_${Date.now()}`;

    return HttpResponse.json({
      accessToken: newAccessToken,
    });
  }),

  // Logout endpoint
  http.post('/auth/logout', async ({ request }) => {
    const body = (await request.json()) as { refreshToken?: string };

    if (body.refreshToken) {
      refreshTokens = refreshTokens.filter((token) => token !== body.refreshToken);
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
