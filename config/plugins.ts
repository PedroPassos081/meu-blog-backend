export default () => ({
    upload: {
        config: {
            provider: '@strapi/provider-upload-cloudinary',
            providerOptions: {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,

            },
            actionOptions: {
                upload: {
                    // opções úteis
                    folder: 'vetdev',           // organiza tudo numa pasta
                    use_filename: true,         // mantém nome do arquivo
                    unique_filename: false,     // não adiciona hash se não quiser
                    overwrite: true,            // sobrescreve se mesmo nome
                    resource_type: 'auto',      // aceita imagem/vídeo/pdf
                },
                delete: {},
            },
        },
    },
});
