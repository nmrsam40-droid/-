export async function sendTelegramMessage(text, keyboard = []) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) {
    return { ok: false, reason: 'telegram_not_configured' };
  }

  const payload = {
    chat_id: chatId,
    text,
    reply_markup: {
      inline_keyboard: keyboard,
    },
  };

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return response.json();
}
