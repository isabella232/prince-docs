var blacklistFullDesc = ['document.write', 'document.writeln'];
var blacklistPropName = ['constructor']; // It is everywhere..
var root = document.getElementById('js-support-table');
function buildSubTree(objReferenceList, objAnnotations, rootElm, actualParentObj, parentDescs) {
    for(var prop in objReferenceList) {
        if(blacklistPropName.indexOf(prop) > -1) {
            continue;
        }
        if(blacklistFullDesc.indexOf(parentDescs.join('.') + '.' + prop) > -1) {
            continue;
        }
        var obj = objReferenceList[prop];
        var annotations = objAnnotations ? objAnnotations[prop] : {};
        try{
            var theRealThing = actualParentObj[prop];
        }catch(e){}
        var hasChildren = Object.keys(obj).length > 0;
        var numArgs = 0;
        try{
            var numArgs = theRealThing && theRealThing.length || 0;
        }catch(e){}
        var thisDiv = add(rootElm, prop, annotations, typeof theRealThing, hasChildren, numArgs, parentDescs);
        thisDiv.className = 'level';
        if(annotations && annotations.ext) {
            thisDiv.className += ' ext';
        }
        if(thisDiv && hasChildren){
            buildSubTree(obj, annotations, thisDiv.appendChild(document.createElement('div')), theRealThing, parentDescs.concat([prop]));
        }
    }
}
function add(parent, thing, annotations, type, hasChildren, length, parentDescs) {
    if(parent.tagName.toUpperCase() === 'DIV'){
        var thisParent = parent.appendChild(document.createElement('details'));
        thisParent.className = 'details-' + type;
        var summary = document.createElement('summary');
        var theSummary = thisParent.appendChild(summary);
        if(parentDescs) {
            theId = parentDescs.join('.') + '.' + thing;
        } else {
            theId = thing;
        }
        summary.setAttribute("id", theId);
        if(theId == '.window') {
            var att = document.createAttribute('open');
            thisParent.setAttributeNode(att);
        }
        var c = theSummary.appendChild(document.createElement('code'))
        var b = c.appendChild(document.createElement('b')), div, span, ul, li, code;
        if(type === 'undefined') {
            type = '';
        }
        b.appendChild(document.createTextNode(thing));
        if ((type === 'function') || (annotations && annotations.arguments)) {
            var argslist = (annotations && annotations.arguments ? annotations.arguments.map(function(item) {return item.name}) : [])
            .join(', ');
            span = b.appendChild(document.createElement('span'));
            span.className = 'argslist';
            span.appendChild(document.createTextNode(argslist))
        }
        b.className = 'name';
        var selflink = document.createElement('a');
        selflink.setAttribute("href", "#" + parentDescs.join('.') + '.' + thing);
        selflink.setAttribute("class", "self-link");
        theSummary.appendChild(selflink);
        var div = document.createElement('div');
        var theDetailsDiv = thisParent.appendChild(div);
        if(annotations && annotations.type) {
            span = theDetailsDiv.appendChild(document.createElement('span'));
            span.className = 'type';
            span.appendChild(document.createTextNode(annotations.type));
        } else {
            span = theDetailsDiv.appendChild(document.createElement('span'));
            span.className = 'type';
            span.appendChild(document.createTextNode(type));
        }
        if(annotations && annotations.url) {
            div = theDetailsDiv.appendChild(document.createElement('div'));
            div.className = 'url-property';
            property = thing.replace(/([A-Z])/g, '-$1').toLowerCase();
            url = div.appendChild(document.createElement('a'));
            url.setAttribute("href", "/doc/css-props#prop-" + property);
            url.appendChild(document.createTextNode(property));
        }
        if(annotations && annotations.desc) {
            div = theDetailsDiv.appendChild(document.createElement('div'));
            div.className = 'desc';
            div.innerHTML = annotations.desc;
        }
        if(annotations && annotations.arguments && annotations.arguments.length) {
            var ul = theDetailsDiv.appendChild(document.createElement('ul'));
            ul.className = 'arguments';
            annotations.arguments.forEach(function (arg) {
                li = ul.appendChild(document.createElement('li'));
                div = li.appendChild(document.createElement('div'));
                li.className = 'argument';
                if(arg.name) {
                    div = li.appendChild(document.createElement('div'));
                    div.className = 'name level';
                    div.appendChild(document.createTextNode(arg.name));
                }
                if(arg.type) {
                    div = li.appendChild(document.createElement('div'));
                    div.className = 'type';
                    div.appendChild(document.createTextNode(arg.type));
                }
                if(arg.desc) {
                    div = li.appendChild(document.createElement('div'));
                    div.className = 'desc';
                    div.appendChild(document.createTextNode(arg.desc));
                }
            });
        }
        if(annotations && annotations.returns) {
            div = theDetailsDiv.appendChild(document.createElement('div'));
            div.className = 'returns level';
            div.innerHTML = annotations.returns;
        }
        if(annotations && annotations.example) {
            example = theDetailsDiv.appendChild(document.createElement('div'));
            example.className = 'example';
            proglist = example.appendChild(document.createElement('div'));
            proglist.className = 'programlisting';
            code = proglist.appendChild(document.createElement('pre'));
            code.className = 'example level';
            code.language = 'javascript';
            code.appendChild(document.createTextNode(annotations.example));
            if (annotations && annotations.exampleReturn) {
                div = code.appendChild(document.createElement('div'));
                div.className = 'example-return';
                div.appendChild(document.createTextNode(annotations.exampleReturn));
            }
        }
        thisParent.className = type + (hasChildren ? ' children' : '');
        return thisParent;
    }
}
root = add(root, 'window', {desc: 'The global object', type: 'object'}, 'object', true, 0, ['']);
root = root.appendChild(document.createElement('div'));
buildSubTree(std, stdAnnotated, root, window, ['window']);
