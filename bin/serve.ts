process.on('unhandledRejection', (reason, p) => {
    console.error(reason);
    console.error(p);
})

process.on('uncaughtException', (e) => {
    console.error(e);
    
})

