module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "path": false,
          "fs": false,
          "os": require.resolve("os-browserify/browser")
        }
      }
    }
  }
};