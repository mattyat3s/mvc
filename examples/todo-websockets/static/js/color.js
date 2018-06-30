var colour = {
  change: function () {
    this.random = Math.floor((Math.random() * 9));
    document.body.className =  ['pinky-red', 'pink', 'purple', 'blue', 'light-blue', 'turquoise', 'lime-green', 'orange', 'red'][this.random];
  }
}.change();
