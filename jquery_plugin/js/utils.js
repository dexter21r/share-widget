function resizeCanvas() {
    var w = canvas.getWidth() * scaleX;
    var h = canvas.getHeight() * scaleY;
    canvas.setWidth(w);
    canvas.setHeight(h);
    console.log(w + ' ' + h + ' ' + canvas.getWidth() + ' ');
    $('.tb-share-canvas-container').css({
        width: w + 5,
        height: h + 5
    });

    var objects = canvas.getObjects();
    for (var i in objects) {

        console.log('=========change size', objects[i].get('type'));
        var sX = objects[i].scaleX;
        var sY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;

        var tempScaleX = sX * scaleX;
        var tempScaleY = sY * scaleY;
        var tempLeft = left * scaleX;
        var tempTop = top * scaleY;

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }

    canvas.renderAll();
}

function checkAssetsLoading() {
    if (totalAssets == loadedAssets) {
        resizeCanvas();
    }
}

// Zoom In
function zoomIn() {
    // TODO limit the max canvas zoom in

    canvasScale = canvasScale * SCALE_FACTOR;

    canvas.setHeight(canvas.getHeight() * SCALE_FACTOR);
    canvas.setWidth(canvas.getWidth() * SCALE_FACTOR);

    var objects = canvas.getObjects();
    for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;

        var tempScaleX = scaleX * SCALE_FACTOR;
        var tempScaleY = scaleY * SCALE_FACTOR;
        var tempLeft = left * SCALE_FACTOR;
        var tempTop = top * SCALE_FACTOR;

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }

    if (canvas.backgroundImage) {
        var oImg = backgroundImage.set({
            scaleX: backgroundImage.scaleX * SCALE_FACTOR,
            scaleY: backgroundImage.scaleY * SCALE_FACTOR
        });
        canvas.setBackgroundImage(oImg);
    }

    $('.tb-share-canvas-container').css({
        width: canvas.getWidth() + 5,
        height: canvas.getHeight() + 5
    });

    canvas.renderAll();
}

// Zoom Out
function zoomOut() {
    // TODO limit max cavas zoom out

    canvasScale = canvasScale / SCALE_FACTOR;

    canvas.setHeight(canvas.getHeight() * (1 / SCALE_FACTOR));
    canvas.setWidth(canvas.getWidth() * (1 / SCALE_FACTOR));

    var objects = canvas.getObjects();
    for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;

        var tempScaleX = scaleX * (1 / SCALE_FACTOR);
        var tempScaleY = scaleY * (1 / SCALE_FACTOR);
        var tempLeft = left * (1 / SCALE_FACTOR);
        var tempTop = top * (1 / SCALE_FACTOR);

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }

    if (canvas.backgroundImage) {
        var oImg = backgroundImage.set({
            scaleX: backgroundImage.scaleX / SCALE_FACTOR,
            scaleY: backgroundImage.scaleY / SCALE_FACTOR
        });
        canvas.setBackgroundImage(oImg);
    }

    $('.tb-share-canvas-container').css({
        width: canvas.getWidth() + 5,
        height: canvas.getHeight() + 5
    });

    canvas.renderAll();
}

// Reset Zoom
function resetZoom() {

    canvas.setHeight(canvas.getHeight() * (1 / canvasScale));
    canvas.setWidth(canvas.getWidth() * (1 / canvasScale));

    var objects = canvas.getObjects();
    for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;

        var tempScaleX = scaleX * (1 / canvasScale);
        var tempScaleY = scaleY * (1 / canvasScale);
        var tempLeft = left * (1 / canvasScale);
        var tempTop = top * (1 / canvasScale);

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }

    if (canvas.backgroundImage) {
        var oImg = backgroundImage.set({
            scaleX: backgroundImage.scaleX * (1 / canvasScale),
            scaleY: backgroundImage.scaleY * (1 / canvasScale)
        });
        canvas.setBackgroundImage(oImg);
    }

    $('.tb-share-canvas-container').css({
        width: canvas.getWidth() + 5,
        height: canvas.getHeight() + 5
    });

    canvas.renderAll();

    canvasScale = 1;
}



