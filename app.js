const Koa = require('koa');
const route = require('koa-route');
const app = new Koa();
const fs = require('fs');
const path = require('path');
const serve = require('koa-static');


app.use(serve(__dirname + '/static'));

const routeView = (ctx, fileName) => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream(path.resolve(__dirname, `demos/${fileName}.html`));
}


app.use(route.get('/', ctx => routeView(ctx, 'index')));
app.use(route.get('/properties', ctx => routeView(ctx, 'css-custom-properties')));
app.use(route.get('/paint', ctx => routeView(ctx, 'paint')));
app.use(route.get('/typed', ctx => routeView(ctx, 'typed-om')));
app.use(route.get('/transform', ctx => routeView(ctx, 'typed-om-transform')));
app.use(route.get('/layout', ctx => routeView(ctx, 'layout')));
app.use(route.get('/media-layout', ctx => routeView(ctx, 'media-layout')));
app.use(route.get('/doc', ctx => routeView(ctx, 'CSS Houdini.md')));


app.listen(3000, 'localhost');
console.log('listent port 3000');