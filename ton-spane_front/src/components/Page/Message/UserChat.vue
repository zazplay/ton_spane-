<template>
  <div class="chat">
    <!-- Секция сообщений -->
    <div class="messages" ref="messages">
      <div v-for="message in messages" :key="message.id"
        :class="{ 'my-message': message.isOwn, 'other-message': !message.isOwn }">
        <p>{{ message.text }}</p>
        <small>{{ message.timestamp }}</small>
      </div>
    </div>

    <!-- Поле ввода -->
    <div class="message-input">
      <input type="text" v-model="newMessage" placeholder="Введите сообщение..." @keyup.enter="sendMessage" />
      <button @click="sendMessage">Отправить</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserChat',
  props: {
    chatId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      messages: [], // Список сообщений
      newMessage: '', // Новое сообщение пользователя
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim()) {
        const message = {
          id: Date.now(),
          text: this.newMessage,
          timestamp: new Date().toLocaleTimeString(),
          isOwn: true,
        };
        this.messages.push(message); // Добавляем сообщение в список
        this.newMessage = ''; // Очищаем поле ввода
        this.scrollToBottom(); // Прокрутка к последнему сообщению
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messages;
        container.scrollTop = container.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  height: 95vh;
  /* Занимает всю высоту экрана */
  overflow: hidden;
}

.messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  /* Прокрутка для сообщений */
  background: #f5f5f5;
}

.my-message {
  text-align: right;
  background: #d1e7dd;
  margin: 5px 0;
  padding: 10px;
  border-radius: 10px;
}

.other-message {
  text-align: left;
  background: #f8d7da;
  margin: 5px 0;
  padding: 10px;
  border-radius: 10px;
}

.message-input {
  display: flex;
  padding: 10px;
  gap: 10px;
  background: #5f7554;
  position: sticky;
  /* Поле ввода всегда остаётся внизу */
  bottom: 0;
  z-index: 10;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: black;
  background-color: white;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

@media screen and (max-width: 600px) {
  .chat {
    max-height: 80vh;
    border-radius: 0;
    width: 100%;
  }

  .message-input {
    flex-direction: column;
  }

  input {
    width: 95%;
  }

  button {
    width: 100%;
  }
}
</style>
