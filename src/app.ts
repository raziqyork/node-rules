import { Rules } from "./rules"
const fs = require('fs');
const args = process.argv.slice(2);

fs.readFile(args[0], 'utf8', (err, rulesJson: string) => {
    if (err) throw err;
    fs.readFile(args[1], 'utf8', (err, modelJson: string) => {
        if (err) throw err;
        const rule = JSON.parse(rulesJson);
        const model = JSON.parse(modelJson);

        if (rule instanceof Array)
            rule.forEach(r => processOutcomeRule(r, model));
        else if (rule.outcome)
            processOutcomeRule(rule, model);
        else
            console.log(Rules.evaluate(rule, model));
    });
});

function processOutcomeRule(rule: any, model: any) {
    if (Rules.evaluate(rule.rule, model))
        console.log(rule.outcome);
    else
        console.log('NOT:' + rule.outcome);
}