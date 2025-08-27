# 🚀 Vercelデプロイ完全手順書

このガイドでは、ギャル風占い師VRMチャットアプリをVercelに確実にデプロイする方法を詳しく説明します。

## 📋 事前準備

### 必要なアカウント
1. **GitHubアカウント** - コードの管理用
2. **Vercelアカウント** - デプロイ用（GitHubアカウントで無料登録可能）
3. **OpenAI APIアカウント** - ChatGPT機能用

### 必要なAPIキー
- **OpenAI API Key** (必須) - `sk-proj-...` で始まるキー
- **にじボイス API Key** (オプション) - 高品質音声合成用

## 🔧 Step 1: GitHubリポジトリの作成

### 1-1. GitHubにログイン
[GitHub.com](https://github.com) にアクセスしてログインします。

### 1-2. 新しいリポジトリを作成
1. 右上の「+」ボタンをクリック
2. 「New repository」を選択
3. リポジトリ名を入力（例: `vrm-chat-app`）
4. 「Public」を選択（Vercelの無料プランで使用）
5. 「Create repository」をクリック

### 1-3. コードをアップロード
1. **ZIPファイルを展開**
   - ダウンロードした `vrm-chat-hybrid-final-fixed.zip` を展開
   
2. **ファイルをアップロード**
   - GitHubリポジトリページで「uploading an existing file」をクリック
   - 展開したフォルダ内の全ファイルをドラッグ&ドロップ
   - 以下のファイルがアップロードされることを確認：
     ```
     index.html
     package.json
     vercel.json
     .env.example
     README.md
     api/chat.js
     api/speak.js
     ```

3. **コミット**
   - コミットメッセージを入力（例: "Initial commit: VRM Chat App"）
   - 「Commit changes」をクリック

## 🌐 Step 2: Vercelアカウントの設定

### 2-1. Vercelにサインアップ
1. [Vercel.com](https://vercel.com) にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択
4. GitHubアカウントでログイン
5. Vercelの利用規約に同意

### 2-2. GitHubとの連携
1. Vercelダッシュボードで「Import Project」をクリック
2. 「Import Git Repository」を選択
3. 先ほど作成したリポジトリを選択
4. 「Import」をクリック

## ⚙️ Step 3: 環境変数の設定

### 3-1. プロジェクト設定画面へ
1. Vercelダッシュボードでプロジェクトを選択
2. 「Settings」タブをクリック
3. 左サイドバーの「Environment Variables」をクリック

### 3-2. 必須環境変数の設定

#### OpenAI API Key（必須）
```
Name: OPENAI_API_KEY
Value: sk-proj-your-actual-api-key-here
Environment: Production, Preview, Development (全て選択)
```

**⚠️ 重要な注意点:**
- APIキーの先頭に `|` などの余計な文字がないことを確認
- `sk-proj-` で始まる正しいキーを使用
- スペースや改行が入らないよう注意

### 3-3. オプション環境変数の設定

#### OpenAI API Base（プロキシ使用時）
```
Name: OPENAI_API_BASE
Value: https://api.manus.im/api/llm-proxy/v1
Environment: Production, Preview, Development
```

#### OpenAI Model（モデル指定）
```
Name: OPENAI_MODEL
Value: gpt-4o-mini
Environment: Production, Preview, Development
```

#### にじボイス API（高品質音声用）
```
Name: NIJIVOICE_API_KEY
Value: your-nijivoice-api-key
Environment: Production, Preview, Development

Name: NIJIVOICE_CHARACTER_ID
Value: your-character-id
Environment: Production, Preview, Development
```

### 3-4. 設定パターン例

#### パターン1: 公式OpenAI API（推奨・最もシンプル）
```
OPENAI_API_KEY=sk-proj-your-key-here
```
その他は未設定でOK

#### パターン2: Manusプロキシ使用
```
OPENAI_API_KEY=your-manus-key
OPENAI_API_BASE=https://api.manus.im/api/llm-proxy/v1
OPENAI_MODEL=gpt-4.1-mini
```

#### パターン3: にじボイス音声付き
```
OPENAI_API_KEY=sk-proj-your-key-here
NIJIVOICE_API_KEY=your-nijivoice-key
NIJIVOICE_CHARACTER_ID=your-character-id
```

## 🚀 Step 4: デプロイの実行

### 4-1. 自動デプロイ
環境変数を設定すると、Vercelが自動的にデプロイを開始します。

### 4-2. デプロイ状況の確認
1. Vercelダッシュボードの「Deployments」タブで進行状況を確認
2. ビルドログでエラーがないかチェック
3. 「Ready」状態になるまで待機（通常1-3分）

### 4-3. デプロイ完了
デプロイが完了すると、以下のようなURLが生成されます：
```
https://your-project-name.vercel.app
```

## 🔍 Step 5: 動作確認とテスト

### 5-1. 基本動作確認
1. **アプリアクセス**: 生成されたURLにアクセス
2. **VRM表示**: 3Dキャラクターが表示されることを確認
3. **チャット機能**: メッセージを送信してAIが応答することを確認
4. **音声機能**: AIの応答が音声で再生されることを確認

### 5-2. API疎通テスト
ブラウザで以下のURLにアクセスして環境変数を確認：
```
https://your-project-name.vercel.app/api/ping
```

期待される応答例：
```json
{
  "hasKey": true,
  "base": "https://api.openai.com/v1"
}
```

### 5-3. エラー対応

#### よくあるエラーと解決方法

**1. "sendMessage is not defined"**
- **原因**: JavaScriptの読み込みエラー
- **解決**: ブラウザのキャッシュをクリアして再読み込み

**2. "ChatGPT API Error"**
- **原因**: APIキーの設定ミス
- **解決**: 環境変数 `OPENAI_API_KEY` を再確認

**3. "VRM model loading failed"**
- **原因**: GLTFLoaderの読み込みエラー
- **解決**: 修正版を使用していることを確認

**4. "Audio playback failed"**
- **原因**: ブラウザの音声ポリシー
- **解決**: ユーザーがページをクリックしてから音声再生

## 🔧 Step 6: カスタマイズとメンテナンス

### 6-1. コードの更新
1. GitHubリポジトリでファイルを編集
2. 変更をコミット
3. Vercelが自動的に再デプロイ

### 6-2. ドメインの設定（オプション）
1. Vercel設定の「Domains」タブ
2. カスタムドメインを追加
3. DNS設定を更新

### 6-3. 分析とモニタリング
1. Vercel Analytics で使用状況を確認
2. Function Logs でAPIエラーを監視
3. Performance Insights で速度を最適化

## 📞 トラブルシューティング

### デプロイが失敗する場合
1. **ビルドログを確認**
   - Vercelの「Deployments」→「View Function Logs」
   
2. **環境変数を再確認**
   - APIキーに余計な文字がないか
   - 全ての環境で設定されているか
   
3. **依存関係を確認**
   - `package.json` の内容が正しいか
   - Node.js バージョンが対応しているか

### APIが動作しない場合
1. **疎通テスト**
   - `/api/ping` でAPIキーの状態確認
   
2. **CORS エラー**
   - ブラウザのコンソールでエラー確認
   - `vercel.json` の設定を確認
   
3. **タイムアウトエラー**
   - Function の実行時間制限（30秒）を確認
   - 重い処理を最適化

## 📚 参考資料

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [OpenAI API ドキュメント](https://platform.openai.com/docs)
- [Three.js VRM ドキュメント](https://github.com/pixiv/three-vrm)

## 🎉 完了！

これで、あなたのギャル風占い師VRMチャットアプリがVercelで公開されました！

生成されたURLを友達にシェアして、占いチャットを楽しんでください✨

---

**何か問題が発生した場合は、このガイドのトラブルシューティングセクションを参照するか、Vercelのサポートにお問い合わせください。**

