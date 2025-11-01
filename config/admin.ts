// config/admin.ts
export default ({ env }) => ({
  url: '/admin',
  serveAdminPanel: true,
  auth: {
    sessions: {
      maxRefreshTokenLifespan: '30d',
      maxSessionLifespan: '7d',
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
});
