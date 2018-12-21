import Page from '../../common/page';

Page({
  data: {
    active: 0,
    onPlus: function() {
      return new Promise((resolve, reject) => {
        debugger;
        setTimeout(() => {
          resolve();
        }, 200);
      });
    }
  },
  onPlus() {
    return new Promise((resolve, reject) => {
      debugger;
      setTimeout(() => {
        resolve();
      }, 200);
    });
  }
});
