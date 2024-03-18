require('dotenv').config();

module.exports = {
    apps: [{
        name: 'discord-server-bridge',
        script: './app.js',
        instances: 1,
        watch: false,
        max_memory_restart: '150M'
    }],
    env_production: {
        NODE_ENV: 'production'
    },
    deploy: {
        production: {
            'user': process.env.PM2_DEPLOY_USER,
            'host': process.env.PM2_DEPLOY_IP,
            'port': process.env.PM2_DEPLOY_PORT,
            'ref': 'origin/master',
            'repo': 'git@github.com:EdouardCourty/discord-server-bridge',
            'path': '/var/www/discord-server-bridge',
            'post-deploy': 'yarn install && cp /var/www/discord-server-bridge/.env /var/www/discord-server-bridge/current/.env && ln -S /var/www/discord-server-bridge/configuration.json /var/www/discord-server-bridge/current/data/configuration.json && pm2 startOrRestart ecosystem.config.cjs --env production'
        }
    }
}
