'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Hello World!';
        }
    });

    server.ext('onRequest', (request, h) => {
        if (request.params) {
            console.log(`onRequest:${request.method.toUpperCase()}:${request.path}/${request.params}`)
        } else {
            console.log(`onRequest:${request.method.toUpperCase()}:${request.path}`)
        }

        if (Object.getOwnPropertyNames(request.query).length) {
            console.log(`onRequest:queryParameters: ${JSON.stringify(request.query)}`)
        }

        if (request.headers && request.headers['x-access-token']) {
            console.log(`onRequest:heders:x-access-token ${JSON.stringify(request.headers['x-access-token'])}`)
        }

        return h.continue
    })

    server.ext('onPreAuth', (request, h) => {
        console.log('onPreAuth')
        return h.continue
    })

    server.ext('onCredentials', (request, h) => {
        console.log('onCredentials')
        return h.continue
    })

    server.ext('onPostAuth', (request, h, error) => {
        if (request.payload) {
            console.log(`onPostAuth:bodyPayload: ${JSON.stringify(request.payload)}`)
        }
        return h.continue
    })

    server.ext('onPreHandler', (request, h) => {
        console.log('onPreHandler')
        return h.continue
    })

    server.ext('onPostHandler', (request, h) => {
        console.log('onPostHandler')
        return h.continue
    })

    server.ext('onPreResponse', (request, h) => {
        if (request && request.response && request.response.source) {
            try {
                console.log(`onPreResponse:${JSON.stringify(request.response.source)}`)
            } catch (err) {
                log.warn(err)
                console.log(h.request.response.source.toString())
            }
        }
        return h.continue
    });
    server.ext('onCredentials', (request, h) => {

        request.auth.credentials.scope = 'customadmin';
        return h.continue;
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();