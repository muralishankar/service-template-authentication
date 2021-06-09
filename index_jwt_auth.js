'use strict';

const Bcrypt = require('bcrypt');
const Hapi = require('@hapi/hapi');
var JWT = require('jsonwebtoken');

const users = [
    {
        username: 'john',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
        name: 'John Doe',
        id: '2133d32a'
    }
];

const start = async () => {

    const server = Hapi.server({ port: 4000 });

    await server.register(require('hapi-auth-jwt2'));

    server.auth.strategy('jwt', 'jwt',
        {
            key: "password",
            validate: async function (decoded, request, h) {
                if (!people[decoded.id]) {
                    return { isValid: false };
                }
                else {
                    return { isValid: true };
                }
            },
        });



    //server.auth.default('session');

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: function (request, h) {

                return { test: 'outer', msg: 'Welcome to the restricted home page!' };
            }
        },
        {
            method: 'GET',
            path: '/secret',
            config: {
                handler(request, h) {
                    return 'secret';
                }
            }
        },
        {
            method: 'GET',
            path: '/login',
            handler: function (request, h) {

                const token = JWT.sign({
                    sid: 12,
                    exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60
                }, "password");
                return { status: "success", token };
            },
            options: {
                auth: false
            }
        },
        // {
        //     method: 'GET',
        //     path: '/logout',
        //     handler: function (request, h) {

        //         request.cookieAuth.clear();
        //         return h.redirect('/login');
        //     },
        //     options: {
        //         auth: false
        //     }
        // },
        // {
        //     method: 'POST',
        //     path: '/login',
        //     handler: async (request, h) => {

        //         const { username, password } = request.payload;
        //         const account = users.find(
        //             (user) => user.username === username
        //         );

        //         if (!account || !(await Bcrypt.compare(password, account.password))) {

        //             return h.view('/login');
        //         }

        //         request.cookieAuth.set({ id: account.id });

        //         return h.redirect('/');
        //     },
        //     options: {
        //         auth: {
        //             mode: 'try'
        //         }
        //     }
        // }
    ]);

    await server.start();

    console.log('server running at: ' + server.info.uri);
};

start();