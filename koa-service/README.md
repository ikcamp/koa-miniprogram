# 后端接口

本后端接口为微信小程序服务，主要存在以下接口：

+ GET `/login` 登陆接口，根据code换取sessioKey
+ GET `/updateUser`， 将客户端的微信号传递到服务器端
+ POST `/photo`, 上传照片
+ DELET `/photo/:id`, 删除照片
+ GET `/photo/approve`, 获取待审核的照片
+ PUT `/photo/approve/:id`, 审核照片
+ GET `/album`, 获取相册列表
+ GET `/album/:id`, 获取某相册的照片列表
+ POST `/album`, 增加相册
+ PUT `/album/:id`, 修改相册
+ DELET `/album/:id`, 删除相册

除了登陆接口外，其他接口都需要在请求头中采用`x-session`字段传递sessionKey

审核功能是管理员的接口

**正式上线，需要增加过滤条件/lib/db/photo.js // isApproved: true**
