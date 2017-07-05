
<template>
  <div class="board">
    <header class="board-header">
      <h3 class="board-header-title">{{ board.title }}</h3>
      <i v-on:click="openModal" class="icon -plus-square board-header-icon"/>
    </header>
    <div class="list-wrapper">
      <List v-for="feed in board.feeds" :key="feed" :config="config" :feed="feed" />
    </div>
    <Modal ref="addFeedModal" :open="openModal">
      <FeedForm reqType="post" :config="config" :close="closeModal"/>
    </Modal>
  </div>
</template>

<script>
  /* eslint-disable */
  export default {
    name: 'board',
    props: ['board', 'config'],
    methods: {
      openModal: function() {
        this.$refs.addFeedModal.openModal();
      },
      closeModal: function() {
        this.$refs.addFeedModal.closeModal();
      }
    }
  };
</script>

<style compile="scss">
  .board {
    display: inline-block;
    height: 100%;
    margin-right: 50px;
    margin-left: 50px;
    border-right: 1px solid #fafafa;
  }
  .board-header {
  }
  .board-header-title {
    display: inline-block;
  }
  .board-header-icon {
    font-size: 2rem;
    margin-top: 8px;
    margin-left: 15px;
    color: lightgrey;
    cursor: pointer;
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  }
  .board h3 {
    margin-left: 20px;
    margin-top: 20px;
  }
</style>
