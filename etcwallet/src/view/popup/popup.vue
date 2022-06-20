<template>
  <div style="width: 360px;height: 600px;overflow: scroll;">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    async created() {
    },
  };
</script>
<style>
  .el-message__content{
    word-break: break-word;
  }
  .el-message {
    z-index: 9999 !important;
  }

  .el-button i {
    font-size: 24px !important;
  }

  .el-button.is-circle {
    padding: 8px !important;
  }

  .walletxt {
    color: #646566 !important;
  }

  .van-nav-bar__title {
    font-size: 18px !important;
  }

  .van-nav-bar__content {
    height: 54px !important;
  }

  .van-nav-bar__placeholder {
    height: 54px !important;
  }

  html {
    color: #000;
    background-color: #ffffff;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    font-size: 100%;
    font-family: Helvetica Neue For Number, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
  }

  body, div, dl, dt, dd, ul, li, pre, form, fieldset, select, input, textarea, button, p, blockquote, th, td, img, iframe {
    margin: 0;
    padding: 0;
  }

  body {
    width: 100%;
    font-family: Overpass;
    background-color: #ffffff;
  }

  body, button, input, select, textarea {
    color: #333435;
    outline: none;
  }

  input, select, textarea {
    font-size: 100%;
  }

  button {
    border: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  th {
    text-align: inherit;
  }

  caption, th {
    text-align: left;
  }

  fieldset, img {
    border: none;
    outline: none;
    -moz-outline: none;
  }

  iframe {
    display: block;
  }

  ol, ul, li {
    list-style: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-size: 100%;
    font-weight: 500;
    margin: 0;
    padding: 0;
  }

  a {
    color: #333;
    cursor: pointer;
    outline: none;
    text-decoration: none;
    blr: expression(this.onFocus=this.blur());
  }

  a:hover {
    text-decoration: underline;
  }

  .clearfix:before, .clearfix:after {
    display: block;
    content: " ";
    clear: both;
  }

  .clearfix {
    zoom: 1;
  }

  article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {
    display: block;
  }

  audio, canvas, video {
    display: inline-block;
    *display: inline;
    *zoom: 1;
  }

  address, caption, cite, code, dfn, em, th {
    font-style: normal;
    font-weight: normal;
  }

  .box-sizing {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>

