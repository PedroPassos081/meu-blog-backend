export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 10000),
  url: env('URL'),     // https://meu-blog-backend-4j5u.onrender.com
  app: { keys: env.array('APP_KEYS') },
});
