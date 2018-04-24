14503 行
修改前

```
image: function (node) {
    var raster = new Raster(getValue(node, 'href', true));
    raster.on('load', function() {
        var size = getSize(node);
        this.setSize(size);
        var center = this._matrix._transformPoint(
            getPoint(node).add(size.divide(2)));
        this.translate(center);
    });
    return raster;
}
```

修改后

```
image: function (node) {
    var raster = new Raster(getValue(node, 'href', true));

        var size = getSize(node);
        raster.setSize(size);
        var center = raster._matrix._transformPoint(
            getPoint(node).add(size.divide(2)));
        raster.translate(center);

    return raster;
}
```