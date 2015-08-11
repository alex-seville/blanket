var simpleNodeLoader = require('./simple-node-loader');

module.exports = function(blanket) {
    var compiler = require("coffee-react"),
        oldLoaderCS = require.extensions['.cjsx'];

    var compile = function(content) {
        return compiler.compile(content);
    };

    require.extensions['.cjsx'] = simpleNodeLoader(blanket, oldLoaderCS, compile, /\.cjsx/);
};
