export const validator = {
  title: 'JSON検証ツール',
  seo_title: 'JSON検証ツール - JSONデータの形式と構文を検証',
  description: 'JSON構文エラーを素早く検証し、JSONが標準フォーマット仕様に準拠していることを確認します',
  keywords: 'JSON検証ツール,JSON検証,JSONフォーマットチェック,JSON構文チェック,JSONエラーロケーター,オンラインJSON検証ツール,JSONエラー修正',
  introduction: 'JSON検証ツールは、JSONデータの有効性と標準準拠を確保するための基本的なツールです。JSON構文とフォーマットのリアルタイム検証を提供し、開発者が問題を迅速に特定して解決するのに役立ちます。\n\n高速なクライアントサイド検証機能により、このツールは括弧の不一致、欠落したカンマ、重複キー、閉じられていない文字列など、JSON構文の多くの一般的なエラーを検出できます。\n\n主な機能には以下が含まれます：\n• 正確なJSON構文チェック\n• エラーの位置と特定のコード行を明確に示す\n• 修正提案を含む詳細なエラー説明\n• 検証成功時のインタラクティブなデータツリービュー\n• サーバー処理不要のインスタント実行\n\n設定ファイル、APIレスポンス、または複雑なデータセットをチェックする場合でも、JSON検証ツールはデータ形式が正しく、JSON標準に準拠していることを確認するのに役立ちます。これによりエラー追跡の時間を節約し、扱うデータがアプリケーションで期待通りに動作することを確保します。',
  input: 'JSON入力',
  validate: 'JSONを検証',
  validJson: '有効なJSON',
  invalidJson: '無効なJSON',
  errorDetails: 'エラーの詳細',
  errorAt: '行{line}、列{column}でエラー',
  expectedToken: '予想されるトークン: {token}',
  unexpectedToken: '予期しないトークン: {token}',
  missingComma: 'カンマが欠落しているか、括弧が一致していません',
  extraComma: '余分なカンマ',
  unclosedString: '閉じられていない文字列',
  unclosedObject: '閉じられていないオブジェクト',
  unclosedArray: '閉じられていない配列',
  invalidProperty: '無効なプロパティ名',
  duplicateKey: '重複したキー',
  extraData: 'JSON終了後の余分なデータ',
  missingValue: '値が欠落しています',
  missingColon: 'コロンが欠落しています',
  repairSuggestion: '修復の提案',
  errorType: 'エラータイプ',
  errorMessage: 'エラーメッセージ',
  position: '位置',
  contextLine: 'コンテキスト行',
  placeholder: '検証するJSONをここに入力してください',
  jsonStructure: 'JSON構造',
  jsonSyntaxError: 'JSON構文エラー',
  parseSuccess: '正常に解析されました。{count}個のデータノードが含まれています。',
  unknownError: '不明なエラー'
}; 