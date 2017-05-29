module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name      : "Fridaybot",
      script    : "./build/www",
      watch     : true,
      ignore_watch : ["node_modules", "public/uploads"],
    }
  ],

} 