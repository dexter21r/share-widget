var fontSizeOptions = '';

for (var fs = 12; fs < 110; fs += 2) {
    fontSizeOptions += '<option value="' + fs + '">' + fs + '</option>';
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

fontFamilyArray.forEach(function (ff) {
    var font = ff;
    var myfont = new FontFaceObserver(font)
    myfont.load()
        .then(function () {
            console.log(':::: FONT LOADED :::: ' + font);
        }).catch(function (e) {
            console.log(e)
            console.log('font loading failed ' + font);
        });
    fontFamilyOptions += '<option style="font-size: 20px; font-family: \'' + ff + '\', sans-serif;" value="\'' + ff + '\', sans-serif">' + ff + '</option>';
})

$('#tb-font-family').html(fontFamilyOptions);

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

var searchCategories = [
    'fashion',
    'nature',
    'backgrounds',
    'science',
    'education',
    'people',
    'feelings',
    'religion',
    'health',
    'places',
    'animals',
    'industry',
    'food',
    'computer',
    'sports',
    'transportation',
    'travel', 
    'buildings', 
    'business', 
    'music'
];

var searchcategoryHtml = '';

searchCategories.forEach(function(c,i){
    searchcategoryHtml += '<span class="tb-search-tag-item" data-tag="'+c+'">'+c+'</span>';
});

$('#tb-search-tags').html(searchcategoryHtml);

$(document).on('click','.tb-search-tag-item',function(){
    var tag = $(this).data('tag');
    console.log('tag Clicked', tag);
    searchBackgrounds( '', tag, orientation);
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
var backgroundImage = null;
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
                // backgroundImage.crossOrigin="anonymous";
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
        searchBackgrounds(searchTerm, '', orientation);
    }
});


