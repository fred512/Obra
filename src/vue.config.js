module.exports = {
    //     publicPath: "./",
	// devServer: {
	//    disableHostCheck: true
	// }
	publicPath: process.env.NODE_ENV === 'production'
    ? '/obra/'
    : '/'
};