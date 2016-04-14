// ʵ��һ���򵥵�Query
function $(selector) {
    var idRegex = /^#([\w\-\.\:]+)/;
    var tagRegex = /^\w+$/;
    var classRegex = /^\.([\w\-\.\:]+)/;
    // [data-log]
    // [data-log="test"]
    // [data-log=test]
    // [data-log='test']
    var attrRegex = /(\w+)?\[([^=\]]+)(?:=(["'])?([^\]"']+)\3?)?\]/;    //important!!
    var selectActions = trim(selector).split(" ");
    
    //���ϲ���
    if (selectActions.length > 1) {    
        var root = $(selectActions[selectActions.length - 1]);
        if (root.length == 0) {
            return null;
        }
        
        if (!isArray(root)) {
            root = toArray(root);
        }
        for (var cur = 2; cur <= selectActions.length; cur++) {
            root = fliterParent(root, selectActions[selectActions.length - cur]);
        }
        return root;
    }
    
    //ͨ��id����
    if (idRegex.test(selector)) {
        return document.getElementById(selector.slice(1, selector.length));
    }
    
    //ͨ��tagname����
    if (tagRegex.test(selector)) {
        return document.getElementsByTagName(selector)[0];    //only return first tag;
    }
    
    //ͨ��class����
    if (classRegex.test(selector)) {
        if (document.getElementsByClassName) {    //�����֧��getElementsByClassName
            return document.getElementsByClassName(selector.slice(1, selector.length));
        }
        else {
            var allNodes = document.getElementsByTagName("*");
            var result = [];
            for (var cur = 0; cur < allNodes.length; cur++) {
                if (hasClass(allNodes[cur], selector.slice(1, selector.length))) {
                    result.push(allNodes[cur]);
                }
            }
            return result;
        }
    }
    
    //ͨ�����Բ���
    if (attrRegex.test(selector)) {
        var result = [];
        var allNodes = document.getElementsByTagName("*");
        var matchResult = selector.match(attrRegex);
        var tag = matchResult[1]; 
        var key = matchResult[2];
        var value = matchResult[4];
        for (var cur = 0; cur < allNodes.length; cur++) {
            if (value) {
                var temp = allNodes[cur].getAttribute(key);
                if (temp === value) {
                    result.push(allNodes[cur]);
                }
                else {
                    continue;
                }
            }
            else {
                if (allNodes[cur].hasAttribute(key)) {
                    result.push(allNodes[cur]);
                }
            }
        }
        return result;
    }
}

// ���ַ���ͷβ���пո��ַ���ȥ��������ȫ�ǰ�ǿո�Tab�ȣ�����һ���ַ���
// ����ʹ��һ�м���������ʽ��ɸ���Ŀ
function trim(str) {
    var regex1 = /^\s*/;
    var regex2 = /\s*$/;
    return (str.replace(regex1, "")).replace(regex2, "");
}

// �ж�arr�Ƿ�Ϊһ�����飬����һ��boolֵ
function isArray(arr) {
    return (Object.prototype.toString.call(arr) === '[object Array]');
}

// �õ�������Array
function toArray(root) {
    var arr = [];
    for (var cur = 0; cur < root.length; cur++) {
        arr.push(root[cur]);
    }
    return arr;
}

// ��һ��element��һ�����event�¼�����Ӧ����Ӧ����Ϊlistener
function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + event, listener);
    }
    else {
        element["on" + event] = listener;
    }
}