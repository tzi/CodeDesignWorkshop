App = (function App() {

    // Attributes
    var editor;
    var project;

    // Initialization
    editor = ace.edit("editorFrame");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");
    QUnit.testDone(function(details){
        addTestReport(details.name, details.failed==0);
    });

    // Private
    cleanTestReport = function() {
        document.getElementById('testFrame').innerHTML = '';
    }
    addTestReport = function(name, result) {
        document.getElementById('testFrame')
            .innerHTML += '<li class="test">'
            + '<span class="test-name">' + name +': </span>'
            + '<span class="test-result test-result--' + (result?'ok':'error') + '">' + (result?'OK':'ERROR') + '</span>'
            + '</li>';
    }
    toggleTestReport = function(action) {
        var method;
        if (typeof action == 'object' || typeof action == 'undefined') {
            action = false;
            method='toggle';
        } else if (action) {
            method='add';
        } else {
            method='remove';
        }
        var result = document.getElementById('mainFrame').classList[method]('showTest');
        var button = document.getElementById('showTestButton');
        if (result || action) {
            button.innerHTML = 'Hide tests';
        } else {
            button.innerHTML = 'Show tests';
        }
    }
    runTests = function() {
        var js = editor.getValue();
        try {
            eval(js);
        } catch(e) {
            alert('Error in javascript compilation');
            return false;
        }
        cleanTestReport();
        toggleTestReport(true);
        QUnit.reset();
        QUnit.init();
        QUnit.start();
        TestSuite(js);
    }

    return {

        // Project
        selectProject: function() {
            var selected = this.options[this.selectedIndex].value;
            if (selected) {
                project = selected;
                var script = document.createElement( 'script' );
                script.src = '/project/'+project+'.js';
                document.body.appendChild( script );
            }
        },

        // Tests
        toggleTestReport: function(action) {
            if (project) {
                toggleTestReport(action);
                editor.focus();
            }
        },
        runTests: function() {
            if (project) {
                var js = editor.getValue();
                try {
                    eval(js);
                } catch(e) {
                    alert('Error in javascript compilation: ' + e.message);
                    return false;
                }
                cleanTestReport();
                toggleTestReport(true);
                QUnit.reset();
                QUnit.init();
                QUnit.start();
                TestSuite(js);
                editor.focus();
            }
        },

        // Editor
        saveCode: function() {
            if (project) {
                localStorage['savedCode-'+project] = editor.getValue();
                editor.focus();
            }
        },
        loadCode: function() {
            if (project) {
                var val = localStorage['savedCode-'+project];
                editor.setValue(val);
                editor.clearSelection();
                editor.focus();
            }
        },
        init: function(val) {
            editor.setValue(val);
            editor.clearSelection();
            if (project) {
                if (typeof localStorage['savedCode-'+project] == 'undefined') {
                    localStorage['savedCode-'+project] = val;
                }
                var buttons = document.getElementsByClassName('enableWithProject');
                for(var i=0; i<buttons.length; i++){
                    buttons[i].disabled=false;
                }
            }
        }
    }
})();

// Menu
var selectProjectButton = document.getElementById('selectProjectButton');
selectProjectButton.addEventListener('change', App.selectProject);
var showTestButton = document.getElementById('showTestButton');
showTestButton.addEventListener('click', App.toggleTestReport);
var runTestButton = document.getElementById('runTestButton');
runTestButton.addEventListener('click', App.runTests);
var saveCodeButton = document.getElementById('saveCodeButton');
saveCodeButton.addEventListener('click', App.saveCode);
var loadCodeButton = document.getElementById('loadCodeButton');
loadCodeButton.addEventListener('click', App.loadCode);

