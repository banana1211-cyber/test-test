import OpenAI from 'openai';

// ランタイム設定（Node.js環境で確実に動作）
export const runtime = "nodejs";

// OpenAI設定（プロキシ対応）
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1', // プロキシまたは公式API
    organization: process.env.OPENAI_ORG,
    project: process.env.OPENAI_PROJECT
});

// ギャル風占い師のシステムプロンプト
const SYSTEM_PROMPT = `あなたは「アイちゃん」という名前のギャル風占い師です。以下の特徴で振る舞ってください：

【キャラクター設定】
- ギャル風の口調を使いますが、占いの要所や盛り上げる場面でギャル語を取り入れ、基本は親しみやすく明るいトーンで話します
- 話は長くなりすぎず、簡潔にまとめ、必要に応じて補足を入れる程度に留めます
- 占いの内容は真面目に扱いつつも、ユーモアを交えて分かりやすく伝えます
- フレンドリーでテンポの良い会話を心がけます

【占いの専門分野】
- タロット占い
- 星座占い（12星座）
- 血液型占い
- 数秘術
- 手相占い
- 風水
- その他の占術

【話し方の例】
- 「こんにちは〜！今日はどんなことを占いたいの？」
- 「うんうん、なるほどね〜！それじゃあタロットで見てみるね✨」
- 「あ〜、これはいい感じの運勢だよ〜！」
- 「ちょっと注意が必要かも💦でも大丈夫、対策教えるから〜」

【重要なルール】
- 専門用語は噛み砕いて説明する
- ユーザーが楽しく占いを受けられるよう配慮する
- 悪い結果でも希望を持てるようなアドバイスを含める
- 絵文字を適度に使って親しみやすさを演出する
- 占いの根拠や意味も簡潔に説明する`;

export default async function handler(req, res) {
    // CORS設定（全オリジン許可）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

    // プリフライトリクエスト対応
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // POST以外は拒否
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. POST method required.'
        });
    }

    try {
        // リクエストボディの検証
        const { message, conversation_history = [] } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'メッセージが必要です'
            });
        }

        console.log('ChatGPT API Request:', {
            message: message.substring(0, 100) + '...',
            historyLength: conversation_history.length,
            timestamp: new Date().toISOString()
        });

        // メッセージ履歴の構築
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT }
        ];

        // 会話履歴を追加（最新10件まで）
        const recentHistory = conversation_history.slice(-10);
        messages.push(...recentHistory);

        // 現在のメッセージを追加
        messages.push({ role: 'user', content: message });

        // OpenAI APIに送信
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini', // 確実に動作するモデル
            messages: messages,
            max_tokens: 500,
            temperature: 0.8,
            top_p: 0.9,
            frequency_penalty: 0.1,
            presence_penalty: 0.1
        });

        const response = completion.choices[0]?.message?.content;

        if (!response) {
            throw new Error('OpenAI APIからの応答が空です');
        }

        console.log('ChatGPT API Success:', {
            responseLength: response.length,
            model: completion.model,
            usage: completion.usage,
            timestamp: new Date().toISOString()
        });

        // 成功レスポンス
        res.json({
            success: true,
            response: response,
            model: completion.model,
            usage: completion.usage,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        // 詳細なエラーログ
        console.error('ChatGPT API Error:', {
            code: error?.code,
            status: error?.status,
            name: error?.name,
            message: error?.message,
            data: error?.response?.data,
            timestamp: new Date().toISOString()
        });

        // エラーレスポンス
        res.status(500).json({
            success: false,
            error: 'ChatGPT APIでエラーが発生しました',
            details: error?.message || 'Unknown error',
            code: error?.code || 'UNKNOWN_ERROR',
            timestamp: new Date().toISOString()
        });
    }
}

