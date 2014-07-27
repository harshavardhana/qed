module.exports = {
  ServerException: function (message) {
    this.message = message;
    this.name = "ServerException";
  }
};
