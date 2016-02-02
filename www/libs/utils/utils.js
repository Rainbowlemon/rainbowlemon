define(function(){
    'use strict';
    
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
        createSwf: createSwf
    };
});