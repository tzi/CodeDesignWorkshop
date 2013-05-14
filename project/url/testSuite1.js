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