/* Exercise 1
 ==================================================================*/
QUnit.test('Instantiate Url without argument', function(){
    var url = new Url();
    QUnit.equal(url.full, window.location.href);
    QUnit.equal(url.protocol+':', window.location.protocol);
    QUnit.equal(url.port, 80);
    QUnit.equal(url.domain, window.location.host);
    QUnit.equal(url.path, window.location.pathname);
});

QUnit.test('Instantiate Url with the current window', function(){
    var url = new Url(window);
    QUnit.equal(url.full, window.location.href);
    QUnit.equal(url.protocol+':', window.location.protocol);
});

QUnit.test('Instantiate Url with the current document', function(){
    var url = new Url(document);
    QUnit.equal(url.full, window.location.href);
    QUnit.equal(url.protocol+':', window.location.protocol);
});

QUnit.test('Instantiate Url with the an IMG element', function(){
    var el = document.createElement('img')
    el.setAttribute('src', 'http://example.net')
    var url = new Url(el);
    QUnit.equal(url.full, 'http://example.net/');
});

QUnit.test('Instantiate Url with the an A element', function(){
    var el = document.createElement('a')
    el.setAttribute('href', 'http://example.net')
    var url = new Url(el);
    QUnit.equal(url.full, 'http://example.net/');
});

QUnit.test('Instantiate Url with the an IFRAME element', function(){
    var el = document.createElement('iframe')
    el.setAttribute('src', 'http://example.net')
    var url = new Url(el);
    QUnit.equal(url.full, 'http://example.net/');
});

QUnit.test('Instantiate Url with the a FORM element', function(){
    var el = document.createElement('form')
    el.setAttribute('action', 'http://example.net')
    var url = new Url(el);
    QUnit.equal(url.full, 'http://example.net/');
});

QUnit.test('Instantiate Url with an absolute url', function(){
    var url = new Url('http://example.net:418/');
    QUnit.equal(url.full, 'http://example.net:418/');
});



/* Exercise 2
 ==================================================================*/
QUnit.test('Validation of the protocol attribute of Url', function(){
    var url = new Url('http://example.net');
    QUnit.equal(url.protocol, 'http');
    var url2 = new Url('https://example.net');
    QUnit.equal(url2.protocol, 'https');
    var url3 = new Url('ftp://example.net');
    QUnit.equal(url3.protocol, 'ftp');
});

QUnit.test('Validation of the domain attribute of Url', function(){
    var url = new Url('http://example.net');
    QUnit.equal(url.domain, 'example.net');
});

QUnit.test('Validation of the port attribute of Url', function(){
    var url = new Url('http://example.net');
    QUnit.equal(url.port, 80);
    var url2 = new Url('http://example.net:418');
    QUnit.equal(url2.port, 418);
});

QUnit.test('Validation of the path attribute of Url', function(){
    var url = new Url('http://example.net');
    QUnit.equal(url.path, '/');
    var url2 = new Url('http://example.net/');
    QUnit.equal(url2.path, '/');
    var url3 = new Url('http://example.net/it/is/so/funny');
    QUnit.equal(url3.path, '/it/is/so/funny');
    var url4 = new Url('http://example.net/it/is?so#funny');
    QUnit.equal(url4.path, '/it/is');
});

QUnit.test('Validation of the query attribute of Url', function(){
    var url = new Url('http://example.net');
    QUnit.equal(url.query, '');
    var url2 = new Url('http://example.net/it/is?so#funny');
    QUnit.equal(url2.query, 'so');
    var url3 = new Url('http://example.net/it/is?so&funny');
    QUnit.equal(url3.query, 'so&funny');
});

QUnit.test('Validation of the anchor attribute of Url', function(){
    var url = new Url('http://example.net/it/is?so#funny');
    QUnit.equal(url.anchor, 'funny');
});



/* Exercise 3
 ==================================================================*/
QUnit.test('Instantiate Url with a relative url starting with a "//"', function(){
    var url = new Url('//example2.net2/it2/is2?so2#funny2', 'http://example.net/it/is?so#funny');
    QUnit.equal(url.full, 'http://example2.net2/it2/is2?so2#funny2');
});

QUnit.test('Instantiate Url with a relative url starting with a "/"', function(){
    var url = new Url('/it2/is2?so2#funny2', 'http://example.net/it/is?so#funny');
    QUnit.equal(url.full, 'http://example.net/it2/is2?so2#funny2');
});

QUnit.test('Instantiate Url with a relative url starting with a ":"', function(){
    var url = new Url(':802/it2/is2?so2#funny2', 'http://example.net/it/is?so#funny');
    QUnit.equal(url.full, 'http://example.net:802/it2/is2?so2#funny2');
});

QUnit.test('Instantiate Url with a relative url starting with a letter', function(){
    var url = new Url('is2?so2#funny2', 'http://example.net/it/is?so#funny');
    QUnit.equal(url.full, 'http://example.net/it/is2?so2#funny2');
});

QUnit.test('Instantiate Url with a relative url starting with a "?"', function(){
    var url = new Url('?so2#funny2', 'http://example.net/it/is?so#funny');
    QUnit.equal(url.full, 'http://example.net/it/is?so2#funny2');
});

QUnit.test('Instantiate Url with a relative url starting with a "#"', function(){
    var url = new Url('#funny2', 'http://example.net/it/is?so#funny');
    QUnit.equal(url.full, 'http://example.net/it/is?so#funny2');
});



/* Exercise 4
 ==================================================================*/
QUnit.test('Instantiate Url with an absolute url not ending with a "/"', function(){
    var url = new Url('http://example.net');
    QUnit.equal(url.path, '/');
    QUnit.equal(url.full, 'http://example.net/');
    var url2 = new Url('http://example.net/path');
    QUnit.equal(url2.path, '/path');
    QUnit.equal(url2.full, 'http://example.net/path');
});