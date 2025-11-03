// src/index.ts (ESM)
export default {
  register() { },

  async bootstrap({ strapi }) {
    // 1) (Opcional) DROPAR TABELA DE SESSÕES – usa apenas 1x
    if (process.env.DROP_STRAPI_SESSIONS === 'true') {
      try {
        await strapi.db.connection.raw('DROP TABLE IF EXISTS "strapi_sessions";');
        strapi.log.info('✅ Tabela strapi_sessions dropada (o Strapi vai recriar).');
      } catch (e) {
        strapi.log.error('❌ Erro ao dropar strapi_sessions:', e);
      }
    }

    // 2) (Opcional) SEED/RESET DE ADMIN – mantém o que você já usava
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (email && password) {
      try {
        const superAdmin = await strapi.service('admin::role').getSuperAdmin();
        const existing = await strapi
          .query('admin::user')
          .findOne({ where: { email } });

        if (existing) {
          await strapi.service('admin::user').updateById(existing.id, { password });
          strapi.log.info(`🔑 Admin password reset for ${email}`);
        } else {
          await strapi.service('admin::user').create({
            email,
            password,
            firstname: 'Admin',
            lastname: 'Prod',
            isActive: true,
            roles: [superAdmin.id],
          });
          strapi.log.info(`👤 Admin created for ${email}`);
        }
      } catch (err) {
        strapi.log.error('❌ Erro ao criar/resetar admin:', err);
      }
    } else {
      strapi.log.info('ℹ️ Seed admin desativado (sem SEED_ADMIN_*).');
    }
  },
};
