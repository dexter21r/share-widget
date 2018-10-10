import $ from 'jquery';

export default class PicBeautify {

  isDailogOpen = false;

  constructor() {
    let that = this;
    $.get("http://localhost/lab/canvas-app/html/dist-widget/src/index.html", function( pluginHtml ) {
      console.log(pluginHtml);
      that.init(pluginHtml);
    }); 
   
  }

  init(pluginHtml) {
    let initHtml = '<div id="#livedigi-pic-beautify-widget">' + pluginHtml + '</div>';

    $('body').prepend(initHtml);
  }

  getPluginHtml() {
    return '';
  }

  openPicBeautifyDailog() {
    this.isDailogOpen = true;
    $('#tb-share-dialog').show();
  }

}