function setFormattingValues() {

    $('#tb-color-pallate').val(textAreaStyle.fontFamily);
    $('#tb-font-size').val(textAreaStyle.fontSize);

    if (textAreaStyle.fontWeight === 'bold') {
        $('#txt-bold').addClass('active');
    } else {
        $('#txt-bold').removeClass('active');
    }

    if (textAreaStyle.fontStyle === 'italic') {
        $('#txt-italic').addClass('active');
    } else {
        $('#txt-italic').removeClass('active');
    }

    if (textAreaStyle.textDecoration === 'underline') {
        $('#txt-underline').addClass('active');
    } else {
        $('#txt-underline').removeClass('active');
    }

    if (textAreaStyle.textAlign === 'left') {
        $('#txt-align-left').show();
        $('#txt-align-center').hide();
        $('#txt-align-right').hide();
    } else if (textAreaStyle.textAlign === 'center') {
        $('#txt-align-left').hide();
        $('#txt-align-center').show();
        $('#txt-align-right').hide();
    } else if (textAreaStyle.textAlign === 'right') {
        $('#txt-align-left').hide();
        $('#txt-align-center').hide();
        $('#txt-align-right').show();
    }

    colorPicker.color = textAreaStyle.fill;
    colorPicker.element.val(colorPicker.color);
    colorPicker.element.css({
        'backgroundColor': colorPicker.color,
        'color': colorPicker.color
    });
    console.log(colorPicker);
    //$.proxy(colorPicker.options.onColorSelected, colorPicker)();

    // var col = textAreaStyle.fill;
    // var colName = getColorNameFromCode(col);
    // pk.setColor(col, colName);
    // wrapperEl.style.backgroundColor = col;

    // col = textAreaStyle.borderColor;
    // colName = getColorNameFromCode(col);
    // pkBorder.setColor(col, colName);
    // wrapperElBorder.style.backgroundColor = col;

}

function applyStyle(styleName, styleValue, styleType) {
    var obj;
    if (obj = getActiveObject()) {
        //console.log('Apply Style',obj.getSelectionStyles(),obj.selectionStart ,obj.selectionEnd,obj );
        styleName = styleObj[styleName];

        if (styleName != undefined) {
            console.log(styleName + ' ==> ' + styleValue);
            if (styleType === 'selection') {
                var isAlreadyApplied = (getStyle(obj, styleName) || '').indexOf(styleValue) > -1;
                styleValue = isAlreadyApplied ? '' : styleValue;
                setStyle(obj, styleName, styleValue);
            } else {
                setStyle(obj, styleName, styleValue);
            }
            setActiveStyle(styleName, styleValue);
            refresh();
        } else {
            console.log('Invalid Style: ' + styleName);
        }


    } else {
        console.log('Object not selected');
    }
}

function setActiveStyle(styleName, styleValue) {

    switch (styleName) {
        case 'fontSize':
            this.textAreaStyle.fontSize = styleValue;
            break;
        case 'fontFamily':
            this.textAreaStyle.fontFamily = styleValue;
            break;
        case 'textAlign':
            this.textAreaStyle.textAlign = styleValue;
            break;
        case 'fontStyle':
            this.textAreaStyle.fontStyle = styleValue;
            break;
        case 'charSpacing':
            this.textAreaStyle.charSpacing = styleValue;
            break;
        case 'lineHeight':
            this.textAreaStyle.lineHeight = styleValue;
            break;
        case 'borderColor':
            this.textAreaStyle.borderColor = styleValue;
            break;
        case 'fill':
            this.textAreaStyle.fill = styleValue;
            break;
        case 'fontWeight':
            this.textAreaStyle.fontWeight = styleValue;
            break;
        case 'textDecoration':
            this.textAreaStyle.textDecoration = styleValue;
            break;
        default:
            console.log('Sorry, we are out of ' + styleName + '.');
    }

    setFormattingValues();
}

function getActiveObject() {
    if (canvas) {
        return canvas.getActiveObject();
    }
    return false;
}

function setStyle(object, styleName, value) {

    if (object.setSelectionStyles && object.isEditing) {
        var style = {};
        style[styleName] = value;
        object.setSelectionStyles(style);
    } else {
        if (styleName == 'fill') {
            object.setColor(value);
        } else {
            object[styleName] = value;
        }
        object.set({
            dirty: true
        });
    }
}

function getStyle(object, styleName) {
    return (object.getSelectionStyles && object.isEditing) ?
        object.getSelectionStyles()[styleName] :
        object[styleName];
}

function refresh() {
    console.log('template updated');
    canvas.renderAll();
    canvas.renderAll.bind(canvas);
}

function applyFilter(filter) {
    console.log(canvas.backgroundImage.filters);
    if (canvas.backgroundImage) {
        canvas.backgroundImage.filters[0] = filter;
        canvas.backgroundImage.applyFilters();

        setTimeout(function() {
            refresh();
        }, 200);
    }
}