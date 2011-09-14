var ZweGrowing = new Class({
    Implements: [Options, Events],

    options: {

    }
});

ZweGrowing.Input = new Class();

ZweGrowing.TextArea = new Class({
    Implements: [Options, Events],

    options: {
        min: 20,

        duration: 200,
        transition: Fx.Transitions.Sine.easeOut
    },

    element: null,
    animation: null,

    initialize: function(element, options)
    {
        this.setOptions(options);
        this.element = document.id(element).setStyle('overflow', 'hidden');
        this.animation = new Fx.Tween(this.element, {
            property: 'height',
            duration: this.options.duration,
            transition: this.options.transition
        });

        this.element.addEvent('keyup', this._resize.bind(this));
        this._resize();
    },

    _resize: function()
    {
        var size = this.element.getStyle('height').toInt(),
            scroll = this.element.getScrollSize();

        if(scroll.y > this.options.min && size != scroll.y)
            this.animation.start(size, scroll.y);
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