module.exports = {
    apps: [{
        name: 'discord-server-bridge',
        script: './app.js',
        instances: 1,
        watch: false,
        mode: 'fork',
        max_memory_restart: '150M'
    }]
}
