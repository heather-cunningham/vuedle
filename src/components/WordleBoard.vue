<script setup lang="ts">
defineProps<{
  wordOfTheDay: string,
  victoryMsg: string,
  defeatMsg: string,
}>()
</script>

<template>
  <input type="text">
<!--  <p>{{ wordOfTheDay }}</p>-->
  <p>{{victoryMsg}}</p>
  <p>{{ defeatMsg }}</p>
</template>