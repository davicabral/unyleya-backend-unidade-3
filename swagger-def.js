const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Davi - URL Shortener',
        version: '1.0.0',
        description: 'Esta API faz parte da pós graduação da Unyleya'
    },
    servers: [
        {
        url: 'http://localhost:3333',
        description: 'Development server',
        }
    ]
}

export default swaggerDefinition;