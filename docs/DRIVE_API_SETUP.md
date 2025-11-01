# Google Drive API 有効化手順

現在のエラー `Request failed with status code 403` は、Google Drive API が有効になっていないことが原因です。

## 🚨 必要な追加設定

### Step 1: Google Drive API の有効化

1. **Google Cloud Console にアクセス**
   - [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - あなたのプロジェクトを選択

2. **APIライブラリでGoogle Drive APIを検索**
   - 左側メニュー → 「APIとサービス」 → 「ライブラリ」
   - 検索バーで「Google Drive API」を検索
   - 「Google Drive API」をクリック
   - 「有効にする」ボタンをクリック

### Step 2: 権限確認

サービスアカウントに以下の権限が必要です：
- `https://www.googleapis.com/auth/spreadsheets` ✅ (既に設定済み)
- `https://www.googleapis.com/auth/drive` ⚠️ (Google Drive API必須)

### Step 3: 設定完了確認

Drive API有効化後、以下のテストを実行：

```bash
curl -X POST http://localhost:3003/api/sheets/create \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Quiz Template"}'
```

成功すると以下のようなレスポンスが返ります：
```json
{
  "spreadsheetId": "1ABC...",
  "embedUrl": "https://docs.google.com/spreadsheets/d/1ABC.../edit?usp=sharing"
}
```

## 🔧 代替案: Drive API なしでの実装

Google Drive API が有効化できない場合は、以下の代替案があります：

1. **手動でテンプレートシートを作成**
2. **そのシートIDをハードコード**
3. **テンプレートをコピーして新しいシートを作成**

この方法では、新規作成ではなく既存テンプレートの複製になります。

---

**推奨**: Google Drive API の有効化が最もシンプルな解決策です。