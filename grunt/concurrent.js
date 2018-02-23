module.exports = function (grunt) {
    return {
        lint: [
            "sasslint",
            "eslint"
        ],
        prototypeServerWatch: {
            tasks: [
                "connect:deploy",
                "watchPrototype"
            ],
            options: {
                logConcurrentOutput: true
            }
        },
        testServerWatch: {
            tasks: [
                "connect:specRunner",
                "watchPrototype"
            ],
            options: {
                logConcurrentOutput: true
            }
        }
    }
}