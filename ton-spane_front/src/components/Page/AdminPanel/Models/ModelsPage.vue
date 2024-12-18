<template>
  <div class="container">
    <div class="left">
      <ProfilesList @select-user="handleUserSelect" />
    </div>
    <div class="right">
      <div v-if="selectedUser">
        <!-- Pass selectedUser as prop -->
        <ProfileContent :userIdProp="selectedUser" />
      </div>
      <div v-else class="el-flex el-justify-center">
        <el-text size="large" class="user-prompt" type="primary">
          Выберите пользователя чтоб просмотреть его профиль.
        </el-text>
      </div>
      <!-- Add new section for posts -->
      <div v-if="selectedUser" class="posts-section">
        <!-- Show message when no posts -->
        <div v-if="!posts.length" class="no-posts-message">
          <el-text>У пользователя пока нет постов</el-text>
          <el-button type="primary" @click="showAddPostForm">Добавить первый пост</el-button>
        </div>
        <!-- Show posts list when exists -->
        <div v-else class="posts-list">
          <div v-for="post in posts" :key="post.id" class="post-item">
            {{ post.content }}
          </div>
          <el-button type="primary" @click="showAddPostForm">Добавить пост</el-button>
        </div>
        <!-- Add post form -->
        <el-dialog v-model="showPostForm" title="Добавить пост">
          <el-form>
            <el-form-item>
              <el-input
                v-model="newPostContent"
                type="textarea"
                placeholder="Введите содержание поста"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addPost">Сохранить</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ProfilesList from './ProfilesList.vue';
import ProfileContent from './ProfileContent.vue';

const selectedUser = ref(null);
const posts = ref([]);
const showPostForm = ref(false);
const newPostContent = ref('');

const handleUserSelect = (userId) => {
  selectedUser.value = userId;
  // Here you would typically load user's posts
  loadUserPosts(userId);
  console.log("selectedUser", selectedUser.value);
};

const showAddPostForm = () => {
  showPostForm.value = true;
};

const addPost = () => {
  if (newPostContent.value.trim()) {
    posts.value.push({
      id: Date.now(), // Simple way to generate unique ID
      content: newPostContent.value,
      userId: selectedUser.value
    });
    newPostContent.value = ''; // Clear the form
    showPostForm.value = false; // Close the dialog
  }
};

const loadUserPosts = async (userId) => {
  // Here you would typically fetch posts from your API
  // For now, we'll just reset the posts array
  posts.value = [];
};
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
}

.left {
  width: 40%;
}

.right {
  width: 60%;
  background-color: rgb(27, 26, 26);
}

.posts-section {
  padding: 20px;
}

.no-posts-message {
  text-align: center;
  padding: 20px;
}

.posts-list {
  margin-top: 20px;
}

.post-item {
  padding: 10px;
  margin-bottom: 10px;
  background-color: #2c2c2c;
  border-radius: 4px;
}

@media (max-width: 1200px) {
  .container {
    flex-direction: column;
  }
  
  .left {
    width: 100%;
    height: max-content;
  }
  
  .right {
    margin-top: 10px;
    width: 100%;
  }
}
</style>