import axios from 'axios';

// ランタイム設定（Node.js環境で確実に動作）
export const runtime = "nodejs";

// にじボイス設定
const NIJIVOICE_CONFIG = {
    base_url: 'https://api.nijivoice.com/api/platform/v1',
    api_key: process.env.NIJIVOICE_API_KEY,
    character_id: process.env.NIJIVOICE_CHARACTER_ID || 'default'
};

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
        const { message, emotion = 'neutral', voice_type = 'female' } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'メッセージが必要です'
            });
        }

        console.log('Speech API Request:', {
            message: message.substring(0, 100) + '...',
            emotion,
            voice_type,
            hasNijiVoiceKey: !!NIJIVOICE_CONFIG.api_key,
            timestamp: new Date().toISOString()
        });

        // にじボイスAPIが設定されている場合
        if (NIJIVOICE_CONFIG.api_key && NIJIVOICE_CONFIG.character_id) {
            try {
                console.log('Attempting NijiVoice API...');
                
                const response = await axios.post(
                    `${NIJIVOICE_CONFIG.base_url}/voice-actors/${NIJIVOICE_CONFIG.character_id}/generate-voice`,
                    {
                        script: message,
                        speed: emotion === 'excited' ? '1.2' : '1.0',
                        format: 'mp3',
                        emotion: emotion
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': NIJIVOICE_CONFIG.api_key
                        },
                        timeout: 30000 // 30秒タイムアウト
                    }
                );

                if (response.data && response.data.audioUrl) {
                    console.log('NijiVoice API Success');
                    return res.json({
                        success: true,
                        audio_url: response.data.audioUrl,
                        method: 'nijivoice',
                        message: message,
                        emotion: emotion,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    throw new Error('音声URLが取得できませんでした');
                }

            } catch (nijiError) {
                console.warn('NijiVoice API Error, falling back to Web Speech:', nijiError.message);
                // フォールバック処理に続く
            }
        }

        // フォールバック: Web Speech API情報を返す
        console.log('Using Web Speech API fallback');
        
        // 感情に応じた音声パラメータ
        const voiceParams = {
            rate: getVoiceRate(emotion),
            pitch: getVoicePitch(emotion, voice_type),
            volume: 0.8,
            lang: 'ja-JP'
        };

        res.json({
            success: true,
            method: 'web_speech',
            message: message,
            emotion: emotion,
            voice_params: voiceParams,
            instructions: {
                usage: 'フロントエンドでWeb Speech APIを使用してください',
                example: `
                const utterance = new SpeechSynthesisUtterance('${message}');
                utterance.rate = ${voiceParams.rate};
                utterance.pitch = ${voiceParams.pitch};
                utterance.volume = ${voiceParams.volume};
                utterance.lang = '${voiceParams.lang}';
                speechSynthesis.speak(utterance);
                `
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Speech API Error:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });

        res.status(500).json({
            success: false,
            error: '音声合成でエラーが発生しました',
            details: error.message,
            fallback: {
                method: 'web_speech',
                message: 'フロントエンドでWeb Speech APIを使用してください'
            },
            timestamp: new Date().toISOString()
        });
    }
}

// 感情に応じた音声レート
function getVoiceRate(emotion) {
    const rateMap = {
        'excited': 1.3,
        'happy': 1.1,
        'neutral': 1.0,
        'thinking': 0.9,
        'sad': 0.8,
        'surprised': 1.2
    };
    return rateMap[emotion] || 1.0;
}

// 感情と声の種類に応じたピッチ
function getVoicePitch(emotion, voice_type) {
    const basePitch = voice_type === 'female' ? 1.2 : 0.8;
    const emotionModifier = {
        'excited': 0.3,
        'happy': 0.2,
        'neutral': 0,
        'thinking': -0.1,
        'sad': -0.2,
        'surprised': 0.4
    };
    
    return Math.max(0.1, Math.min(2.0, basePitch + (emotionModifier[emotion] || 0)));
}

