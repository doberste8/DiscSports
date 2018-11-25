<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
@import '/assets/bootstrap.min.css';

#app {
  margin: 5px;
}
.name {
  width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
