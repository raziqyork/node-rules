const objectPathGet = require('object-path-get');

export namespace Rules {

    interface IPropertyRule {
        propertyName: string;
        value?: any;
        dateTimeValue?: string;
    }

    const testLogic = {
        equals: (x, y) => x == y,
        notEquals: (x, y) => x != y,
        greaterThanOrEqualTo: (x, y) => x >= y,
        greaterThan: (x, y) => x > y,
        lessThanOrEqualTo: (x, y) => x <= y,
        lessThan: (x, y) => x < y
    }

    export function evaluate(rule: any, model: any): boolean {
        const opName = Object.keys(rule)[0];

        const op = Rules[opName];
        if (op) return op(rule[opName], model);

        const func = testLogic[opName];
        if (func) return test(rule[opName], model, func);

        throw `Unsupported rule: ${opName}`;
    }

    export function all(rule: any, model: any): boolean {
        const modelValue = objectPathGet(model, rule.propertyName);
        let result = true;
        for (let i = 0; result && i < modelValue.length; i++) {
            model[rule.token] = modelValue[i];
            result = result && evaluate(rule.predicate, model);
        };
        delete model[rule.token];
        return result;
    }

    export function any(rule: any, model: any): boolean {
        const modelValue = objectPathGet(model, rule.propertyName);
        let result = false;
        for (let i = 0; !result && i < modelValue.length; i++) {
            model[rule.token] = modelValue[i];
            result = evaluate(rule.predicate, model);
        };
        delete model[rule.token];
        return result;
    }

    export function none(rule: any, model: any): boolean {
        return !any(rule, model);
    }

    export function not(rule: any, model: any): boolean {
        return !evaluate(rule, model);
    }

    export function and(rules: any, model: any): boolean {
        let result = true;
        for (let i = 0; result && i < rules.length; i++) {
            result = result && evaluate(rules[i], model);
        }
        return result;
    }

    export function or(rules: any, model: any): boolean {
        let result = false;
        for (let i = 0; !result && i < rules.length; i++) {
            result = evaluate(rules[i], model);
        }
        return result;
    }

    export function contains(rule: IPropertyRule, model: any): boolean {
        const value = '' + (rule.value || '');
        const modelValue = objectPathGet(model, rule.propertyName);
        if (typeof modelValue === 'string')
            return modelValue.indexOf(value) !== -1;
        if (modelValue instanceof Array)
            return (<any>modelValue).includes(value);
        return false;
    }

    function test(rule: IPropertyRule, model: any, func: (x: any, y: any) => boolean): boolean {
        const modelValue = objectPathGet(model, rule.propertyName);
        if (rule.value)
            return func(rule.value, modelValue);
        if (rule.dateTimeValue)
            return func(evaluateDateTime(rule.dateTimeValue), evaluateDateTime(modelValue));
        return false;
    }

    function getModelValue(value: any, model: any): any {
        if (value instanceof Array) return value;
        if (value instanceof Object) {
            return getModelValue(objectPathGet(model, value.propertyName), model);
        }
    }

    function evaluateDateTime(dateTimeValue: any): number {
        // todo: parse DateTimeOffset and ZonedDateTime strings

        return dateTimeValue;
    }
}