function searchBackgrounds(searchTerm, searchTag, orientation) {
    console.log('Search it');
    $.ajax({
        url: 'tb-share-widget.php',
        type: 'POST',
        data: {
            action: 'search',
            searchterm: searchTerm,
            category: searchTag,
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

$(document).on('click', '.tb-share-platform-icon', function () {
    console.log($(this).data('platform'));
    $('#tb-share-platform-card').hide();
    $('#tb-share-dialog').show();

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
    $('#tb-share-dialog').hide();
    canvas.dispose();

});

// ============================================ BG Filters ==================================
var f = fabric.Image.filters;
console.log(f);
var availableFilters = ['Sepia','Sepia2', 'Invert', 'Grayscale', 'Noise'];
var filtersHtml = '';
availableFilters.forEach(function(f,i){
    filtersHtml += '<span class="tb-share-bg-filter-item" data-filter="'+f+'">'+f+'</span>';
});

$('.tb-share-bg-filters').html(filtersHtml);

$(document).on('click','.tb-share-bg-filter-item', function(e){
    var filter = $(this).data('filter');
    console.log('filter clicked', filter);
    switch (filter) {
        case 'Sepia':
            applyFilter( new f.Sepia());
            break;
            case 'Sepia2':
            applyFilter( new f.Sepia2());
            break;
            case 'Invert':
            applyFilter( new f.Invert());
            break;
            case 'Grayscale':
            applyFilter( new f.Grayscale());
            break;
            case 'Noise':
            applyFilter( new f.Noise({noise:100}));
            break;
    
        default:
            break;
    }
});



$('#brownie').click(function(e) {
    applyFilter(4, this.checked && new f.Brownie());
  });
  $('vintage').onclick = function() {
    applyFilter(9, this.checked && new f.Vintage());
  };
  $('technicolor').onclick = function() {
    applyFilter(14, this.checked && new f.Technicolor());
  };
  $('polaroid').onclick = function() {
    applyFilter(15, this.checked && new f.Polaroid());
  };
  $('kodachrome').onclick = function() {
    applyFilter(18, this.checked && new f.Kodachrome());
  };
  $('blackwhite').onclick = function() {
    applyFilter(19, this.checked && new f.BlackWhite());
  };
  $('grayscale').onclick = function() {
    applyFilter(0, this.checked && new f.Grayscale());
  };
  $('average').onclick = function() {
    applyFilterValue(0, 'mode', 'average');
  };
  $('luminosity').onclick = function() {
    applyFilterValue(0, 'mode', 'luminosity');
  };
  $('lightness').onclick = function() {
    applyFilterValue(0, 'mode', 'lightness');
  };
  $('invert').onclick = function() {
    applyFilter(1, this.checked && new f.Invert());
  };
  $('remove-color').onclick = function () {
    applyFilter(2, this.checked && new f.RemoveColor({
      distance: $('remove-color-distance').value,
      color: $('remove-color-color').value,
    }));
  };
  $('remove-color-color').onchange = function() {
    applyFilterValue(2, 'color', this.value);
  };
  $('remove-color-distance').oninput = function() {
    applyFilterValue(2, 'distance', this.value);
  };
  $('sepia').onclick = function() {
    applyFilter(3, this.checked && new f.Sepia());
  };
  $('brightness').onclick = function () {
    applyFilter(5, this.checked && new f.Brightness({
      brightness: parseFloat($('brightness-value').value)
    }));
  };
  $('brightness-value').oninput = function() {
    applyFilterValue(5, 'brightness', parseFloat(this.value));
  };
  $('gamma').onclick = function () {
    var v1 = parseFloat($('gamma-red').value);
    var v2 = parseFloat($('gamma-green').value);
    var v3 = parseFloat($('gamma-blue').value);
    applyFilter(17, this.checked && new f.Gamma({
      gamma: [v1, v2, v3]
    }));
  };
  $('gamma-red').oninput = function() {
    var current = getFilter(17).gamma;
    current[0] = parseFloat(this.value);
    applyFilterValue(17, 'gamma', current);
  };
  $('gamma-green').oninput = function() {
    var current = getFilter(17).gamma;
    current[1] = parseFloat(this.value);
    applyFilterValue(17, 'gamma', current);
  };
  $('gamma-blue').oninput = function() {
    var current = getFilter(17).gamma;
    current[2] = parseFloat(this.value);
    applyFilterValue(17, 'gamma', current);
  };
  $('contrast').onclick = function () {
    applyFilter(6, this.checked && new f.Contrast({
      contrast: parseFloat($('contrast-value').value)
    }));
  };
  $('contrast-value').oninput = function() {
    applyFilterValue(6, 'contrast', parseFloat(this.value));
  };
  $('saturation').onclick = function () {
    applyFilter(7, this.checked && new f.Saturation({
      saturation: parseFloat($('saturation-value').value)
    }));
  };
  $('saturation-value').oninput = function() {
    applyFilterValue(7, 'saturation', parseFloat(this.value));
  };
  $('noise').onclick = function () {
    applyFilter(8, this.checked && new f.Noise({
      noise: parseInt($('noise-value').value, 10)
    }));
  };
  $('noise-value').oninput = function() {
    applyFilterValue(8, 'noise', parseInt(this.value, 10));
  };
  $('pixelate').onclick = function() {
    applyFilter(10, this.checked && new f.Pixelate({
      blocksize: parseInt($('pixelate-value').value, 10)
    }));
  };
  $('pixelate-value').oninput = function() {
    applyFilterValue(10, 'blocksize', parseInt(this.value, 10));
  };
  $('blur').onclick = function() {
    applyFilter(11, this.checked && new f.Blur({
      value: parseFloat($('blur-value').value)
    }));
  };
  $('blur-value').oninput = function() {
    applyFilterValue(11, 'blur', parseFloat(this.value, 10));
  };
  $('sharpen').onclick = function() {
    applyFilter(12, this.checked && new f.Convolute({
      matrix: [  0, -1,  0,
                -1,  5, -1,
                 0, -1,  0 ]
    }));
  };
  $('emboss').onclick = function() {
    applyFilter(13, this.checked && new f.Convolute({
      matrix: [ 1,   1,  1,
                1, 0.7, -1,
               -1,  -1, -1 ]
    }));
  };
  $('blend').onclick= function() {
    applyFilter(16, this.checked && new f.BlendColor({
      color: document.getElementById('blend-color').value,
      mode: document.getElementById('blend-mode').value,
      alpha: document.getElementById('blend-alpha').value
    }));
  };

  $('blend-mode').onchange = function() {
    applyFilterValue(16, 'mode', this.value);
  };

  $('blend-color').onchange = function() {
    applyFilterValue(16, 'color', this.value);
  };

  $('blend-alpha').oninput = function() {
    applyFilterValue(16, 'alpha', this.value);
  };

  $('hue').onclick= function() {
    applyFilter(21, this.checked && new f.HueRotation({
      rotation: document.getElementById('hue-value').value,
    }));
  };

  $('hue-value').oninput = function() {
    applyFilterValue(21, 'rotation', this.value);
  };

  $('blend-image').onclick= function() {
    applyFilter(20, this.checked && new f.BlendImage({
      image: fImage,
    }));
  };

  $('blend-image-mode').onchange = function() {
    applyFilterValue(20, 'mode', this.value);
  };