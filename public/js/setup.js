// bitdewy@gmail.com

'use strict';

(function (document, window) {
    var myviewer = new marmoset.WebViewer(1280, 800, 'mview/sword.mview');
    document.body.appendChild(myviewer.domRoot);
    myviewer.loadScene();
})(document, window);
