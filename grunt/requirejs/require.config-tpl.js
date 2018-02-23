// this file is a config for requirejs and loaded before require is loaded
// <script src="../require.config.js"></script>
// <script data-main="main" src="../require.js"></script>
var require = {
    urlArgs: "<%= cacheBusterWithoutQuestionMark %>",
    baseUrl: "/js"
};