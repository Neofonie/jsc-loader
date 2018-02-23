module.exports = function (grunt) {
    return {
        options: {
            flatten: true,
            data: "<%= globalConfig.srcFolder %>/templates/data/*.{json,yml}",
            layoutdir: "<%= globalConfig.srcFolder %>/templates/layouts",
            helpers: "<%= globalConfig.srcFolder %>/templates/helpers/*.js",
            layout: "tpl_default.hbs",
            partials: "<%= globalConfig.srcFolder %>/templates/partials/**/*.hbs",
            absolute_path: "http://<%= globalConfig.hostName %>:<%= globalConfig.port %>",
            absolute_path_without_port: "http://<%= globalConfig.hostName %>"
        },
        default: {
            files: {
                "<%= globalConfig.deployFolder %>": ["<%= globalConfig.srcFolder %>/templates/pages/**/*.hbs"]
            }
        }
    }
};