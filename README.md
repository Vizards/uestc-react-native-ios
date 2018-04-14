<p align="center"><img src="https://o9sapbwjn.qnssl.com/2018-03-18-icon-1024.png" alt="UESTC" width="100px" style="border: 1px solid #eee; border-radius: 20%"/></p>
<h1 align="center">UESTC</h1>

> App Store 搜索「UESTC」即刻安装

[![iTunes App Store](https://img.shields.io/itunes/v/1368462316.svg?style=flat-square)](https://itunes.apple.com/app/id1368462316)  [![React Native](https://img.shields.io/badge/react--native-0.52.0-brightgreen.svg?style=flat-square)](https://facebook.github.io/react-native/) [![Made for](https://img.shields.io/badge/made%20for-iPhone%20iPad%20iPod%20Touch-orange.svg?style=flat-square)](https://uestc.ga)  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/Vizards/uestc-react-native-ios/pulls) [![%e2%9d%a4](https://img.shields.io/badge/made%20with-%e2%9d%a4-ff69b4.svg?style=flat-square)](https://github.com/Vizards/uestc-react-native-ios)
<br/>
[<img width="200" src="https://o9sapbwjn.qnssl.com/2018-04-10-app-store.png"/>](https://itunes.apple.com/app/id1368462316)

<img width="200" src="https://o9sapbwjn.qnssl.com/2018-04-11-2018_04_11_1711359759.png"/>

## 界面截图

<img src="https://o9sapbwjn.qnssl.com/2018-04-11-IMG_2881.JPG" alt="启动页" width="30%">&nbsp;&nbsp;<img src="https://o9sapbwjn.qnssl.com/2018-04-11-IMG_2883.JPG" alt="登录" width="30%">&nbsp;&nbsp;<img src="https://o9sapbwjn.qnssl.com/2018-04-11-IMG_2882.JPG" alt="课程表" width="30%"><img src="https://o9sapbwjn.qnssl.com/2018-04-11-IMG_2885.JPG" alt="考试安排" width="30%">&nbsp;&nbsp;<img src="https://o9sapbwjn.qnssl.com/2018-04-11-IMG_2884.JPG" alt="学期成绩" width="30%">&nbsp;&nbsp;<img src="https://o9sapbwjn.qnssl.com/2018-04-11-IMG_2887.JPG" alt="成绩统计" width="30%"><img src="https://o9sapbwjn.qnssl.com/2018-04-11-IMG_2886.JPG" alt="一卡通电费" width="30%">&nbsp;&nbsp;<img src="https://o9sapbwjn.qnssl.com/2018-04-11-IMG_2888.JPG" alt="更多功能" width="30%">&nbsp;&nbsp;<img src="https://o9sapbwjn.qnssl.com/2018-04-11-IMG_2913.JPG" width="30%"><img src="https://o9sapbwjn.qnssl.com/2018-04-11-IMG_2914.JPG" alt="" width="30%">&nbsp;&nbsp;<img src="https://o9sapbwjn.qnssl.com/2018-04-11-IMG_2915.JPG" alt="" width="30%">&nbsp;&nbsp;<img src="https://o9sapbwjn.qnssl.com/2018-04-11-IMG_2916.JPG" alt="" width="30%">

## 功能列表

#### 已有功能

- [x] 登录教务系统取得用户基本信息，支持退出登录和从数据库删除个人信息
- [x] 按学年学期查看课程表
- [x] 按学期查看考试时间、考场座位、考试倒计时
- [x] 按学期查看学科成绩详细数据
- [x] 查看 GPA 统计信息，学期成绩折线图，所有已修学科成绩
- [x] 绑定喜付账户，支持解绑和重新登录
- [x] 查看一卡通和电费余额
- [x] 查看 30 天一卡通消费详单
- [x] 查看班车信息（依赖清水河畔，可能无法访问）
- [x] 查看教务处信息公告、教学新闻
- [x] 教务服务资料下载，查询办事指南、校历、作息时间
- [x] 查询空闲教室信息
- [x] 查询当日全校课程、全校所有开设课程信息
- [x] 查询教师信息

#### 预期功能

- [ ] 考试、成绩信息推送
- [ ] 一卡通、电费余额告警
- [ ] 失物招领信息
- [ ] iOS Today Widget
- [ ] 图书借阅信息

## 开发

#### 安装

```
$ git clone && npm install
```

#### 运行

1. 链接原生库

    ```
    $ react-native link
    ```

2. 修改 `node_modules/react-native-web-echarts/index.js` 源码。第 30 行改为：

    ```
    source={Platform.OS === 'android' && !__DEV__ ? { uri:'https://o9wj5x8i4.qnssl.com/tpl.html' } : { uri: 'https://o9wj5x8i4.qnssl.com/tpl.html' }}
    ```

3. 在模拟器运行

    ```
    $ react-native run-ios
    ```

#### 错误处理

1. 模拟器运行错误：

    ```
    Error: While resolving module `react-native-vector-icons/xxxx`, the Haste package `react-native-vector-icons` was found. 
    ```

    处理：

    - `rm ./node_modules/react-native/local-cli/core/__fixtures__/files/package.json`
    
    - 重启 packager



2. Xcode 编译错误：

    ```
    Error: 'RCTBridgeModule.h' file not found
    ```
    
    处理：
    
    - 定位到该错误源文件，将 `'RCTBridgeModule.h'` 改为 `<React/RCTBridgeModule.h>`
    
3. 其他错误请先尝试以下步骤： 

   - 清理 React Native Packager 缓存：
     
     ```
     $ sudo rm -fr $TMPDIR/metro*
     ``` 
   - 在 Xcode 中运行 `Product > Clean`
   - 重建 `node_modules`:
     
     ```
     $ rm -rf node_modules && npm install
     ```

其他任何问题或开发交流，欢迎：

- [New issues](https://github.com/Vizards/uestc-react-native-ios/issues)

- APP 内反馈

- 前往 [uestc.ga](https://uestc.ga) 反馈

## 致谢

- 设计师 [轩轩](https://www.behance.net/XuanXuan1996) 完成的 APP UI 设计

- Apple Developer [蛋总](https://github.com/maxlxq) 帮助上架

如您觉得此项目对您有帮助，或愿意协助改进，欢迎 Star 或 Fork


