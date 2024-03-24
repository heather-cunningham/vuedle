<script setup lang="ts">
defineProps<{
  wordOfTheDay: string
  victoryMsg: string
}>()
</script>

<template>
  <input type="text">
<!--  <p>{{ wordOfTheDay }}</p>-->
  <p>{{victoryMsg}}</p>
  <p>Better luck next time!</p>
</template>