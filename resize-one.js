(function(targetWidth = 1440) {
    const isFox =
      navigator.userAgent.indexOf('Firefox') > -1 ? true : false;
    const style = document.createElement('style');
    style.innerHTML = `
    html {
      width:${targetWidth + 'px'};
      overflow: hidden;
      ${isFox ? `transform-origin: top left;` : ''}
    }
    body {
      width: 100%;
      height: 100%;
      margin: 0;
    }
    `;
    document.head.appendChild(style);

    let adjustWindow = () => {
      const ratio = window.innerWidth / targetWidth;
      const htmlHeight =
        (window.innerHeight * targetWidth) / window.innerWidth + 'px';

      document.documentElement.style.height = htmlHeight;
      if (isFox) {
        document.documentElement.style.transform = `scale(${ratio})`;
      } else {
        document.documentElement.style.zoom = ratio;
      }
      document.documentElement.setAttribute('data-ratio', ratio);
    };
    adjustWindow();
    window.addEventListener('resize', adjustWindow);
    // 使鼠标坐标一致
    let x_get = Object.getOwnPropertyDescriptor(MouseEvent.prototype, 'x')
      .get;
    let y_get = Object.getOwnPropertyDescriptor(MouseEvent.prototype, 'y')
      .get;
    Object.defineProperties(MouseEvent.prototype, {
      R: {
        get: function() {
          return parseFloat(
            document.documentElement.getAttribute('data-ratio')
          );
        }
      },
      x: {
        get: function() {
          return x_get.call(this) / this.R;
        }
      },
      y: {
        get: function() {
          return y_get.call(this) / this.R;
        }
      }
    });
    if (isFox) {
      let getBoundingClientRect = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function() {
        let value = getBoundingClientRect.call(this);
        let ratio = parseFloat(
          document.documentElement.getAttribute('data-ratio')
        );
        value = new Proxy(value, {
          get: function(target, proper) {
            return Reflect.get(target, proper) / ratio;
          }
        });
        return value;
      };
    }
  })();