// src/index.ts ou src/index.js (ESM)
export default {
  register() { },

  async bootstrap({ strapi }) {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!email || !password) {
      strapi.log.info('Seed admin vars not set — skipping admin bootstrap.');
      return;
    }

    const superAdmin = await strapi.service('admin::role').getSuperAdmin();
    const existing = await strapi.query('admin::user').findOne({ where: { email } });

    if (existing) {
      await strapi.service('admin::user').updateById(existing.id, { password });
      strapi.log.info(`Admin password reset for ${email}`);
    } else {
      await strapi.service('admin::user').create({
        email,
        password,
        firstname: 'Admin',
        lastname: 'Prod',
        isActive: true,
        roles: [superAdmin.id],
      });
      strapi.log.info(`Admin created for ${email}`);
    }
  },
};
