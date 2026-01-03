const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    appName: import.meta.env.VITE_APP_NAME || 'WhatsApp Campaign Manager',

    features: {
        auditLogs: true,
        externalApiImport: true,
        scheduling: false,
    },

    pagination: {
        defaultLimit: 25,
        maxLimit: 100,
    }
};

export default config;
