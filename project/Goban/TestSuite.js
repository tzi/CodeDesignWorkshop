function TestSuite(js) {
    eval(js);
    QUnit.test('The Goban is a 19x19 board', function(){
        QUnit.equal(new GoBan().getSize(), 19);
    });
}
