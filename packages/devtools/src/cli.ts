import minimist, { ParsedArgs } from 'minimist';
import { addAliases } from 'module-alias';

addAliases({
    '@exile/client/': `${__dirname}/../../client/src/`,
    '@exile/common/': `${__dirname}/../../common/src/`,
});

export async function cli(helpText: string, main: (argv: ArgvProvider) => any): Promise<void> {
    const argv = minimist(process.argv.slice(2));

    helpText = helpText.trim();

    if (argv.h || argv.help) {
        console.log(helpText);
        process.exit();
    }

    try {
        const argvProvider = makeArgvProvider(argv);
        await main(argvProvider);
    } catch (e) {
        if (e instanceof CliError) {
            console.error(e.message);
        } else {
            console.error(e.stack);
        }
        process.exit();
    }
}

export function assert(val: unknown, errMsg: string): asserts val {
    if (!val) {
        throw new CliError(errMsg);
    }
}

function makeArgvProvider(argv: ParsedArgs): ArgvProvider {
    return (key: string, errMsg?: string, test?: ArgvTest, def?: any) => {
        let value = argv[key];

        if (value === undefined && def !== undefined) {
            value = def;
        }

        if (value) {
            switch (test) {
            case 'string':
                if (typeof value !== 'string') {
                    throw new CliError(`Value of switch -${key} is not string`);
                }
                break;
            case 'int':
                value = parseInt(value);
                if (Number.isNaN(value)) {
                    throw new CliError(`Value of switch -${key} is not string`);
                }
                break;
            case 'float':
                value = parseFloat(value);
                if (Number.isNaN(value)) {
                    throw new CliError(`Value of switch -${key} is not string`);
                }
                break;
            }

            return value;
        } else {
            throw new CliError(errMsg);
        }
    };
}

export class CliError extends Error {

    public override readonly name = 'CliError';
}

interface ArgvProvider {
    (key: string, errorMsg?: string, test?: ArgvTest, def?: any): any;
    (key: string, errorMsg: string | undefined, test: 'string', def?: any): string;
    (key: string, errorMsg: string | undefined, test: 'int' | 'float', def?: any): number;
}

type ArgvTest = 'string' | 'int' | 'float';
