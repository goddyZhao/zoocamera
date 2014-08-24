var env = process.env.NODE_ENV || "development";
var rootDir = process.cwd();

module.exports = {
  /**
   * Get the env of current application
   * @return {String} env
   * @api public
   */
  getEnv: function(){
    return env;
  },

  /**
   * Get the rootDir of current application
   * @return {String} rootDir
   * @api public
   */
  getRootDir: function(){
    return rootDir;
  },

  isCov: function(){
    return !!process.env.CC_COV;
  },

  isDebug: function(){
    return env === "development" || !!process.env.DEBUG;
  }
};