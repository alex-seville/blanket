var simpleNodeLoader = require('./simple-node-loader');

module.exports = function(blanket) {
    var coffeeScript = require("iced-coffee-script"),
        oldLoaderCS = require.extensions['.iced'];

    var compile = function(content) {
        return coffeeScript.compile(content);
    };

    require.extensions['.iced'] = simpleNodeLoader(blanket, oldLoaderCS, compile, /\.iced$/);
};
