App = (function App() {


    /*** Management of project & associate tests ***/
    var Project = {
        name: '',
        active: function() {
            return (Project.name !== '');
        },
        load: function(name){
            if (name) {
                Project.name = name;
                var script = document.createElement( 'script' );
                script.src = 'project/'+name+'.js';
                document.body.appendChild( script );
            }
        },
        runTests: function(){
            if (Project.active()) {
                var js = Interface.Editor.getValue();
                try {
                    var currentFileLine = 22;
                    eval(js);
                } catch(e) {
                    var msg = 'Error in javascript compilation: '+e.message;
                    if (typeof e.lineNumber != 'undefined') {
                        msg += ' at line '+(e.lineNumber-currentFileLine);
                    }
                    alert(msg);
                    return false;
                }
                Interface.TestPanel.clean();
                Interface.TestPanel.toggle(true);
                QUnit.reset();
                QUnit.init();
                QUnit.start();
                TestSuite(js);
            }
        },
        init: function() {
            QUnit.testDone(function(details){
                Interface.TestPanel.addEntry(details.name, details.failed==0);
            });
        }
    }


    /*** Management of local storage ***/
    var Storage = {
        getAllCodes: function() {
            if (!Project.active()) {
                return {};
            }
            var codes = localStorage['savedCode-'+Project.name];
            if (typeof codes != 'string') {
                return {};
            }
            try {
                return JSON.parse(codes);
            } catch (e) {
            }
            return {};
        },
        getCode: function(name) {
            var codes = Storage.getAllCodes();
            if (typeof codes[name] != 'string') {
                return '';
            }
            return codes[name];
        },
        getAllNames: function() {
            var codes = Storage.getAllCodes();
            var names = [];
            for (name in codes) {
                if (codes.hasOwnProperty(name)) {
                    names.push(name);
                }
            }
            return names;
        },
        addCode: function(name, code) {
            var codes = Storage.getAllCodes();
            var isNew = (typeof code[name] == 'undefined');
            codes[name] = code;
            localStorage['savedCode-'+Project.name] = JSON.stringify(codes);
            return isNew;
        }
    }


    /*** Management of action elements & test panel ***/
    var Interface = {
        selectProjectAction: document.getElementById('selectProjectAction'),
        showTestAction: document.getElementById('showTestAction'),
        runTestAction: document.getElementById('runTestAction'),
        saveCodeAction: document.getElementById('saveCodeAction'),
        loadCodeAction: document.getElementById('loadCodeAction'),
        Editor: ace.edit('editorFrame'),
        init: function() {
            Interface.selectProjectAction.addEventListener('change', App.selectProject);
            Interface.loadCodeAction.addEventListener('change', App.loadCode);
            Interface.showTestAction.addEventListener('click', App.toggleTestPanel);
            Interface.runTestAction.addEventListener('click', App.runTests);
            Interface.saveCodeAction.addEventListener('click', App.saveCode);
            Interface.Editor.setTheme("ace/theme/twilight");
            Interface.Editor.getSession().setMode("ace/mode/javascript");
            Interface.Editor.on('change', function(){
                Interface.TestPanel.clean();
            });
        },
        enableActions: function() {
            var buttons = document.getElementsByClassName('enableWithProject');
            for(var i=0; i<buttons.length; i++){
                buttons[i].disabled=false;
            }
        },
        addSaveOption: function(name, value) {
            var option = document.createElement( 'option' );
            option.innerHTML = name;
            if (arguments.length == 2){
                option.value = value;
            }
            Interface.loadCodeAction.appendChild( option );
        },
        setOptions: function(names) {
            Interface.loadCodeAction.innerHTML = '';
            Interface.addSaveOption('Load a save','');
            for(var i=0; i<names.length; i++){
                Interface.addSaveOption(names[i]);
            }
        },
        TestPanel: {
            element: document.getElementById('testReport'),
            clean: function() {
                Interface.TestPanel.element.innerHTML = '';
            },
            addEntry: function(name, result) {
                Interface.TestPanel.element
                    .innerHTML += '<li class="test">'
                    + '<span class="test-name">' + name +': </span>'
                    + '<span class="test-result test-result--' + (result?'ok':'error') + '">' + (result?'OK':'ERROR') + '</span>'
                    + '</li>';
            },
            toggle: function(action) {
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
                if (result || action) {
                    Interface.showTestAction.innerHTML = 'Hide tests';
                } else {
                    Interface.showTestAction.innerHTML = 'Show tests';
                }
            }
        }
    }


    /*** Public functions ***/
    var App = {

        // Project
        selectProject: function() {
            Project.load(this.options[this.selectedIndex].value);
            Interface.Editor.focus();
        },
        runTests: function() {
            Project.runTests();
            Interface.Editor.focus();
        },
        toggleTestPanel: function(action) {
            if (Project.active()) {
                Interface.TestPanel.toggle(action);
                Interface.Editor.focus();
            }
        },

        // Editor
        saveCode: function() {
            if (Project.active()) {
                var name = prompt('Under which name?', 'just a try');
                if (Storage.addCode(name, Interface.Editor.getValue())){
                    Interface.addSaveOption(name);
                }
                Interface.Editor.focus();
            }
        },
        loadCode: function() {
            if (Project.active()) {
                var name = this.options[this.selectedIndex].value;
                if (name) {
                    Interface.Editor.setValue(Storage.getCode(name));
                    Interface.Editor.clearSelection();
                    Interface.Editor.focus();
                    this.selectedIndex = 0;
                }
            }
        },
        init: function(val) {
            Interface.Editor.setValue(val);
            Interface.Editor.clearSelection();
            if (Project.active()) {
                Storage.addCode('origin', val);
                Interface.enableActions();
                Interface.setOptions(Storage.getAllNames());
            }
        }
    }


    /*** Initialization ***/
    Interface.init();
    Project.init();
    return App;
})();

