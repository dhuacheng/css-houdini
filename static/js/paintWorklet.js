

class Shape {
    static get inputProperties() {
        return ['--border-color', '--color'];
    }
    paint(ctx, geom, properties) {
        // console.log(ctx);
        // console.log(geom);
        console.log(properties, properties.get('--border-color').toString());
        const borderColor = properties.get('--border-color').toString();
        const x = geom.width / 2;
        const y = geom.height / 2;
        ctx.strokeStyle = borderColor || 'red';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }
    
}

class Shape2 {
    paint(ctx, geom, properties) {
        console.log(properties);
        const x = geom.width / 2;
        const y = geom.height / 2;
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4;
        ctx.rect(x, y, 100, 100);
        ctx.stroke();
    }
}

registerPaint('awesomePattern', Shape2);
