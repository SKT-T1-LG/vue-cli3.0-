module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ["> 0.01%", "Android >= 4.0", "Firefox ESR", "Ios >= 8.0"]
    },
    //更多配置参考：https://github.com/ant-tool/postcss-plugin-px2rem
    "postcss-plugin-px2rem": {
      rootValue: 75,
      unitPrecision: 5,
      propWhiteList: [],
      propBlackList: [
        "border-bottom",
        "border-top",
        "border-left",
        "border-right",
        "border",
        "filter"
      ],
      exclude:/(node_module)/,
      selectorBlackList: ["ignore"],
      ignoreIdentifier: false,
      replace: true,
      mediaQuery: false,
      minPixelValue: 3
    },
  }
};
