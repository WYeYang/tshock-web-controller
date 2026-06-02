# 配置加载修复计划

## 问题分析

1. 当前逻辑过于复杂，导致配置项显示不全
2. 需要简单直接的逻辑：读取完整配置，只覆盖必需的默认值，然后显示所有配置

## 默认值（需要覆盖的字段）

```json
{
  "RestApiEnabled": true,
  "RestApiPort": 7878,
  "EnableTokenEndpointAuthentication": false,
  "LogRest": true,
  "RESTMaximumRequestsPerInterval": 50,
  "RESTRequestBucketDecreaseIntervalMinutes": 1,
  "ApplicationRestTokens": {}
}
```

## 修改文件

1. `WizardConfigEditorModal.tsx` - 简化 `loadConfig`，读取完整配置只覆盖默认值
2. `ConfigForm.tsx` - 确保显示所有配置项，不做多余过滤

## 执行步骤

1. 修改 `WizardConfigEditorModal` 的 `loadConfig` 函数：
   - 读取完整配置
   - 只覆盖上述 7 个默认值
   - 不删除其他配置

2. 保留 `ConfigForm` 现有的功能（显示必需字段锁定，其他可编辑）
