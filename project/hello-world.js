function TestSuite(js) {
    eval(js);
    QUnit.test('Hello world test suite', function(){
        QUnit.equal(new GoBan().getName(), 'Hello World');
    });
}

App.init((function GoBan() {
    this.getName = function() {
        return 'Hello World';
    };
}).toString());