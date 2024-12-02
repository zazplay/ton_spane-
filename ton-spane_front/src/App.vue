<script>
import MainPage from './components/MainPage.vue';
import ListPostCards from './components/ListPostCards.vue';

export default {
  name: 'App',
  components: {
    MainPage
    ListPostCards

  }
}
</script>

<template>
  <MainPage></MainPage>
  <ListPostCards></ListPostCards>
</template>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
