function TestSuite(js) {
    eval(js);
    QUnit.test('The Goban is a 19x19 board', function(){
        QUnit.equal(new GoBan().getSize(), 19);
    });
}

App.init((function GoBan() {
    this.getSize = function() {
        return 19;
    };
}).toString());