// API疎通テスト用エンドポイント
// 環境変数の設定状況を確認できます

export const runtime = "nodejs";

export default async function handler(req, res) {
    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // 環境変数の状態をチェック
        const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
        const openaiBase = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
        const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
        const hasNijiVoiceKey = !!process.env.NIJIVOICE_API_KEY;
        const nijiVoiceCharacter = process.env.NIJIVOICE_CHARACTER_ID || 'not_set';

        // APIキーの先頭部分のみ表示（セキュリティ考慮）
        const keyPreview = hasOpenAIKey 
            ? process.env.OPENAI_API_KEY.substring(0, 10) + '...'
            : 'not_set';

        const response = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: {
                hasOpenAIKey,
                keyPreview,
                openaiBase,
                openaiModel,
                hasNijiVoiceKey,
                nijiVoiceCharacter
            },
            vercel: {
                region: process.env.VERCEL_REGION || 'unknown',
                runtime: 'nodejs'
            },
            recommendations: []
        };

        // 設定に関する推奨事項
        if (!hasOpenAIKey) {
            response.recommendations.push('OPENAI_API_KEY環境変数を設定してください');
        }

        if (hasOpenAIKey && !process.env.OPENAI_API_KEY.startsWith('sk-')) {
            response.recommendations.push('OPENAI_API_KEYが正しい形式ではない可能性があります（sk-で始まる必要があります）');
        }

        if (openaiBase.includes('manus') && openaiModel === 'gpt-4o-mini') {
            response.recommendations.push('Manusプロキシを使用する場合、OPENAI_MODELをgpt-4.1-miniに変更することを推奨します');
        }

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
}

