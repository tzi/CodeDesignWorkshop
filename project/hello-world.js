function TestSuite(js) {
    eval(js);
    QUnit.test('The main function return "Hello World"', function(){
        QUnit.equal(main(), 'Hello World');
    });
}

App.init((function main() {
    return 'Hello World';
}).toString());