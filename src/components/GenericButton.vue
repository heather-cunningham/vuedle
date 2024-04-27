<template>
	<button :id="props.id" :class="props.buttonClass" @click="handleClick">
		{{ props.label }}
	</button>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps(
	{
		id: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		buttonClass: {
			type: String,
			default: '',
		},
		onClick: {
			type: Function /*as () => {}*/,
			default: () => {},
		},
	}
);

const emit = defineEmits(['clicked']);

// const handleClick = () => {
// 	emit('clicked');
// };

const handleClick = () => {
	emit(props.onClick());
};
</script>
