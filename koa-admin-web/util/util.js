const token = 'token'

module.exports = {
  getToken (ctx) {
    return ctx.cookies.get(token)
  },
  setToken (ctx, value) {
    ctx.cookies.set(token, value)
  },
  clearToken (ctx) {
    ctx.cookies.set(token, '', {
      expires: new Date('2000-01-01')
    })
  },
  redirectToLogin (ctx) {
    this.clearToken(ctx)
    ctx.status = 302
    ctx.redirect('/login')
  }
}
