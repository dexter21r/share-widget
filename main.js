
var fontSizeOptions = '';

for (var fs = 12; fs < 110; fs+=2) {
    fontSizeOptions += '<option value="'+fs+'">'+fs+'</option>';
}

$('#tb-font-size').html(fontSizeOptions);

var fontFamilyArray = [
    'Lato',
    'Open Sans',
    'Montserrat',
    'Raleway',
    'Lora',
    'Indie Flower',
    'Oxygen',
    'Bitter',
    'Josefin Sans',
    'Josefin Slab',
    'Libre Baskerville',
    'Lobster',
    'Varela Round',
    'Dancing Script',
    'Bree Serif',
    'Coiny',
    'Righteous',
    'Poiret One',
    'Caveat',
    'Monoton',
    'Lobster Two'
];

var fontFamilyOptions = '';

fontFamilyArray.forEach(function(ff){
    var font = ff;
    var myfont = new FontFaceObserver(font)
    myfont.load()
      .then(function () {
        console.log(':::: FONT LOADED :::: ' + font);
      }).catch(function (e) {
        console.log(e)
        console.log('font loading failed ' + font);
      });
    fontFamilyOptions += '<option style="font-size: 20px; font-family: \''+ff+'\', sans-serif;" value="\''+ff+'\', sans-serif">'+ff+'</option>';
})

$('#tb-color-pallate').html(fontFamilyOptions);

var colorPicker = null;

$(".colorPickSelector").colorPick({
    'initialColor': '#27ae60',
    'onColorSelected': function () {
        colorPicker = this;
        console.log("The user has selected the color: " + this.color)
        this.element.css({
            'backgroundColor': this.color,
            'color': this.color
        });
        applyStyle('font-color', this.color)
    }
});



var textAreaStyle = {
    fontSize: 11,
    lineHeight: 1,
    fontFamily: 'Wonderbar',
    textAlign: 'left',
    fontWeight: "",
    textDecoration: "",
    fontStyle: "",
    fill: '#00000',
    charSpacing: 1
};

var styleObj = {
    'border-color': 'borderColor',
    'font-size': 'fontSize',
    'font-family': 'fontFamily',
    'text-align': 'textAlign',
    'font-style': 'fontStyle',
    'letter-spacing': 'charSpacing',
    'line-height': 'lineHeight',
    'bg-color': 'textBackgroundColor',
    'font-color': 'fill',
    'font-weight': 'fontWeight',
    'text-decoration': 'textDecoration'
};

var canvas;
var scaleX, scaleY, textArea, textArea2, brand;
var totalAssets = 3;
var loadedAssets = 0;
var canvasScale = 1;
var SCALE_FACTOR = 1.2;
var backgroundImage = '';
var panning = false;
var orientation = 'horizontal';

//$('.shareit').click(function () {
console.log('Share Button Clicked');
$('#tb-share-dialog').show();
//});

$(document).on('click', '.tb-share-dialog-close', function () {
    $('#tb-share-dialog').hide();
});

// button Zoom In
$("#btnZoomIn").click(function () {
    zoomIn();
});
// button Zoom Out
$("#btnZoomOut").click(function () {
    zoomOut();
});
// button Reset Zoom
$("#btnResetZoom").click(function () {
    resetZoom();
});

$(document).on('click', '.tb-search-items', function () {
    console.log('image clicked');
    var imageUrl = $(this).data('url');
    $.ajax({
        url: 'tb-share-widget.php',
        type: 'POST',
        data: {
            action: 'save-image',
            imageurl: imageUrl
        },
        success: function (res) {
            console.log(res);
            fabric.Image.fromURL(res.data, function (img) {
                backgroundImage = img;
                canvas.setBackgroundImage(backgroundImage, canvas.renderAll.bind(
                    canvas), {
                    scaleX: canvas.width / backgroundImage.width,
                    scaleY: canvas.height / backgroundImage.height
                });
            });

        },
        error: function (error) {
            console.log(error);
        }
    });
});

