<template>
  <iframe
    :src="src"
    border="0"
    frameborder="no"
    scrolling="no"
    title="iframe"
  />
</template>

<script>
import renderer from './renderer'
export default {
  extends: renderer,
  props: {
    src: {
      type: String,
      required: true
    }
  },
  name: 'websiteRenderer'
}
</script>
