const fetch = require('node-fetch');

class TelegramLogger {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    this.adminId = process.env.TELEGRAM_ADMIN_ID;
    this.logs = [];
    this.startTime = this.getUzbekistanTime();
    this.queue = Promise.resolve();
    this.lastRequestTime = 0;
    this.minDelay = 200;
  }

  getUzbekistanTime() {
    return new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Asia/Tashkent',
      dateStyle: 'short',
      timeStyle: 'medium'
    }).format(new Date());
  }

  escapeHTML(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  async sendMessage(text) {
    if (!this.botToken || !this.chatId) {
      console.log('Telegram credentials missing');
      return;
    }

    if (text.length > 4000) {
      text = text.substring(0, 4000) + '...';
    }

    this.queue = this.queue.then(async () => {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.minDelay) {
        await new Promise(resolve => setTimeout(resolve, this.minDelay - timeSinceLastRequest));
      }

      try {
        const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: this.chatId,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: true
          })
        });

        this.lastRequestTime = Date.now();

        if (!response.ok) {
          const data = await response.json();
          if (data.error_code === 429) {
            const retryAfter = data.parameters?.retry_after || 1;
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            return this.sendMessage(text);
          }
          throw new Error(`Telegram API error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Telegram send error:', error.message);
      }
    });

    return this.queue;
  }

  async logGeneration(step, details) {
    this.logs.push({ step, details: details.trim() });
  }

  async sendError(error) {
    const errorMessage = `❌ <b>ERROR</b> @${this.adminId}\n` + 
                        `<blockquote expandable>${this.escapeHTML(error.message)}</blockquote>`;
    await this.sendFinalLog(errorMessage, true);
  }

  async sendFinalLog(additionalMessage = '', isError = false) {
    try {
      const endTime = this.getUzbekistanTime();
      
      let message = `🔄 <b>ModForge AI Log</b>\n`;
      message += `⏰ Start: ${this.escapeHTML(this.startTime)}\n`;
      message += `⏰ End: ${this.escapeHTML(endTime)}\n\n`;
      
      if (this.logs.length > 0) {
        const groupedLogs = this.logs.reduce((acc, log) => {
          const type = log.step.includes('Error') ? 'errors' :
                      log.step.includes('Warning') ? 'warnings' : 'info';
          if (!acc[type]) acc[type] = [];
          acc[type].push(log);
          return acc;
        }, {});

        if (groupedLogs.errors?.length > 0) {
          message += `<b>❌ Errors (${groupedLogs.errors.length})</b>\n`;
          message += `<blockquote expandable>` + groupedLogs.errors.map(log => 
            `<b>${this.escapeHTML(log.step)}</b>\n${this.escapeHTML(log.details)}`
          ).join('\n\n') + `</blockquote>\n\n`;
        }

        if (groupedLogs.warnings?.length > 0) {
          message += `<b>⚠️ Warnings (${groupedLogs.warnings.length})</b>\n`;
          message += `<blockquote expandable>` + groupedLogs.warnings.map(log => 
            `<b>${this.escapeHTML(log.step)}</b>\n${this.escapeHTML(log.details)}`
          ).join('\n\n') + `</blockquote>\n\n`;
        }

        if (groupedLogs.info?.length > 0) {
          message += `<b>ℹ️ Process Log (${groupedLogs.info.length})</b>\n`;
          message += `<blockquote expandable>` + groupedLogs.info.map(log => 
            `<b>${this.escapeHTML(log.step)}</b>\n${this.escapeHTML(log.details)}`
          ).join('\n\n') + `</blockquote>`;
        }
      }

      if (additionalMessage) {
        message += `\n\n${additionalMessage}`;
      }

      await this.sendMessage(message);
      this.logs = [];
      this.startTime = this.getUzbekistanTime();
    } catch (error) {
      console.error('Failed to send final log:', error);
    }
  }

  clearLogs() {
    this.logs = [];
    this.startTime = this.getUzbekistanTime();
  }
}

module.exports = TelegramLogger;