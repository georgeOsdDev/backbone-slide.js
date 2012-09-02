// backbone-slide.js<br>
//<br>
// backbone-slide.js is a presentation tool based on the power of backbone.js.<br>
//<br>
// MIT Licensed.<br>
// ------------------------------------------------<br>
// author:  [Takeharu Oshida](http://about.me/takeharu.oshida)<br>
// version: 0.1<br>
// url:     [http://georgeOsdDev.github.com/backbone-slide.js/](http://georgeOsdDev.github.com/backbone-slide.js/)<br>
// source:  [http://github.com/georgeOsdDev/backbone-slid.jse/](http://github.com/georgeOsdDev/backbone-slide.js/)<br>


// **Namespace** `BackboneSlide`
window.BackboneSlide ={
  Model:{},
  Collection:{},
  View:{},
  lock:false,
  current:0,
  option:{},
  // Entry point of **backbone-slide.js**
  init:function(opts){
    BackboneSlide.option = opts || {};
    // create DOM Element for slideshow.
    var wrap = document.createElement('div')
    wrap.id = "wrap";
    $('body').append(wrap);
    // crate view
    var slideView = new BackboneSlide.View.SlideView();
  }
};


$(function(){

  // **Model**<br>
  // `BackboneSlide.Model.Slide` corresponds to one slide.
  BackboneSlide.Model.Slide = Backbone.Model.extend({
  });

  // **Collection**<br>
  // The collection of `BackboneSlide.Model.Slide`
  BackboneSlide.Collection.Slides = Backbone.Collection.extend({
    model: BackboneSlide.Model.Slide
  });

  // **View**<br>
  // `BackboneSlide.View.SlideView`.
  BackboneSlide.View.SlideView = Backbone.View.extend({ 
    // `BackboneSlide.Model.Slide` is binded on this view.
    model:BackboneSlide.Model.Slide,
    // And `<body>` also binded as element on this view.
    el:$('body'),

    // initialize view
    initialize:function(){
      // create collection
      this.collection = new BackboneSlide.Collection.Slides();

      var no = 0;
      var self = this;
      _.bindAll(this, "render","keyPress","move");
      $(document).bind('keydown', this.keyPress);

      // search `<section>` tags in body element<br>
      // and handle it's inner elements (children) as a model.
      _($(self.el).find('section')).each(function(section){
        var slide = new BackboneSlide.Model.Slide({
          elements:$(section).children(),
          no:no,
        });
        // create start page.
        if(no == 0) self.render(slide);
        // add model to collection
        self.collection.add(slide);
        no++;
      });
    },

    // render slide in `<div id=#wrap></div>`<br>
    // default animation is fade,<br>
    // so `forward` option is not refferd.<br>
    // Please customize annimation.
    render:function(slide,forward){
      $('#wrap').empty();
      $('#wrap').fadeOut(250,function(){
        $('#wrap').append(slide.get('elements'));
      });
      $('#wrap').fadeIn(500);
    },

    // handle key press
    keyPress:function(e){
      switch (e.keyCode) {
        case 32: // space
        case 39: // arrow-right
          this.move(+1);
          break;
        case  8: // delete
        case 37: // arrow-left
          this.move(-1);
          break;
        default:
          break;
      }
    },

    // move slide
    move:function(direction){
      if (BackboneSlide.lock) return;
      BackboneSlide.lock = true;
      this.model = this.collection.at(BackboneSlide.current+direction);
      if (this.model) {
        BackboneSlide.current +=direction;
        this.render(this.model,direction);
      }
      BackboneSlide.lock = false;
    }
  });
});