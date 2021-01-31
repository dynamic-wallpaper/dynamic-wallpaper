<template>
  <div id="app">
    <video id="videoElement"></video>
  </div>
</template>

<script>
import flvjs from "flv.js";
export default {
  name: "App",
  components: {},
  mounted() {
    var videoElement = document.getElementById("videoElement");
    var flvPlayer = flvjs.createPlayer({
      type: "flv",
      url: "http://example.com/flv/video.flv"
    });
    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();
    flvPlayer.play();
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
