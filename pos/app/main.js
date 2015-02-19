requirejs.config({
    paths: {
        'text': '../lib/require/text',
        'durandal':'../lib/durandal/js',
        'plugins' : '../lib/durandal/js/plugins',
        'transitions' : '../lib/durandal/js/transitions',
        'knockout': '../lib/knockout/knockout-3.1.0',
        'bootstrap': '../lib/bootstrap/js/bootstrap',
        'jquery': '../lib/jquery/jquery-1.9.1',
        'breeze': '../lib/breeze.debug',
        'q': '../lib/q',
        'breeze.koES5': '../lib/breeze.koES5',
    },
    map: {
      '*': {
          ko: 'knockout',
          Q: 'q'
      }  
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
       }
    },
    deps: ['jquery', 'q', 'breeze', 'breeze.koES5'],
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'breeze'],  function (system, app, viewLocator, breeze) {
    
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");
    
    breeze.config.initializeAdapterInstance("modelLibrary", "koES5", true);

    app.title = 'Durandal Starter Kit';

    app.configurePlugins({
        observable: true,
        router:true,
        dialog: true,
        widget: {
            kinds: ['calculator']
        }
    });

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});