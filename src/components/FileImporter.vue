<template>
  <div>
    <div class="input-group mb-3">
      <div class="custom-file">
        <input
          type="file"
          class="custom-file-input"
          id="inputGroupFile02"
          @change="loadTextFromFile"
        >
        <label class="custom-file-label" for="inputGroupFile02">Choose file</label>
      </div>
    </div>
    <div>
      <br>
      <p>
        File:
        <span style="font-style: italic;">{{fileName}}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileName: ''
    };
  },
  methods: {
    // TODO:
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      if (file) {
        this.fileName = file.name;
        const reader = new FileReader();
        reader.onload = e => this.$emit('load', e.target.result);
        reader.readAsText(file);
      }
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