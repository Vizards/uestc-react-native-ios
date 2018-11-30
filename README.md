<p align="center"><img src="https://ipic.vizards.cc/2018-04-14-171713.png" alt="UESTC" width="125px"/></p>
<h1 align="center">UESTC</h1>

> App Store 搜索「UESTC」即刻安装

[![iTunes App Store](https://img.shields.io/itunes/v/1368462316.svg?style=flat-square)](https://itunes.apple.com/cn/app/uestc/id1368462316)  [![React Native](https://img.shields.io/badge/react--native-0.52.0-brightgreen.svg?style=flat-square)](https://facebook.github.io/react-native/) [![Made for](https://img.shields.io/badge/made%20for-iPhone%20iPad%20iPod%20Touch-orange.svg?style=flat-square)](https://uestc.ga)  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/Vizards/uestc-react-native-ios/pulls) [![%e2%9d%a4](https://img.shields.io/badge/made%20with-%e2%9d%a4-ff69b4.svg?style=flat-square)](https://github.com/Vizards/uestc-react-native-ios)



[<img width="200" src="https://ipic.vizards.cc/2018-04-10-app-store.png"/>](https://itunes.apple.com/cn/app/uestc/id1368462316)

<img width="200" src="https://ipic.vizards.cc/2018-04-11-2018_04_11_1711359759.png"/>

- Android 客户端：[i成电 By Febers](http://app.febers.tech) 
- Android 开源地址：[Febers/iUESTC - GitHub](https://github.com/Febers/iUESTC)

## 界面截图

<img src="https://ipic.vizards.cc/2018-04-11-IMG_2881.JPG" alt="启动页" width="30%">&nbsp;&nbsp;<img src="https://ipic.vizards.cc/2018-04-11-IMG_2883.JPG" alt="登录" width="30%">&nbsp;&nbsp;<img src="https://ipic.vizards.cc/2018-04-11-IMG_2882.JPG" alt="课程表" width="30%"><img src="https://ipic.vizards.cc/2018-04-11-IMG_2885.JPG" alt="考试安排" width="30%">&nbsp;&nbsp;<img src="https://ipic.vizards.cc/2018-04-11-IMG_2884.JPG" alt="学期成绩" width="30%">&nbsp;&nbsp;<img src="https://ipic.vizards.cc/2018-04-11-IMG_2887.JPG" alt="成绩统计" width="30%"><img src="https://ipic.vizards.cc/2018-04-11-IMG_2886.JPG" alt="一卡通电费" width="30%">&nbsp;&nbsp;<img src="https://ipic.vizards.cc/2018-04-11-IMG_2888.JPG" alt="更多功能" width="30%">&nbsp;&nbsp;<img src="https://ipic.vizards.cc/2018-04-11-IMG_2913.JPG" width="30%"><img src="https://ipic.vizards.cc/2018-04-11-IMG_2914.JPG" alt="" width="30%">&nbsp;&nbsp;<img src="https://ipic.vizards.cc/2018-04-11-IMG_2915.JPG" alt="" width="30%">&nbsp;&nbsp;<img src="https://ipic.vizards.cc/2018-04-11-IMG_2916.JPG" alt="" width="30%">

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
- [x] 图书借阅信息
- [x] 课程表导入系统日历

#### 预期功能

- [ ] 考试、成绩信息推送
- [ ] 一卡通、电费余额告警
- [x] <del>iOS Today Widget</del>（使用系统日历 Widget 代替）
- [ ] 自主添加课程

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
    source={Platform.OS === 'android' && !__DEV__ ? { uri:'https://qiniu.vizards.cc/tpl.html' } : { uri: 'https://qiniu.vizards.cc/tpl.html' }}
    ```


3. 修改 `RNBEMCheckBox.xcodeproj`：

    在 Xcode 中修改 `Libraries/RNBEMCheckBox.xcodeproj/RNBEMCheckBoxManager.m`：
    
    - `#import RCTBridge.h` 改为 `#import <React/RCTBridge.h>`
    
    - `#import RCTEventDispatcher.h` 改为 `#import <React/RCTEventDispatcher.h>`
    
    - `#import RCTConvert.h` 改为 `#import <React/RCTConvert.h>`

5. 配置依赖库 react-native-image-crop-picker

    参考 [ivpusic/react-native-image-crop-picker - GitHub](https://github.com/ivpusic/react-native-image-crop-picker)

    > 本项目没有采用推荐的 Cocoapods 方式安装此依赖库，请按照 `Manual` 指导的方式进行安装配置。

6. 配置依赖库 jshare

    参考 [jpush/jshare-react-native - GitHub](https://github.com/jpush/jshare-react-native)

    > 请注意，此处需要您新建配置 `RCTJShareConfig.plist`，该文件应当位于 `/ios/RCTJShareConfig.plist` 同时需要拖入 XCode 以创建引用关系。

    
7. 在模拟器运行

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

## 致谢

- 设计师 [轩轩](https://www.behance.net/XuanXuan1996) 完成的 APP UI 设计

- Apple Developer [蛋总](https://github.com/maxlxq) 帮助上架

如您觉得此项目对您有帮助，或愿意协助改进，欢迎 Star 或 Fork





