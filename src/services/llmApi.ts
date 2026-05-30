import type { LLMRequest, LLMResponse, CommandGenerationResult, LLMMessage } from '../types/llm';

const SYSTEM_PROMPT = `你是一个专业的 TShock 服务器管理员助手。你的任务是将用户的自然语言描述转换为正确的 TShock 命令。

常见的 TShock 命令包括：
- /kick <玩家名> [原因] - 踢出玩家
- /ban <玩家名> [原因] - 封禁玩家
- /unban <玩家名> - 解封玩家
- /whisper <玩家名> <消息> - 私信玩家
- /broadcast <消息> - 广播消息
- /time set <时间> - 设置时间
- /weather <天气类型> - 设置天气
- /spawn <物品名> [数量] - 生成物品
- /give <玩家名> <物品名> [数量] - 给玩家物品
- /tp <玩家名> - 传送到玩家
- /tphere <玩家名> - 把玩家传送到自己
- /home <家的名称> - 传送到家
- /sethome <家的名称> - 设置家
- /world - 查看世界信息
- /players - 查看在线玩家
- /help [命令名] - 查看帮助

请只返回 JSON 格式的响应，格式如下：
{
  "command": "转换后的命令",
  "explanation": "对命令的简短解释"
}

注意：
- 不要包含任何其他文本
- 确保命令格式正确
- 如果不确定，使用最相关的命令`;

export class LLMApi {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  async chatCompletion(request: LLMRequest): Promise<LLMResponse> {
    const url = `${this.apiUrl}/chat/completions`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM API Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  async generateCommand(naturalLanguage: string): Promise<CommandGenerationResult> {
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: naturalLanguage,
      },
    ];

    const response = await this.chatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from LLM');
    }

    try {
      return JSON.parse(content) as CommandGenerationResult;
    } catch {
      return {
        command: content.trim(),
        explanation: 'LLM 直接返回命令',
      };
    }
  }
}
