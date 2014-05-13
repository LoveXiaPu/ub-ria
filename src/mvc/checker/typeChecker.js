define(
    function (require) {
        var u = require('underscore');
        var TEMPLATE_SETTINGS = {
            interpolate: /\$\{(.+?)\}/g
        };

        var checker = {
            name: 'type',
            errorMessage: '${title}的类型不符合要求',
            priority: 10,
            check: check
        };


        /**
         * 类型检验器
         * value值为undefined、null时，不做检查，enum、number类型字段值为number
         * 时通过检查，
         * 
         * @param {string | boolean | number | object | array | undefined}
         * @param {field} 字符串，该属性相对于entity的完整路径
         * @param {array} 字段的定义, 长度为3或2的数组
         * @return {object} 检验失败时返回field与errorMessage组成的对象
         * @return {boolean} 检验成功时返回true
         */
        function check(value, field, schema) {
            var result = true;
            var expectedType = schema[0];

            // typeMapping的key为值类型，value为与key匹配的定义中的类型数组
            var typeMapping = {
                'undefined': true,
                'null': true,
                'array': [ 'array' ],
                'string': [ 'string' ],
                'number': [ 'number', 'enum' ],
                'boolean': [ 'bool' ],
                'object': [ 'object' ]
            };

            var key = typeof value;
            if ('object' === key) {
                if (u.isArray(value)) {
                    key = 'array';
                }
                else if (u.isNull(value)) {
                    key = 'null';
                }
                // TODO 以下分支可能没啥用处
                else if (value instanceof String) {
                    key = 'string';
                }
                else if (value instanceof Number) {
                    key = 'number';
                }
                else if (value instanceof Boolean) {
                    key = 'boolean';
                }
            }

            if (typeMapping[key] !== true && u.indexOf(typeMapping[key], expectedType) < 0) {
                var errorMessage = u.template(this.errorMessage, data, TEMPLATE_SETTINGS);
                result = {
                    field: field,
                    message: errorMessage
                };
            }

            return result;
        }
        
        return checker;
    }
);