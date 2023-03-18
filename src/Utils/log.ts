export default {
    m: (message: String) => {
        console.log("\x1b[32m", `message: ${message} [${new Date()}]`);
    },
    e: (message: any) => {
        console.log("\x1b[31m", `message: ${message} [${new Date()}]`);
    },
    g: (question: String) => {
        return new Promise<string>((r) => {
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });

            readline.question(question, (answer: string) => {
                r(answer)
                readline.close();
            });

        })
    }
}