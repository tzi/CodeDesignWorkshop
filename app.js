function App() {
    var state = true;
    QUnit.done( function(details){
       if ( details.failed > 0 ) {
           state = false;
       }
    });

    var testReport = function() {
        if ( state ) {
            alert( 'All tests are great :)');
        } else {
            alert( 'There is an error in the tests');
        }
    }

    this.toggle = function() {
        if ( document.getElementById('mainFrame').classList.toggle('showTest') ) {
            this.innerHTML = 'Hide tests';
        } else {
            this.innerHTML = 'Show tests';
        }
    };

    this.run = function() {
        try {
            eval( editor.getValue() );
            state = true;
            QUnit.test( 'Hello world test', function(){
                QUnit.equal( new GoBan().getName(), 'Hello World' );
            });
            QUnit.test( 'Hello world test', function(){
                QUnit.equal( new GoBan().getName(), 'Hello World' );
            });
            testReport();
        } catch(e) {
            alert('Error in javascript compilation');
        }
    };
}


// Editor
var editor = ace.edit("editorFrame");
editor.setTheme("ace/theme/twilight");
editor.getSession().setMode("ace/mode/javascript");

// Menu
var app = new App();
var showTestButton = document.getElementById('showTestButton');
showTestButton.addEventListener('click', app.toggle);
var runTestButton = document.getElementById('runTestButton');
runTestButton.addEventListener('click', app.run);

