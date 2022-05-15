// devServer: {
//     proxy: { //配置跨域
//         api: {
//             target: 'http://192.168.0.0:8080/',//這裡後臺的地址模擬的;應該填寫你們真實的後臺介面
//             changOrigin: true,//允許跨域
//             secure: false,
//             pathRewrite: {
//                 /* 重寫路徑，當我們在瀏覽器中看到請求的地址為：http://localhost:8080/api/core/getData/userInfo 時
//                     實際上訪問的地址是：http://121.121.67.254:8185/core/getData/userInfo,因為重寫了 /api
//                 */
//                 '^/api': ''
//             }
//         }
//     }
// }
