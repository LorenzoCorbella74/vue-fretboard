<template>
  <label class="text-reader">
    Importa
    <input type="file" @change="loadTextFromFile">
    <br>
    <p>
      File:
      <span style="font-style: italic;">{{fileName}}</span>
    </p>
  </label>
</template>

<script>
export default {
  data() {
    return {
      fileName: ''
    };
  },
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = e => this.$emit('load', e.target.result);
      reader.readAsText(file);
    }
  }
};
</script>

<style>
.text-reader {
  position: relative;
  overflow: hidden;
  display: inline-block;
  cursor: pointer;
}
.text-reader input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
</style>