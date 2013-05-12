QUnit.test('For empty arguments, return document url', function(){
    var url = new Url();
    QUnit.equal(url.full, window.location.href);
    QUnit.equal(url.protocol+':', window.location.protocol);
    QUnit.equal(url.port, 80);
    QUnit.equal(url.domain, window.location.host);
    QUnit.equal(url.path, window.location.pathname);
});
QUnit.test('For window, return associate url', function(){
    var url = new Url(window);
    QUnit.equal(url.full, window.location.href);
    QUnit.equal(url.protocol+':', window.location.protocol);
});
QUnit.test('For document, return associate url', function(){
    var url = new Url(document);
    QUnit.equal(url.full, window.location.href);
    QUnit.equal(url.protocol+':', window.location.protocol);
});
QUnit.test('For image, return associate url', function(){
    var el = document.createElement('img')
    el.setAttribute('src', 'http://example.net')
    var url = new Url(el);
    QUnit.equal(url.full, 'http://example.net/');
});
QUnit.test('For link, return associate url', function(){
    var el = document.createElement('a')
    el.setAttribute('href', 'http://example.net')
    var url = new Url(el);
    QUnit.equal(url.full, 'http://example.net/');
});
QUnit.test('For iframe, return associate url', function(){
    var el = document.createElement('iframe')
    el.setAttribute('src', 'http://example.net')
    var url = new Url(el);
    QUnit.equal(url.full, 'http://example.net/');
});
QUnit.test('For form, return associate url', function(){
    var el = document.createElement('form')
    el.setAttribute('action', 'http://example.net')
    var url = new Url(el);
    QUnit.equal(url.full, 'http://example.net/');
});