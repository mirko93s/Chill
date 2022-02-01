module.exports = () => {
    // process.on("unhandledRejection", (err) => {
    //     console.error(err);
    // });
    process.on("uncaughtException", (err) => {
        console.error(err);
    });
}