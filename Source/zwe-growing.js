var ZweGrowing = new Class({
    Implements: [Options, Events],

    options: {
        min: 20,
        extraSpace: 10,

        duration: 200,
        transition: Fx.Transitions.Sine.easeOut/*,

        onResize: function(){},
        onResized: function(){}*/
    },

    element: null,
    clone: null,
    animation: null,

    originalSize: 0,
    scroll: 0,
    lastScroll: 0,

    property: null,

    initialize: function(element, options)
    {
        if(!this.property || !['height', 'width'].contains(this.property))
            return;

        this.setOptions(options);
        this.element = document.id(element).setStyles({
            resize: 'none',
            'overflow-y': 'hidden'
        });

        this.originalSize = this.element.getStyle(this.property).toInt();

        this._addClone();
        this._addAnimation();
        this._addEvents();
        this._resize();
    },

    _addClone: function()
    {
        this.clone.inject(document.body);
        ['font-size', 'font-family', 'padding-left', 'padding-top', 'padding-bottom',
		 'padding-right', 'border-left', 'border-right', 'border-top', 'border-bottom',
		 'word-spacing', 'letter-spacing', 'text-indent', 'text-transform', 'text-decoration',
         'line-height'].each(function(property){
            this.clone.setStyle(property, this.element.getStyle(property));
        }, this);
    },

    _addAnimation: function()
    {
        this.animation = new Fx.Tween(this.element, {
            property: this.property,
            duration: this.options.duration,
            transition: this.options.transition
        })
    },

    _addEvents: function()
    {
        this.element.addEvents({
            keyup: this._resize.bind(this),
            keydown: this._resize.bind(this),
            change: this._resize.bind(this)
        });
    },

    _resize: function()
    {
        this._calculate();

        if(this.lastScroll === this.scroll)
            return;

        this.lastScroll = this.scroll;

        this.fireEvent('resize');

        this.animation.start(this.element.getStyle(this.property), this.scroll).chain(this.fireEvent.bind(this, 'resized'));
    },

    _calculate: function()
    {
        // To be overridden
    }
});

ZweGrowing.Input = new Class({
    Extends: ZweGrowing,

    options: {
        duration: 0
    },

    property: 'width',

    _addClone: function()
    {
        this.clone = new Element('span', {
            styles: {
                'float': 'left',
                display: 'inline-block',
                position: 'absolute',
                left: -9999
            }
        });
        this.parent();
    },

    _calculate: function()
    {
        this.clone.set('text', this.element.get('value'));
        this.scroll = Math.max(this.originalSize, this.clone.getStyle(this.property).toInt()) + this.options.extraSpace;
    }
});

ZweGrowing.TextArea = new Class({
    Extends: ZweGrowing,

    property: 'height',

    _addClone: function()
    {
        this.clone = this.element.clone().set('name', '').setStyles({
            position: 'absolute',
            top: 0,
            left: -9999,
            height: this.element.getStyle('height'),
            width: this.element.getStyle('width')
        });
        this.parent();
    },

    _calculate: function()
    {
        this.clone.setStyle(this.property, 0);
        this.clone.set('value', this.element.get('value'));
        this.scroll = Math.max(this.originalSize, this.clone.getScrollSize().y) + this.options.extraSpace;
    }
});

Element.implement({
    zweGrowing: function(options){
        if('textarea' == this.get('tag'))
            new ZweGrowing.TextArea(this, options);
        else if('input' == this.get('tag') && ('text' == this.get('type') || 'password' == this.get('type')))
            new ZweGrowing.Input(this, options);

        return this;
    }
});