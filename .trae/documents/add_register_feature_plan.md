# 添加用户注册功能 - 实现计划

## 概述
为 TShock Web Controller 添加用户注册功能，通过执行 `/register` 命令来创建新用户。

## 需求分析

### 功能需求
1. 用户注册页面/弹窗，输入用户名和密码
2. 执行注册命令 `/register <username> <password>`
3. 注册成功/失败提示
4. 注册后自动使用新账号登录

### 技术方案
- 使用 TShock API 的 `rawcmd` 端点执行注册命令
