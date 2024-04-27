<template>
	<button @click="handleClick" :class="buttonClass">
		{{ props.buttonLabel }}
	</button>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps(
	{
		buttonLabel: {
			type: String,
			required: true,
		},
		buttonClass: {
			type: String,
			default: '',
		},
	},
);

const emit  = defineEmits(['clicked']);

const handleClick = () => {
	emit('clicked');
};
</script>
