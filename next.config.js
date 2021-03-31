module.exports = {
  future: {
    webpack5: true,
  },
  // See https://github.com/vercel/next.js/issues/22813
  webpack: (config, { isServer, dev }) => {
    config.output.chunkFilename = isServer
      ? `${dev ? "[name]" : "[name].[fullhash]"}.js`
      : `static/chunks/${dev ? "[name]" : "[name].[fullhash]"}.js`;
    return config;
  },
};
