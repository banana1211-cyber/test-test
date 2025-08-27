# 🔮 ギャル風占い師VRMチャット - 確実稼働版

このプロジェクトは、3Dアバター（VRM）と対話できる、ギャル風占い師キャラクターのWebアプリケーションです。ChatGPT APIと音声合成技術を組み合わせ、リアルタイムでインタラクティブな占い体験を提供します。

**ハイブリッド設計**: ChatGPTとClaudeの優れた点を融合し、技術的な安定性と美しいUI/UXを両立させています。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fvrm-chat-hybrid-final)

## ✨ 主な機能

- **インタラクティブな3Dアバター**: `three-vrm` を使用してVRMモデルを表示し、リアルタイムで対話します。
- **ギャル風占い師AI**: ChatGPT API (`gpt-4o-mini`) をベースにした、親しみやすいキャラクターとの会話。
- **多様な占い**: タロット、星座、血液型、数秘術など、様々な占いに対応。
- **音声合成**: Web Speech APIによる自然な音声応答。にじボイスAPI（オプション）にも対応。
- **プロキシ対応**: 公式OpenAI APIとManusなどのプロキシ環境の両方で動作します。
- **美しいUI/UX**: Claudeの設計思想を取り入れた、洗練されたレスポンシブデザイン。
- **リアルタイムステータス表示**: AIの状態（考え中、話し中など）を視覚的に表示。
- **簡単デプロイ**: Vercelに数クリックでデプロイ可能。

## 🛠️ 技術スタック

- **フロントエンド**: HTML, CSS, JavaScript (ESM)
- **3Dレンダリング**: Three.js (r160), @pixiv/three-vrm (2.0.7)
- **バックエンド (Serverless)**: Vercel Functions (Node.js)
- **AI**: OpenAI API (ChatGPT)
- **音声合成**: Web Speech API (標準), にじボイス (オプション)
- **HTTPクライアント**: Axios

## 🚀 セットアップとデプロイ

### 1. リポジトリをフォーク

まず、このリポジトリをあなたのGitHubアカウントにフォークします。

### 2. Vercelにデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fvrm-chat-hybrid-final)

上記のボタンをクリックし、Vercelプロジェクトを作成します。

### 3. 環境変数の設定

Vercelのプロジェクト設定で、以下の環境変数を設定します。

#### 必須

- `OPENAI_API_KEY`: あなたのOpenAI APIキー (`sk-proj-...`)

#### オプション

- `OPENAI_API_BASE`: プロキシを使用する場合のエンドポイントURL。
  - **Manusプロキシ**: `https://api.manus.im/api/llm-proxy/v1`
  - **公式API**: `https://api.openai.com/v1` (または未設定)
- `OPENAI_MODEL`: 使用するモデル名。
  - **推奨**: `gpt-4o-mini`
- `NIJIVOICE_API_KEY`: にじボイスAPIキー（高品質な音声合成用）。
- `NIJIVOICE_CHARACTER_ID`: にじボイスのキャラクターID。

### 4. デプロイ

環境変数を設定すると、Vercelが自動的にデプロイを開始します。完了後、あなたのVRMチャットアプリが公開されます。

## 🔧 カスタマイズ

### VRMモデルの変更

`index.html`内の以下の行を、あなたのVRMモデルのURLに変更します。

```javascript
// 変更前
const vrmUrl = 'https://cdn.jsdelivr.net/gh/pixiv/three-vrm@dev/packages/three-vrm/examples/models/VRM1_Constraint_Twist_Sample.vrm';

// 変更後
const vrmUrl = 'あなたのVRMモデルのURL';
```

### キャラクター設定の変更

`api/chat.js`内の`SYSTEM_PROMPT`を編集することで、AIのキャラクターや振る舞いを自由に変更できます。

```javascript
const SYSTEM_PROMPT = `あなたは「新しいキャラクター」です。以下の特徴で振る舞ってください...`;
```

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。


