// Set this in globals:true in test obj in vitest.config.ts
// And, in tsconfig.vitest.json, added "vitest/globals" in "compilerOptions" obj in "types" List
// But can't get to work
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'

describe('WordleBoard', () => {
  it('renders properly', () => {
    const wrapper = mount(WordleBoard, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
