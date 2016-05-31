'use strict';

(function (document, window) {
    var myviewer = new marmoset.WebViewer(1280, 800, 'sylvanas.mview');
    document.body.appendChild(myviewer.domRoot);
    myviewer.loadScene();
})(document, window);
