This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## todo
- ~~ユーザーID,PWでの簡単な認証へ変更~~ ✅ 完了（メール/パスワード認証に変更）
- グループ分けして、同グループの学生が登録した問題は確認・コメントできるようにする
- プロンプトの洗練
- 管理者用のユーザー作成画面の実装


## 現状見つかっているバグ
- ~~問題登録ボタンがうまく動作しないことがある~~

→ セッション状態の保持、LocalStorageとSessionStorageの削除によって一旦は解決。本番環境でもやってみる。

- タブを変更して戻ってくると画面表示が切り替わってしまう
- システムプロンプトが履歴に表示されてしまう