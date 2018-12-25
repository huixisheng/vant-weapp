import Page from '../../common/page';

Page({
  data: {
    beforeHandler(value, oldValue, type) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(value);
          console.log(oldValue);
          if (type === 'minus') {
            reject();
          }
          resolve();
        }, 200);
      });
    }
  }
});
