const TOKEN_NAME = 'ikcamp_token';

module.exports = {
    getToken(ctx) {
        return ctx.cookies.get(TOKEN_NAME)
    },
    setToken(ctx, value) {
        ctx.cookies.set(TOKEN_NAME, value);
    },
    clearToken(ctx) {
        ctx.cookies.set(TOKEN_NAME, '', {
            expires: new Date('2000-01-01')
        });
    },
    redirectToLogin(ctx) {
        this.clearToken(ctx);
        ctx.status = 302;
        ctx.redirect('/login');
    }
}