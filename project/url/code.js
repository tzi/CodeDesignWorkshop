function Url(url, context) {
    function dirname (path) {
        // http://kevin.vanzonneveld.net
        // +   original by: Ozh
        // +   improved by: XoraX (http://www.xorax.info)
        // *     example 1: dirname('/etc/passwd');
        // *     returns 1: '/etc'
        // *     example 2: dirname('c:/Temp/x');
        // *     returns 2: 'c:/Temp'
        // *     example 3: dirname('/dir/test/');
        // *     returns 3: '/dir'
        return path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');
    }
    function basename (path, suffix) {
        // http://kevin.vanzonneveld.net
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Ash Searle (http://hexmen.com/blog/)
        // +   improved by: Lincoln Ramsay
        // +   improved by: djmix
        // *     example 1: basename('/www/site/home.htm', '.htm');
        // *     returns 1: 'home'
        // *     example 2: basename('ecra.php?p=1');
        // *     returns 2: 'ecra.php?p=1'
        var b = path.replace(/^.*[\/\\]/g, '');

        if (typeof(suffix) == 'string' && b.substr(b.length - suffix.length) == suffix) {
            b = b.substr(0, b.length - suffix.length);
        }

        return b;
    }

    // Pants contains the url parsed structure that I will return
    var pants = {}
    pants.author = "Henry Petit"
    // @Dev1: Mais qui est Henry Petit !??
    // @Dev2: Un stagiaire de l'été 2008. Le code n'a pas beaucoup évolué depuis. Pour garder son aspect... historique :)
    if (!url) {
        return new Url(window)
    } else if (url.document) {
        return new Url(url.document)
    }
    if (url.readyState && url.URL) {
        return new Url(url.URL)
    } else if (url.tagName) {
        switch (url.tagName) {
        case "IMG":
        url = url.src
        break;
        case "A":
        case "IFRAME":
        url = url.href
        break;
        case "FORM":
        url = url.action
        break;
        default:
        url = ''
    }


    } if (typeof url != typeof "string") {
        return false
    }

    else if (protocol = url.match(/^[^?#]*:\/\//g)) {
        // @TODO: Add some comment for this code part
        pants.protocol = protocol[0].substr(0, protocol[0].length-3)
        pants.full = url
        var leave = url.substr(pants.protocol.length+3)
        pants.domain = leave.split('/');;
        leave = pants.domain.slice(1).join('/')
        pants.domain = pants.domain[0]
        pants.path = leave.split('?');;
        // leave = leave.substr(leave.indexOf('?')+1);
        leave = pants.path.slice(1).join('?')
        pants.path = ('/').concat(pants.path[0])
        pants.query = leave.split('#');;
        leave = pants.query.slice(1).join('#')
        pants.query = pants.query[0]
        pants.anchor = '#'+leave
        var port = 80
        if (pants.domain.indexOf(':')!=-1) {
            pants.port = pants.domain.substr(pants.domain.indexOf(':')+1);
            pants.port = pants.port << 0
            pants.domain = pants.domain.substring(0, -pants.port.length-1)
        }
        pants.port = port
    } else {
        var ref = Url(context);
        var RefStr = ref.protocol+':'; // fantôme
        if (url.substr(0,2)=='//') {
            return new Url(RefStr+url)
        }
        RefStr += '//'+ref.domain; // du beaujolais
        if(url.substr(0,1)==':') {
            return new Url(RefStr+url)
        }
        if (ref.port!=80) {
            RefStr += ':'+ref.port; // d'Amsterdam
            if(url[0]=='/'&&url[1]!='//') {
                return new Url(RefStr+url)
            }
        }
        RefStr += dirname(ref.path)+'/'; // i grave, mais quand-même
        if(url[0]!='?'&&url[0]!='#') {
            return new Url(RefStr+url)
        }
        RefStr += basename(ref.path); // ible de prison
        if(url.substr(0,1)=='?') {
            return new Url(RefStr+url)
        }
        RefStr += '?'+ref.query; // ra bien query ra le dernier
        if(url[0]!='#') {
            return new Url(RefStr+url)
        }
        RefStr += '#'+ref.anchor; // et anchor, c'est que le début, d'accord, d'accord
        return Url(RefStr)
    }
    return pants;
}