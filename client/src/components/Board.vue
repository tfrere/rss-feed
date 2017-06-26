
<template>
  <div class="board">
     <h3>{{ subject.title }}</h3>
     <div class="list-wrapper">
       <List v-for="feed in subject.feeds" :key="feed" :feed="feed" />
     </div>
  </div>
</template>

<script>
  export default {
    name: 'board',
    props: ['subject'],
  };
</script>

<style scoped>
  .board {
    display: inline-block;
    height: 100%;
  }
  .board h3 {
    margin-left: 20px;
    margin-top: 20px;
  }
</style>
