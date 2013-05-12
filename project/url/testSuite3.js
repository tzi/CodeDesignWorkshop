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


// Exercice 2
QUnit.test('Extract protocol from absolute url', function(){
    var url = new Url('http://example.net');
    QUnit.equal(url.protocol, 'http');
    var url2 = new Url('https://example.net');
    QUnit.equal(url2.protocol, 'https');
    var url3 = new Url('ftp://example.net');
    QUnit.equal(url3.protocol, 'ftp');
});
QUnit.test('Extract domain from absolute url', function(){
    var url = new Url('http://example.net');
    QUnit.equal(url.protocol, 'http');
});
QUnit.test('Extract port from absolute url', function(){
    var url = new Url('http://example.net');
    QUnit.equal(url.port, 80);
    var url2 = new Url('http://example.net:418');
    QUnit.equal(url2.port, 418);
});
QUnit.test('Extract path from absolute url', function(){
    var url = new Url('http://example.net');
    QUnit.equal(url.path, '/');
    var url2 = new Url('http://example.net/');
    QUnit.equal(url2.path, '/');
    var url3 = new Url('http://example.net/it/is/so/funny');
    QUnit.equal(url3.path, '/it/is/so/funny');
    var url4 = new Url('http://example.net/it/is?so#funny');
    QUnit.equal(url4.path, '/it/is');
});
QUnit.test('Extract query from absolute url', function(){
    var url = new Url('http://example.net');
    QUnit.equal(url.query, '');
    var url2 = new Url('http://example.net/it/is?so#funny');
    QUnit.equal(url2.query, 'so');
    var url3 = new Url('http://example.net/it/is?so&funny');
    QUnit.equal(url3.query, 'so&funny');
});
QUnit.test('Extract anchor from absolute url', function(){
    var url = new Url('http://example.net/it/is?so#funny');
    QUnit.equal(url.anchor, 'funny');
});


// Exercice 3
QUnit.test('Reconstruct url starting with //', function(){
    var url = new Url('//example2.net2/it2/is2?so2#funny2', 'http://example.net/it/is?so#funny');
    QUnit.equal(url.full, 'http://example2.net2/it2/is2?so2#funny2');
});
QUnit.test('Reconstruct url starting with /', function(){
    var url = new Url('/it2/is2?so2#funny2', 'http://example.net/it/is?so#funny');
    QUnit.equal(url.full, 'http://example.net/it2/is2?so2#funny2');
});
QUnit.test('Reconstruct url starting with :', function(){
    var url = new Url(':802/it2/is2?so2#funny2', 'http://example.net/it/is?so#funny');
    QUnit.equal(url.full, 'http://example.net:802/it2/is2?so2#funny2');
});
QUnit.test('Reconstruct url starting with page', function(){
    var url = new Url('is2?so2#funny2', 'http://example.net/it/is?so#funny');
    QUnit.equal(url.full, 'http://example.net/it/is2?so2#funny2');
});
QUnit.test('Reconstruct url starting with ?', function(){
    var url = new Url('?so2#funny2', 'http://example.net/it/is?so#funny');
    QUnit.equal(url.full, 'http://example.net/it/is?so2#funny2');
});
QUnit.test('Reconstruct url starting with #', function(){
    var url = new Url('#funny2', 'http://example.net/it/is?so#funny');
    QUnit.equal(url.full, 'http://example.net/it/is?so#funny2');
});