({
    appDir: '.',
    baseUrl: 'lib',

    //Uncomment to turn off uglify minification.
    //optimize: 'none',
    dir: '../demo-build',

    //Stub out the cs module after a build since
    //it will not be needed.
    stubModules: ['cs'],

    paths: {
        'cs' :'../../cs',
        'coffee-script': '../../coffee-script'
    },

    modules: [
        {
            name: 'main',
            //The optimization will load CoffeeScript to convert
            //the CoffeeScript files to plain JS. Use the exclude
            //directive so that the coffee-script module is not included
            //in the built file.
            exclude: ['coffee-script']
        }
    ]
})
