'use strict';

const Bcrypt = require('bcrypt');
const Hapi = require('@hapi/hapi');

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

    await server.register(require('@hapi/cookie'));

    server.auth.strategy('session', 'cookie', {
        cookie: {
            name: 'sid-example',
            password: '!wsYhFA*C2U6nz=Bu^%A@^F#SF3&kSR6',
            isSecure: true
        },
        redirectTo: '/login',
        validateFunc: async (request, session) => {

            const account = await users.find(
                (user) => (user.id === session.id)
            );

            if (!account) {

                return { valid: false };
            }

            return { valid: true, credentials: account };
        }
    });

    server.auth.default('session');

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: function (request, h) {

                return {test:'outer',msg:'Welcome to the restricted home page!'};
            }
        },
        {
            method: 'GET',
            path: '/login',
            handler: function (request, h) {

                return ` <html>
                            <head>
                                <title>Login page</title>
                            </head>
                            <body>
                                <h3>Please Log In</h3>
                                <form method="post" action="/login">
                                    Username: <input type="text" name="username"><br>
                                    Password: <input type="password" name="password"><br/>
                                <input type="submit" value="Login"></form>
                            </body>
                        </html>`;
            },
            options: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/logout',
            handler: function (request, h) {

               request.cookieAuth.clear();
               return h.redirect('/login');
            },
            options: {
                auth: false
            }
        },
        {
            method: 'POST',
            path: '/login',
            handler: async (request, h) => {

                const { username, password } = request.payload;
                const account = users.find(
                    (user) => user.username === username
                );

                if (!account || !(await Bcrypt.compare(password, account.password))) {

                    return h.view('/login');
                }

                request.cookieAuth.set({ id: account.id });

                return h.redirect('/');
            },
            options: {
                auth: {
                    mode: 'try'
                }
            }
        }
    ]);

    await server.start();

    console.log('server running at: ' + server.info.uri);
};

start();