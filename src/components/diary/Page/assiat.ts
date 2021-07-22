import {Platform} from 'react-native';
import {Fonts} from '../../../common/phone/fonts';

export const getHTML = (body: string) => {
  return `<!DOCTYPE html>
           <html>
              <head>
              <meta http-equiv="content-type" content="text/html; charset=utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style type="text/css">
                  ${generateAssetsFontCss(Fonts.regular, 'ttf')}
                  html, body {
                    margin: 0;
                    padding: 0;
                    font-size: 16px;
                   line-height: 19px;
                  }
                  </style>
              </head>
              <body>
                ${body} 
              </body>
          </html>`;
};
type fontFormats = 'ttf' | 'otf';
/**
 * example of usage:

 const originalHtml = "<div/>"
 const css = generateAssetsFontCss("Roboto-Dark", "ttf")

 const html = addCssToHtml(originalHtml, css)
 *
 * @param fontFileName - font name in resources
 * @param fileFormat - ttf or otf
 * @returns {string} - css for webview
 */
export const generateAssetsFontCss = (
  fontFileName: string,
  fileFormat: fontFormats = 'ttf'
) => {
  const fileUri = Platform.select({
    ios: `${fontFileName}.${fileFormat}`,
    android: `file:///android_asset/fonts/${fontFileName}.${fileFormat}`
  });

  return `
	@font-face {
        	font-family: '${fontFileName}';
        src: local('${fontFileName}'), url('${fileUri}') format('${
  fileFormat === 'ttf' ? 'truetype' : 'opentype'
}');
	}`;
};
