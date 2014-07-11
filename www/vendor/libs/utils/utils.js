define(function(){
    'use strict';
    
    /* accepts parameters
     * h  Object = {h:x, s:y, v:z}
     * OR 
     * h, s, v
    */
    function hsbToRgb(h, s, v) {
        var r, g, b, i, f, p, q, t;
        
        if (h && s === undefined && v === undefined) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.floor(r * 255),
            g: Math.floor(g * 255),
            b: Math.floor(b * 255)
        };
    };
    
    function createSwf(src, attributes, parameters) {
        var i, 
            html = '<object', 
            div, 
            obj, 
            attr = attributes || {}, 
            param = parameters || {};
        
        attr.type = 'application/x-shockwave-flash';
        
        if (window.ActiveXObject) {
            attr.classid = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000';
            param.movie = src;
        }
        else {
            attr.data = src;
        }
        
        for (i in attr) {
            html += ' ' + i + '="' + attr[i] + '"';
        }
        html += '>';
        for (i in param) {
            html += '<param name="' + i + '" value="' + param[i] + '" />';
        }
        html += '</object>';
        
        div = document.createElement('div');
        div.innerHTML = html;
        obj = div.firstChild;
        div.removeChild(obj);
        
        return obj;
    };

    return {
        hsbToRgb: hsbToRgb,
        createSwf: createSwf
    };
});