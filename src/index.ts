export default {
  register() { },

  async bootstrap({ strapi }) {
    const db = strapi.db.connection;

    // cria a tabela de sessões se estiver faltando
    try {
      const force = process.env.FORCE_CREATE_STRAPI_SESSIONS === 'true';
      const exists = await db.schema.hasTable('strapi_sessions');

      if (force || !exists) {
        if (exists) await db.schema.dropTable('strapi_sessions');

        await db.schema.createTable('strapi_sessions', (table) => {
          table.increments('id').primary();
          table.string('session_id', 255).unique().notNullable();
          table.integer('user_id');
          table.string('status', 50);
          table.string('type', 50);
          table.timestamp('created_at', { useTz: true }).defaultTo(db.fn.now());
          table.timestamp('updated_at', { useTz: true }).defaultTo(db.fn.now());
          table.timestamp('expires_at', { useTz: true });
          table.timestamp('absolute_expires_at', { useTz: true });
          table.string('origin', 255);
          table.string('device_id', 255);
          table.string('document_id', 255);
          table.string('child_id', 255);
          table.timestamp('published_at', { useTz: true }).defaultTo(db.fn.now());
        });

        strapi.log.info('✅ Tabela strapi_sessions criada com sucesso.');
      }
    } catch (e) {
      strapi.log.error('❌ Erro ao garantir/ criar tabela strapi_sessions:', e);
    }

    // (opcional) seed/reset do admin
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (email && password) {
      const superAdmin = await strapi.service('admin::role').getSuperAdmin();
      const existing = await strapi.query('admin::user').findOne({ where: { email } });
      if (existing) {
        await strapi.service('admin::user').updateById(existing.id, { password });
        strapi.log.info(`🔑 Admin password reset for ${email}`);
      } else {
        await strapi.service('admin::user').create({
          email, password, firstname: 'Admin', lastname: 'Prod', isActive: true, roles: [superAdmin.id],
        });
        strapi.log.info(`👤 Admin created for ${email}`);
      }
    }
  },
};
