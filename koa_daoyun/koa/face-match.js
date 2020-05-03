const axios = require('axios')
const fs = require('fs')
const LogUtil = require('./log/log-util')
const API_KEY = 'wKZpxF4HTEDnX0rx_Ne4I-nekh3reVSt'
const API_Secret = '8N-TeVUNcFEvnrd8e2Hop_J6IUOGNyc7'
const API_URL = 'https://api-cn.faceplusplus.com/facepp/v3/compare'


module.exports = async (im1, im2) => {
    let im1_base64 = base64Formate(im1)
    let im2_base64 = base64Formate(im2)
    if (!im1_base64 || !im2_base64) throw '文件读取错误'
    let params = new URLSearchParams()
    params.append('api_key', API_KEY)
    params.append('api_secret', API_Secret)
    params.append('image_base64_1', im1_base64)
    params.append('image_base64_2', im2_base64)
    LogUtil.info("send request varify face info")
    return await axios.post(API_URL, params)
        .then(response => {
            if (response.status != 200) {
                LogUtil.error(response.data.error_message)
                throw '请求验证人脸错误'
            }
            return Number(response.data.confidence)
        }).catch(err => {
            // LogUtil.error(err)
            fs.writeFile('./logs/face_error/err.txt',''+(err),{},callback=(err)=>{})
            throw "网络请求错误"
        })
}

var base64Formate = (img_url) => {
    let bitmap
    try {
        bitmap = fs.readFileSync(img_url)
    } catch (err) {
        LogUtil.error(err)
        return false
    }
    let base64str = Buffer.from(bitmap, 'binary').toString('base64')
    return base64str
}