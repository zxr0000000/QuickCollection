<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const msg = ref('');
const chatlogs = ref<string[]>([]);

const summitQuery = () => {
  chatlogs.value.push(msg.value);
  const params = new URLSearchParams({
    key: 'free',
    appid: 0,
    msg: msg.value
  } as any);
  axios
    .get(`http://api.qingyunke.com/api.php`, { params })
    .then((response) => {
      chatlogs.value.push(response.data.content);
    })
    .catch((error) => {
      error = error;
    });
  msg.value = '';
};
</script>

<template>
  <div class="main">
    <div class="chat">
      <div class="chat-header">
        <h2>Chat !!!!</h2>
      </div>
      <div class="chat-messages">
        <div class="chat-message">Joshua：你不说话，我就不说话</div>
        <div v-for="(chatlog, index) in chatlogs" :key="index" class="chat-message">
          <div>
            <span v-if="!(index % 2)">Me: {{ chatlog }}</span>
            <span v-if="index % 2">Joshua: {{ chatlog }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <input type="text" v-model="msg" @keyup.enter="summitQuery" />
      <button @click="summitQuery">Send</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  font-family: Arial, sans-serif;
  background-color: #f7f7f7;
  max-width: 500px;
  border-radius: 10px;
}

.chat {
  max-width: 350px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.chat-header {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: rgb(228, 168, 178);
  color: #fff;
  padding: 10px;
  text-align: center;
}

.chat-messages {
  max-height: 5oopx;
  overflow-y: scroll;
  padding: 10px;
}

.chat-message {
  margin-bottom: 10px;
}

.chat-message strong {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.chat-message p {
  margin: 0;
}

.chat-input {
  margin-top: 5px;
  display: flex;
  align-items: center;
  background-color: #eee;
  padding: 10px;
}

.chat-input input{
  flex-grow: 1;
  margin-right: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.chat-input button{
  padding: 5px 10px;
  background-color: pink;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
</style>
