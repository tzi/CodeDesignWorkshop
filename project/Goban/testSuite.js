QUnit.test('The Goban is an object', function(){
    QUnit.equal(typeof new GoBan(), 'object');
});
QUnit.test('The Goban is a 19x19 board', function(){
    QUnit.equal(new GoBan().getSize(), 19);
});
