var simpleNodeLoader = require('./simple-node-loader');

module.exports = function(blanket) {
    var coffeeScript = require("coffee-script"),
        oldLoaderCS = require.extensions['.coffee'];

    var compile = function(content) {
        return coffeeScript.compile(content);
    };

    require.extensions['.coffee'] = simpleNodeLoader(blanket, oldLoaderCS, compile, /\.coffee$/);
};