$(document).on('click', '#tb-btnsearch', function () {
    var searchTerm = $('#tb-txtsearch').val();
    console.log('Search', searchTerm);

    if (searchTerm && searchTerm.length > 3) {
        console.log('Search it');
        $.ajax({
            url: 'tb-share-widget.php',
            type: 'POST',
            data: {
                action: 'search',
                searchterm: searchTerm,
                orientation: orientation
            },
            success: function (res) {
                console.log(res);
                var images = res.data;
                var searchHtml = '';
                images.forEach(function (item) {
                    searchHtml +=
                        '<div class="tb-search-items" data-url="' + item.largeImageURL +
                        '">\n\
                                    <a target="_blank" href="' +
                        item.pageURL +
                        '" class="tb-search-image-source-link">\n\
                                    <img class="tb-search-image-source"  src="pixabay.svg" /></a>\n\
                                    <img class="tb-search-image-preview" src="' +
                        item.previewURL +
                        '" />\n\
                                </div>';
                })
                $('#tb-bg-search-results').html(searchHtml);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
});

$(document).on('click', '.tb-share-platform-icon', function () {
    console.log($(this).data('platform'));
    $('#tb-share-platform-card').hide();
    $('#tb-share-canvas-card').show();

    var width = 1024;
    var height = 1024;
    orientation = 'horizontal';
    var platform = $(this).data('platform');
    switch (platform) {
        case 'fb':
            width = 940;
            height = 788;
            break;
        case 'in':
            width = 1080;
            height = 1080;
            break;
        case 'tw':
            width = 1024;
            height = 512;
            break;
        case 'pi':
            width = 600;
            height = 900;
            orientation = 'vertical';
            break;
        case 'gp':
            width = 1024;
            height = 512;
            break;
        case 'ge':
            width = 1024;
            height = 1024;
            break;
        default:
            break;
    }

    totalAssets = 3;
    loadedAssets = 0;

    canvas = new fabric.Canvas('tb-share-canvas', {});

    canvas.setWidth(width);
    canvas.setHeight(height);

    // initCenteringGuidelines(canvas);

    var deviceHeight = 600 * 70 / 100; //480; //;262.5;
    var deviceWidth = width * deviceHeight / height;

    $('.tb-canvas-scroll').height(deviceHeight + 10);
    console.log('Width: ' + deviceWidth);
    console.log('Height: ' + deviceHeight);
    scaleX = (deviceWidth / width);
    scaleY = (deviceHeight / height);
    console.log('Scale Factor: X: ' + scaleX + ' , Y: ' + scaleY);


    fabric.Image.fromURL(
        'http://www.qygjxz.com/data/out/129/4777797-images-wallpaper.jpeg',
        function (img) {
            backgroundImage = img;
            console.log('Image width: ' + (width / img.width) + 'Image height: ' + img.height);
            // var oImg = backgroundImage.set({
            //     // left: 0,
            //     // top: 0,
            //     // angle: 0,
            //     // width: width,
            //     // height: height,
            //     // scaleX: width / img.width, // Mobileview
            //     // scaleY:  height / img.height// Mobileview
            // });
            canvas.setBackgroundImage(backgroundImage, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width / backgroundImage.width,
                scaleY: canvas.height / backgroundImage.height
            });

            //canvas.backgroundImageStretch = true;
            //canvas.renderAll();
            // canvas.backgroundImageStretch = true;
            console.log('==> backgroud loaded');
            // var dataURL = canvas.toDataURL({
            // 	format: 'png',
            // 	quality: 0.8
            // });
            loadedAssets++;
            checkAssetsLoading();
        });

    // Add Brand Name 
    brand = new fabric.Text('site.com', {
        left: canvas.getWidth() - 160,
        top: 5,
        fontSize: 21,
        fontFamily: 'Josefin Slab',
        textAlign: 'center',
        fontWeight: "bold",
        fill: '#fff',
        borderColor: "#CCC",
        selectable: false,
        stroke: 'rgba(255, 255, 255,0.5)',
        strokeWidth: 0.2,
        // lineHeight: ta.defaultSettings.lineHeight,
        // fontFamily: ta.defaultSettings.fontFamily,
    });

    canvas.add(brand);
    loadedAssets++;
    checkAssetsLoading();
    // ------

    textArea = new fabric.Textbox(
        'To accomplish great things, we must not only act, but also dream; not only plan, but also believe.', {
            width: canvas.getWidth() - 200,
            // stroke: 'rgba(0,0,0,0.5)',
            // strokeWidth: 0.2,
            fontSize: 48,
            fontFamily: 'Lobster Two',
            textAlign: 'center',
            // fontWeight: "bold",
            textDecoration: "normal",
            fontStyle: "normal",
            fill: 'yellow',
            borderColor: "#CCC",
            editable: false,
            // lineHeight: ta.defaultSettings.lineHeight,
            // fontFamily: ta.defaultSettings.fontFamily,
        });
    textArea._forceClearCache = true;

    textArea.set({
        left: (canvas.getWidth() / 2) - (textArea.width / 2),
        top: ((canvas.getHeight() / 2) - (textArea.height / 2)),
        borderDashArray: [2, 2],
        cornerColor: 'white',
        cornerStrokeColor: 'black',
        cornerStyle: 'circle',
        cornerSize: 12,
        padding: 15,
        transparentCorners: false,
        borderScaleFactor: 2
    });

    textArea.setControlsVisibility({
        mt: false,
        mb: false,
    });

    textArea.on("changed", function (e) {
        //console.log('textchanges',e);
    });

    canvas.add(textArea);
    loadedAssets++;
    checkAssetsLoading();

    textArea2 = new fabric.Textbox('- Author Name', {
        width: 200,
        height: 150,
        stroke: 'rgba(0,0,0,0.5)',
        strokeWidth: 0.2,
        fontSize: 22,
        fontFamily: 'Bitter',
        textAlign: 'center',
        // fontWeight: "bold",
        textDecoration: "normal",
        fontStyle: "normal",
        fill: '#fff',
        borderColor: "#CCC",
        editable: false,
        // lineHeight: ta.defaultSettings.lineHeight,
        // fontFamily: ta.defaultSettings.fontFamily,
    });
    textArea2._forceClearCache = true;

    textArea2.set({
        left: (canvas.getWidth() / 2) - (textArea2.width / 2),
        top: textArea.top + textArea.height + 50,
        borderDashArray: [2, 2],
        cornerColor: 'white',
        cornerStrokeColor: 'black',
        cornerStyle: 'circle',
        cornerSize: 12,
        padding: 15,
        transparentCorners: false,
        borderScaleFactor: 2
    });

    textArea2.on("changed", function (e) {
        //console.log('textchanges',e);
    });

    canvas.add(textArea2);
    loadedAssets++;
    checkAssetsLoading();

    canvas.on("mouse:up", function (e) {
        //console.log(e);
        if (e.target != null) {
            var type = e.target.get('type');
            if (type == 'textbox') {
                console.log('textbox');
                $('#tb-share-text-controls').show();
                textAreaStyle = {
                    fontSize: e.target.fontSize,
                    lineHeight: e.target.lineHeight,
                    fontFamily: e.target.fontFamily,
                    textAlign: e.target.textAlign,
                    fontWeight: e.target.fontWeight !== undefined ? e.target.fontWeight : "normal",
                    textDecoration: e.target.textDecoration,
                    fontStyle: e.target.fontStyle !== undefined ? e.target.fontStyle : "normal",
                    fill: e.target.fill,
                    charSpacing: e.target.charSpacing !== undefined ? e.target.charSpacing : 1
                };

                setFormattingValues();
            } else if (type == 'path-group') {

            }

        } else {
            $('#tb-share-text-controls').hide();
        }
    });

});

$(document).on('click', '.tb-share-dialog-back', function () {
    $('#tb-share-platform-card').show();
    $('#tb-share-canvas-card').hide();
    canvas.dispose();

});