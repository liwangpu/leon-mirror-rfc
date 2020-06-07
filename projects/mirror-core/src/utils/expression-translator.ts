import { ObjectTool } from './object-tool';

export function removeDisableFilterExpression(filter: { [key: string]: any }): any {
    iterateFilterExpression(filter, null, filter);

    let res: string = JSON.stringify(filter);
    if (res !== '{}') {
        // console.log('before', res);
        while (/{}/g.test(res) || /\[\]/g.test(res)) {
            res = res.replace(/{}/g, '');
            res = res.replace(/\[(,){1,}/g, '[');
            res = res.replace(/(,){1,}\]/g, ']');
            res = res.replace(/(,){1,}\]/g, ']');
            res = res.replace(/,{2,}/g, ',');
            res = res.replace(/\"@and\":\[\]/g, '');
            res = res.replace(/\"@or\":\[\]/g, '');
        }
        // console.log('after', res);
    }

    if (res === '') {
        return {};
    }
    return JSON.parse(res);
}

function getExpressionOperationValue(obj: { [key: string]: any }): any {
    let keys: Array<string> = Object.keys(obj).filter(x => x !== 'disable');
    if (keys.length < 1) {
        return obj['@eq'] || obj['@in'] || obj['@lt'] || obj['@gt'];
    }

    if (keys.length == 1) {
        return obj[keys[0]];
    }
    return null;
}

function iterateFilterExpression(exp: { [key: string]: any }, property: string, parent: any): boolean {
    if (!exp) {
        return false;
    }

    if (typeof exp.disable !== 'undefined') {
        let value: any = getExpressionOperationValue(exp);
        if (value !== exp.disable) {
            delete exp.disable;
            return false;
        }
        return true;
    }

    for (let p in exp) {
        if (exp.hasOwnProperty(p)) {
            // tslint:disable-next-line: no-collapsible-if
            if (typeof exp[p] == 'object') {
                // tslint:disable-next-line: no-collapsible-if
                if (iterateFilterExpression(exp[p], p, exp)) {
                    // tslint:disable-next-line: no-dynamic-delete
                    delete exp[p];
                }
            }
        }
    }

    if (Array.isArray(exp) && exp.length) {
        // tslint:disable-next-line: only-arrow-functions
        exp = exp.filter(function (el: any): boolean {
            return el != null;
        });
        parent[property] = exp;
    }
}

// @dynamic
export class ExpressionTranslator {

    public static translateDynamicVariableExpression(expression: { [key: string]: any } | string, getVariable: (k: string) => any): any {
        let originExpression: any = expression;
        const expressionType: string = typeof expression;
        if (!expression || !Object.keys(expression).length) { return expression; }
        if (expressionType !== 'string') {
            expression = JSON.stringify(expression);
        }

        // console.log('translate before', expression);
        // debugger;
        const reg: RegExp = /{{[\w.]+}}/g;
        if (reg.test(expression as string)) {
            let exps: Array<string> = expression.match(reg);
            for (let i: number = 0, len: number = exps.length; i < len; i++) {
                let exp: string = exps[i];
                let variable: string = exp.match(/[\w.]+/)[0];

                let v: any = getVariable(variable);
                if (len === 1 && expression === `{{${variable}}}`) {
                    return v;
                }
                // console.log(1, `"\{\{${variable}\}\}"`);
                if (expressionType !== 'string') {
                    expression = expression.replace(new RegExp(`"\{\{${variable}\}\}"`), v === null || v === undefined ? `null` : `${JSON.stringify(v)}`);
                    continue;
                }
                expression = expression.replace(new RegExp(`\{\{${variable}\}\}`), v === null || v === undefined ? '' : v);
                // expression = expression.replace(new RegExp(`\{\{${variable}\}\}`), v === null || v === undefined ? '' : v);
            }
        }

        // console.log('translate result', expression);

        if (expressionType === 'string') {
            return expression;
        }

        try {
            return JSON.parse(expression as any);
        } catch (err) {
            console.warn(`翻译失败,请检查语法是否正确或者表达式无法翻译您的表达,详细信息为:`, originExpression);
            return null;
        }
    }

    public static translateStaticVariableExpression(expression: any, data: any, dataName?: string): any {
        return ExpressionTranslator.translateDynamicVariableExpression(expression, (k: string) => {
            if (dataName && k === dataName) {
                return data;
            }
            return ObjectTool.recursionValueByField(data, k);
        });
    }

    public static analyzeExpressionVariable(expression: any): Array<string> {
        const expressionType: string = typeof expression;
        if (expressionType === 'string' && (expression as string).trim() === '') { return []; }
        if (expressionType !== 'string') { expression = JSON.stringify(expression); }
        const reg: RegExp = /{{[\w.]+}}/g;
        if (reg.test(expression as string)) {
            let variables: Array<string> = [];
            let exps: Array<string> = expression.match(reg);
            for (let i: number = 0, len: number = exps.length; i < len; i++) {
                let exp: string = exps[i];
                let variable: string = exp.match(/[\w.]+/)[0];
                if (!variables.some(v => v === variable)) {
                    variables.push(variable);
                }
            }
            return variables;
        }
        return [];
    }
}
