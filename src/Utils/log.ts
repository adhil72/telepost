export default {
    m: (message: String) => {
        console.log("\x1b[32m", `message: ${message}`);
    },
    e: (message: any) => {
        console.log("\x1b[31m", `message: ${message}`);
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