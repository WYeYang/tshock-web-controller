export const CONFIG_DESCRIPTIONS: Record<string, string> = {
  // ===== 服务器基础配置 =====
  'ServerName': '服务器名称，显示在玩家客户端的多人游戏列表中',
  'ServerPassword': '服务器密码，玩家加入时需要输入此密码才能进入游戏',
  'Port': '服务器运行端口，默认 7777',
  'ServerPort': '服务器监听的 TCP 端口号，默认 7777',
  'MaxPlayers': '服务器最大玩家数量上限',
  'ReservedSlots': '预留座位数，超过最大玩家数后保留玩家可加入',
  'ServerFullNotice': '当服务器已满时，发送给试图加入的玩家的提示消息',
  'ServerNamePlate': '显示在玩家头顶的名称标签文字',
  'UseServerName': '是否用 ServerName 替换世界名称',

  // ===== REST API 配置（必需，锁定） =====
  'RestApiEnabled': '是否启用 REST API 接口。这是 Web 控制台功能的必要条件，必须开启',
  'RestApiPort': 'REST API 服务监听的端口号，默认 7878',
  'EnableTokenEndpointAuthentication': '是否启用 REST API 的身份验证令牌机制，建议开启以确保安全',
  'LogRest': '是否记录所有 REST API 请求到日志文件，便于调试和审计',
  'RESTMaximumRequestsPerInterval': '在指定时间间隔内允许的最大 API 请求数量，超出限制的请求将被拒绝',
  'RESTRequestBucketDecreaseIntervalMinutes': 'API 请求速率限制桶的减少间隔时间（分钟）',
  'ApplicationRestTokens': '存储 REST API 访问令牌的对象，用于身份验证',
  'EnableTokenLoginAuthentication': '是否允许玩家使用 REST API Token 直接登录服务器',
  'EnableRPCEP': '启用 RPC 端点',

  // ===== 游戏模式配置 =====
  'Difficulty': '游戏难度等级：0=普通，1=专家模式，2=大师模式，3=旅途模式',
  'DisableHardmode': '是否禁用困难模式切换，即使世花被插入也不会触发困难模式',
  'ForceXmas': '是否强制启用圣诞节雪景和礼物事件',
  'ForceHalloween': '是否强制启用万圣节南瓜事件',

  // ===== 世界与存储配置 =====
  'WorldName': '世界名称，会显示在游戏内',
  'WorldPath': '世界数据文件的存储路径',
  'BackupPath': '世界备份文件的存储目录路径',
  'LogPath': '服务器日志文件的存储目录路径，默认 "tshock"',
  'StorageType': '数据存储类型，可选 "sqlite"（默认）或 "mysql"',
  'SqliteDBPath': 'SQLite 数据库路径',
  'MySqlHost': 'MySQL 主机地址和端口，默认 "localhost:3306"',
  'MySqlDbName': 'MySQL 数据库名称',
  'MySqlUsername': 'MySQL 用户名',
  'MySqlPassword': 'MySQL 密码',
  'UseSqlLogs': '是否将日志写入 SQL 数据库而非文件',
  'LogSql': '是否将日志保存到 SQL 数据库',
  'DebugLogs': '是否输出调试日志',

  // ===== 自动保存与备份 =====
  'AutoSave': '是否启用世界自动保存功能',
  'AnnounceSave': '保存世界时是否向所有在线玩家广播通知',
  'SaveWorldOnCrash': '服务器崩溃时是否自动保存当前世界状态',
  'SaveWorldOnLastPlayerExit': '最后一个玩家退出时是否保存世界',
  'ShowBackupAutosaveMessages': '是否在控制台显示自动保存/备份的相关消息',
  'BackupInterval': '世界自动备份的时间间隔（分钟），0 为禁用',
  'BackupKeepFor': '自动备份文件保留的时间（分钟），2880 = 2天',

  // ===== 玩家角色管理 =====
  'ServerSideCharacter': '是否启用服务端角色（SSC）功能，玩家角色数据保存在服务器端',
  'AllowVanillaSSC': '是否允许客户端使用原版的个人世界存储（需服务端 SSC 禁用）',
  'DisableLoginBeforeJoin': '是否允许玩家在不登录的情况下加入服务器',
  'AllowLoginAnyUsername': '允许任意用户名的登录',
  'AllowRegisterAnyUsername': '允许注册任意用户名',
  'MinimumPasswordLength': '最小密码长度',
  'HashAlgorithm': '密码加密算法，可选: sha512, sha256, md5',

  // ===== 权限与黑白名单 =====
  'DisableWhitelist': '是否禁用白名单功能，禁用后不在白名单中的玩家也能加入',
  'DisableBlacklist': '是否禁用黑名单功能，禁用后即使在黑名单中的玩家也能加入',
  'EnableWhitelist': '启用白名单',
  'EnableIPBans': '启用 IP 地址封禁',
  'KickProxyUsers': '是否踢出使用代理/VPN 连接的玩家',
  'BanOnHardcoreDeath': '硬核玩家死亡时是否封禁',
  'BanOnMediumcoreDeath': '中核玩家死亡时是否封禁',
  'DisableHardcoreBan': '硬核模式玩家死亡后是否自动封禁其 IP',
  'DisableBugs': '是否禁用客户端的 Bug 报告功能',
  'WhitelistSucks': '白名单相关设置',

  // ===== 建造与破坏 =====
  'DisableBuild': '是否禁用玩家的方块建造和破坏权限（管理员除外）',

  // ===== 事件与入侵 =====
  'DisableInvasion': '是否禁用所有类型的入侵事件',
  'DisableSnowMoon': '是否禁用霜月事件',
  'DisablePumpkinMoon': '是否禁用南瓜月事件',
  'DisabledInvasions': '禁用的特定入侵事件列表',
  'DisableInvasionsWormholeGreeting': '入侵事件时是否禁用虫洞问候',

  // ===== 其他游戏功能 =====
  'DisableDungeonGuardian': '是否禁用地牢守护者（极度强大的Boss，击败可获得世花）',
  'DisableFishing': '是否禁用钓鱼功能',
  'DisableSunMoon': '是否禁用日/月神坛修改时间的功能',
  'DisableClownBombs': '是否禁用小丑的爆炸气球攻击',
  'DisableSnowBalls': '是否禁用雪球的伤害效果',
  'KickOnDamageThresholdBroken': '超出伤害阈值时是否踢出玩家',

  // ===== 玩家出生与保护 =====
  'SpawnProtection': '生成保护半径（方块），玩家在此范围内不会生成敌怪',
  'SpawnProtectionRadius': '出生点保护半径，防止在出生点保护范围内放置物块',
  'spawnProtectionRadius': '防止在出生点保护范围内放置物块',
  'MaxSpawns': '最大NPC生成数量',
  'SpawnRate': '敌怪生成速率，数值越低生成越快',

  // ===== 玩家对战与消耗品 =====
  'PvP': '是否启用玩家间 PvP（玩家对战）',
  'RoundsPerAmmo': '每消耗一个弹药物品可以射击的回合数',
  'InfinitePvPConsumables': '玩家在 PvP 模式下是否获得无限弹药',

  // ===== 杂项 =====
  'MainLandSize': '主世界陆地大小（像素）',
  'evilBorder': '腐化/神圣蔓延的边界大小',
  'BoundsWidth': '世界宽度边界',
  'BoundsHeight': '世界高度边界',
  'LogicalCheckLag': '是否启用逻辑延迟检测',
  'EnableGeoIP': '是否启用基于 IP 地址的地理位置检测',
  'Respawn': '玩家死亡后是否自动重生',
  'AutoRegen': '是否启用自动生命值和魔力值回复',
  'RatePlayerSave': '玩家数据自动保存速率',
  'EnableChatPrepend': '聊天消息是否添加玩家名称前缀',
  'SilencePrefixMode': '是否静默忽略聊天前缀模式',
  'BroadcastRespawns': '是否广播玩家重生消息',
  'AnonymousBossInvasions': '入侵Boss是否匿名显示',
  'ServerRegion': '服务器所属地区（用于匹配）',
  'LastAPIUpdateIndex': '最后更新的 API 索引',
  'ChannelPiggyback': 'Piggy 频道负载均衡策略',
};
